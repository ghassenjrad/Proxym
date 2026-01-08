import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user-decorator';
import { User } from 'src/user/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/user.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post('create')
  async createReservation(
    @Body()
    body: {
      userId: number;
      deviceId: number;
      startDate: Date;
      endDate: Date;
    },
  ): Promise<void> {
    const { userId, deviceId, startDate, endDate } = body;
    await this.reservationService.effectuerRes(
      userId,
      deviceId,
      startDate,
      endDate,
    );
    console.log('Reservation cree par succés');
  }

  @Put('modifier')
  async extendReservation(
    @Body() body: { userId: number; idRes: number; deviceId: number ; newStartDate: Date; newEndDate: Date },
  ): Promise<void> {
    const { userId, idRes, deviceId , newStartDate, newEndDate } = body;
    await this.reservationService.ModifierRes(userId, idRes, deviceId, newStartDate, newEndDate);
    console.log('Reservation modified');
  }

  @Post('cancel')
  async cancelReservation(
    @Body() body: { userId: number; idRes: number },
  ): Promise<void> {
    const { userId, idRes } = body;
    await this.reservationService.annulerRes(userId, idRes);
  }


  @Get('all')
  async getReservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  // Admin: list all reservations (protected)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/all')
  async getAllForAdmin(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  // Admin: update reservation status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/status')
  async updateStatus(
    @Body() body: { idRes: number; status: string },
  ) {
    const { idRes, status } = body;
    return this.reservationService.updateReservationStatus(idRes, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getUserReservations(
    @GetUser() connectedUser: { userId: number; username: string },
  ) {
    console.log('User ID from token:', connectedUser); // Log user information from token
    return this.reservationService.consulterRes(connectedUser);
  }
}

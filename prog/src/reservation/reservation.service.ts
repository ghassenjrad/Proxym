import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from './reservation.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  // PLease note that any entites names should named with the first letter capitalized
  // So the user entity should be named User and the reservation entity should be named Reservation
  // So please refactor the names

  async consulterRes(connectedUser: {
    userId: number;
    username: string;
  }): Promise<Reservation[]> {
    console.log(`Fetching reservations for user ID: ${connectedUser.userId}`); // Log user ID

    const user = await this.userRepository.findOne({
      where: { idUs: connectedUser.userId },
    });
    if (!user) {
      throw new NotFoundException(`User id ${connectedUser.userId} not found`);
    }

    const reservations = await this.reservationRepository.find({
      where: { user },
      relations: ['device'],
    });
    console.log('Reservations found:', reservations); // Log reservations
    return reservations;
  }

  async annulerRes(userId: number, reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { idRes: reservationId, user: { idUs: userId } },
    });
    if (!reservation) {
      console.log(`Reservation id ${reservationId} not found for user id ${userId}`);
      throw new NotFoundException(`Reservation id ${reservationId} not found`);
    }
    await this.reservationRepository.remove(reservation);
  }



  async effectuerRes(
    userId: number,
    deviceId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { idUs: userId } });
    if (!user) {
      throw new NotFoundException(`User id ${userId} not found`);
    }

    const existingRes = await this.reservationRepository.findOne({
      where: [
        {
          deviceId,
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate),
        },
      ],
    });

    if (existingRes) {
      throw new ConflictException(`Device is already reserved`);
    }

    const newRes = new Reservation();
    newRes.startDate = startDate;
    newRes.endDate = endDate;
    newRes.status = 'Pending';
    newRes.deviceId = deviceId;
    newRes.user = user;

    await this.reservationRepository.save(newRes);
  }

  async ModifierRes(
    userId: number,
    resId: number,
    deviceId: number,
    newStartDate: Date,
    newEndDate: Date,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { idUs: userId },
    });
    if (!user) {
      throw new NotFoundException(`User id ${userId} not found`);
    }


    const reservation = await this.reservationRepository.findOne({
      where: {
        idRes: resId,
        user,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${resId} not found`);
    }

    const existingRes = await this.reservationRepository.findOne({
      where: {
        deviceId,
        startDate: LessThanOrEqual(newEndDate),
        endDate: MoreThanOrEqual(newStartDate),
      },
    });

    if (existingRes) {
      throw new ConflictException(`Device is already reserved`);
    }


    reservation.startDate = newStartDate
    reservation.endDate = newEndDate;

    await this.reservationRepository.save(reservation);
  }



  async getReservationsByUser(user: User): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { idUs: user.idUs } },
      relations: ['user'],
    });
  }

  async findReservationsByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { idUs: userId } },
      relations: ['device'], // Ensure device relationship is included
    });
  }

}

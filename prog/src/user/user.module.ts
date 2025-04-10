import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Reservation } from '../reservation/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reservation])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}

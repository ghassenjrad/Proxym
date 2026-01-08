import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DeviceModule } from './device/device.module';
import { ReservationModule } from './reservation/reservation.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailService } from './auth/mail.service';
import { Reservation } from './reservation/reservation.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '23500501',
      database: 'db',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Reservation]),
    UserModule,
    ReservationModule,
    DeviceModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
  exports:[MailService],
})
export class AppModule { }

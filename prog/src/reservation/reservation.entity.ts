import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";
import { Device } from "src/device/device.entity";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    idRes: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    status: string;

    @Column()
    deviceId: number;

    @ManyToOne(() => Device, device => device.reservations)
    device: Device;

    @ManyToOne(() => User, user => user.Reservations)
    user: User;
}


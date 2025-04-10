import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    state: string;

    @Column()
    description: string;

    @OneToMany(() => Reservation, reservation => reservation.device)
    reservations: Reservation[];

}
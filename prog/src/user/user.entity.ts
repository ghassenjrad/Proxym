import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Reservation } from "../reservation/reservation.entity";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'idus'})
    idUs: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Reservation, reservation => reservation.user)
    Reservations: Reservation[];

    @Column({ nullable: true })
    resetToken: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    resetTokenExpires: Date | null;
}

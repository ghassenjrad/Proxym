import { Entity, Column, PrimaryGeneratedColumn, OneToMany, IntegerType } from "typeorm";
import { Reservation } from "../reservation/reservation.entity"; // Assurez-vous de l'import correct de votre entité de réservation

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    idUs: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Reservation, reservation => reservation.user)
    Reservations: Reservation[];

    @Column({ nullable: true })
    resetToken: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    resetTokenExpires: Date | null;

  
}

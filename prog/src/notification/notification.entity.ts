import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  message: string;

  @Column({ default: false })
  sent: boolean;
}

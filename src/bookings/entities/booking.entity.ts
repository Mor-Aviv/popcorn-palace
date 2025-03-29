import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column('uuid')
  userId: string;

  @Column()
  showtimeId: number;

  @Column()
  seatNumber: number;
}

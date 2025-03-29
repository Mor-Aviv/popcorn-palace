import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  price: number;

  @Column()
  movieId: number; 

  @Column()
  theater: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

}

  
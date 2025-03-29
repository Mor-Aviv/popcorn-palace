import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Showtime])],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  async create(bookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
    const showtime = await this.showtimeRepo.findOne({ where: { id: bookingDto.showtimeId } });

    if (!showtime) {
      throw new NotFoundException(`Showtime ${bookingDto.showtimeId} does not exist`);
    }

    const existingBooking = await this.bookingRepo.findOne({
      where: {
        showtimeId: bookingDto.showtimeId,
        seatNumber: bookingDto.seatNumber,
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        `Seat ${bookingDto.seatNumber} is already booked for showtime ${bookingDto.showtimeId}`,
      );
    }

    const booking = this.bookingRepo.create(bookingDto);
    const saved = await this.bookingRepo.save(booking);

    return { bookingId: saved.bookingId };
  }
}

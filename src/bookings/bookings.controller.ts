import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(200)
  create(@Body() bookingDto: CreateBookingDto) {
    return this.bookingsService.create(bookingDto);
  }
}

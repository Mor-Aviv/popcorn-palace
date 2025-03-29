import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from '../bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: jest.Mocked<Repository<Booking>>;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;

  const dto: CreateBookingDto = {
    userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    showtimeId: 1,
    seatNumber: 15,
  };

  const mockBooking: Booking = {
    bookingId: 'uuid-1234',
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockBooking),
            save: jest.fn().mockResolvedValue(mockBooking),
          },
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    showtimeRepo = module.get(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return booking ID if seat is available and showtime exists', async () => {
      showtimeRepo.findOne.mockResolvedValue({ id: 1 } as Showtime);
      bookingRepo.findOne.mockResolvedValue(null);

      const result = await service.create(dto);

      expect(result).toEqual({ bookingId: mockBooking.bookingId });
      expect(bookingRepo.create).toHaveBeenCalledWith(dto);
      expect(bookingRepo.save).toHaveBeenCalledWith(mockBooking);
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      showtimeRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if seat is already booked', async () => {
      showtimeRepo.findOne.mockResolvedValue({ id: 1 } as Showtime);
      bookingRepo.findOne.mockResolvedValue(mockBooking);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });
});

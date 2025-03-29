import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from '../bookings.controller';
import { BookingsService } from '../bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const dto: CreateBookingDto = {
    userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    showtimeId: 1,
    seatNumber: 15,
  };

  const mockBookingResponse = {
    bookingId: 'uuid-1234',
  };

  const mockBookingsService = {
    create: jest.fn().mockResolvedValue(mockBookingResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a bookingId when called', async () => {
      const result = await controller.create(dto);
      expect(result).toEqual(mockBookingResponse);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from '../showtimes.controller';
import { ShowtimesService } from '../showtimes.service';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { Showtime } from '../entities/showtime.entity';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const dto: CreateShowtimeDto = {
    movieId: 1,
    price: 50.2,
    theater: 'Theater A',
    startTime: '2025-04-01T10:00:00.000Z',
    endTime: '2025-04-01T12:00:00.000Z',
  };

  const mockShowtime: Showtime = {
    id: 1,
    ...dto,
    startTime: new Date(dto.startTime),
    endTime: new Date(dto.endTime),
  };

  const mockShowtimesService = {
    create: jest.fn().mockResolvedValue(mockShowtime),
    getById: jest.fn().mockResolvedValue(mockShowtime),
    update: jest.fn().mockResolvedValue(mockShowtime),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a showtime', async () => {
      const result = await controller.create(dto);
      expect(result).toEqual(mockShowtime);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getById', () => {
    it('should return a showtime by id', async () => {
      const result = await controller.getById(1);
      expect(result).toEqual(mockShowtime);
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const result = await controller.update(1, dto);
      expect(result).toEqual(mockShowtime);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a showtime', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});

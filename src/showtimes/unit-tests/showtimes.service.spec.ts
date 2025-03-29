import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShowtimesService } from '../showtimes.service';
import { Showtime } from '../entities/showtime.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            create: jest.fn().mockReturnValue(mockShowtime),
            save: jest.fn().mockResolvedValue(mockShowtime),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(undefined),
              getExists: jest.fn().mockResolvedValue(true),
            })),
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              getExists: jest.fn().mockResolvedValue(true),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a showtime if valid', async () => {
      const result = await service.create(dto);
      expect(result).toEqual(mockShowtime);
      expect(showtimeRepo.save).toHaveBeenCalledWith(mockShowtime);
    });

    it('should throw if start time is after end time', async () => {
      await expect(
        service.create({ ...dto, startTime: dto.endTime, endTime: dto.startTime }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getById', () => {
    it('should return a showtime', async () => {
      showtimeRepo.findOne.mockResolvedValue(mockShowtime);
      const result = await service.getById(1);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw if not found', async () => {
      showtimeRepo.findOne.mockResolvedValue(null);
      await expect(service.getById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a showtime if valid', async () => {
      showtimeRepo.findOne.mockResolvedValue(mockShowtime);
      const result = await service.update(1, dto);
      expect(result).toEqual(mockShowtime);
    });

    it('should throw if showtime not found', async () => {
      showtimeRepo.findOne.mockResolvedValue(null);
      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove showtime', async () => {
      showtimeRepo.delete.mockResolvedValue({ affected: 1, raw: {} });
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw if not found', async () => {
      showtimeRepo.delete.mockResolvedValue({ affected: 0, raw: {} });
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: jest.Mocked<Repository<Movie>>;

  const dto: CreateMovieDto = {
    title: 'Dune',
    genre: 'Sci-Fi',
    duration: 155,
    rating: 8.2,
    releaseYear: 2021,
  };

  const mockMovie: Movie = {
    id: 1,
    ...dto,
  };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockMovie]),
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue(mockMovie),
    save: jest.fn().mockResolvedValue(mockMovie),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a movie', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.create(dto);
      expect(result).toEqual(mockMovie);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw if movie already exists', async () => {
      repo.findOne.mockResolvedValue(mockMovie);
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return a movie', async () => {
      repo.findOne.mockResolvedValue(mockMovie);
      const result = await service.update('Dune', dto);
      expect(result).toEqual(mockMovie);
    });

    it('should throw if movie not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update('Unknown', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a movie', async () => {
      repo.delete.mockResolvedValue({ affected: 1 ,raw: {}});
      await service.delete('Dune');
      expect(repo.delete).toHaveBeenCalledWith({ title: 'Dune' });
    });

    it('should throw if movie not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 ,raw: {}});
      await expect(service.delete('Unknown')).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { Movie } from '../entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

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

  const mockMoviesService = {
    findAll: jest.fn().mockResolvedValue([mockMovie]),
    create: jest.fn().mockResolvedValue(mockMovie),
    update: jest.fn().mockResolvedValue(mockMovie),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return an array of movies', async () => {
      const result = await controller.getAllMovies();
      expect(result).toEqual([mockMovie]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createMovie', () => {
    it('should create and return a movie', async () => {
      const result = await controller.createMovie(dto);
      expect(result).toEqual(mockMovie);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateMovie', () => {
    it('should update and return a movie', async () => {
      const result = await controller.updateMovie('Dune', dto);
      expect(result).toEqual(mockMovie);
      expect(service.update).toHaveBeenCalledWith('Dune', dto);
    });
  });

  describe('deleteMovie', () => {
    it('should delete the movie', async () => {
      await controller.deleteMovie('Dune');
      expect(service.delete).toHaveBeenCalledWith('Dune');
    });
  });
});

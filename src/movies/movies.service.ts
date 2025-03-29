import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.movieRepo.find();
  }

  async create(movieDto: CreateMovieDto): Promise<Movie> {
    const existing = await this.movieRepo.findOne({
      where: { title: movieDto.title },
    });
  
    if (existing) {
      throw new BadRequestException(
        `Movie with title "${movieDto.title}" already exists.`,
      );
    }
  
    const movie = this.movieRepo.create(movieDto);
    return this.movieRepo.save(movie);
  }
  
  async update(title: string, movieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.movieRepo.findOne({ where: { title } });
    if (!movie) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }

    Object.assign(movie, movieDto);
    return this.movieRepo.save(movie);
  }

  async delete(title: string): Promise<void> {
    const result = await this.movieRepo.delete({ title });
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }
  }
}


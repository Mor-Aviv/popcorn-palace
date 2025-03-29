import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, LessThan, MoreThan, Not } from 'typeorm';
  import { Showtime } from './entities/showtime.entity';
  import { CreateShowtimeDto } from './dto/create-showtime.dto';
  import { Movie } from '../movies/entities/movie.entity';
  
  @Injectable()
  export class ShowtimesService {
    constructor(
      @InjectRepository(Showtime)
      private readonly showtimeRepo: Repository<Showtime>,
      @InjectRepository(Movie)
      private readonly movieRepo: Repository<Movie>,
    ) {}
  
    async create(showtimeDto: CreateShowtimeDto): Promise<Showtime> {
      if (new Date(showtimeDto.startTime) >= new Date(showtimeDto.endTime)) {
        throw new BadRequestException('Start time must be before end time.');
      }
      
      await this.ensureMovieExists(showtimeDto.movieId);
      await this.checkForOverlappingShowtimes(showtimeDto);
  
      const showtime = this.showtimeRepo.create(showtimeDto);
      return this.showtimeRepo.save(showtime);
    }
  
    async getById(id: number): Promise<Showtime> {
      const showtime = await this.showtimeRepo.findOne({ where: { id } });
  
      if (!showtime) {
        throw new NotFoundException(`Showtime with id '${id}' not found`);
      }
  
      return showtime;
    }
  
    async update(id: number, showtimeDto: CreateShowtimeDto): Promise<Showtime> {
      if (new Date(showtimeDto.startTime) >= new Date(showtimeDto.endTime)) {
        throw new BadRequestException('Start time must be before end time.');
      }
      const showtime = await this.showtimeRepo.findOne({ where: { id } });
  
      if (!showtime) {
        throw new NotFoundException(`Showtime with id '${id}' not found`);
      }
  
      await this.ensureMovieExists(showtimeDto.movieId);
      await this.checkForOverlappingShowtimes(showtimeDto, id);
  
      Object.assign(showtime, showtimeDto);
      return this.showtimeRepo.save(showtime);
    }
  
    async remove(id: number): Promise<void> {
      const result = await this.showtimeRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Showtime with id '${id}' not found`);
      }
    }
  
    private async checkForOverlappingShowtimes(
      showtimeDto: CreateShowtimeDto,
      excludeId?: number,
    ): Promise<void> {
      const query = this.showtimeRepo.createQueryBuilder('showtime')
        .where('showtime.theater = :theater', { theater: showtimeDto.theater })
        .andWhere(
          `NOT (
            showtime.endTime <= :startTime OR
            showtime.startTime >= :endTime
          )`,
          {
            startTime: new Date(showtimeDto.startTime),
            endTime: new Date(showtimeDto.endTime),
          },
        );
    
      if (excludeId) {
        query.andWhere('showtime.id != :id', { id: excludeId });
      }
    
      const overlapping = await query.getOne();
    
      if (overlapping) {
        throw new BadRequestException(
          'Overlapping showtime exists in this theater.',
        );
      }
    }
    
  
    private async ensureMovieExists(id: number): Promise<void> {
        const exists = await this.movieRepo
        .createQueryBuilder('movie')
        .where('movie.id = :id', { id })
        .getExists();
    
      if (!exists) {
        throw new NotFoundException(`Movie with id '${id}' not found`);
      }
    }
  }
  
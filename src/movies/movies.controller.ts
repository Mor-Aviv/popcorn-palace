import { Controller, Get, Post, Body, Param, Delete,HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  @HttpCode(200)
  getAllMovies() {
    return this.moviesService.findAll();
  }

  
  @Post()
  @HttpCode(200)
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  
  @Post('update/:title')
  @HttpCode(200)
  updateMovie(
    @Param('title') title: string,
    @Body() updateMovieDto: CreateMovieDto,
  ) {
    return this.moviesService.update(title, updateMovieDto);
  }

  
  @Delete(':title')
  @HttpCode(200)
  deleteMovie(@Param('title') title: string) {
    return this.moviesService.delete(title);
  }
}

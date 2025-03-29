import {
    Controller,
    Post,
    Body,
    HttpCode,
    Get,
    Param,
    Delete,
  } from '@nestjs/common';
  import { ShowtimesService } from './showtimes.service';
  import { CreateShowtimeDto } from './dto/create-showtime.dto';
  
  @Controller('showtimes')
  export class ShowtimesController {
    constructor(private readonly showtimesService: ShowtimesService) {}
  
    @Post()
    @HttpCode(200)
    async create(@Body() createShowtimeDto: CreateShowtimeDto) {
      return this.showtimesService.create(createShowtimeDto);
    }
  
    @Get(':id')
    @HttpCode(200)
    async getById(@Param('id') id: number) {
      return this.showtimesService.getById(id);
    }
  
    @Post('update/:id')
    @HttpCode(200)
    async update(
      @Param('id') id: number,
      @Body() updateDto: CreateShowtimeDto,
    ) {
      return this.showtimesService.update(id, updateDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number) {
      return this.showtimesService.remove(id);
    }
  }
  

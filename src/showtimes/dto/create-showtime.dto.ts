import {
    IsInt,
    IsPositive,
    IsString,
    IsDateString,
    IsNumber,
  } from 'class-validator';
  
  export class CreateShowtimeDto {
    @IsInt()
    @IsPositive()
    movieId: number;

    @IsNumber()
    @IsPositive()
    price: number;
  
    @IsString()
    theater: string;
  
    @IsDateString()
    startTime: string;
  
    @IsDateString()
    endTime: string;
  
    
  }
  
import {
    IsInt,
    IsPositive,
    IsString,
    IsDateString,
    IsNumber,
    IsNotEmpty,
    IsDefined
  } from 'class-validator';
  
  export class CreateShowtimeDto {
    
    @IsPositive()
    @IsInt()
    @IsDefined()
    movieId: number;

    @IsPositive()
    @IsNumber()
    @IsDefined()
    price: number;
  
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    theater: string;
  
    @IsDateString()
    @IsNotEmpty()
    @IsDefined()
    startTime: string;
  
    @IsDateString()
    @IsNotEmpty()
    @IsDefined()
    endTime: string;
  
  }
  
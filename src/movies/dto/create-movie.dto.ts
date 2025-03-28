import { IsString, IsNumber, Min, Max, IsInt } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(0)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @Min(1888) 
  @Max(new Date().getFullYear() + 1)
  releaseYear: number;
}

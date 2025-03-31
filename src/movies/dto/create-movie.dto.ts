import { IsString, IsNumber, Min, Max, IsInt, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  genre: string;

  
  @Min(0)
  @IsInt()
  @IsDefined()
  duration: number;

  
  @Min(0)
  @Max(10)
  @IsNumber()
  @IsDefined()
  rating: number;

  
  @Min(1888) 
  @Max(new Date().getFullYear() + 1)
  @IsInt()
  @IsDefined()
  releaseYear: number;
}

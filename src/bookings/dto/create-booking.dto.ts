import { IsUUID, IsInt, Min, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  userId: string;

  @IsInt()
  @IsDefined()
  showtimeId: number;
 
  @Min(1)
  @IsInt()
  @IsDefined()
  seatNumber: number;
}

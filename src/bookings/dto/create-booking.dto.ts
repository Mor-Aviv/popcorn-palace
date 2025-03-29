import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  userId: string;

  @IsInt()
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;
}

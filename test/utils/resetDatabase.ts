import { DataSource } from 'typeorm';
import { Movie } from '../../src/movies/entities/movie.entity';
import { Showtime } from '../../src/showtimes/entities/showtime.entity';
import { Booking } from '../../src/bookings/entities/booking.entity';

// helper function to reset data between E2E tests
export async function resetDatabase(dataSource: DataSource) {
  await dataSource.getRepository(Booking).delete({});
  await dataSource.getRepository(Showtime).delete({});
  await dataSource.getRepository(Movie).delete({});
}

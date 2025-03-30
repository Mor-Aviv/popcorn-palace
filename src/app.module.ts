import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'popcorn-palace', 
    password: 'popcorn-palace', 
    database: 'popcorn-palace', 
    synchronize: true, 
    autoLoadEntities: true, 
  }),MoviesModule, ShowtimesModule, BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

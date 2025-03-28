import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres', 
    password: 'postgres', 
    database: 'popcorn_palace', 
    synchronize: true, 
    autoLoadEntities: true, 
  }),MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/resetDatabase';

jest.setTimeout(20000);

describe('Bookings E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let showtimeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    await resetDatabase(dataSource);

  });

  beforeEach(async () => {
    await resetDatabase(dataSource);

    const movieRes = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'E2E Booking Movie',
        genre: 'Action',
        duration: 120,
        rating: 7.8,
        releaseYear: 2021,
      });

    const movieId = movieRes.body.id;

    const showtimeRes = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId,
        price: 18,
        theater: 'Booking Theater',
        startTime: '2025-04-01T18:00:00.000Z',
        endTime: '2025-04-01T20:00:00.000Z',
      });

    showtimeId = showtimeRes.body.id;
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('POST /bookings', () => {
    it('should create a booking', async () => {
      const payload = {
        userId: 'de305d54-75b4-431b-adb2-eb6b9e546014',
        showtimeId,
        seatNumber: 5,
      };

      const res = await request(app.getHttpServer())
        .post('/bookings')
        .send(payload)
        .expect(200);

      expect(res.body.bookingId).toBeDefined();
    });

    it('should fail if seat is already booked', async () => {
      
      const movieRes = await request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Duplicate Seat Test Movie',
          genre: 'Action',
          duration: 120,
          rating: 8,
          releaseYear: 2022,
        });
    
      const movieId = movieRes.body.id;
    
      const showtimeRes = await request(app.getHttpServer())
        .post('/showtimes')
        .send({
          movieId,
          price: 20,
          theater: 'Test Theater',
          startTime: '2025-04-01T12:00:00.000Z',
          endTime: '2025-04-01T14:00:00.000Z',
        });
    
      const showtimeId = showtimeRes.body.id;
    
      const payload = {
        userId: '83f2e7e2-4f38-4f9f-91e4-77ef615c264a',
        showtimeId,
        seatNumber: 5,
      };
    
      
      await request(app.getHttpServer())
        .post('/bookings')
        .send(payload)
        .expect(200);
    
      
      await request(app.getHttpServer())
        .post('/bookings')
        .send(payload)
        .expect(400);
    });
    

    it('should fail if showtime does not exist', async () => {
      const payload = {
        userId: '6bc8e60a-1f10-4e88-8231-6c4fc6a3a2d2',
        showtimeId: 99999,
        seatNumber: 7,
      };

      const res = await request(app.getHttpServer())
        .post('/bookings')
        .send(payload)
        .expect(404);

      expect(res.body.message).toContain('Showtime 99999 does not exist');
    });
  });
});

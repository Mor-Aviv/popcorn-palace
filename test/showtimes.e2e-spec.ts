import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/resetDatabase';

jest.setTimeout(20000);

describe('Showtimes E2E', () => {
  let app: INestApplication;
  let movieId: number;
  let dataSource: DataSource;

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
        title: 'The Prestige',
        genre: 'Mystery',
        duration: 110,
        rating: 9.5,
        releaseYear: 2016,
      });

    movieId = movieRes.body.id;
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('POST /showtimes', () => {
    it('should create a showtime', async () => {
      const payload = {
        movieId,
        price: 25.5,
        theater: 'Theater 1',
        startTime: '2025-04-01T12:00:00.000Z',
        endTime: '2025-04-01T13:00:00.000Z',
      };

      const res = await request(app.getHttpServer())
        .post('/showtimes')
        .send(payload)
        .expect(200);

      expect(res.body).toMatchObject({
        movieId,
        theater: 'Theater 1',
      });
      expect(res.body.id).toBeDefined();
    });

    it('should fail for overlapping showtimes in the same theater', async () => {

      await request(app.getHttpServer())
        .post('/showtimes')
        .send({
          movieId,
          price: 20,
          theater: 'Theater 1',
          startTime: '2025-04-01T10:00:00.000Z',
          endTime: '2025-04-01T12:00:00.000Z',
        })
        .expect(200);

      // Overlapping showtime
      const payload = {
        movieId,
        price: 30,
        theater: 'Theater 1',
        startTime: '2025-04-01T11:00:00.000Z',
        endTime: '2025-04-01T13:00:00.000Z',
      };

      await request(app.getHttpServer())
        .post('/showtimes')
        .send(payload)
        .expect(400);
    });

    it('should fail if startTime is after endTime', async () => {
      const payload = {
        movieId,
        price: 22,
        theater: 'Theater 2',
        startTime: '2025-04-01T15:00:00.000Z',
        endTime: '2025-04-01T14:00:00.000Z',
      };

      await request(app.getHttpServer())
        .post('/showtimes')
        .send(payload)
        .expect(400);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { resetDatabase } from './utils/resetDatabase';

jest.setTimeout(20000);

describe('Movies E2E', () => {
  let app: INestApplication;
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
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('POST /movies', () => {
    it('should create a movie', async () => {
      const payload = {
        title: `Interstellar`,
        genre: 'Sci-Fi',
        duration: 169,
        rating: 8.6,
        releaseYear: 2014,
      };

      const res = await request(app.getHttpServer())
        .post('/movies')
        .send(payload)
        .expect(200);

      expect(res.body).toMatchObject(payload); 
      expect(res.body.id).toBeDefined();
    });

    it('should fail with invalid rating', async () => {
      const payload = {
        title: 'Invalid Movie',
        genre: 'Drama',
        duration: 100,
        rating: 15, // invalid rating > 10
        releaseYear: 2020,
      };

      const res = await request(app.getHttpServer())
        .post('/movies')
        .send(payload)
        .expect(400);

      expect(res.body.message).toBeDefined();
    });
  });

  describe('GET /movies/all', () => {
    it('should return all movies', async () => {
      const movie1 = {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 140,
        rating: 8.8,
        releaseYear: 2015,
      };
  
      const movie2 = {
        title: 'The Matrix',
        genre: 'Action',
        duration: 126,
        rating: 8.7,
        releaseYear: 1991,
      };
  
      
      await request(app.getHttpServer()).post('/movies').send(movie1);
      await request(app.getHttpServer()).post('/movies').send(movie2);
  
      const res = await request(app.getHttpServer())
        .get('/movies/all')
        .expect(200);
  
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
  
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining(movie1),
          expect.objectContaining(movie2),
        ]),
      );
    });
  });
  
});

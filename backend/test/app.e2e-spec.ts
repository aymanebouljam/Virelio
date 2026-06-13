import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { Server } from 'node:http';

describe('App e2e', () => {
  let app: INestApplication;
  let http: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    configureApp(app);

    await app.init();
    http = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / returns backend sanity check', async () => {
    await request(http).get('/').expect(200).expect('Hello World!');
  });

  it('GET /health returns backend health', async () => {
    await request(http).get('/health').expect(200).expect({
      status: 'ok',
      service: 'backend',
    });
  });
});

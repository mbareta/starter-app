import { AppModule } from '../app.module';
import { AuthGuard } from '../auth/auth.guard';
import { AuthGuardMock } from '../auth/auth.guard.mock';
import { Course } from './entities/course.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';

const BASE_URL = '/courses';
const credentials = {
  admin: { email: 'admin@test.com' },
  user: { email: 'user@test.com' }
};

describe('Users', () => {
  let app: INestApplication;
  let em: EntityManager;
  let server;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AuthGuard)
      .useClass(AuthGuardMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    em = app.get(EntityManager).fork();

    adminToken = credentials.admin.email;
    userToken = credentials.user.email;
  });

  describe(`GET ${BASE_URL}`, () => {
    it('returns 401 when user is not authenticated', () => {
      return request(server).get(BASE_URL).expect(401);
    });

    it('returns list of courses', () => {
      return request(server)
        .get(BASE_URL)
        .set('Authorization', adminToken)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
        });
    });
  });

  describe(`GET ${BASE_URL}/catalog`, () => {
    it('returns 401 when user is not authenticated', () => {
      return request(server).get(`${BASE_URL}/catalog`).expect(401);
    });

    it('returns 403 when user is not authorized', () => {
      return request(server)
        .get(`${BASE_URL}/catalog`)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('returns list of courses in the catalog', () => {
      return request(server)
        .get(`${BASE_URL}/catalog`)
        .set('Authorization', adminToken)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(2); // TODO
        });
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('returns 401 when user is not authenticated', () => {
      return request(server).post(BASE_URL).expect(401);
    });

    it('returns 403 when user is not authorized', () => {
      return request(server)
        .post(BASE_URL)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('imports course', () => {
      const sourceId = 3;
      return request(server)
        .post(BASE_URL)
        .send({ sourceId })
        .set('Authorization', adminToken)
        .expect(201)
        .then(async () => {
          const course = await em.findOne(Course, { sourceId });
          expect(course.id).toBeGreaterThan(0);
        });
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it('returns 401 when user is not authenticated', async () => {
      const { id } = await em.findOne(Course, { sourceId: 1 });
      return request(server).delete(`${BASE_URL}/${id}`).expect(401);
    });

    it('returns 403 when user is not authorized', async () => {
      const { id } = await em.findOne(Course, { sourceId: 1 });
      return request(server)
        .delete(`${BASE_URL}/${id}`)
        .set('Authorization', userToken)
        .expect(403);
    });

    it('returns 404 when course does not exist', async () => {
      return request(server)
        .delete(`${BASE_URL}/0`)
        .set('Authorization', adminToken)
        .expect(404);
    });

    it('deletes course', async () => {
      const course = await em.findOne(Course, { sourceId: 1 });
      return request(server)
        .delete(`${BASE_URL}/${course.id}`)
        .set('Authorization', adminToken)
        .expect(204)
        .then(async () => {
          const course = await em.findOne(Course, { sourceId: 1 });
          expect(course).toBeNull();
        });
    });
  });

  afterAll(() => app.close());
});

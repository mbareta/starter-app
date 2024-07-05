import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';

const BASE_URL = '/users';
const credentials = {
  admin: { email: 'admin@test.com', password: 'admin' }
};
const fakeUser = { email: 'new_user@fake.com', password: 'temp', role: 'USER' };

describe('Users', () => {
  let app: INestApplication;
  let server;
  let token: string;
  let em: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    em = app.get(EntityManager).fork();

    const res = await request(server)
      .post('/auth/login')
      .send(credentials.admin);
    token = res.body.token;
  });

  describe(`GET ${BASE_URL}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).get(BASE_URL).expect(401);
    });

    it('returns list of users', () => {
      return request(server)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          const admin = body.find((it) => it.email === credentials.admin.email);
          expect(admin).not.toBeNull();
        });
    });
  });

  describe(`POST ${BASE_URL}`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).post(BASE_URL).expect(401);
    });

    it('creates new user', async () => {
      return request(server)
        .post(BASE_URL)
        .send(fakeUser)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .then(async () => {
          const user = await em.findOne(User, { email: fakeUser.email });
          expect(user).not.toBeNull();
          return request(server).post('/auth/login').send(fakeUser).expect(200);
        });
    });
  });

  describe(`DELETE ${BASE_URL}/:id`, () => {
    it('returns 401 when user is not authorized', () => {
      return request(server).delete(`${BASE_URL}/1`).expect(401);
    });

    it('deletes user', async () => {
      const user = await em.findOne(User, { email: fakeUser.email });
      return request(server)
        .delete(`${BASE_URL}/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(async () => {
          const user = await em.findOne(User, { email: fakeUser.email });
          expect(user).toBeNull();
        });
    });
  });

  afterAll(() => app.close());
});

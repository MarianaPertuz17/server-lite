import dotenv from 'dotenv';
import supertest from 'supertest';
import { mocks } from './mocks';
import { Admin } from '../models/admin';
import chai from 'chai';
import { bootServer } from '../server';

import { ProcessEnv } from '../environment';

chai.should();
// Allows using Chai assertions

// env

dotenv.config();
const envVar = (process.env as ProcessEnv);
// const validJWT =
//   'Bearer ' + jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET);
// const invalidJWT = 'Bearer ' + jwt.sign({ _id: 1 }, 'wrong_secret');

const app = bootServer(envVar.TEST_PORT);

const request = supertest(app);

describe('test server endpoints', () => {
  // setup
  before('Ensure Models are Synced', async () => {
    // Ensure Models are synced and tables crated
    await Admin.sync();

    // destroys test Admin if it exists
    await Admin.destroy({
      where: {
        id: mocks.mockAdmin.id,
      },
    });
    // creates test user
    await Admin.create(mocks.mockAdmin);

  });

  // clean up
  after('clean up', async () => {
    // Destroys test user if it exists
    await Admin.destroy({
      where: {
        id: mocks.mockAdmin.id,
      },
    });
  });

  // no auth required
  describe('does not require user auth', () => {
    describe('non-covered endpoint', () => {
      it('should return error message', async () => {
        const res = await request.get('/wrong');
        res.text.should.equal('These are not the routes you are looking for');
      });
    });

    // describe('GET /api/user/getInfo', () => {
    //   it('should return user info', async () => {
    //     const res = await request
    //       .get('/api/user/getInfo')
    //       .set('Authorization', validJWT);
    //     res.status.should.equal(200);
    //     res.body.res.firstName.should.equal('Rick');
    //     res.body.res.surname.should.equal('Sanchez');
    //     res.body.res.username.should.equal('pickelrick');
    //   });
    // });
  });
});

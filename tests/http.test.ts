import dotenv from 'dotenv';
import supertest from 'supertest';
import { mocks } from './mocks';
import jwt from 'jsonwebtoken';
import chai from 'chai';
import { bootServer } from '../server';
import { ProcessEnv } from '../environment';

import { Product } from '../models/product';
import { Guest } from '../models/guest';
import { Company } from '../models/company';
import { Admin } from '../models/admin';

chai.should();
// Allows using Chai assertions

// env

dotenv.config();
const envVar = process.env as ProcessEnv;

// const validJWT =
//   'Bearer ' + jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET);
// const invalidJWT = 'Bearer ' + jwt.sign({ _id: 1 }, 'wrong_secret');

const app = bootServer(envVar.TEST_PORT);

const request = supertest(app);

const cleanup = async () => {
  await Admin.destroy({
    where: {
      email: mocks.mockAdmin.email,
    },
  });

  await Product.destroy({
    where: {
      companyId: mocks.mockProducts[0].companyId,
    },
  });

  await Company.destroy({
    where: {
      NIT: mocks.mockCompany.NIT,
    },
  });

  await Guest.destroy({
    where: {
      email: mocks.mockGuest.email,
    },
  });
};

const syncModels = async () => {
  await Admin.sync();
  await Product.sync();
  await Guest.sync();
  await Company.sync();
};

describe('test server endpoints', () => {
  before('Ensure Models are Synced', async () => {
    // Ensure Models are synced and tables created
    await syncModels();
    await cleanup();
  });

  after('clean up', async () => {
    await cleanup();
  });

  describe('non-covered endpoint', () => {
    it('should return error message', async () => {
      const res = await request.get('/wrong');
      res.text.should.equal('These are not the routes you are looking for');
    });
  });

  describe('POST: api/guest/register', () => {
    it('should not register if password length is less than 6', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({...mocks.mockGuest, password: 'short', passwordRepeat: 'short'});
        res.body.res.should.equal('Password should be at least 6 characters long!');
        res.status.should.equal(400);
    });
    it('should not register with invalid emails', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({...mocks.mockGuest, email: 'wrong_email_format'});
        res.body.res.should.equal('Email is not valid!');
        res.status.should.equal(400);
    });
    it('should not register if passwords are different', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({...mocks.mockGuest, password: 'pass123', passwordRepeat: 'pass1234'});
        res.body.res.should.equal('Passwords don\'t match!');
        res.status.should.equal(400);
    });
    it('should register guest and return jwt', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({...mocks.mockGuest, passwordRepeat: mocks.mockGuest.password});
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      decoded.user.email.should.equal(mocks.mockGuest.email);
      res.status.should.equal(201);
    });
    it('should not register same user twice', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({...mocks.mockGuest, passwordRepeat: mocks.mockGuest.password});
        res.body.res.should.equal('User already exists!');
        res.status.should.equal(409);
    });
  });

  describe('POST: api/admin/register', () => {
    it('should not allow register access without secret admin password', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, password: 'short', passwordRepeat: 'short'});
        res.body.res.should.equal('You are not authorized to create admin users');
        res.status.should.equal(401);
    });
    it('should not register if password length is less than 6', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, password: 'short', passwordRepeat: 'short', adminSecret: process.env.ADMIN_CREATION_SECRET});
        res.body.res.should.equal('Password should be at least 6 characters long!');
        res.status.should.equal(400);
    });
    it('should not register with invalid emails', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, email: 'wrong_email_format', adminSecret: process.env.ADMIN_CREATION_SECRET});
        res.body.res.should.equal('Email is not valid!');
        res.status.should.equal(400);
    });
    it('should not register if passwords are different', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, password: 'pass123', passwordRepeat: 'pass1234', adminSecret: process.env.ADMIN_CREATION_SECRET});
        res.body.res.should.equal('Passwords don\'t match!');
        res.status.should.equal(400);
    });
    it('should register admin with secret and return jwt', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, passwordRepeat: mocks.mockAdmin.password, adminSecret: process.env.ADMIN_CREATION_SECRET});
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      decoded.user.email.should.equal(mocks.mockAdmin.email);
      res.status.should.equal(201);
    });
    it('should not register same user twice', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({...mocks.mockAdmin, passwordRepeat: mocks.mockAdmin.password, adminSecret: process.env.ADMIN_CREATION_SECRET});
        res.body.res.should.equal('User already exists!');
        res.status.should.equal(409);
    });

  });

});

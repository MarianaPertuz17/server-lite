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

const app = bootServer(envVar.TEST_PORT);

const request = supertest(app);

let guestJWT: string;
let adminJWT: string;
let createdProductId: string;

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
        .send({
          ...mocks.mockGuest,
          password: 'short',
          passwordRepeat: 'short',
        });
      res.body.res.should.equal(
        'Password should be at least 6 characters long!'
      );
      res.status.should.equal(400);
    });
    it('should not register with invalid emails', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({ ...mocks.mockGuest, email: 'wrong_email_format' });
      res.body.res.should.equal('Email is not valid!');
      res.status.should.equal(400);
    });
    it('should not register if passwords are different', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({
          ...mocks.mockGuest,
          password: 'pass123',
          passwordRepeat: 'pass1234',
        });
      res.body.res.should.equal('Passwords don\'t match!');
      res.status.should.equal(400);
    });
    it('should register guest and return jwt', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({ ...mocks.mockGuest, passwordRepeat: mocks.mockGuest.password });
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      decoded.user.email.should.equal(mocks.mockGuest.email);
      res.status.should.equal(201);
    });
    it('should not register same user twice', async () => {
      const res = await request
        .post('/api/guest/register')
        .send({ ...mocks.mockGuest, passwordRepeat: mocks.mockGuest.password });
      res.body.res.should.equal('User already exists!');
      res.status.should.equal(409);
    });
  });

  describe('POST: api/admin/register', () => {
    it('should not allow register access without secret admin password', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          password: 'short',
          passwordRepeat: 'short',
        });
      res.body.res.should.equal('You are not authorized to create admin users');
      res.status.should.equal(401);
    });
    it('should not register if password length is less than 6', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          password: 'short',
          passwordRepeat: 'short',
          adminSecret: process.env.ADMIN_CREATION_SECRET,
        });
      res.body.res.should.equal(
        'Password should be at least 6 characters long!'
      );
      res.status.should.equal(400);
    });
    it('should not register with invalid emails', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          email: 'wrong_email_format',
          adminSecret: process.env.ADMIN_CREATION_SECRET,
        });
      res.body.res.should.equal('Email is not valid!');
      res.status.should.equal(400);
    });
    it('should not register if passwords are different', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          password: 'pass123',
          passwordRepeat: 'pass1234',
          adminSecret: process.env.ADMIN_CREATION_SECRET,
        });
      res.body.res.should.equal('Passwords don\'t match!');
      res.status.should.equal(400);
    });
    it('should register admin with secret and return jwt', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          passwordRepeat: mocks.mockAdmin.password,
          adminSecret: process.env.ADMIN_CREATION_SECRET,
        });
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      decoded.user.email.should.equal(mocks.mockAdmin.email);
      res.status.should.equal(201);
    });
    it('should not register same user twice', async () => {
      const res = await request
        .post('/api/admin/register')
        .send({
          ...mocks.mockAdmin,
          passwordRepeat: mocks.mockAdmin.password,
          adminSecret: process.env.ADMIN_CREATION_SECRET,
        });
      res.body.res.should.equal('User already exists!');
      res.status.should.equal(409);
    });
  });

  describe('POST: api/guest/login', () => {
    it('should not login if wrong email', async () => {
      const res = await request
        .post('/api/guest/login')
        .send({ ...mocks.mockGuest, email: 'wrong_email@gmail.com' });
      res.body.res.should.equal('Invalid username or password!');
      res.status.should.equal(401);
    });
    it('should not login if passwords do not match', async () => {
      const res = await request
        .post('/api/guest/login')
        .send({ ...mocks.mockGuest, password: 'wrong password' });
      res.body.res.should.equal('Invalid username or password!');
      res.status.should.equal(401);
    });
    it('should login guest and return jwt', async () => {
      const res = await request
        .post('/api/guest/login')
        .send({ ...mocks.mockGuest });
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      guestJWT = res.body.res;
      decoded.user.email.should.equal(mocks.mockGuest.email);
      res.status.should.equal(200);
    });
  });

  describe('POST: api/admin/login', () => {
    it('should not login if wrong email', async () => {
      const res = await request
        .post('/api/admin/login')
        .send({ ...mocks.mockAdmin, email: 'wrong_email@gmail.com' });
      res.body.res.should.equal('Invalid username or password!');
      res.status.should.equal(401);
    });
    it('should not login if passwords do not match', async () => {
      const res = await request
        .post('/api/admin/login')
        .send({ ...mocks.mockAdmin, password: 'wrong password' });
      res.body.res.should.equal('Invalid username or password!');
      res.status.should.equal(401);
    });
    it('should login admin and return jwt', async () => {
      const res = await request
        .post('/api/admin/login')
        .send({ ...mocks.mockAdmin });
      const decoded: any = jwt.verify(res.body.res, process.env.JWT_SECRET);
      adminJWT = res.body.res;
      decoded.user.email.should.equal(mocks.mockAdmin.email);
      res.status.should.equal(200);
    });
  });

  describe('POST: api/admin/company', () => {
    it('should not let guest user create a company', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ ...mocks.mockCompany })
        .set('Authorization', 'Bearer ' + guestJWT);
      res.body.res.should.equal('Not an admin user!');
      res.status.should.equal(401);
    });
    it('should not let create company if missing fields', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ name: mocks.mockCompany.name })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Missing form fields!');
      res.status.should.equal(400);
    });
    it('should not let create company if phone is different from 10 digits', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ ...mocks.mockCompany, phone: '313334' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Expected phone number of 10 digits');
      res.status.should.equal(400);
    });
    it('should not let create company if NIT is invalid', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ ...mocks.mockCompany, NIT: '102930e' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('We only accept numbers in NIT');
      res.status.should.equal(400);
    });
    it('should let admin create a company', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ ...mocks.mockCompany })
        .set('Authorization', 'Bearer ' + adminJWT);
      const { NIT, name, address, phone } = res.body.res;
      NIT.should.equal(mocks.mockCompany.NIT);
      name.should.equal(mocks.mockCompany.name);
      address.should.equal(mocks.mockCompany.address);
      phone.should.equal(mocks.mockCompany.phone);
      res.status.should.equal(201);
    });
    it('should not create an existing company', async () => {
      const res = await request
        .post('/api/admin/company')
        .send({ ...mocks.mockCompany })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Company with that NIT already exists');
      res.status.should.equal(409);
    });
  });

  describe('POST: api/admin/product', () => {
    it('should not let guest user create a product', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ ...mocks.mockProducts[0] })
        .set('Authorization', 'Bearer ' + guestJWT);
      res.body.res.should.equal('Not an admin user!');
      res.status.should.equal(401);
    });
    it('should not let create product if missing fields', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ productName: mocks.mockProducts[0].productName })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Missing form fields!');
      res.status.should.equal(400);
    });
    it('should not let create product if quantity is less than zero', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ ...mocks.mockProducts[0], quantity: -1 })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal(
        'Product quantity has to be greater than or equal to zero'
      );
      res.status.should.equal(400);
    });
    it('should not let create product if NIT is invalid', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ ...mocks.mockProducts[0], companyId: '102930e' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('We only accept numbers in NIT');
      res.status.should.equal(400);
    });
    it('should not let create product if company does not exist', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ ...mocks.mockProducts[0], companyId: '1111111111111' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Company with that NIT does not exist');
      res.status.should.equal(400);
    });

    it('should let admin create a product', async () => {
      const res = await request
        .post('/api/admin/product')
        .send({ ...mocks.mockProducts[0] })
        .set('Authorization', 'Bearer ' + adminJWT);
      const { companyId, productName, quantity, id } = res.body.res;
      createdProductId = id;
      companyId.should.equal(mocks.mockProducts[0].companyId);
      productName.should.equal(mocks.mockProducts[0].productName);
      quantity.should.equal(mocks.mockProducts[0].quantity);
      res.status.should.equal(201);
    });
  });

  describe('GET: api/guest/companies', () => {
    it('should let guest user see companies', async () => {
      const res = await request
        .get('/api/guest/companies')
        .set('Authorization', 'Bearer ' + guestJWT);
      const companyToSearch = res.body.res.filter(
        (company: any) => company.NIT === mocks.mockCompany.NIT
      );
      companyToSearch
        .map(({ NIT, address, name, phone }: any) => ({
          NIT,
          address,
          name,
          phone,
        }))
        .should.eql([mocks.mockCompany]);
      res.status.should.equal(200);
    });
    it('should let admin user see companies', async () => {
      const res = await request
        .get('/api/guest/companies')
        .set('Authorization', 'Bearer ' + adminJWT);
      const companyToSearch = res.body.res.filter(
        (company: any) => company.NIT === mocks.mockCompany.NIT
      );
      companyToSearch
        .map(({ NIT, address, name, phone }: any) => ({
          NIT,
          address,
          name,
          phone,
        }))
        .should.eql([mocks.mockCompany]);
      res.status.should.equal(200);
    });
  });

  describe('GET: api/guest/company/:id', () => {
    it('should let guest user see a company', async () => {
      const res = await request
        .get(`/api/guest/company/${mocks.mockCompany.NIT}`)
        .set('Authorization', 'Bearer ' + guestJWT);
      const { products, name, phone, address, NIT } = res.body.res;
      const { productName, companyId, quantity } = products[0];
      name.should.equal(mocks.mockCompany.name);
      phone.should.equal(mocks.mockCompany.phone);
      address.should.equal(mocks.mockCompany.address);
      NIT.should.equal(mocks.mockCompany.NIT);
      productName.should.equal(mocks.mockProducts[0].productName);
      companyId.should.equal(mocks.mockProducts[0].companyId);
      quantity.should.equal(mocks.mockProducts[0].quantity);
      res.status.should.equal(200);
    });
    it('should let admin user see a company', async () => {
      const res = await request
        .get(`/api/guest/company/${mocks.mockCompany.NIT}`)
        .set('Authorization', 'Bearer ' + adminJWT);
      const { products, name, phone, address, NIT } = res.body.res;
      const { productName, companyId, quantity } = products[0];
      name.should.equal(mocks.mockCompany.name);
      phone.should.equal(mocks.mockCompany.phone);
      address.should.equal(mocks.mockCompany.address);
      NIT.should.equal(mocks.mockCompany.NIT);
      productName.should.equal(mocks.mockProducts[0].productName);
      companyId.should.equal(mocks.mockProducts[0].companyId);
      quantity.should.equal(mocks.mockProducts[0].quantity);
      res.status.should.equal(200);
    });
  });

  // mutating requests over here

  describe('PUT: api/admin/company', () => {
    it('should not let guest user edit a company', async () => {
      const res = await request
        .put('/api/admin/company')
        .send({ ...mocks.mockCompany })
        .set('Authorization', 'Bearer ' + guestJWT);
      res.body.res.should.equal('Not an admin user!');
      res.status.should.equal(401);
    });
    it('should not let edit company if missing fields', async () => {
      const res = await request
        .put('/api/admin/company')
        .send({ name: mocks.mockCompany.name })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Missing form fields!');
      res.status.should.equal(400);
    });
    it('should not let edit company if phone is different from 10 digits', async () => {
      const res = await request
        .put('/api/admin/company')
        .send({ ...mocks.mockCompany, phone: '313334' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('Expected phone number of 10 digits');
      res.status.should.equal(400);
    });
    it('should not let edit company if NIT is invalid', async () => {
      const res = await request
        .put('/api/admin/company')
        .send({ ...mocks.mockCompany, NIT: '102930e' })
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal('We only accept numbers in NIT');
      res.status.should.equal(400);
    });
    it('should let admin edit a company', async () => {
      const res = await request
        .put('/api/admin/company')
        .send({ ...mocks.mockCompany, name: 'test_name' })
        .set('Authorization', 'Bearer ' + adminJWT);
      const { NIT, name, address, phone } = res.body.res;
      NIT.should.equal(mocks.mockCompany.NIT);
      name.should.equal('test_name');
      address.should.equal(mocks.mockCompany.address);
      phone.should.equal(mocks.mockCompany.phone);
      res.status.should.equal(200);
    });
  });

  describe('DELETE: api/admin/product', () => {
    it('should not let guest user delete a product', async () => {
      const res = await request
        .delete(`/api/admin/product/${createdProductId}`)
        .set('Authorization', 'Bearer ' + guestJWT);
      res.body.res.should.equal('Not an admin user!');
      res.status.should.equal(401);
    });
    it('should let admin delete a product', async () => {
      const res = await request
        .delete(`/api/admin/product/${createdProductId}`)
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal(
        `Product with product id: ${createdProductId} deleted from database`
      );
      res.status.should.equal(200);
    });
  });

  describe('DELETE: api/admin/company', () => {
    it('should not let guest user delete a company', async () => {
      const res = await request
        .delete(`/api/admin/company/${mocks.mockCompany.NIT}`)
        .set('Authorization', 'Bearer ' + guestJWT);
      res.body.res.should.equal('Not an admin user!');
      res.status.should.equal(401);
    });
    it('should let admin delete a company', async () => {
      const res = await request
        .delete(`/api/admin/company/${mocks.mockCompany.NIT}`)
        .set('Authorization', 'Bearer ' + adminJWT);
      res.body.res.should.equal(
        `Company with NIT: ${mocks.mockCompany.NIT} deleted from database`
      );
      res.status.should.equal(200);
    });
  });
});

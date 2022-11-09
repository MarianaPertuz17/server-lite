import dotenv from 'dotenv';
import { bootServer } from './server';
import { Company } from './models/company';
import { Admin } from './models/admin';
import { Guest } from './models/guest';
import { Product } from './models/product';

dotenv.config();

const PORT: number = process.env.PORT;

(async () => {
  try {
    await Company.sync();
    await Product.sync();
    await Admin.sync();
    await Guest.sync();
    console.log("Connected to DB: ", process.env.DB_NAME); // tslint:disable-line
    bootServer(PORT);
  } catch (e) {
    console.log(e); // tslint:disable-line
  }
})();

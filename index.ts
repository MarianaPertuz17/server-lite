import dotenv from 'dotenv';
import { User } from './models/user';
import { bootServer } from './server';

dotenv.config();

const PORT: number = process.env.PORT;

(async () => {
  try {
    await User.sync();
    console.log("Connected to DB: ", process.env.DB_NAME); // tslint:disable-line
    bootServer(PORT);
  } catch (e) {
    console.log(e); // tslint:disable-line
  }
})();

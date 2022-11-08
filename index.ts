import dotenv from 'dotenv';
import { bootServer } from './server';
dotenv.config();

const PORT: number = process.env.PORT;

(async () => {
  try {
    // console.log("Connected to DB: ", process.env.DB_NAME);
    bootServer(PORT);
  } catch (e) {
    console.log(e); // tslint:disable-line
  }
})();

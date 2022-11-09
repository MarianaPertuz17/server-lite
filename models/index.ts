import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
// import path from 'path';

// const dotEnvPath = path.resolve('./.env');
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'my_db',
  process.env.DB_USER ?? 'my_user',
  process.env.DB_PASSWORD ?? '',
  {
    host: process.env.DB_HOST ?? 'localhost',
    dialect: 'postgres',
    logging: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  },
);

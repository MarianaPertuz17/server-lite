import { Dialect } from "sequelize";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      TEST_PORT: number;
      DB_NAME: string; 
      DB_USER: string; 
      DB_PASSWORD: string;
      DB_HOST: string; 
      JWT_SECRET: string;
    }
  }
  declare namespace Express {
    export interface Request {
      user: {
        id: number;
      }
    }
  }
}

export { ProcessEnv };

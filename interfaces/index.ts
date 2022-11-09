export interface Admin {
  id: number;
  email: string;
  password: string;
}

export interface MocksObj {
  sequelizeError: string;
  invalidJWT: {
    value: string;
  };
  mockAdmin: Admin;
}




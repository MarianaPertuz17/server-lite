export interface User {
  id: number;
  firstName: string;
  surname: string;
  username: string;
  password: string;
}

export interface MocksObj {
  sequelizeError: string;
  invalidJWT: {
    value: string;
  };
  mockUser: User;
}




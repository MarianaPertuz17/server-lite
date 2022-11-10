export interface IAdmin {
  email: string;
  password: string;
}

interface IMockProduct {
  companyId: string;
  productName: string;
  quantity: number;
}

interface IMockCompany {
  NIT: string;
  name: string;
  address: string;
  phone: string;
}

export interface MocksObj {
  sequelizeError: string;
  invalidJWT: {
    value: string;
  };
  mockAdmin: IAdmin;
  mockGuest: IAdmin;
  mockCompany: IMockCompany;
  mockProducts: IMockProduct[];
}




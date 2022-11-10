import { MocksObj } from '../interfaces';

const mocks: MocksObj = {
  sequelizeError: '1SequelizeValidationError: notNull Violation: Message.ownerId cannot be null, notNull Violation: Message.text cannot be null',
  invalidJWT: {
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  },
  mockAdmin: {
    email: 'testadmin@gmail.com',
    password: 'testpassword'
  },
  mockGuest: {
    email: 'testguest@gmail.com',
    password: 'testpassword'
  },
  mockCompany: {
    NIT: '123456',
    address: 'test_address',
    phone: '3135881289',
    name: 'test_company',
  },
  mockProducts: [
    {
      productName: 'test_product_1',
      companyId: '123456',
      quantity: 10
    },
    {
      productName: 'test_product_2',
      companyId: '123456',
      quantity: 12
    }
  ]
};

export { mocks };
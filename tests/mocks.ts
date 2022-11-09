import { MocksObj } from '../interfaces';

const mocks: MocksObj = {
  sequelizeError: '1SequelizeValidationError: notNull Violation: Message.ownerId cannot be null, notNull Violation: Message.text cannot be null',
  invalidJWT: {
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  },
  mockAdmin: {
    id: 1,
    email: 'test@gmail.com',
    password: 'wubalubadubdub'
  }
};

export { mocks };
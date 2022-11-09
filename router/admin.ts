import { Router } from 'express';
import { loginAdmin, registerAdmin } from '../controllers/auth';

const adminRouter = Router();

// auth
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);

export { adminRouter };
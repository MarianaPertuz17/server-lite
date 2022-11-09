import { Router } from 'express';
import { createCompany } from '../controllers/admin';
import { loginAdmin, registerAdmin } from '../controllers/auth';
import { adminMiddleware } from '../middleware/admin';
import { authMiddleware } from '../middleware/auth';

const adminRouter = Router();

// auth
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);

// company
adminRouter.post('/company', authMiddleware, adminMiddleware, createCompany);

export { adminRouter };
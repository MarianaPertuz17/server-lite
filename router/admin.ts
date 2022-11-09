import { Router } from 'express';
import { createCompany, createProduct, deleteCompany, deleteProduct, editCompany } from '../controllers/admin';
import { loginAdmin, registerAdmin } from '../controllers/auth';
import { adminMiddleware } from '../middleware/admin';
import { authMiddleware } from '../middleware/auth';

const adminRouter = Router();

// auth
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);

// company
adminRouter.post('/company', authMiddleware, adminMiddleware, createCompany);
adminRouter.put('/company', authMiddleware, adminMiddleware, editCompany);
adminRouter.delete('/company/:companyId', authMiddleware, adminMiddleware, deleteCompany);

// products
adminRouter.post('/product', authMiddleware, adminMiddleware, createProduct);
adminRouter.delete('/product/:productId', authMiddleware, adminMiddleware, deleteProduct);

export { adminRouter };
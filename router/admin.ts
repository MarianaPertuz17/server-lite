import { Router } from 'express';
import { createCompany, createProduct, deleteCompany, deleteProduct, editCompany } from '../controllers/admin';
import { loginAdmin, registerAdmin } from '../controllers/auth';
import { generatePDFReport } from '../controllers/stats';
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

// pdf generation
adminRouter.get('/pdf/:companyId', authMiddleware, adminMiddleware, generatePDFReport);
export { adminRouter };
import { Router } from 'express';
import { loginGuest, registerGuest } from '../controllers/auth';
import { getCompanies, getCompany } from '../controllers/guest';
import { authMiddleware } from '../middleware/auth';

const guestRouter = Router();

guestRouter.post('/login', loginGuest);
guestRouter.post('/register', registerGuest);

// visualize companies
guestRouter.get('/companies', authMiddleware, getCompanies);
guestRouter.get('/company/:companyId', authMiddleware, getCompany);

export { guestRouter };
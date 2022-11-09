import { Router } from 'express';
import { loginGuest, registerGuest } from '../controllers/auth';

const guestRouter = Router();

guestRouter.post('/login', loginGuest);
guestRouter.post('/register', registerGuest);

export { guestRouter };
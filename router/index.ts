import { Router } from 'express';
import { authRouter } from './auth';

const rootRouter = Router();

rootRouter.use('/api/auth', authRouter);

export default rootRouter;

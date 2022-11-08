import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';

const rootRouter = Router();

rootRouter.use('/api/auth', authRouter);
rootRouter.use('/api/user', userRouter);

export default rootRouter;

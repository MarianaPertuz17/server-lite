import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';

const rootRouter = Router();

rootRouter.use('/api/auth', authRouter);
rootRouter.use('/api/user', userRouter);

rootRouter.all('*', (_, res) => {
  res.status(404).send('These are not the routes you are looking for');
});

export default rootRouter;

import { Router } from 'express';
import { adminRouter } from './admin';
import { guestRouter } from './guest';

const rootRouter = Router();

rootRouter.use('/api/guest', guestRouter);
rootRouter.use('/api/admin', adminRouter);

rootRouter.all('*', (_, res) => {
  res.status(404).send('These are not the routes you are looking for');
});

export default rootRouter;

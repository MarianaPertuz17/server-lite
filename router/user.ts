import { Router } from 'express';
import { getUserInfo } from '../controllers/user';

const userRouter = Router();

userRouter.get('/info', getUserInfo);

export { userRouter };
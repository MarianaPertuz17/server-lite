import { Request, Response } from 'express';
import { Admin } from '../models/admin';

const getUserInfo = async (_: Request, res: Response) => {
  try {
    const user = await Admin.findOne({where: {email: 'MariPer'}});
    res.status(200).json({ res: user, error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { getUserInfo };
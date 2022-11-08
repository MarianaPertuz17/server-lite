import { Request, Response } from 'express';
import { User } from '../models/user';

const login = async (_: Request, res: Response) => {
  try {
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const register = async (_: Request, res: Response) => {
  try {
    await User.create({firstName: 'Mariana', surname: 'Pertuz', username: 'MariPer', password: 'helloworld'});
    res.status(201).json({ res: 'User created!', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { login, register };

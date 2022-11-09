import { Request, Response } from 'express';
import { Admin } from '../models/admin';
import { loginFunction } from '../utils';

interface IAuthRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const loginAdmin = async (req: IAuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    await loginFunction(email, password, res, true);
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerAdmin = async (req: IAuthRequest, res: Response) => {
  try {
    await Admin.create({email: 'hello', password: 'helloworld'});
    res.status(201).json({ res: 'User created!', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const loginGuest = async (req: IAuthRequest, res: Response) => {
  try {
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerGuest = async (req: IAuthRequest, res: Response) => {
  try {
    await Admin.create({email: 'hello', password: 'helloworld'});
    res.status(201).json({ res: 'User created!', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { loginAdmin, registerAdmin, loginGuest, registerGuest };

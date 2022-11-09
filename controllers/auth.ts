import { Request, Response } from 'express';
import { Admin } from '../models/admin';

const loginAdmin = async (_: Request, res: Response) => {
  try {
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerAdmin = async (_: Request, res: Response) => {
  try {
    await Admin.create({email: 'hello', password: 'helloworld'});
    res.status(201).json({ res: 'User created!', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const loginGuest = async (_: Request, res: Response) => {
  try {
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerGuest = async (_: Request, res: Response) => {
  try {
    await Admin.create({email: 'hello', password: 'helloworld'});
    res.status(201).json({ res: 'User created!', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { loginAdmin, registerAdmin, loginGuest, registerGuest };

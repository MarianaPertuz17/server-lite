import { Request, Response } from 'express';

const login = async (_: Request, res: Response) => {
  try {
    res.status(200).json({ res: 'login here', error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { login };

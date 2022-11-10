import { Request, Response } from 'express';
import { loginFunction, registerFunction } from '../utils';

interface ILoginBody {
  email: string;
  password: string;
}

interface IRegisterBody extends ILoginBody {
  passwordRepeat: string;
}

interface IRegisterAdminBody extends IRegisterBody {
  adminSecret: string;
}

interface ILoginRequest extends Request {
  body: ILoginBody;
}

interface IRegisterRequest extends Request {
  body: IRegisterBody;
}

interface IRegisterAdminRequest extends Request {
  body: IRegisterAdminBody;
}

const loginAdmin = async (req: ILoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    await loginFunction(email, password, res, true);
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerAdmin = async (req: IRegisterAdminRequest, res: Response) => {
  try {
    const { email, password, passwordRepeat, adminSecret } = req.body;
    // check for internal password
    if (process.env.ADMIN_CREATION_SECRET !== adminSecret) {
      return res.status(401).json({res: 'You are not authorized to create admin users', error: true});
    }
    await registerFunction(email, password, passwordRepeat, res, true);
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const loginGuest = async (req: ILoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    await loginFunction(email, password, res, false);
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const registerGuest = async (req: IRegisterRequest, res: Response) => {
  try {
    const { email, password, passwordRepeat } = req.body;
    await registerFunction(email, password, passwordRepeat, res, false);
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { loginAdmin, registerAdmin, loginGuest, registerGuest };

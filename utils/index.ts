import { Response } from 'express';
import { Admin } from '../models/admin';
import { Guest } from '../models/guest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const loginFunction = async (
  email: string,
  password: string,
  res: Response,
  isAdmin: boolean
) => {
  const user = !isAdmin
    ? await Guest.findOne({where: {email}})
    : await Admin.findOne({where: {email}});
  if (!user) return res.status(401).send('Invalid username or password!');
  const hashedUserPW = user.password;
  const isMatch = await bcrypt.compare(password, hashedUserPW);
  if (!isMatch) return res.status(401).send('Invalid username or password!');
  const userPayload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    userPayload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    }
  );
};

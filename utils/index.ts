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
  const user = isAdmin
    ? await Admin.findOne({ where: { email } })
    : await Guest.findOne({ where: { email } });

  if (!user)
    return res
      .status(401)
      .send({ res: 'Invalid username or password!', error: true });

  const hashedUserPW = user.password;
  const isMatch = await bcrypt.compare(password, hashedUserPW);

  if (!isMatch)
    return res
      .status(401)
      .send({ res: 'Invalid username or password!', error: true });

  const userPayload = {
    user: {
      id: user.id,
      email: user.email
    },
  };

  jwt.sign(
    userPayload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.status(200).json({ res: token, error: false });
    }
  );
};

export const registerFunction = async (
  email: string,
  password: string,
  passwordRepeat: string,
  res: Response,
  isAdmin: boolean
) => {
  if (!validateEmail(email)) {
    return res.status(400).send({ res: 'Email is not valid!', error: true });
  }

  const userAdmin = await Admin.findOne({ where: { email } })
  const userGuest =  await Guest.findOne({ where: { email } });

  if (userAdmin || userGuest) {
    return res.status(409).send({ res: 'User already exists!', error: true });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .send({
        res: 'Password should be at least 6 characters long!',
        error: true,
      });
  }

  if (password !== passwordRepeat) {
    return res.status(400).send({ res: 'Passwords don\'t match!', error: true });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = isAdmin
    ? await Admin.create({
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      })
    : await Guest.create({
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      });

  const payload = {
    user: {
      id: newUser.id,
      email: newUser.email
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    async (err, token) => {
      if (err) throw err;
      return res.send({ res: token, error: false });
    }
  );
};

export const validateEmail = (email = '') => {
  const isEmail = email.match(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  return Boolean(isEmail);
};

export const phoneValidator = (phone = '') => {
  const regexResult = phone.match(/\d/g);
  return (Array.isArray(regexResult) && regexResult.length === 10);
};

export const NITValidator = (NIT = '') => {
  if (typeof NIT !== 'string') return false;
  const NITRegex = /^[0-9]*$/;
  const NITRegexRes = NIT.match(NITRegex);
  return NITRegexRes;
};

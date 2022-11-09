import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/admin';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const adminId = req.user.id;
  const isAdmin = await Admin.findByPk(adminId);

  // Check if no token
  if (!isAdmin) {
    return res.status(401).json({ msg: 'Not an admin user!' });
  }
  next();
};
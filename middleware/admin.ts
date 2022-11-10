import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/admin';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const adminId = req.body.user.id;
  const adminEmail = req.body.user.email;
  const isAdmin = await Admin.findOne({where: {id: adminId, email: adminEmail}});

  if (!isAdmin) {
    return res.status(401).json({ res: 'Not an admin user!', error: true });
  }
  next();
};
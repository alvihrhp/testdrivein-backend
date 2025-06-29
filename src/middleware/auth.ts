import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

type UserRole = 'CLIENT' | 'SALES';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Please authenticate' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: UserRole };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Please authenticate' });
      return;
    }

    req.user = {
      id: user.id,
      role: user.role as UserRole,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
    return;
  }
};

// Note: The isSales middleware has been moved to roles.ts

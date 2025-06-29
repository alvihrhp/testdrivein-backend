import { Request, Response, NextFunction, RequestHandler } from 'express';

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

// Middleware to check if user has sales role
export const isSales: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'SALES') {
    res.status(403).json({ error: 'Access denied. Sales role required.' });
    return;
  }

  next();
};

// Middleware to check if user is the owner of a resource
export const isOwner: RequestHandler = (req, res, next) => {
  // This middleware can be used to check if the user is the owner of a specific resource
  // For example, to check if the user is the owner of a mobil they're trying to update/delete
  next();
};

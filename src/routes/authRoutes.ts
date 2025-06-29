import { Router, Request, Response, NextFunction } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await register(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Protected route
router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getMe(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;

import { Router } from 'express';
import { 
  getAllMobil, 
  getMobilBySlug, 
  createMobil, 
  updateMobil, 
  deleteMobil 
} from '../controllers/mobilController';
import { auth } from '../middleware/auth';
import { isSales } from '../middleware/roles';

const router = Router();

// Public routes
router.get('/', (req, res, next) => {
  getAllMobil(req, res, next).catch(next);
});

router.get('/:slug', (req, res, next) => {
  getMobilBySlug(req, res, next).catch(next);
});

// Protected routes (require authentication and sales role)
router.post('/', auth, isSales, (req, res, next) => {
  createMobil(req, res, next).catch(next);
});

router.put('/:id', auth, isSales, (req, res, next) => {
  updateMobil(req, res, next).catch(next);
});

router.delete('/:id', auth, isSales, (req, res, next) => {
  deleteMobil(req, res, next).catch(next);
});

export default router;

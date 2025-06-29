import { Router, Request, Response } from 'express';
import { createBooking, getAllBookings } from '../controllers/bookingController';

const router = Router();

// POST /api/bookings - Create a new booking
router.post('/', (req: Request, res: Response) => createBooking(req, res));

// GET /api/bookings - Get all bookings
router.get('/', (req: Request, res: Response) => getAllBookings(req, res));

export default router;

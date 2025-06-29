import { Request, Response } from 'express';
import { prisma } from '../app';
const bcrypt = require('bcryptjs')

interface BookingData {
  name: string;
  email: string;
  phone: string;
  mobilId: string;
  mobilName: string;
  showroom: string;
  tanggal: string;
  jam: string;
}

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, mobilId, showroom, tanggal, jam }: BookingData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !mobilId || !showroom || !tanggal || !jam) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Get mobil details with images
    const mobil = await prisma.mobil.findUnique({
      where: { id: mobilId },
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: 'asc' },
          select: { url: true }
        }
      },
    });

    if (!mobil) {
      res.status(404).json({ error: 'Mobil not found' });
      return;
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create a temporary password for new users
      const tempPassword = Math.random().toString(36).slice(-8);
      const salt = await (bcrypt).genSalt(10);
      const hashedPassword = await (bcrypt).hash(tempPassword, salt);
      
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'CLIENT',
        },
      });
    }

    // Get the first image for the car
    const mobilImages = await prisma.mobilImage.findMany({
      where: { mobilId },
      take: 1,
      orderBy: { createdAt: 'asc' }
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        sales: {
          connect: { id: mobil.salesId }
        },
        mobil: {
          connect: { id: mobilId }
        },
        mobilName: req.body.mobilName || mobil.name,
        mobilImage: mobilImages[0]?.url || null,
        mobilPrice: mobil.price,
        showroom,
        tanggal: new Date(tanggal),
        jam,
        status: 'PENDING',
      },
      include: {
        mobil: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          }
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        mobil: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

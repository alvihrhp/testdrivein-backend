import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  try {
    const password = 'B1625nfb!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: 'Rafael Harahap',
        email: 'rafael.hrhp@yahoo.com',
        password: hashedPassword,
        phone: '081234567890',
        role: 'CLIENT'
      }
    });

    console.log('User created successfully:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();

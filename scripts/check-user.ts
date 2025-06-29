import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true
      }
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:');
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = 'rafael.hrhp@yahoo.com';
checkUser(email);

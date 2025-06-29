import app from './app';
import { prisma } from './app';

const PORT = process.env.PORT || 5001;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Process terminated by user');
    process.exit(0);
  });
});

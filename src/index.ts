import app from './app';
import { prisma } from './app';

// Handle shutdown
export const shutdown = async () => {
  console.log('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

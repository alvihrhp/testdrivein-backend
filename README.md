# TestDriveIn - Backend

Backend service for TestDriveIn, a car test drive booking platform.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string in `.env`
4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with sample data:
   ```bash
   npx ts-node prisma/seed.ts
   ```

## Development

- Start the development server:
  ```bash
  npm run dev
  ```
- The server will be available at `http://localhost:5000`

## API Endpoints

### Cars
- `GET /api/mobil` - Get all cars
- `GET /api/mobil/:slug` - Get a single car by slug

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

## Database

- Run Prisma Studio to view and edit the database:
  ```bash
  npx prisma studio
  ```

## Production

- Build the application:
  ```bash
  npm run build
  ```
- Start the production server:
  ```bash
  npm start
  ```

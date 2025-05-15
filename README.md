# Park Note App

A simple app to help users remember where they parked their cars.

## Features

- **User-Friendly Interface**: A clean and intuitive UI for easy navigation.
- **Offline Support**: Users can manage their parking even when offline, with data being synced when back online.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Prisma**: An ORM for database management.
- **IndexedDB**: For offline data storage.
- **TypeScript**: For type safety and better development experience.
- **PostgreSQL**: As the database for storing vehicle and parking information.
- **Material-UI**: For UI components.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- PostgreSQL (version 12 or later)
- Docker (optional, for easier deployment)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/nisibz/nextjs-park-note.git
   cd nextjs-park-note
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a `.env` file based on the `.env.example` provided and fill in your database credentials.
   - Run the Prisma migrations to set up the database schema:

   ```bash
   npx prisma migrate dev
   ```

4. Seed the database with initial data (only needed the first time):

   ```bash
   node prisma/seed.mjs
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Setup

You can also run the application using Docker:

```bash
# Copy the example env file
cp .env.example .env

# Start the containers
docker-compose up -d
```

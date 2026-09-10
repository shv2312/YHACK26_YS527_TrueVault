# TrueVault

**Decentralized Identity, Asset Ownership and Access Control Platform**

## Project Purpose
TrueVault is a secure platform for identity verification, asset ownership management, and access control using blockchain technology. It provides a robust backend to handle users, their roles, and their asset operations securely.

## Technology Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT, bcrypt
- **Blockchain Integration:** Pending (to be implemented)
- **Frontend:** Pending

## Folder Structure
- `/backend`: Node.js Express server, Prisma schema, API routes.
- `/frontend`: Web application frontend (React/Next.js to be added).
- `/blockchain`: Smart contracts and related scripts.
- `/docs`: Project documentation and work logs.

## Setup Commands
### Backend
1. `cd backend`
2. `npm install`
3. Generate Prisma Client: `npx prisma generate`

## Environment Variables
Create a `.env` file in the `/backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your_secret_here"
PORT=3000
```

## Database Migration Commands
1. Run migrations: `npx prisma migrate dev --name init`
2. Alternatively, push schema (for quick prototyping): `npx prisma db push`

## Backend Start Command
- For development: `npm run dev`
- For production: `npm run build` then `npm start`

## Current Implementation Status
- **Shri Hari:** Completed initial Backend Foundation. Set up Express, TypeScript, Prisma, basic models, Auth APIs, health check, and documentation structure.
- **Pending Work:**
  - **Sanjay:** Implement Frontend connection to backend APIs.
  - **Parthiban:** Implement Blockchain integration and Smart Contracts.
  - **Sindhuja:** Develop specific Asset operations and API routes.
  - **Sandhiya:** Implement End-to-End Testing and UI improvements.

*Note: Fictitious demo data should be used for testing.*

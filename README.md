# TrueVault

**Decentralized Identity, Asset Ownership and Access Control Platform**

## Project Purpose
TrueVault is a secure platform for identity verification, asset ownership management, and access control using blockchain technology. It provides a robust backend to handle users, their roles, and their asset operations securely.

## Technology Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT, bcrypt
- **Blockchain Integration:** MockBlockchainAdapter (Pending Smart Contracts)
- **Frontend:** React + Vite

## Folder Structure
- `/backend`: Node.js Express server, Prisma schema, API routes, File upload logic.
- `/frontend`: Web application frontend (React).
- `/blockchain`: Smart contracts and related scripts.
- `/docs`: Project documentation and work logs.

## Setup Commands
### Required Software
- Node.js (v24)
- PostgreSQL (Local or via Docker)

### Environment Variables
Create a `.env` file in the `/backend` directory without secret values:
```env
DATABASE_URL="postgresql://truevault:truevault@127.0.0.1:5432/truevault?schema=public"
JWT_SECRET="your_secret_here"
PORT=3000
```

### Backend Startup
1. `cd backend`
2. `npm install`
3. Database Migration: `npx prisma db push`
4. Generate Prisma Client: `npx prisma generate`
5. Start server: `npm run dev`

### Test Commands
- **Health Check:** `curl http://localhost:3000/api/health`
- **TypeScript compilation check:** `npx tsc`
- **Prisma validation:** `npx prisma validate`

## Current Implementation Status
- **Current Frontend Origin:** Designed for local development.
- **Blockchain Adapter Mode:** Currently running `MockBlockchainAdapter` which simulates transaction hashes and states (`PENDING`, `CONFIRMED`).
- **Authentication:** Fully secured with bcrypt and generic error responses.
- **File Upload:** Generates SHA-256 hash, runs XOR mock encryption, and stores off-chain locally.
- **Known Blockers:** Local PostgreSQL DB could not be reached via 5432 in the test environment, preventing endpoint testing.

*Note: Fictitious demo data should be used for testing.*

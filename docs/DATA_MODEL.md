# Data Model

The database uses PostgreSQL managed by Prisma ORM.

## Models

### User
- `id`: String (UUID, Primary Key)
- `username`: String (Unique)
- `passwordHash`: String (Never returned in API)
- `role`: RoleEnum (ADMIN, OWNER, OFFICIAL, VERIFIER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### WalletChallenge
- `id`: String (UUID, Primary Key)
- `nonce`: String
- `userId`: String (Foreign Key)
- `createdAt`: DateTime

### Asset
- `id`: String (UUID, Primary Key)
- `name`: String
- `ownerId`: String (Foreign Key)
- `status`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### ChainOperation
- `id`: String (UUID, Primary Key)
- `txHash`: String (Unique)
- `status`: String (PENDING, CONFIRMED, FAILED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### AuditEvent
- `id`: String (UUID, Primary Key)
- `action`: String
- `timestamp`: DateTime
- `details`: JSON

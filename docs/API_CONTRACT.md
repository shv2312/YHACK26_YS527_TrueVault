# API Contract

## Authentication
- `POST /api/auth/login`
  - Request: `{ "username": "...", "password": "..." }`
  - Response: `{ "token": "...", "user": { "id": "...", "username": "...", "role": "..." } }`
- `POST /api/auth/logout`
  - Response: `{ "message": "Logged out successfully" }`
- `GET /api/auth/me`
  - Response: `{ "user": { "id": "...", "username": "...", "role": "..." } }`

## System
- `GET /api/health`
  - Response: `{ "status": "ok", "timestamp": "..." }`

## Assets
- `GET /api/assets`
  - Response: `[ { "id": "...", "name": "...", "ownerId": "...", "status": "..." } ]`

*Note: All secure API responses will never return passwords, private keys, or encryption keys.*

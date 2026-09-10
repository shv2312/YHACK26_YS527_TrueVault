# Frontend Compatibility

This document maps the API calls originating from the frontend (specifically `frontend/src/services/api.ts`) to the TrueVault backend implementation.

| Frontend Request Function | Documented Backend Endpoint | Implemented Backend Endpoint | Request-Body Match | Response-Body Match | Auth Required | Integration Status |
| --- | --- | --- | --- | --- | --- | --- |
| `authService.login` | `POST /api/auth/login` | `POST /api/auth/login` | Partial | Yes | No | Backend ready. Frontend expects `{ username, password }` but sends `walletAddress` as username. |
| `authService.logout` | `POST /api/auth/logout` | `POST /api/auth/logout` | Yes | Yes | Yes (JWT) | Fully Compatible. |
| `assetService.getAssets` | `GET /api/assets` | Not Implemented Yet | N/A | N/A | Yes | **Missing Backend Endpoint**. To be completed by Sindhuja. |
| `assetService.getAuditLogs` | `GET /api/audit` | Not Implemented Yet | N/A | N/A | Yes | **Missing Backend Endpoint**. To be implemented. |

**Current Assessment**:
The frontend relies heavily on mock data (`mockUser`, `mockAssets`, `mockAuditLogs`) because it assumes the backend is not ready. The authentication endpoint for `login` accepts `username`, so the frontend must pass `walletAddress` as the `username` field. Asset fetching and audit log fetching endpoints need to be implemented on the backend to achieve full compatibility.

# Integration Contract

## Frontend-Backend Integration Rules
- Authentication is handled via secure tokens (JWT/Session).
- Frontend MUST NOT send role values to assert authorization.
- Frontend MUST NOT store or process file encryption keys.
- All errors will follow a standard format `{ "error": "Message" }`.

## Backend-Blockchain Integration Rules
- **Blockchain proof status**: `PENDING`, `CONFIRMED`, `FAILED`.
- A transaction hash MUST NOT be treated as confirmed until the blockchain receipt is successfully verified by the backend.
- Private keys MUST NEVER be stored in the repository, and the backend MUST use a secure vault or environment variables injected at runtime.
- The backend handles all transaction submissions; the frontend only requests operations.

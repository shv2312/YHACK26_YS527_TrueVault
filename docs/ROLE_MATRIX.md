# Role Matrix

The platform uses the following role values: `ADMIN`, `OWNER`, `OFFICIAL`, `VERIFIER`.

## Role Definitions & Permissions

| Role | Description | Permissions |
| --- | --- | --- |
| **ADMIN** | System administrator. | Can manage users and platform settings. |
| **OWNER** | Asset owner. | Can create assets, grant/revoke permissions to their assets. |
| **OFFICIAL**| Regulatory/Government official. | Can issue assets, verify ownership at a high level. |
| **VERIFIER**| Third-party verifier. | Can verify asset ownership when granted permission by the owner. |

## Important Security Rules
- Role values MUST NEVER be trusted when sent directly from the frontend.
- Backend MUST always derive the user role from the secure session/JWT based on the database record.

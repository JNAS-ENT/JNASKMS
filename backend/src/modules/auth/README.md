# Authentication and User Management Module

## Purpose
The **Authentication & User Management Module** serves as the core security and account orchestration engine for the AI Knowledge OS platform. It is designed with standard enterprise constraints in mind: supporting local and social (Google OAuth 2.0) authentication protocols, role-based access controls (RBAC) down to fine-grained permission levels, and resilient session auditing capabilities across multi-device user setups.

---

## Folder Structure
The module adheres strictly to NestJS layout patterns:
```text
backend/src/modules/auth/
├── controllers/
│   └── auth.controller.ts             # Auth HTTP endpoints
├── services/
│   └── auth.service.ts                 # Core auth and session business logic
├── dto/
│   ├── auth-response.dto.ts           # Unified Auth response schema
│   ├── login.dto.ts                   # Validates incoming Login body
│   ├── register.dto.ts                # Validates incoming Registration body
│   ├── refresh.dto.ts                 # Validates incoming Refresh requests
│   ├── change-password.dto.ts         # Validates password change requests
│   ├── forgot-password.dto.ts         # Validates forgot-password (email target)
│   └── reset-password.dto.ts          # Validates password reset token and new password
├── decorators/
│   ├── current-user.decorator.ts      # Custom decorator to extract user from Req
│   ├── permissions.decorator.ts       # Assigns required permissions to endpoints
│   └── public.decorator.ts            # Marks endpoints as bypassable by AuthGuard
├── guards/
│   └── auth.guard.ts                  # Integrates JWT validation & RBAC permission checks
└── interfaces/
    └── jwt-payload.interface.ts       # Type definitions for decoded JWT contents
```

---

## Dependencies
* `@nestjs/jwt` - For sign-off, verification, and rotation of system JWT tokens.
* `bcrypt` - Used to cryptographically secure and match local password credentials.
* `class-validator` & `class-transformer` - Dynamic endpoint input payload sanitation.
* `@prisma/client` - Strongly typed interface to access records stored in Neon PostgreSQL.

---

## API Endpoints

### Public Endpoints
* `POST /api/auth/register` - Local registration creating an account with `USER` role.
* `POST /api/auth/login` - Credentials validation generating Access and Refresh Tokens.
* `POST /api/auth/refresh` - Refresh access tokens using active refresh session token.
* `POST /api/auth/google` - Securely link/register/login via Google Identity Token profiles.
* `POST /api/auth/forgot-password` - Creates an expiry reset token and logs/dispatches reset flow.
* `POST /api/auth/reset-password` - Updates user password with valid reset token.
* `GET /api/auth/verify-email?token=xyz` - Validates registration verification token.

### Protected Endpoints (Bearer Auth required)
* `POST /api/auth/logout` - Revokes and deletes active session refresh token.
* `POST /api/api/change-password` - Updates current password matching against bcrypt old password.
* `GET /api/auth/sessions` - Returns active session logs (IP, Device, Timestamps) for the current user.
* `DELETE /api/auth/sessions/:id` - Revokes/forces logout on specific active user devices.
* `GET /api/auth/me` - Simple, high-level user session metadata retriever.

---

## Environment Variables
Ensure the following variables are configured in `.env`:
```env
JWT_SECRET="super-secret-access-token-key-change-in-production"
JWT_REFRESH_SECRET="super-secret-long-term-refresh-token-key"
DATABASE_URL="postgresql://user:password@neon-host:5432/db?sslmode=require"
```

---

## Future Improvements
1. **Abstract Mail Server Driver**: Replace visual/stdout logging of dispatch events with a dedicated SMTP/SendGrid or Nodemailer driver.
2. **IP Whitelisting & Geo-analysis**: Capture IP-based approximate location details on session instantiation to proactively notify users of suspicious logins.
3. **Multi-Factor Authentication (MFA)**: Support OTP / TOTP setups (e.g., Google Authenticator) for enhanced enterprise-tier login security.

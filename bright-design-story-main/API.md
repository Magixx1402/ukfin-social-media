# Backend API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Health Check
```
GET /health
```
Returns server status.

### 2. User Registration
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### 3. User Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 4. Protected Profile
```
GET /protected/profile
Authorization: Bearer <token>
```

## Testing with curl

```bash
# Start the server
npm run server

# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (replace TOKEN with actual token from login response)
curl -X GET http://localhost:3001/api/protected/profile \
  -H "Authorization: Bearer TOKEN"
```

## Frontend Integration

The frontend now includes:
- API client (`src/lib/api.ts`)
- Authentication hook (`src/hooks/useAuth.ts`)
- Login/Register pages (`src/pages/Auth.tsx`)
- Protected routes (`src/components/auth/ProtectedRoute.tsx`)
- Profile page (`src/pages/Profile.tsx`)

## Environment Variables

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Request validation with Zod
- CORS configuration
- Helmet for security headers
- Request logging with Morgan
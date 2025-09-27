# Store Management System API

A comprehensive API for managing stores, users, and administrators with rating functionality.

## Getting Started

### Prerequisites
- Node.js
- npm
- Database (configured in .env)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database and JWT configuration

4. Start the development server:
```bash
npm run server
```

The API will be available at `http://localhost:5000`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## API Endpoints

### Authentication Endpoints

#### User Signup
Register a new user account.

**Endpoint:** `POST /api/auth/user/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Street, City",
  "password": "Password123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/user/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Street, City",
  "password": "Password123!"
}'
```

#### Login
Authenticate user, store owner, or admin.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "Password123!"
}'
```

#### Admin Signup (First Time)
Register the first admin account.

**Endpoint:** `POST /api/auth/admin/signup`

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}'
```

### Admin Endpoints

#### Update Admin Password
**Endpoint:** `POST /api/admin/update-password`  
**Authorization:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/update-password \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}'
```

#### Add Store
Create a new store with owner account.

**Endpoint:** `POST /api/admin/add-store`  
**Authorization:** Required

**Request Body:**
```json
{
  "name": "Owner Name",
  "email": "owner@example.com",
  "password": "OwnerPass123!",
  "storename": "My Store",
  "storeEmail": "store@example.com",
  "storeaddress": "123 Street, City"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/add-store \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Owner Name",
  "email": "owner@example.com",
  "password": "OwnerPass123!",
  "storename": "My Store",
  "storeEmail": "store@example.com",
  "storeaddress": "123 Street, City"
}'
```

#### Add Admin
Create a new admin account.

**Endpoint:** `POST /api/admin/add-admin`  
**Authorization:** Required

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/add-admin \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}'
```

#### Add User
Create a new user account.

**Endpoint:** `POST /api/admin/add-user`  
**Authorization:** Required

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "address": "123 Street, City",
  "password": "UserPassword123!"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/add-user \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "name": "User Name",
  "email": "user@example.com",
  "address": "123 Street, City",
  "password": "UserPassword123!"
}'
```

#### Get Dashboard Stats
**Endpoint:** `GET /api/admin/dashboard`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get Stores
**Endpoint:** `GET /api/admin/stores`  
**Authorization:** Required  
**Query Parameters:** `search` (optional)

**Example:**
```bash
curl -X GET "http://localhost:5000/api/admin/stores?search=store" \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get Users
**Endpoint:** `GET /api/admin/users`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/admin/users \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get Admin Profile
**Endpoint:** `GET /api/admin/profile`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/admin/profile \
-H "Authorization: Bearer <JWT_TOKEN>"
```

### Store Owner Endpoints

#### Update Store Password
**Endpoint:** `PUT /api/store/update-password`  
**Authorization:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/store/update-password \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}'
```

#### Get Store Dashboard
**Endpoint:** `GET /api/store/dashboard`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/store/dashboard \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get Store User Ratings
**Endpoint:** `GET /api/store/user-ratings`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/store/user-ratings \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get Store Profile
**Endpoint:** `GET /api/store/profile`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/store/profile \
-H "Authorization: Bearer <JWT_TOKEN>"
```

### User Endpoints

#### Update User Password
**Endpoint:** `PUT /api/user/update-password`  
**Authorization:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/user/update-password \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}'
```

#### Add or Update Store Rating
**Endpoint:** `POST /api/user/add-rating`  
**Authorization:** Required

**Request Body:**
```json
{
  "storeId": 1,
  "rating": 4
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/user/add-rating \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <JWT_TOKEN>" \
-d '{
  "storeId": 1,
  "rating": 4
}'
```

#### Get All Stores
**Endpoint:** `GET /api/user/stores`  
**Authorization:** Required  
**Query Parameters:** `search` (optional)

**Example:**
```bash
curl -X GET "http://localhost:5000/api/user/stores?search=store" \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get User Ratings
**Endpoint:** `GET /api/user/ratings`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/user/ratings \
-H "Authorization: Bearer <JWT_TOKEN>"
```

#### Get User Profile
**Endpoint:** `GET /api/user/profile`  
**Authorization:** Required

**Example:**
```bash
curl -X GET http://localhost:5000/api/user/profile \
-H "Authorization: Bearer <JWT_TOKEN>"
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## User Roles

The API supports three user roles:

1. **Admin** - Full system access, can manage stores, users, and other admins
2. **Store Owner** - Can manage their store profile and view ratings
3. **User** - Can browse stores and add ratings

## Security

- All passwords must meet complexity requirements
- JWT tokens are required for protected endpoints
- Passwords are hashed before storage
- Input validation is enforced on all endpoints

## Development

For development mode, the server runs with automatic restart on file changes. Make sure your `.env` file includes:

- Database connection details
- JWT secret key
- Port configuration (default: 5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
# API Testing Guide

## Create a Mobile User

Use the artisan command to create a mobile app user:

**With Docker/Sail:**
```bash
./vendor/bin/sail artisan make:mobile-user user@example.com password123 --name="John Doe"
```

**Or with docker-compose:**
```bash
docker-compose exec app php artisan make:mobile-user user@example.com password123 --name="John Doe"
```

Or without specifying name (defaults to "Mobile User"):

```bash
./vendor/bin/sail artisan make:mobile-user user@example.com password123
```

## API Endpoints Testing with cURL

### Base URL
For Docker/Sail setup, use `http://localhost` (port 80) instead of `http://localhost:8000`.

### 1. Get Available Countries (to find country_id)

```bash
curl -X GET http://localhost/api/mobile/v1/countries \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "France",
      "code": "FR",
      "flag_url": "..."
    },
    {
      "id": 14,
      "name": "Sri Lanka",
      "code": "LK",
      "flag_url": "..."
    }
  ]
}
```

### 2. Register a New User

**Note:** You need to get a valid `country_id` from the countries endpoint first.

```bash
curl -X POST http://localhost/api/mobile/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "date_of_birth": "1990-05-15",
    "country_id": 14
  }'
```

**Registration with Sri Lanka:**
```bash
curl -X POST http://localhost/api/mobile/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Asanka",
    "last_name": "Perera",
    "email": "asanka.perera@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "date_of_birth": "1995-03-20",
    "country_id": 14
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "date_of_birth": "1990-05-15",
      "country_id": 14,
      "role": "user",
      "email_verified_at": null,
      "created_at": "2026-01-22T17:00:00.000000Z",
      "updated_at": "2026-01-22T17:00:00.000000Z"
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Field Requirements:**
- `first_name`: Required, string, max 255 characters
- `last_name`: Required, string, max 255 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, min 8 characters (Laravel default rules)
- `password_confirmation`: Required, must match password
- `date_of_birth`: Required, date format (YYYY-MM-DD), must be in the past
- `country_id`: Required, integer, must exist in countries table

### 3. Login with Email/Password

```bash
curl -X POST http://localhost/api/mobile/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "email_verified_at": null,
      "created_at": "2026-01-22T17:00:00.000000Z",
      "updated_at": "2026-01-22T17:00:00.000000Z"
    },
    "token": "2|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

### 3. Login with Google (ID Token)

```bash
curl -X POST http://localhost/api/mobile/v1/auth/google \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "id_token": "YOUR_GOOGLE_ID_TOKEN_HERE"
  }'
```

**Note:** You need to get the ID token from your React Native app after Google Sign-In.

### 4. Get Authenticated User (Me)

```bash
curl -X GET http://localhost/api/mobile/v1/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User data retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "email_verified_at": null,
      "created_at": "2026-01-22T17:00:00.000000Z",
      "updated_at": "2026-01-22T17:00:00.000000Z"
    }
  }
}
```

### 5. Refresh Token

```bash
curl -X POST http://localhost/api/mobile/v1/auth/refresh \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_OLD_TOKEN_HERE"
```

### 6. Logout

```bash
curl -X POST http://localhost/api/mobile/v1/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Get Destinations

```bash
curl -X GET "http://localhost/api/mobile/v1/destinations?per_page=10&page=1" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Get User's Plans

```bash
curl -X GET http://localhost/api/mobile/v1/plans \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Create a Plan

```bash
curl -X POST http://localhost/api/mobile/v1/plans \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "specialist_id": 1,
    "destination_id": 1
  }'
```

### 10. Get User Profile

```bash
curl -X GET http://localhost/api/mobile/v1/profile \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost/api/mobile/v1"
EMAIL="test@example.com"
PASSWORD="password123"

echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password_confirmation\": \"$PASSWORD\"
  }")

echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from register response (if successful)
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo "Registration failed or user already exists. Trying login..."
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "{
      \"email\": \"$EMAIL\",
      \"password\": \"$PASSWORD\"
    }")
  
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')
  echo "$LOGIN_RESPONSE" | jq '.'
fi

if [ -n "$TOKEN" ]; then
  echo ""
  echo "Token: $TOKEN"
  echo ""
  echo "2. Getting user profile..."
  curl -s -X GET "$BASE_URL/auth/me" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  
  echo ""
  echo "3. Getting destinations..."
  curl -s -X GET "$BASE_URL/destinations?per_page=5" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer $TOKEN" | jq '.'
else
  echo "Failed to get authentication token"
fi
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Error Responses

### Invalid Credentials (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Access Denied (403)
```json
{
  "success": false,
  "message": "Access denied. This API is for mobile app users only."
}
```

# Registration API - cURL Examples

## Base URL
Replace `http://localhost:8000` with your actual API base URL.

## 1. Get Available Countries (to find country_id)

```bash
curl -X GET "http://localhost:8000/api/mobile/v1/countries" \
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

## 2. Register a New User

### Basic Registration

```bash
curl -X POST "http://localhost:8000/api/mobile/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "1990-05-15",
    "country_id": 14
  }'
```

### Registration with Sri Lanka

```bash
curl -X POST "http://localhost:8000/api/mobile/v1/auth/register" \
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

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Asanka Perera",
      "email": "asanka.perera@example.com",
      "first_name": "Asanka",
      "last_name": "Perera",
      "date_of_birth": "1995-03-20",
      "country_id": 14
    },
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

### Error Response (422 Validation Error)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["This email is already registered."],
    "password_confirmation": ["Password confirmation does not match."]
  }
}
```

## Field Requirements

- **first_name**: Required, string, max 255 characters
- **last_name**: Required, string, max 255 characters
- **email**: Required, valid email format, must be unique
- **password**: Required, must meet Laravel's default password rules (min 8 characters)
- **password_confirmation**: Required, must match password
- **date_of_birth**: Required, date format (YYYY-MM-DD), must be in the past
- **country_id**: Required, integer, must exist in countries table

## Testing with Different Scenarios

### Test with Missing Fields

```bash
curl -X POST "http://localhost:8000/api/mobile/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Test",
    "email": "test@example.com"
  }'
```

### Test with Invalid Email

```bash
curl -X POST "http://localhost:8000/api/mobile/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "invalid-email",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "2000-01-01",
    "country_id": 1
  }'
```

### Test with Password Mismatch

```bash
curl -X POST "http://localhost:8000/api/mobile/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Password123!",
    "password_confirmation": "DifferentPassword123!",
    "date_of_birth": "2000-01-01",
    "country_id": 1
  }'
```

## Using with Laravel Sail

If using Laravel Sail, replace `http://localhost:8000` with your Sail URL (usually `http://localhost`):

```bash
curl -X POST "http://localhost/api/mobile/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "1990-05-15",
    "country_id": 14
  }'
```

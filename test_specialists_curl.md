# Testing Specialists API Endpoint

## Quick Test Commands

### 1. Test without authentication (if endpoint is public)
```bash
curl -X GET "http://localhost:8000/api/mobile/v1/specialists?ids=1,2,3" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  | jq '.'
```

### 2. Test with authentication token
```bash
# Replace YOUR_TOKEN with actual token
curl -X GET "http://localhost:8000/api/mobile/v1/specialists?ids=1,2,3" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.'
```

### 3. Test with specific specialist IDs from a destination
```bash
# First, get a destination to find specialist_ids
curl -X GET "http://localhost:8000/api/mobile/v1/destinations/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.data.destination.specialist_ids'

# Then use those IDs to get specialists
curl -X GET "http://localhost:8000/api/mobile/v1/specialists?ids=1,2" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.data[] | {id, first_name, last_name, profile_pic}'
```

## Expected Response Format

```json
{
  "success": true,
  "message": "Specialists retrieved successfully",
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Smith",
      "full_name": "John Smith",
      "email": "john.smith@example.com",
      "profile_pic": "http://localhost:8000/storage/specialists/image.jpg",
      "bio": "Experienced adventure guide...",
      "country_id": 1,
      "country": {
        "id": 1,
        "name": "United States",
        "code": "US"
      }
    }
  ]
}
```

## Checking profile_pic URL

The `profile_pic` field should be:
- A full absolute URL (starts with http:// or https://)
- For seeded data: Full Unsplash URLs like `https://images.unsplash.com/...`
- For uploaded images: Full app URL like `http://localhost:8000/storage/specialists/filename.jpg`

## Troubleshooting

1. **If profile_pic is null**: Check if the specialist has a profile_pic in the database
2. **If profile_pic is a relative path**: The URL generation is not working correctly
3. **If profile_pic URL returns 404**: The file doesn't exist in storage/app/public/specialists/
4. **If image doesn't load on device**: Check CORS settings and ensure the URL is accessible from the device's network

## Testing Image URL Directly

After getting the response, test if the image URL is accessible:

```bash
# Extract profile_pic URL from response and test
PROFILE_PIC_URL="http://localhost:8000/storage/specialists/image.jpg"
curl -I "$PROFILE_PIC_URL"
```

This should return HTTP 200 if the image is accessible.

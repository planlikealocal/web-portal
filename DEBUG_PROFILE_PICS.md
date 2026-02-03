# Debugging Profile Picture Loading Issue

## Quick Test Commands

### 1. Test Specialists API Endpoint

Replace `YOUR_TOKEN` with your actual authentication token and `YOUR_DOMAIN` with your API domain:

```bash
# Test with specialist IDs 1, 2, 3
curl -X GET "http://YOUR_DOMAIN/api/mobile/v1/specialists?ids=1,2,3" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.data[] | {id, first_name, last_name, profile_pic}'
```

### 2. Check What profile_pic Value is Returned

The response should show `profile_pic` as a full URL. Check:

```bash
curl -X GET "http://YOUR_DOMAIN/api/mobile/v1/specialists?ids=1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | jq '.data[0].profile_pic'
```

**Expected formats:**
- ✅ `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop` (seeded data)
- ✅ `http://YOUR_DOMAIN/storage/specialists/filename.jpg` (uploaded images)
- ❌ `specialists/filename.jpg` (WRONG - relative path)
- ❌ `null` (no image)

### 3. Test if Image URL is Accessible

After getting the profile_pic URL, test if it's accessible:

```bash
# Replace with actual URL from step 2
IMAGE_URL="http://YOUR_DOMAIN/storage/specialists/image.jpg"
curl -I "$IMAGE_URL"
```

Should return `HTTP/1.1 200 OK` if accessible.

### 4. Check Laravel Logs

Check the Laravel log file for URL generation debugging:

```bash
tail -f storage/logs/laravel.log | grep "Specialist profile_pic URL"
```

This will show:
- Original path from database
- Storage path generated
- Base URL used
- Final URL generated

## Common Issues and Fixes

### Issue 1: profile_pic is null
**Cause:** Specialist doesn't have a profile picture in database
**Fix:** Upload a profile picture for the specialist

### Issue 2: profile_pic is a relative path (e.g., `specialists/image.jpg`)
**Cause:** URL generation is not working
**Fix:** Check `APP_URL` in `.env` file is set correctly

### Issue 3: profile_pic URL returns 404
**Cause:** File doesn't exist in `storage/app/public/specialists/`
**Fix:** 
- Check if file exists: `ls -la storage/app/public/specialists/`
- Run: `php artisan storage:link` to create symlink

### Issue 4: Image loads in browser but not on device
**Cause:** 
- CORS issue
- Network connectivity (device can't reach server)
- HTTP vs HTTPS mismatch
- Localhost URL not accessible from device

**Fix:**
- Use device's IP address instead of localhost (e.g., `http://192.168.1.100:8000`)
- Check CORS configuration
- Ensure device and server are on same network
- Use HTTPS if required by device security policies

### Issue 5: React Native Image component not loading
**Cause:** 
- Invalid URL format
- Network request blocked
- Image component caching issue

**Fix:**
- Check console logs for error messages
- Verify URL is accessible via curl
- Try clearing React Native cache
- Check if URL needs to be HTTPS

## Verification Steps

1. ✅ API returns profile_pic as full URL
2. ✅ URL is accessible via curl/browser
3. ✅ Device can reach the server (ping/curl from device)
4. ✅ CORS allows requests from mobile app
5. ✅ React Native logs show URL being loaded
6. ✅ Image file exists in storage

## Mobile App Debugging

The mobile app now logs:
- Profile pic URL received from API
- Whether URL is full URL or relative
- Image load start/end events
- Error details if image fails to load

Check React Native console/logs for these messages.

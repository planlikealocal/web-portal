<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\Api\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends BaseApiController
{
    /**
     * Get user profile
     */
    public function show(Request $request): JsonResponse
    {
        try {
            return $this->success([
                'user' => new UserResource($request->user()),
            ], 'Profile retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve profile: ' . $e->getMessage());
        }
    }

    /**
     * Update user profile
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $validated = $request->validated();
            
            // If first_name and last_name are provided, update name as well
            if (isset($validated['first_name']) || isset($validated['last_name'])) {
                $firstName = $validated['first_name'] ?? $user->first_name;
                $lastName = $validated['last_name'] ?? $user->last_name;
                
                // Build name from first_name and last_name, handling null values
                $nameParts = array_filter([$firstName, $lastName], fn($value) => !is_null($value) && $value !== '');
                $validated['name'] = !empty($nameParts) ? trim(implode(' ', $nameParts)) : ($user->name ?? '');
            }
            
            $user->update($validated);

            return $this->success([
                'user' => new UserResource($user->fresh()),
            ], 'Profile updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update profile: ' . $e->getMessage());
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors(), 'Validation failed');
            }

            $user = $request->user();

            // Check if user has a password (Google users might not)
            if (!$user->password) {
                return $this->error('Password cannot be changed for Google-authenticated accounts', null, 400);
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return $this->error('Current password is incorrect', null, 400);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->password),
            ]);

            return $this->success(null, 'Password changed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to change password: ' . $e->getMessage());
        }
    }

    /**
     * Upload profile image
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors(), 'Validation failed');
            }

            $user = $request->user();

            // Delete old image if exists
            if ($user->avatar_url) {
                $oldPath = str_replace('/storage/', '', parse_url($user->avatar_url, PHP_URL_PATH));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Store the new image
            $imagePath = $request->file('profile_image')->store('profile-images', 'public');
            // Store relative path (UserResource will convert to full URL)
            $relativePath = '/storage/' . $imagePath;
            
            $user->update([
                'avatar_url' => $relativePath,
                'profile_image' => $relativePath,
            ]);

            // Return full URL in response
            $fullUrl = rtrim(config('app.url'), '/') . $relativePath;

            return $this->success([
                'image_url' => $fullUrl,
                'avatar_url' => $fullUrl,
                'profile_image' => $fullUrl,
            ], 'Profile image uploaded successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to upload image: ' . $e->getMessage());
        }
    }
}

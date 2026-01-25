<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\Api\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
            
            $user->update($request->validated());

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
}

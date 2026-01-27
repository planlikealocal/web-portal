<?php

namespace App\Http\Controllers\Api;

use App\Actions\Auth\HandleGoogleMobileAuthAction;
use App\Actions\Auth\ResetMobilePasswordAction;
use App\Actions\Auth\SendMobilePasswordResetLinkAction;
use App\Http\Requests\Api\ForgotPasswordRequest;
use App\Http\Requests\Api\GoogleLoginRequest;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\ResetPasswordRequest;
use App\Http\Resources\Api\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends BaseApiController
{
    public function __construct(
        private HandleGoogleMobileAuthAction $handleGoogleMobileAuthAction,
        private SendMobilePasswordResetLinkAction $sendMobilePasswordResetLinkAction,
        private ResetMobilePasswordAction $resetMobilePasswordAction
    ) {}

    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'name' => trim($request->first_name . ' ' . $request->last_name),
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'date_of_birth' => $request->date_of_birth,
                'country_id' => $request->country_id,
                'role' => 'user',
            ]);

            $token = $user->createToken('mobile-app')->plainTextToken;

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'User registered successfully', 201);
        } catch (\Exception $e) {
            Log::error('User registration failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
            ]);

            return $this->error('Registration failed. Please try again.');
        }
    }

    /**
     * Login user with email and password
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->error('Invalid credentials', null, 401);
            }

            // Ensure user is a mobile user (not admin or specialist)
            if ($user->isAdmin() || $user->isSpecialist()) {
                return $this->error('Access denied. This API is for mobile app users only.', null, 403);
            }

            $token = $user->createToken('mobile-app')->plainTextToken;

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'Login successful');
        } catch (\Exception $e) {
            Log::error('User login failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
            ]);

            return $this->error('Login failed. Please try again.');
        }
    }

    /**
     * Login or register user with Google ID token
     */
    public function googleLogin(GoogleLoginRequest $request): JsonResponse
    {
        try {
            $result = $this->handleGoogleMobileAuthAction->execute($request->id_token);

            if (!$result['success']) {
                return $this->error($result['message'], null, 401);
            }

            $user = $result['user'];

            // Ensure user is a mobile user
            if ($user->isAdmin() || $user->isSpecialist()) {
                return $this->error('Access denied. This API is for mobile app users only.', null, 403);
            }

            $token = $user->createToken('mobile-app')->plainTextToken;

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'Google authentication successful');
        } catch (\Exception $e) {
            Log::error('Google login failed', [
                'error' => $e->getMessage(),
            ]);

            return $this->error('Google authentication failed. Please try again.');
        }
    }

    /**
     * Logout user (revoke current token)
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return $this->success(null, 'Logged out successfully');
        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id ?? null,
            ]);

            return $this->error('Logout failed. Please try again.');
        }
    }

    /**
     * Refresh access token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Revoke old token
            $request->user()->currentAccessToken()->delete();
            
            // Create new token
            $token = $user->createToken('mobile-app')->plainTextToken;

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
            ], 'Token refreshed successfully');
        } catch (\Exception $e) {
            Log::error('Token refresh failed', [
                'error' => $e->getMessage(),
            ]);

            return $this->error('Token refresh failed. Please try again.');
        }
    }

    /**
     * Get authenticated user data
     */
    public function me(Request $request): JsonResponse
    {
        try {
            return $this->success([
                'user' => new UserResource($request->user()),
            ], 'User data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('Get user data failed', [
                'error' => $e->getMessage(),
            ]);

            return $this->error('Failed to retrieve user data.');
        }
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->sendMobilePasswordResetLinkAction->execute($request->email);

            if ($result['success']) {
                return $this->success(null, $result['message']);
            }

            return $this->error($result['message']);
        } catch (\Exception $e) {
            Log::error('Forgot password request failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
            ]);

            return $this->error('Failed to process password reset request. Please try again.');
        }
    }

    /**
     * Reset password with token
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->resetMobilePasswordAction->execute(
                $request->email,
                $request->token,
                $request->password
            );

            if ($result['success']) {
                return $this->success(null, $result['message']);
            }

            return $this->error($result['message'], null, 400);
        } catch (\Exception $e) {
            Log::error('Password reset failed', [
                'error' => $e->getMessage(),
                'email' => $request->email,
            ]);

            return $this->error('Failed to reset password. Please try again.');
        }
    }
}

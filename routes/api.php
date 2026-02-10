<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('mobile/v1')->group(function () {
    // Public routes
    Route::get('/who-we-are', [App\Http\Controllers\Api\WhoWeAreController::class, 'index']);
    Route::get('/pricing', [App\Http\Controllers\Api\PricingController::class, 'index']);
    Route::get('/process', [App\Http\Controllers\Api\ProcessController::class, 'index']);
    Route::get('/countries', [App\Http\Controllers\Api\CountryController::class, 'index']);
    Route::post('/auth/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/auth/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/auth/google', [App\Http\Controllers\Api\AuthController::class, 'googleLogin']);
    Route::post('/auth/forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);
    
    // Protected routes (require authentication)
    Route::middleware(['auth:sanctum', 'api.user'])->group(function () {
        // Authentication routes
        Route::post('/auth/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
        Route::post('/auth/refresh', [App\Http\Controllers\Api\AuthController::class, 'refresh']);
        Route::get('/auth/me', [App\Http\Controllers\Api\AuthController::class, 'me']);
        
        // Destinations
        Route::get('/destinations', [App\Http\Controllers\Api\DestinationController::class, 'index']);
        Route::get('/destinations/{id}', [App\Http\Controllers\Api\DestinationController::class, 'show']);
        Route::get('/destinations/country/{country}', [App\Http\Controllers\Api\DestinationController::class, 'getByCountry']);
        Route::get('/destinations/region/{region}', [App\Http\Controllers\Api\DestinationController::class, 'getByRegion']);
        
        // Plans
        Route::get('/plans', [App\Http\Controllers\Api\PlanController::class, 'index']);
        Route::post('/plans', [App\Http\Controllers\Api\PlanController::class, 'store']);
        Route::post('/plans/payment-intent', [App\Http\Controllers\Api\PlanController::class, 'createPaymentIntent']);
        Route::get('/plans/{id}', [App\Http\Controllers\Api\PlanController::class, 'show']);
        Route::put('/plans/{id}', [App\Http\Controllers\Api\PlanController::class, 'update']);
        Route::get('/plans/{id}/availability', [App\Http\Controllers\Api\PlanController::class, 'getAvailability']);
        Route::post('/plans/{id}/checkout', [App\Http\Controllers\Api\PlanController::class, 'createCheckoutSession']);
        
        // Appointments
        Route::get('/appointments', [App\Http\Controllers\Api\AppointmentController::class, 'list']);
        Route::post('/appointments/book', [App\Http\Controllers\Api\AppointmentController::class, 'book']);
        Route::post('/appointments/{id}/cancel', [App\Http\Controllers\Api\AppointmentController::class, 'cancel']);
        
        // Profile
        Route::get('/profile', [App\Http\Controllers\Api\ProfileController::class, 'show']);
        Route::put('/profile', [App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::post('/profile/change-password', [App\Http\Controllers\Api\ProfileController::class, 'changePassword']);
        
        // User profile (alias for mobile app compatibility)
        Route::get('/user/profile', [App\Http\Controllers\Api\ProfileController::class, 'show']);
        Route::put('/user/profile', [App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::post('/user/profile/image', [App\Http\Controllers\Api\ProfileController::class, 'uploadImage']);
        
        // Specialist application
        Route::post('/specialist/apply', [App\Http\Controllers\Api\SpecialistController::class, 'apply']);
        
        // Specialists
        Route::get('/specialists', [App\Http\Controllers\Api\SpecialistController::class, 'index']);
    });
});

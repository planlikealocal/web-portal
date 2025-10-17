<?php

use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SpecialistController;
use App\Http\Controllers\Admin\DestinationController;
use App\Http\Controllers\Admin\CountryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Website routes
Route::get('/', [WebsiteController::class, 'home'])->name('home');
Route::get('/about', [WebsiteController::class, 'about'])->name('about');
Route::get('/contact', [WebsiteController::class, 'contact'])->name('contact');
Route::post('/contact', [WebsiteController::class, 'contactSubmit'])->name('contact.submit');

// Admin authentication routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware(['admin'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/specialists', [SpecialistController::class, 'index'])->name('specialists.index');
        Route::get('/specialists/create', [SpecialistController::class, 'create'])->name('specialists.create');
        Route::get('/specialists/{specialist}/edit', [SpecialistController::class, 'edit'])->name('specialists.edit');
        Route::post('/specialists', [SpecialistController::class, 'store'])->name('specialists.store');
        Route::post('/specialists/{specialist}', [SpecialistController::class, 'update'])->name('specialists.update');
        Route::delete('/specialists/{specialist}', [SpecialistController::class, 'destroy'])->name('specialists.destroy');
        
        // Destination routes
        Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations.index');
        Route::get('/destinations/create', [DestinationController::class, 'create'])->name('destinations.create');
        Route::get('/destinations/{destination}/manage', [DestinationController::class, 'manage'])->name('destinations.manage');
        Route::get('/destinations/{destination}/edit', [DestinationController::class, 'edit'])->name('destinations.edit');
        Route::post('/destinations', [DestinationController::class, 'store'])->name('destinations.store');
        Route::post('/destinations/{destination}', [DestinationController::class, 'update'])->name('destinations.update');
        Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy'])->name('destinations.destroy');
        Route::post('/destinations/{destination}/toggle-status', [DestinationController::class, 'toggleStatus'])->name('destinations.toggle-status');
        Route::get('/destinations/specialists-by-country', [DestinationController::class, 'getSpecialistsByCountry'])->name('destinations.specialists-by-country');
        
        // Destination Images routes
        Route::post('/destinations/{destination}/images', [DestinationController::class, 'storeImage'])->name('destinations.images.store');
        Route::match(['post', 'put'], '/destinations/{destination}/images/{image}', [DestinationController::class, 'updateImage'])->name('destinations.images.update');
        Route::delete('/destinations/{destination}/images/{image}', [DestinationController::class, 'destroyImage'])->name('destinations.images.destroy');
        
        // Destination Seasons routes
        Route::post('/destinations/{destination}/seasons', [DestinationController::class, 'storeSeason'])->name('destinations.seasons.store');
        Route::put('/destinations/{destination}/seasons/{season}', [DestinationController::class, 'updateSeason'])->name('destinations.seasons.update');
        Route::delete('/destinations/{destination}/seasons/{season}', [DestinationController::class, 'destroySeason'])->name('destinations.seasons.destroy');
        
        // Destination Activities routes
        Route::post('/destinations/{destination}/activities', [DestinationController::class, 'storeActivity'])->name('destinations.activities.store');
        Route::post('/destinations/{destination}/activities/bulk', [DestinationController::class, 'storeBulkActivities'])->name('destinations.activities.bulk');
        Route::put('/destinations/{destination}/activities/{activity}', [DestinationController::class, 'updateActivity'])->name('destinations.activities.update');
        Route::delete('/destinations/{destination}/activities/{activity}', [DestinationController::class, 'destroyActivity'])->name('destinations.activities.destroy');
        
        // Destination Itineraries routes
        Route::post('/destinations/{destination}/itineraries', [DestinationController::class, 'storeItinerary'])->name('destinations.itineraries.store');
        Route::put('/destinations/{destination}/itineraries/{itinerary}', [DestinationController::class, 'updateItinerary'])->name('destinations.itineraries.update');
        Route::delete('/destinations/{destination}/itineraries/{itinerary}', [DestinationController::class, 'destroyItinerary'])->name('destinations.itineraries.destroy');
        
        // Countries routes
        Route::get('/countries', [CountryController::class, 'index'])->name('countries.index');
        Route::get('/countries/autocomplete', [CountryController::class, 'autocomplete'])->name('countries.autocomplete');
        
        // Test notification route (for development/demo purposes)
        Route::post('/test-notifications', function () {
            $type = request('type', 'info');
            $message = request('message', 'Test notification');
            
            return redirect()->back()->with($type, $message);
        })->name('test.notifications');
    });
});

<?php

use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SpecialistController;
use App\Http\Controllers\Admin\DestinationController;
use Illuminate\Support\Facades\Route;

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
        
        // Test storage access
        Route::get('/test-storage/{filename}', function ($filename) {
            $path = storage_path('app/public/destinations/' . $filename);
            if (file_exists($path)) {
                return response()->file($path);
            }
            return response('File not found', 404);
        })->name('test.storage');
        
        // Test notification route (for development/demo purposes)
        Route::post('/test-notifications', function () {
            $type = request('type', 'info');
            $message = request('message', 'Test notification');
            
            return redirect()->back()->with($type, $message);
        })->name('test.notifications');
    });
});

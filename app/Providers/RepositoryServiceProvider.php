<?php

namespace App\Providers;

use App\Contracts\Repositories\SpecialistRepositoryInterface;
use App\Repositories\SpecialistRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(SpecialistRepositoryInterface::class, SpecialistRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

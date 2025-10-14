<?php

namespace App\Providers;

use App\Contracts\Repositories\SpecialistRepositoryInterface;
use App\Contracts\Repositories\DestinationRepositoryInterface;
use App\Repositories\SpecialistRepository;
use App\Repositories\DestinationRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(SpecialistRepositoryInterface::class, SpecialistRepository::class);
        $this->app->bind(DestinationRepositoryInterface::class, DestinationRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

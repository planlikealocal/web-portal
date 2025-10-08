<?php

namespace App\Providers;

use App\Actions\Specialist\CreateSpecialistAction;
use App\Actions\Specialist\DeleteSpecialistAction;
use App\Actions\Specialist\GetSpecialistsAction;
use App\Actions\Specialist\UpdateSpecialistAction;
use App\Contracts\Actions\SpecialistActionInterface;
use App\Contracts\Repositories\SpecialistRepositoryInterface;
use App\Contracts\Services\DataPreparationServiceInterface;
use App\Contracts\Services\ValidationServiceInterface;
use App\Repositories\SpecialistRepository;
use App\Services\SpecialistDataPreparationService;
use App\Services\SpecialistOperationService;
use App\Services\SpecialistValidationService;
use Illuminate\Support\ServiceProvider;

class SpecialistServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(SpecialistRepositoryInterface::class, SpecialistRepository::class);
        
        // Service bindings
        $this->app->bind(DataPreparationServiceInterface::class, SpecialistDataPreparationService::class);
        $this->app->bind(ValidationServiceInterface::class, SpecialistValidationService::class);
        
        // Action bindings
        $this->app->bind('specialist.create', CreateSpecialistAction::class);
        $this->app->bind('specialist.update', UpdateSpecialistAction::class);
        $this->app->bind('specialist.delete', DeleteSpecialistAction::class);
        $this->app->bind('specialist.get', GetSpecialistsAction::class);
        
        // Strategy service
        $this->app->singleton(SpecialistOperationService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

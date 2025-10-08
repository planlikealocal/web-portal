<?php

namespace App\Actions;

use App\Contracts\Actions\SpecialistActionInterface;
use App\Contracts\Repositories\SpecialistRepositoryInterface;
use App\Contracts\Services\DataPreparationServiceInterface;
use App\Contracts\Services\ValidationServiceInterface;

abstract class AbstractSpecialistAction implements SpecialistActionInterface
{
    public function __construct(
        protected SpecialistRepositoryInterface $specialistRepository,
        protected DataPreparationServiceInterface $dataPreparationService,
        protected ValidationServiceInterface $validationService
    ) {}

    /**
     * Execute the action
     */
    abstract public function execute(...$args);

    /**
     * Prepare data using the data preparation service
     */
    protected function prepareData(array $data): array
    {
        return $this->dataPreparationService->prepareSpecialistData($data);
    }

    /**
     * Validate data using the validation service
     */
    protected function validateData(array $data): array
    {
        return $this->validationService->validateSpecialistData($data);
    }

    /**
     * Log action execution
     */
    protected function logAction(string $action, array $data = []): void
    {
        // Log the action for audit purposes
        \Log::info("Specialist Action: {$action}", $data);
    }
}

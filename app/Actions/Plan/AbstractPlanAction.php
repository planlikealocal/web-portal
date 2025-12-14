<?php

namespace App\Actions\Plan;

use App\Services\GoogleCalendarService;
use Illuminate\Support\Facades\Log;

abstract class AbstractPlanAction
{
    protected GoogleCalendarService $googleCalendarService;

    public function __construct(GoogleCalendarService $googleCalendarService)
    {
        $this->googleCalendarService = $googleCalendarService;
    }

    /**
     * Execute the action
     */
    abstract public function execute(...$args);

    /**
     * Log action execution
     */
    protected function logAction(string $action, array $data = []): void
    {
        Log::info("Plan Action: {$action}", $data);
    }
}


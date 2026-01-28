<?php

namespace App\Http\Controllers\Api;

use App\Actions\SpecialistApplication\HandleSpecialistApplicationAction;
use App\Http\Requests\Api\ApplyForSpecialistRequest;
use Illuminate\Http\JsonResponse;

class SpecialistController extends BaseApiController
{
    /**
     * Apply for specialist position
     *
     * @param ApplyForSpecialistRequest $request
     * @param HandleSpecialistApplicationAction $action
     * @return JsonResponse
     */
    public function apply(ApplyForSpecialistRequest $request, HandleSpecialistApplicationAction $action): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            
            // Map qualification to qualified_expert for the action
            $validatedData['qualified_expert'] = $validatedData['qualification'];
            unset($validatedData['qualification']);
            
            // Set default best_way_to_contact if not provided
            if (!isset($validatedData['best_way_to_contact']) || empty($validatedData['best_way_to_contact'])) {
                $validatedData['best_way_to_contact'] = 'Email';
            }
            
            $application = $action->execute($validatedData);
            
            return $this->success(
                ['application_id' => $application->id],
                'Your application has been submitted successfully. We will review it and get back to you soon.'
            );
        } catch (\Exception $e) {
            \Log::error('Failed to submit specialist application via mobile API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return $this->error('Failed to submit application. Please try again later.');
        }
    }
}

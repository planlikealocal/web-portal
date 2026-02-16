<?php

namespace App\Http\Controllers\Api;

use App\Actions\Specialist\GetSpecialistAvailabilityAction;
use App\Actions\SpecialistApplication\HandleSpecialistApplicationAction;
use App\Http\Requests\Api\ApplyForSpecialistRequest;
use App\Http\Resources\Api\SpecialistResource;
use App\Models\Specialist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    /**
     * Get specialists by IDs
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $ids = $request->get('ids');
            
            if (!$ids) {
                return $this->error('Specialist IDs are required.');
            }

            // Parse comma-separated IDs
            $specialistIds = is_array($ids) ? $ids : explode(',', $ids);
            $specialistIds = array_map('intval', $specialistIds);
            $specialistIds = array_filter($specialistIds, fn($id) => $id > 0);

            if (empty($specialistIds)) {
                return $this->success([], 'No valid specialist IDs provided.');
            }

            // Get active specialists by IDs
            $specialists = Specialist::whereIn('id', $specialistIds)
                ->where('status', 'active')
                ->with('country')
                ->get();

            return $this->success(
                SpecialistResource::collection($specialists),
                'Specialists retrieved successfully'
            );
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve specialists via mobile API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return $this->error('Failed to retrieve specialists. Please try again later.');
        }
    }

    /**
     * Get availability for a specialist
     */
    public function getAvailability(Request $request, $id): JsonResponse
    {
        try {
            $request->validate([
                'date' => 'required|date_format:Y-m-d',
                'duration' => 'required|integer|min:15|max:480',
            ]);

            $specialist = Specialist::with('workingHours')->findOrFail($id);

            $action = app(GetSpecialistAvailabilityAction::class);
            $result = $action->execute(
                $specialist,
                $request->input('date'),
                (int) $request->input('duration')
            );

            return $this->success([
                'availability' => $result['availability'],
                'timezone' => $result['timezone'],
            ], 'Availability retrieved successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Specialist not found');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve availability: ' . $e->getMessage());
        }
    }
}

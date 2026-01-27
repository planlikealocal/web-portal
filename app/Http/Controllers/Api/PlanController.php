<?php

namespace App\Http\Controllers\Api;

use App\Actions\Plan\CreatePlanAction;
use App\Actions\Plan\UpdatePlanAction;
use App\Actions\Plan\GetPlanAvailabilityAction;
use App\Actions\Plan\CreateCheckoutSessionAction;
use App\Http\Requests\Api\StorePlanRequest;
use App\Http\Requests\Api\UpdatePlanRequest;
use App\Http\Resources\Api\PlanResource;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends BaseApiController
{
    public function __construct(
        private CreatePlanAction $createPlanAction,
        private UpdatePlanAction $updatePlanAction,
        private GetPlanAvailabilityAction $getPlanAvailabilityAction,
        private CreateCheckoutSessionAction $createCheckoutSessionAction,
    ) {}

    /**
     * List authenticated user's plans
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $plans = Plan::where('email', $user->email)
                ->with(['specialist', 'destination'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return $this->success([
                'plans' => PlanResource::collection($plans->items()),
                'pagination' => [
                    'current_page' => $plans->currentPage(),
                    'last_page' => $plans->lastPage(),
                    'per_page' => $plans->perPage(),
                    'total' => $plans->total(),
                ],
            ], 'Plans retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve plans: ' . $e->getMessage());
        }
    }

    /**
     * Create a new plan
     */
    public function store(StorePlanRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Add user's email to plan data
            $planData = array_merge($request->validated(), [
                'email' => $user->email,
            ]);
            
            $plan = $this->createPlanAction->execute($planData);

            return $this->success([
                'plan' => new PlanResource($plan->load(['specialist', 'destination'])),
            ], 'Plan created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create plan: ' . $e->getMessage());
        }
    }

    /**
     * Get plan details
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $plan = Plan::with(['specialist', 'destination'])
                ->where('id', $id)
                ->where('email', $user->email)
                ->firstOrFail();

            return $this->success([
                'plan' => new PlanResource($plan),
            ], 'Plan retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Plan not found');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve plan: ' . $e->getMessage());
        }
    }

    /**
     * Update plan
     */
    public function update(UpdatePlanRequest $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $plan = Plan::where('id', $id)
                ->where('email', $user->email)
                ->firstOrFail();

            $plan = $this->updatePlanAction->execute($plan, $request->validated());

            return $this->success([
                'plan' => new PlanResource($plan->load(['specialist', 'destination'])),
            ], 'Plan updated successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Plan not found');
        } catch (\Exception $e) {
            return $this->error('Failed to update plan: ' . $e->getMessage());
        }
    }

    /**
     * Get availability for a plan
     */
    public function getAvailability(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $plan = Plan::where('id', $id)
                ->where('email', $user->email)
                ->firstOrFail();

            $availability = $this->getPlanAvailabilityAction->execute($plan, $request->all());

            return $this->success([
                'availability' => $availability,
            ], 'Availability retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Plan not found');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve availability: ' . $e->getMessage());
        }
    }

    /**
     * Create Stripe checkout session
     */
    public function createCheckoutSession(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $plan = Plan::where('id', $id)
                ->where('email', $user->email)
                ->firstOrFail();

            $session = $this->createCheckoutSessionAction->execute($plan);

            return $this->success([
                'checkout_url' => $session['url'],
                'session_id' => $session['id'],
            ], 'Checkout session created successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFound('Plan not found');
        } catch (\Exception $e) {
            return $this->error('Failed to create checkout session: ' . $e->getMessage());
        }
    }
}

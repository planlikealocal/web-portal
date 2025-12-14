<?php

namespace Tests\Feature;

use App\Actions\Plan\HandlePaymentSuccessAction;
use App\Models\Country;
use App\Models\Destination;
use App\Models\Plan;
use App\Models\Specialist;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Mockery;
use Tests\TestCase;

class PlanAppointmentFlowTest extends TestCase
{
    use RefreshDatabase;

    protected GoogleCalendarService $calendarService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calendarService = Mockery::mock(GoogleCalendarService::class);
        $this->calendarService->shouldIgnoreMissing();
        $this->instance(GoogleCalendarService::class, $this->calendarService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_specialist_can_view_plan_details_with_permissions(): void
    {
        [$user, , $plan] = $this->createPlanWithRelations();

        $response = $this->actingAs($user)
            ->getJson(route('specialist.appointments.plan.details', $plan->id));

        $response->assertOk()
            ->assertJsonPath('id', $plan->id)
            ->assertJsonPath('appointment_status', 'draft')
            ->assertJsonPath('permissions.can_cancel', false)
            ->assertJsonPath('permissions.can_complete', false);
    }

    public function test_payment_success_makes_plan_active_and_specialist_can_cancel(): void
    {
        [$user, $specialist, $plan] = $this->createPlanWithRelations();

        $this->simulatePaymentSuccess($plan);

        $plan->refresh();
        $this->assertSame('active', $plan->appointment_status);
        $this->assertSame('paid', $plan->payment_status);

        $comment = 'Traveler asked to cancel.';

        $response = $this->actingAs($user)->postJson(
            route('specialist.appointments.plan.cancel', $plan->id),
            ['comment' => $comment]
        );

        $response->assertOk()
            ->assertJsonPath('appointment_status', 'cancelled')
            ->assertJsonPath('cancellation_comment', $comment)
            ->assertJsonPath('canceled_by.id', $specialist->id)
            ->assertJsonPath('permissions.can_cancel', false);

        $plan->refresh();

        $this->assertSame('cancelled', $plan->appointment_status);
        $this->assertSame($comment, $plan->cancellation_comment);
        $this->assertSame($specialist->id, $plan->canceled_by_id);
        $this->assertNotNull($plan->canceled_at);
    }

    public function test_specialist_cannot_cancel_non_active_plan(): void
    {
        [$user, , $plan] = $this->createPlanWithRelations([
            'appointment_status' => 'draft',
        ]);

        $response = $this->actingAs($user)->postJson(
            route('specialist.appointments.plan.cancel', $plan->id),
            ['comment' => 'Not allowed']
        );

        $response->assertStatus(422)
            ->assertJson([
                'error' => 'Only active appointments can be cancelled.',
            ]);
    }

    public function test_specialist_can_complete_active_plan_after_end_time(): void
    {
        [$user, , $plan] = $this->createPlanWithRelations([
            'appointment_status' => 'active',
            'payment_status' => 'paid',
            'appointment_start' => now()->subHours(2),
            'appointment_end' => now()->subHour(),
        ]);

        $response = $this->actingAs($user)->postJson(
            route('specialist.appointments.plan.complete', $plan->id),
            ['comment' => 'Session went well.']
        );

        $response->assertOk()
            ->assertJsonPath('appointment_status', 'completed')
            ->assertJsonPath('completion_comment', 'Session went well.')
            ->assertJsonPath('permissions.can_complete', false);

        $plan->refresh();

        $this->assertSame('completed', $plan->appointment_status);
        $this->assertSame('Session went well.', $plan->completion_comment);
        $this->assertNotNull($plan->completed_at);
    }

    public function test_specialist_cannot_complete_before_end_time(): void
    {
        [$user, , $plan] = $this->createPlanWithRelations([
            'appointment_status' => 'active',
            'payment_status' => 'paid',
            'appointment_start' => now()->subHour(),
            'appointment_end' => now()->addMinutes(30),
        ]);

        $response = $this->actingAs($user)->postJson(
            route('specialist.appointments.plan.complete', $plan->id),
            ['comment' => 'Too soon']
        );

        $response->assertStatus(422)
            ->assertJson([
                'error' => 'Appointment can be completed only after it ends.',
            ]);
    }

    /**
     * Helper to create a plan with linked user, specialist, and destination.
     *
     * @return array{User, Specialist, Plan}
     */
    private function createPlanWithRelations(array $planOverrides = []): array
    {
        $country = Country::create([
            'name' => 'United States',
            'code' => 'US',
            'flag_url' => null,
        ]);

        $specialistEmail = 'specialist@example.com';

        $specialist = Specialist::create([
            'first_name' => 'Sam',
            'last_name' => 'Advisor',
            'email' => $specialistEmail,
            'profile_pic' => null,
            'bio' => 'Travel expert',
            'contact_no' => '+1 555 123 4567',
            'country_id' => $country->id,
            'state_province' => 'CA',
            'city' => 'Los Angeles',
            'address' => '123 Main St',
            'postal_code' => '90001',
            'timezone' => 'UTC',
            'status' => 'active',
            'no_of_trips' => 100,
        ]);

        $user = User::factory()->create([
            'name' => $specialist->full_name,
            'email' => $specialistEmail,
            'role' => 'specialist',
            'google_access_token' => 'token',
        ]);

        $destination = Destination::create([
            'name' => 'Hawaii',
            'description' => 'Beach destination',
            'overview_title' => 'Tropical Escape',
            'overview' => 'A wonderful place to relax.',
            'status' => 'active',
            'state_province' => 'HI',
            'city' => 'Honolulu',
            'home_image' => null,
            'grid_image' => null,
            'banner_image' => null,
            'specialist_ids' => [$specialist->id],
            'country_id' => $country->id,
        ]);

        $planData = array_merge([
            'specialist_id' => $specialist->id,
            'destination_id' => $destination->id,
            'first_name' => 'Taylor',
            'last_name' => 'Traveler',
            'email' => 'traveler@example.com',
            'phone' => '+1 555 987 6543',
            'travel_dates' => '2025-12-10 to 2025-12-20',
            'travelers' => '2 adults',
            'interests' => ['adventure'],
            'other_interests' => null,
            'plan_type' => 'pathfinder',
            'selected_plan' => 'pathfinder',
            'status' => 'draft',
            'appointment_status' => 'draft',
            'selected_time_slot' => null,
            'appointment_start' => now()->addDays(3),
            'appointment_end' => now()->addDays(3)->addHour(),
            'payment_status' => 'pending',
            'amount' => 149,
        ], $planOverrides);

        $plan = Plan::create($planData);

        return [$user, $specialist, $plan];
    }

    private function simulatePaymentSuccess(Plan $plan): void
    {
        Mail::fake();

        $session = (object) [
            'id' => 'sess_' . $plan->id,
            'metadata' => (object) ['plan_id' => $plan->id],
            'payment_intent' => 'pi_' . $plan->id,
        ];

        app(HandlePaymentSuccessAction::class)->execute($session);
    }
}


<?php

namespace App\Http\Resources;

use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'specialist_id' => $this->specialist_id,
            'destination_id' => $this->destination_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'destination' => $this->when(
                $this->destination_id,
                $this->destination?->name
            ),
            'specialist' => $this->when(
                $this->specialist_id,
                $this->specialist ? [
                    'id' => $this->specialist->id,
                    'first_name' => $this->specialist->first_name,
                    'last_name' => $this->specialist->last_name,
                    'full_name' => $this->specialist->full_name,
                    'email' => $this->specialist->email,
                    'contact_no' => $this->specialist->contact_no,
                    'bio' => $this->specialist->bio,
                    'status' => $this->specialist->status,
                    'profile_pic' => $this->specialist->profile_pic,
                    'country' => $this->specialist->country ? [
                        'id' => $this->specialist->country->id,
                        'name' => $this->specialist->country->name,
                    ] : null,
                    'city' => $this->specialist->city,
                    'state_province' => $this->specialist->state_province,
                    'timezone' => $this->specialist->timezone,
                ] : null
            ),
            'travel_dates' => $this->travel_dates,
            'travelers' => $this->travelers,
            'interests' => $this->interests ?? [],
            'other_interests' => $this->other_interests,
            'plan_type' => $this->plan_type,
            'selected_plan' => $this->selected_plan ?? $this->plan_type,
            'status' => $this->status,
            'appointment_status' => $this->appointment_status ?? 'draft',
            'payment_status' => $this->payment_status ?? 'pending',
            'appointment_start' => $this->appointment_start?->toDateTimeString(),
            'appointment_end' => $this->appointment_end?->toDateTimeString(),
            'amount' => $this->amount,
            'paid_at' => $this->paid_at?->toDateTimeString(),
            'google_calendar_event_id' => $this->google_calendar_event_id,
            'meeting_link' => $this->meeting_link,
            'cancellation_comment' => $this->cancellation_comment,
            'canceled_at' => $this->canceled_at?->toDateTimeString(),
            'canceled_by' => $this->when($this->canceled_by_type, [
                'type' => $this->canceled_by_type,
                'id' => $this->canceled_by_id,
                'name' => $this->getCanceledByName(),
            ]),
            'completion_comment' => $this->completion_comment,
            'completed_at' => $this->completed_at?->toDateTimeString(),
            'permissions' => [
                'can_cancel' => $this->resource instanceof Plan ? $this->resource->canCancelAppointment() : false,
                'can_complete' => $this->resource instanceof Plan ? $this->resource->canCompleteAppointment() : false,
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }

    private function getCanceledByName(): ?string
    {
        if (!$this->canceled_by_type) {
            return null;
        }

        if ($this->canceled_by_type === 'specialist') {
            return $this->specialist?->full_name;
        }

        $fullName = trim(implode(' ', array_filter([$this->first_name, $this->last_name])));

        return $fullName !== '' ? $fullName : null;
    }
}

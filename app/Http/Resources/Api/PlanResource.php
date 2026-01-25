<?php

namespace App\Http\Resources\Api;

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
            'specialist' => $this->specialist ? [
                'id' => $this->specialist->id,
                'first_name' => $this->specialist->first_name,
                'last_name' => $this->specialist->last_name,
                'email' => $this->specialist->email,
                'profile_pic' => $this->specialist->profile_pic,
            ] : null,
            'destination_id' => $this->destination_id,
            'destination' => $this->destination ? [
                'id' => $this->destination->id,
                'name' => $this->destination->name,
            ] : null,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'travel_dates' => $this->travel_dates,
            'travelers' => $this->travelers,
            'interests' => $this->interests,
            'other_interests' => $this->other_interests,
            'plan_type' => $this->plan_type,
            'selected_plan' => $this->selected_plan,
            'status' => $this->status,
            'appointment_status' => $this->appointment_status,
            'selected_time_slot' => $this->selected_time_slot,
            'appointment_start' => $this->appointment_start,
            'appointment_end' => $this->appointment_end,
            'google_calendar_event_id' => $this->google_calendar_event_id,
            'meeting_link' => $this->meeting_link,
            'payment_status' => $this->payment_status,
            'amount' => $this->amount,
            'paid_at' => $this->paid_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

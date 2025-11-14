<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Handle both array and object resources (Google Calendar returns arrays)
        $data = is_array($this->resource) ? $this->resource : $this->resource->toArray();
        
        return [
            'id' => $data['id'] ?? null,
            'summary' => $data['summary'] ?? 'Appointment',
            'description' => $data['description'] ?? '',
            'client_name' => $data['client_name'] ?? '',
            'client_email' => $data['client_email'] ?? '',
            'client_phone' => $data['client_phone'] ?? '',
            'start' => $data['start'] ?? null,
            'end' => $data['end'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'html_link' => $data['html_link'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'appointment_status' => $data['plan']['appointment_status'] ?? $data['appointment_status'] ?? null,
            'location' => $data['location'] ?? null,
            'plan_id' => $data['plan_id'] ?? null,
            'plan' => $this->when(
                isset($data['plan']) && $data['plan'],
                function () use ($data) {
                    return new PlanResource($data['plan']);
                }
            ),
        ];
    }
}


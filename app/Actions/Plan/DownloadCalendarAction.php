<?php

namespace App\Actions\Plan;

use App\Models\Plan;
use Carbon\Carbon;

class DownloadCalendarAction extends AbstractPlanAction
{
    public function execute(...$args): string
    {
        $plan = $args[0];

        // Check if appointment details are available
        if (!$plan->appointment_start || !$plan->appointment_end) {
            throw new \Exception('Appointment details not found');
        }

        $startTime = Carbon::parse($plan->appointment_start);
        $endTime = Carbon::parse($plan->appointment_end);

        // Format dates for ICS (YYYYMMDDTHHmmssZ)
        $startFormatted = $startTime->format('Ymd\THis\Z');
        $endFormatted = $endTime->format('Ymd\THis\Z');
        $createdFormatted = now()->format('Ymd\THis\Z');

        // Generate unique ID
        $uid = 'appointment-' . $plan->id . '-' . time() . '@' . parse_url(config('app.url'), PHP_URL_HOST);

        // Build description
        $description = "Appointment with " . ($plan->specialist ? $plan->specialist->full_name : 'Specialist') . "\n\n";
        $description .= "Client: " . trim(($plan->first_name ?? '') . ' ' . ($plan->last_name ?? '')) . "\n";
        $description .= "Email: " . ($plan->email ?? '') . "\n";
        if ($plan->phone) {
            $description .= "Phone: " . $plan->phone . "\n";
        }
        if ($plan->destination) {
            $description .= "Destination: " . $plan->destination->name . "\n";
        }
        if ($plan->selected_plan || $plan->plan_type) {
            $description .= "Plan: " . ucfirst($plan->selected_plan ?? $plan->plan_type) . "\n";
        }

        // Build location
        $location = '';
        if ($plan->specialist) {
            $locationParts = array_filter([
                $plan->specialist->city,
                $plan->specialist->state_province,
                $plan->specialist->country ? $plan->specialist->country->name : null
            ]);
            $location = implode(', ', $locationParts);
        }

        // Build ICS content
        $icsContent = "BEGIN:VCALENDAR\r\n";
        $icsContent .= "VERSION:2.0\r\n";
        $icsContent .= "PRODID:-//Web Portal//Appointment//EN\r\n";
        $icsContent .= "CALSCALE:GREGORIAN\r\n";
        $icsContent .= "METHOD:REQUEST\r\n";
        $icsContent .= "BEGIN:VEVENT\r\n";
        $icsContent .= "UID:" . $uid . "\r\n";
        $icsContent .= "DTSTAMP:" . $createdFormatted . "\r\n";
        $icsContent .= "DTSTART:" . $startFormatted . "\r\n";
        $icsContent .= "DTEND:" . $endFormatted . "\r\n";
        $icsContent .= "SUMMARY:Appointment - " . ucfirst($plan->selected_plan ?? $plan->plan_type ?? 'Plan') . " Plan\r\n";
        $icsContent .= "DESCRIPTION:" . str_replace(["\r\n", "\n"], "\\n", $description) . "\r\n";
        if ($location) {
            $icsContent .= "LOCATION:" . $location . "\r\n";
        }
        $icsContent .= "STATUS:CONFIRMED\r\n";
        $icsContent .= "SEQUENCE:0\r\n";
        $icsContent .= "BEGIN:VALARM\r\n";
        $icsContent .= "TRIGGER:-PT24H\r\n";
        $icsContent .= "ACTION:DISPLAY\r\n";
        $icsContent .= "DESCRIPTION:Reminder: Appointment in 24 hours\r\n";
        $icsContent .= "END:VALARM\r\n";
        $icsContent .= "END:VEVENT\r\n";
        $icsContent .= "END:VCALENDAR\r\n";

        return $icsContent;
    }
}


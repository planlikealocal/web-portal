<?php

namespace App\Http\Controllers\Specialist;

use App\Actions\Specialist\UpdateSpecialistAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSpecialistProfileRequest;
use App\Models\Country;
use App\Models\Specialist;
use App\Models\WorkingHour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        private UpdateSpecialistAction $updateSpecialistAction,
    ) {}

    /**
     * Show the specialist profile page
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get specialist data
        $specialist = Specialist::where('email', $user->email)
            ->with(['workingHours', 'country'])
            ->first();
        
        $countries = Country::orderBy('name')->get(['id', 'name', 'code', 'flag_url']);

        // Format working hours for frontend
        $workingHours = $specialist?->workingHours->map(function ($wh) {
            return [
                'id' => $wh->id,
                'start_time' => substr($wh->start_time, 0, 5), // Format as HH:MM
                'end_time' => substr($wh->end_time, 0, 5), // Format as HH:MM
            ];
        })->toArray() ?? [];

        return Inertia::render('Specialist/Profile', [
            'specialist' => $specialist ? [
                'id' => $specialist->id,
                'first_name' => $specialist->first_name,
                'last_name' => $specialist->last_name,
                'email' => $specialist->email,
                'profile_pic_url' => $specialist->profile_pic ? asset('storage/' . $specialist->profile_pic) : null,
                'bio' => $specialist->bio,
                'contact_no' => $specialist->contact_no,
                'country_id' => $specialist->country_id,
                'state_province' => $specialist->state_province,
                'city' => $specialist->city,
                'address' => $specialist->address,
                'postal_code' => $specialist->postal_code,
                'status' => $specialist->status,
                'working_hours' => $workingHours,
            ] : null,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specialist profile
     */
    public function update(UpdateSpecialistProfileRequest $request)
    {
        $user = auth()->user();
        
        // Get specialist data
        $specialist = Specialist::where('email', $user->email)->first();
        
        if (!$specialist) {
            return back()->withErrors(['message' => 'Specialist profile not found.']);
        }

        // Update specialist details
        $data = $request->validated();
        
        // Handle profile picture upload
        if ($request->hasFile('profile_pic')) {
            $data['profile_pic'] = $request->file('profile_pic');
        }
        
        // Preserve existing status (specialists can't change their own status)
        // The status field is required by the validation service, so we keep the existing one
        if (!isset($data['status'])) {
            $data['status'] = $specialist->status;
        }
        
        // Update specialist
        $updatedSpecialist = $this->updateSpecialistAction->execute($specialist, $data);

        // Handle working hours
        if ($request->has('working_hours')) {
            // Delete existing working hours
            $specialist->workingHours()->delete();
            
            // Parse working hours (could be JSON string or array)
            $workingHours = $request->working_hours;
            if (is_string($workingHours)) {
                $workingHours = json_decode($workingHours, true);
            }
            
            // Create new working hours
            if (!empty($workingHours) && is_array($workingHours)) {
                foreach ($workingHours as $workingHour) {
                    if (!empty($workingHour['start_time']) && !empty($workingHour['end_time'])) {
                        WorkingHour::create([
                            'specialist_id' => $specialist->id,
                            'start_time' => $workingHour['start_time'],
                            'end_time' => $workingHour['end_time'],
                        ]);
                    }
                }
            }
        }

        return redirect()->route('specialist.profile')
            ->with('success', 'Profile updated successfully.');
    }
}

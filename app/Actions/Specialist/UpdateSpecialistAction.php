<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use App\Models\Specialist;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateSpecialistAction extends AbstractSpecialistAction
{
    public function execute(...$args): Specialist
    {
        $specialist = $args[0];
        $data = $args[1];
        $this->logAction('update_specialist', ['id' => $specialist->id, 'email' => $data['email'] ?? 'unknown']);

        // Store old email and name before update to sync with User account
        $oldEmail = $specialist->email;
        $oldName = $specialist->first_name . ' ' . $specialist->last_name;

        // Validate data
        $validatedData = $this->validateData($data);

        // Prepare data
        $preparedData = $this->prepareData($validatedData);

        // Handle profile picture upload and delete old one if necessary
        if (isset($validatedData['profile_pic']) && $validatedData['profile_pic'] instanceof UploadedFile) {
            // Delete old profile picture if exists
            if (!empty($specialist->profile_pic)) {
                Storage::disk('public')->delete($specialist->profile_pic);
                $path = $validatedData['profile_pic']->store('specialists', 'public');
                $preparedData['profile_pic'] = $path;
            }

        }

        // Update specialist
        $updatedSpecialist = $this->specialistRepository->update($specialist, $preparedData);

        // Update corresponding User account if email or name changed
        $newEmail = $updatedSpecialist->email;
        $newName = $updatedSpecialist->first_name . ' ' . $updatedSpecialist->last_name;

        if ($oldEmail !== $newEmail || $oldName !== $newName) {
            // Find user account by old email (before update)
            $user = User::where('email', $oldEmail)
                       ->where('role', 'specialist')
                       ->first();

            if ($user) {
                // Update user account with new email and/or name
                $userUpdateData = [];
                if ($oldEmail !== $newEmail) {
                    $userUpdateData['email'] = $newEmail;
                }
                if ($oldName !== $newName) {
                    $userUpdateData['name'] = $newName;
                }

                if (!empty($userUpdateData)) {
                    $user->update($userUpdateData);
                    $this->logAction('user_account_updated', [
                        'specialist_id' => $updatedSpecialist->id,
                        'user_id' => $user->id,
                        'old_email' => $oldEmail,
                        'new_email' => $newEmail,
                    ]);
                }
            } else {
                // Log warning if user account not found
                $this->logAction('user_account_not_found_for_update', [
                    'specialist_id' => $updatedSpecialist->id,
                    'old_email' => $oldEmail,
                    'new_email' => $newEmail,
                ]);
            }
        }

        $this->logAction('specialist_updated', ['id' => $updatedSpecialist->id]);

        return $updatedSpecialist;
    }
}

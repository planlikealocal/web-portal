<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use App\Models\Specialist;
use Illuminate\Support\Facades\Storage;

class DeleteSpecialistAction extends AbstractSpecialistAction
{
    public function execute(...$args): bool
    {
        $specialist = $args[0];
        $this->logAction('delete_specialist', ['id' => $specialist->id, 'email' => $specialist->email]);
        
        // Add business logic before deletion
        $this->validateDeletion($specialist);
        
        // Delete specialist
        $result = $this->specialistRepository->delete($specialist);
        
        if ($result) {
            // Delete profile picture from storage if present
            if (!empty($specialist->profile_pic)) {
                Storage::disk('public')->delete($specialist->profile_pic);
            }
            $this->logAction('specialist_deleted', ['id' => $specialist->id]);
        }
        
        return $result;
    }

    private function validateDeletion(Specialist $specialist): void
    {
        // Add business rules for deletion
        // For example: check if specialist has active assignments, etc.
        
        if ($specialist->no_of_trips > 0) {
            // Log warning but allow deletion
            $this->logAction('specialist_deletion_warning', [
                'id' => $specialist->id,
                'trips' => $specialist->no_of_trips
            ]);
        }
    }
}

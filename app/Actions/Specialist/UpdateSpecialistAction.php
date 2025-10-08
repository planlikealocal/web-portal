<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use App\Models\Specialist;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateSpecialistAction extends AbstractSpecialistAction
{
    public function execute(...$args): Specialist
    {
        $specialist = $args[0];
        $data = $args[1];
        $this->logAction('update_specialist', ['id' => $specialist->id, 'email' => $data['email'] ?? 'unknown']);

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

        $this->logAction('specialist_updated', ['id' => $updatedSpecialist->id]);

        return $updatedSpecialist;
    }
}

<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use App\Models\Specialist;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateSpecialistAction extends AbstractSpecialistAction
{
    public function execute(...$args): Specialist
    {
        $data = $args[0];
        $this->logAction('create_specialist', ['email' => $data['email'] ?? 'unknown']);

        // Validate data
        $validatedData = $this->validateData($data);

        // Prepare data
        $preparedData = $this->prepareData($validatedData);

        // Handle profile picture upload
        if (isset($validatedData['profile_pic']) && $validatedData['profile_pic'] instanceof UploadedFile) {
            $path = $validatedData['profile_pic']->store('specialists', 'public');
            $preparedData['profile_pic'] = $path;
        }

        // Create specialist
        $specialist = $this->specialistRepository->create($preparedData);

        $this->logAction('specialist_created', ['id' => $specialist->id]);

        return $specialist;
    }
}

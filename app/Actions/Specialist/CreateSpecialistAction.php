<?php

namespace App\Actions\Specialist;

use App\Actions\AbstractSpecialistAction;
use App\Models\Specialist;
use App\Actions\Auth\CreateUserAccountAction;
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

        // Create corresponding user account for authentication
        $createUserAction = new CreateUserAccountAction();
        $userResult = $createUserAction->execute([
            'name' => $specialist->first_name . ' ' . $specialist->last_name,
            'email' => $specialist->email,
            'role' => 'specialist',
        ], true);

        if (!$userResult['success']) {
            $this->logAction('user_account_creation_failed', [
                'specialist_id' => $specialist->id,
                'email' => $specialist->email,
                'error' => $userResult['message'],
            ]);
        } else {
            $this->logAction('user_account_created', [
                'specialist_id' => $specialist->id,
                'email' => $specialist->email,
                'user_id' => $userResult['user']->id,
            ]);
        }

        $this->logAction('specialist_created', ['id' => $specialist->id]);

        return $specialist;
    }
}

<?php

namespace Tests\Feature;

use App\Models\Specialist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SpecialistUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminUser(): User
    {
        return User::factory()->create([
            'role' => 'admin',
        ]);
    }

    private function createSpecialist(array $overrides = []): Specialist
    {
        $data = array_merge([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'bio' => 'Bio',
            'contact_no' => '+1 (555) 123-4567',
            'country' => 'US',
            'state_province' => 'CA',
            'city' => 'LA',
            'address' => '123 Main St',
            'postal_code' => '90001',
            'status' => 'active',
        ], $overrides);

        return Specialist::create($data);
    }

    public function test_update_without_new_profile_pic_keeps_existing(): void
    {
        Storage::fake('public');

        $admin = $this->createAdminUser();
        $this->actingAs($admin);

        // Seed existing file
        $existingFile = UploadedFile::fake()->image('old.jpg');
        $existingPath = $existingFile->store('specialists', 'public');

        $specialist = $this->createSpecialist([
            'profile_pic' => $existingPath,
        ]);

        $payload = [
            'first_name' => 'Johnny',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com', // unchanged
            'bio' => 'New Bio',
            'contact_no' => '+1 (555) 123-4567',
            'country' => 'US',
            'state_province' => 'CA',
            'city' => 'LA',
            'address' => '123 Main St',
            'postal_code' => '90001',
            'status' => 'active',
            '_method' => 'PUT',
        ];

        $response = $this->post(route('admin.specialists.update', $specialist), $payload);

        $response->assertRedirect(route('admin.specialists.index'));

        $specialist->refresh();
        $this->assertSame('Johnny', $specialist->first_name);
        $this->assertSame($existingPath, $specialist->profile_pic);
        Storage::disk('public')->assertExists($existingPath);
    }

    public function test_update_with_new_profile_pic_replaces_and_deletes_old(): void
    {
        Storage::fake('public');

        $admin = $this->createAdminUser();
        $this->actingAs($admin);

        // Seed existing file
        $existingFile = UploadedFile::fake()->image('old.jpg');
        $existingPath = $existingFile->store('specialists', 'public');

        $specialist = $this->createSpecialist([
            'profile_pic' => $existingPath,
        ]);

        $newFile = UploadedFile::fake()->image('new.jpg');

        $payload = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com', // unchanged
            'bio' => 'Bio',
            'contact_no' => '+1 (555) 123-4567',
            'country' => 'US',
            'state_province' => 'CA',
            'city' => 'LA',
            'address' => '123 Main St',
            'postal_code' => '90001',
            'status' => 'active',
            '_method' => 'PUT',
            'profile_pic' => $newFile,
        ];

        $response = $this->post(route('admin.specialists.update', $specialist), $payload);

        $response->assertRedirect(route('admin.specialists.index'));

        $specialist->refresh();
        $this->assertNotSame($existingPath, $specialist->profile_pic);
        Storage::disk('public')->assertMissing($existingPath);
        Storage::disk('public')->assertExists($specialist->profile_pic);
    }
}



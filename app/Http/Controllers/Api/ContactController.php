<?php

namespace App\Http\Controllers\Api;

use App\Actions\Contact\HandleContactFormSubmissionAction;
use App\Http\Requests\Api\SubmitContactFormRequest;
use Illuminate\Support\Facades\Log;

class ContactController extends BaseApiController
{
    /**
     * Submit a new contact form message.
     */
    public function store(SubmitContactFormRequest $request, HandleContactFormSubmissionAction $action)
    {
        try {
            $contactedUser = $action->execute($request->validated());

            return $this->success(
                ['id' => $contactedUser->id],
                'Your message has been sent successfully.'
            );
        } catch (\Exception $e) {
            Log::error('Contact form submission failed: ' . $e->getMessage(), [
                'user_id' => $request->user()->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->error('Failed to submit contact form. Please try again.');
        }
    }
}

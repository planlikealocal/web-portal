<?php

namespace App\Http\Controllers\Api;

use App\Actions\BugReport\HandleBugReportSubmissionAction;
use App\Http\Requests\Api\SubmitBugReportRequest;
use Illuminate\Support\Facades\Log;

class BugReportController extends BaseApiController
{
    /**
     * Submit a new bug report.
     */
    public function store(SubmitBugReportRequest $request, HandleBugReportSubmissionAction $action)
    {
        try {
            $user = $request->user();
            $screenshot = $request->file('screenshot');

            $bugReport = $action->execute(
                $request->validated(),
                $screenshot,
                $user->id
            );

            return $this->success(
                ['id' => $bugReport->id],
                'Bug report submitted successfully.'
            );
        } catch (\Exception $e) {
            Log::error('Bug report submission failed: ' . $e->getMessage(), [
                'user_id' => $request->user()->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->error('Failed to submit bug report. Please try again.');
        }
    }
}

<?php

namespace App\Actions\Plan;

use App\Models\Plan;

class CreatePlanAction extends AbstractPlanAction
{
    public function execute(...$args): Plan
    {
        $data = $args[0];
        $this->logAction('create_plan', [
            'specialist_id' => $data['specialist_id'] ?? null,
            'destination_id' => $data['destination_id'] ?? null,
        ]);

        $plan = Plan::create([
            'specialist_id' => $data['specialist_id'],
            'destination_id' => $data['destination_id'] ?? null,
            'status' => 'draft',
            'appointment_status' => 'draft',
        ]);

        $this->logAction('plan_created', ['id' => $plan->id]);

        return $plan;
    }
}


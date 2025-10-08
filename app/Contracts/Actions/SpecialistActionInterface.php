<?php

namespace App\Contracts\Actions;

use App\Models\Specialist;

interface SpecialistActionInterface
{
    public function execute(...$args);
}

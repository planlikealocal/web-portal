<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the status enum to include 'pending'
        DB::statement("ALTER TABLE plans MODIFY COLUMN status ENUM('draft', 'pending', 'in_progress', 'completed') DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'pending' from the enum (note: this will fail if any records have 'pending' status)
        DB::statement("ALTER TABLE plans MODIFY COLUMN status ENUM('draft', 'in_progress', 'completed') DEFAULT 'draft'");
    }
};

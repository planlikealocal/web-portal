<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialist_id')->nullable()->constrained('specialists')->onDelete('set null');
            $table->foreignId('destination_id')->nullable()->constrained('destinations')->onDelete('set null');
            
            // Step 1: Personal Information
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            
            // Step 2: Destination and Dates
            $table->string('destination')->nullable();
            $table->string('travel_dates')->nullable();
            
            // Step 3: Travelers
            $table->string('travelers')->nullable();
            
            // Step 4: Interests
            $table->json('interests')->nullable(); // Array of selected interests
            $table->text('other_interests')->nullable();
            
            // Status
            $table->enum('status', ['draft', 'in_progress', 'completed'])->default('draft');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};

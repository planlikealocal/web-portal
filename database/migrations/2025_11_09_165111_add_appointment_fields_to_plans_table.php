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
        Schema::table('plans', function (Blueprint $table) {
            $table->string('selected_time_slot')->nullable()->after('selected_plan');
            $table->timestamp('appointment_start')->nullable()->after('selected_time_slot');
            $table->timestamp('appointment_end')->nullable()->after('appointment_start');
            $table->string('google_calendar_event_id')->nullable()->after('appointment_end');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'selected_time_slot',
                'appointment_start',
                'appointment_end',
                'google_calendar_event_id',
            ]);
        });
    }
};

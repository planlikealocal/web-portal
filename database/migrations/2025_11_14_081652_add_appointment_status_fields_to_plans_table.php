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
            $table->string('appointment_status', 32)->default('draft')->after('status');
            $table->text('cancellation_comment')->nullable()->after('appointment_status');
            $table->string('canceled_by_type')->nullable()->after('cancellation_comment');
            $table->unsignedBigInteger('canceled_by_id')->nullable()->after('canceled_by_type');
            $table->timestamp('canceled_at')->nullable()->after('canceled_by_id');
            $table->text('completion_comment')->nullable()->after('canceled_at');
            $table->timestamp('completed_at')->nullable()->after('completion_comment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'appointment_status',
                'cancellation_comment',
                'canceled_by_type',
                'canceled_by_id',
                'canceled_at',
                'completion_comment',
                'completed_at',
            ]);
        });
    }
};

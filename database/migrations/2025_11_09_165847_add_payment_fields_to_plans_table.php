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
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending')->after('google_calendar_event_id');
            $table->string('stripe_payment_intent_id')->nullable()->after('payment_status');
            $table->string('stripe_session_id')->nullable()->after('stripe_payment_intent_id');
            $table->decimal('amount', 10, 2)->nullable()->after('stripe_session_id');
            $table->timestamp('paid_at')->nullable()->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'payment_status',
                'stripe_payment_intent_id',
                'stripe_session_id',
                'amount',
                'paid_at',
            ]);
        });
    }
};

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
        Schema::table('destinations', function (Blueprint $table) {
            $table->string('country')->nullable();
            $table->string('state_province')->nullable();
            $table->string('city')->nullable();
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn(['country', 'state_province', 'city']);
            // Note: location_id column was already removed in the up() method
            // and locations table was dropped, so we can't recreate the foreign key
        });
    }
};
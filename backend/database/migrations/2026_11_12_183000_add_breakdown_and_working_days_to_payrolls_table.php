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
        if (Schema::hasTable('payrolls')) {
            Schema::table('payrolls', function (Blueprint $table) {
                if (!Schema::hasColumn('payrolls', 'working_days')) {
                    $table->unsignedSmallInteger('working_days')->default(0)->after('total_days');
                }
                if (!Schema::hasColumn('payrolls', 'late_count')) {
                    $table->unsignedSmallInteger('late_count')->default(0)->after('absent_days');
                }
                if (!Schema::hasColumn('payrolls', 'late_cut_days')) {
                    $table->decimal('late_cut_days', 4, 2)->default(0)->after('late_count');
                }
                if (!Schema::hasColumn('payrolls', 'late_deductions')) {
                    $table->decimal('late_deductions', 10, 2)->default(0)->after('deduction');
                }
                if (!Schema::hasColumn('payrolls', 'absence_deductions')) {
                    $table->decimal('absence_deductions', 10, 2)->default(0)->after('late_deductions');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('payrolls')) {
            Schema::table('payrolls', function (Blueprint $table) {
                $cols = ['working_days', 'late_count', 'late_cut_days', 'late_deductions', 'absence_deductions'];
                foreach ($cols as $col) {
                    if (Schema::hasColumn('payrolls', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }
    }
};


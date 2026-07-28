<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('expenses') && !Schema::hasColumn('expenses', 'project_id')) {
            Schema::table('expenses', function (Blueprint $table) {
                $table->unsignedBigInteger('project_id')->nullable()->after('business_id');
                $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
                $table->index('project_id');
            });
        }

        if (Schema::hasTable('attendances') && !Schema::hasColumn('attendances', 'project_id')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->unsignedBigInteger('project_id')->nullable()->after('user_id');
                $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
                $table->index('project_id');
            });
        }

        if (Schema::hasTable('payrolls') && !Schema::hasColumn('payrolls', 'project_id')) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->unsignedBigInteger('project_id')->nullable()->after('user_id');
                $table->foreign('project_id')->references('id')->on('projects')->nullOnDelete();
                $table->index('project_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('expenses') && Schema::hasColumn('expenses', 'project_id')) {
            Schema::table('expenses', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            });
        }

        if (Schema::hasTable('attendances') && Schema::hasColumn('attendances', 'project_id')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            });
        }

        if (Schema::hasTable('payrolls') && Schema::hasColumn('payrolls', 'project_id')) {
            Schema::table('payrolls', function (Blueprint $table) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            });
        }
    }
};

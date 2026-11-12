<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Payroll extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'user_id',
        'month',
        'total_days',
        'working_days',
        'present_days',
        'absent_days',
        'late_count',
        'late_cut_days',
        'half_days',
        'paid_leaves',
        'unpaid_leaves',
        'week_offs',
        'holidays',
        'base_salary',
        'per_day_salary',
        'deduction',
        'late_deductions',
        'absence_deductions',
        'total_commission',
        'total_overtime_hours',
        'total_overtime_amount',
        'bonus',
        'advance_deduction',
        'salary_components',
        'salary_type',
        'final_salary',
        'notes',
        'status',
        'paid_date',
    ];

    protected $casts = [
        'working_days' => 'integer',
        'late_count' => 'integer',
        'late_cut_days' => 'float',
        'late_deductions' => 'float',
        'absence_deductions' => 'float',
        'base_salary' => 'float',
        'per_day_salary' => 'float',
        'deduction' => 'float',
        'total_commission' => 'float',
        'total_overtime_hours' => 'float',
        'total_overtime_amount' => 'float',
        'bonus' => 'float',
        'advance_deduction' => 'float',
        'final_salary' => 'float',
        'salary_components' => 'array',
        'paid_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

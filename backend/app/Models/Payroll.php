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
        'deductions_breakdown',
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
        'deductions_breakdown' => 'array',
        'paid_date' => 'date',
    ];

    protected $appends = [
        'deductions_breakdown',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detailed breakdown of each deduction item with specific name, formula reason, and amount.
     */
    public function getDeductionsBreakdownAttribute(): array
    {
        // 1. If stored explicitly in database, use it
        $stored = $this->attributes['deductions_breakdown'] ?? null;
        if (!empty($stored)) {
            $decoded = is_string($stored) ? json_decode($stored, true) : $stored;
            if (is_array($decoded) && count($decoded) > 0) {
                return $decoded;
            }
        }

        // 2. Otherwise dynamically derive rich breakdown from payroll data
        $breakdown = [];

        // A. Salary Components (PF, PT, TDS, Insurance, etc.)
        if (is_array($this->salary_components)) {
            foreach ($this->salary_components as $comp) {
                if (is_array($comp) && ($comp['type'] ?? '') === 'deduction' && (float)($comp['amount'] ?? 0) > 0) {
                    $breakdown[] = [
                        'type'   => 'component',
                        'name'   => $comp['name'] ?? 'Salary Component Deduction',
                        'reason' => ($comp['name'] ?? 'Component') . ' deduction as per salary structure',
                        'amount' => round((float) $comp['amount'], 2),
                    ];
                }
            }
        }

        // B. Unapproved Absence Penalty (Loss of Pay)
        $absenceTotal = (float) ($this->absence_deductions ?? ((float)($this->deduction ?? 0) - (float)($this->late_deductions ?? 0)));
        if ($absenceTotal > 0) {
            $absDays = (float) ($this->absent_days ?? 0);
            $hDays = (float) ($this->half_days ?? 0);
            $unpaidL = (float) ($this->unpaid_leaves ?? 0);
            $pRate = (float) ($this->per_day_salary ?? 0);

            $reasonParts = [];
            if ($absDays > 0) {
                $reasonParts[] = "{$absDays} unauthorized absent " . ($absDays > 1 ? 'days' : 'day') . " (voluntary absence penalty applied)";
            }
            if ($hDays > 0) {
                $reasonParts[] = "{$hDays} half " . ($hDays > 1 ? 'days' : 'day') . " (0.5 day wage cut)";
            }
            if ($unpaidL > 0) {
                $reasonParts[] = "{$unpaidL} unpaid " . ($unpaidL > 1 ? 'leaves' : 'leave') . " (loss of pay)";
            }

            $reasonText = !empty($reasonParts) 
                ? implode(' • ', $reasonParts) 
                : 'Unapproved voluntary absences & unpaid leaves (Loss of Pay)';

            $breakdown[] = [
                'type'   => 'unapproved_absence',
                'name'   => 'Absence Deductions (Loss of Pay)',
                'reason' => $reasonText,
                'days'   => $absDays + ($hDays * 0.5) + $unpaidL,
                'rate'   => $pRate,
                'amount' => round($absenceTotal, 2),
            ];
        }

        // C. Late Arrival Penalty
        $lateTotal = (float) ($this->late_deductions ?? 0);
        $lateCut = (float) ($this->late_cut_days ?? 0);
        $lateCount = (int) ($this->late_count ?? 0);

        if ($lateTotal > 0 || $lateCut > 0) {
            $reason = "{$lateCount} late arrivals recorded";
            if ($lateCut > 0) {
                $reason .= " ({$lateCut} day salary cut triggered by late policy)";
            }
            $breakdown[] = [
                'type'   => 'late_arrival',
                'name'   => 'Late Arrival Penalty',
                'reason' => $reason,
                'days'   => $lateCut,
                'amount' => round($lateTotal, 2),
            ];
        }

        // D. Salary Advance / Loan Recovery
        $advTotal = (float) ($this->advance_deduction ?? 0);
        if ($advTotal > 0) {
            $breakdown[] = [
                'type'   => 'advance',
                'name'   => 'Salary Advance Recovered',
                'reason' => 'Monthly recovery towards salary advance disbursement',
                'amount' => round($advTotal, 2),
            ];
        }

        return $breakdown;
    }
}

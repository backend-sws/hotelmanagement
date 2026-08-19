<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Project extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'name',
        'project_code',
        'client_name',
        'client_phone',
        'site_address',
        'city',
        'start_date',
        'end_date',
        'contract_value',
        'status',
        'description',
        'notes',
        'location_id',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'contract_value' => 'decimal:2',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(BusinessLocation::class, 'location_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function materialConsumptions(): HasMany
    {
        return $this->hasMany(MaterialConsumption::class);
    }

    public function boqTemplates(): HasMany
    {
        return $this->hasMany(BoqTemplate::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Expense extends Model
{
    use SoftDeletes, BelongsToBusiness, LogsActivity;

    protected $fillable = [
        'business_id',
        'project_id',
        'category',
        'amount',
        'description',
        'receipt_path',
        'added_by',
        'expense_date'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
    ];

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}

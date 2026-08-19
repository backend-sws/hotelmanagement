<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Unit extends Model
{
    use HasFactory, BelongsToBusiness, LogsActivity;

    protected $fillable = ['business_id', 'name'];
}

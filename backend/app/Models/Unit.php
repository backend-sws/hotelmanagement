<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToBusiness;

class Unit extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = ['business_id', 'name'];
}

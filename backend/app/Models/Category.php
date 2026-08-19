<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\BelongsToBusiness;
use App\Traits\LogsActivity;

class Category extends Model
{
    use BelongsToBusiness, SoftDeletes, LogsActivity;

    protected $fillable = ['business_id', 'name'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

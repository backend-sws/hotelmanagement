<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\BusinessPayment;
use App\Models\Business;
use Illuminate\Support\Facades\DB;

class SuperadminSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = BusinessPayment::with(['business', 'plan'])->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('business_id')) {
            $query->where('business_id', $request->business_id);
        }

        return response()->json($query->paginate(20));
    }
}

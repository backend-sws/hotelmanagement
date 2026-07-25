<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Services\InvoiceNumberService;
use Illuminate\Http\Request;

class DebitNoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'debit_note');

        return response()->json(['data' => $query->orderBy('id', 'desc')->paginate(20)]);
    }

    public function show($id, Request $request)
    {
        $dn = Sale::with(['items.product', 'customer', 'user'])
            ->where('business_id', app('current_business_id'))
            ->where('invoice_type', 'debit_note')
            ->findOrFail($id);

        return response()->json(['data' => $dn]);
    }
}

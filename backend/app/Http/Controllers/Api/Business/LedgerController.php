<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Services\LedgerService;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function customerStatement(Request $request, $id)
    {
        $statement = $this->ledgerService->getStatement(
            'customer', 
            (int) $id, 
            $request->input('from_date'), 
            $request->input('to_date')
        );

        return response()->json(['data' => $statement]);
    }

    public function supplierStatement(Request $request, $id)
    {
        $statement = $this->ledgerService->getStatement(
            'supplier', 
            (int) $id, 
            $request->input('from_date'), 
            $request->input('to_date')
        );

        return response()->json(['data' => $statement]);
    }

    public function customerBalance($id)
    {
        $balance = $this->ledgerService->getBalance('customer', (int) $id);
        $outstanding = $this->ledgerService->getOutstanding('customer', (int) $id);
        
        return response()->json([
            'party_id' => (int) $id,
            'balance' => round($balance, 2),
            'outstanding' => round($outstanding, 2)
        ]);
    }

    public function supplierBalance($id)
    {
        $balance = $this->ledgerService->getBalance('supplier', (int) $id);
        $outstanding = $this->ledgerService->getOutstanding('supplier', (int) $id);
        
        return response()->json([
            'party_id' => (int) $id,
            'balance' => round($balance, 2),
            'outstanding' => round($outstanding, 2)
        ]);
    }

    public function customerStatementPdf($id, Request $request)
    {
        $statement = $this->ledgerService->getStatement(
            'customer', 
            (int) $id, 
            $request->input('from_date'), 
            $request->input('to_date')
        );

        return response()->json([
            'message' => 'Customer account statement PDF ready.',
            'data' => $statement,
            'download_url' => url("/api/v1/business/ledger/customer/{$id}?format=pdf")
        ]);
    }

    public function supplierStatementPdf($id, Request $request)
    {
        $statement = $this->ledgerService->getStatement(
            'supplier', 
            (int) $id, 
            $request->input('from_date'), 
            $request->input('to_date')
        );

        return response()->json([
            'message' => 'Supplier account statement PDF ready.',
            'data' => $statement,
            'download_url' => url("/api/v1/business/ledger/supplier/{$id}?format=pdf")
        ]);
    }
}

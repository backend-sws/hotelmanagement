<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BankAccountController extends Controller
{
    public function index(Request $request)
    {
        $businessId = $request->user()->business_id;
        $accounts = BankAccount::where('business_id', $businessId)
            ->orderBy('is_default', 'desc')
            ->orderBy('account_name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $accounts,
            'total_bank_balance' => $accounts->sum('current_balance')
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
            'bank_name' => 'required|string|max:100',
            'branch' => 'nullable|string|max:100',
            'opening_balance' => 'nullable|numeric',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $businessId = $request->user()->business_id;
        $isDefault = $request->boolean('is_default', false);
        $openingBalance = $request->input('opening_balance', 0);

        if ($isDefault || BankAccount::where('business_id', $businessId)->count() === 0) {
            BankAccount::where('business_id', $businessId)->update(['is_default' => false]);
            $isDefault = true;
        }

        $account = BankAccount::create([
            'business_id' => $businessId,
            'account_name' => $request->input('account_name'),
            'account_number' => $request->input('account_number'),
            'ifsc_code' => $request->input('ifsc_code'),
            'bank_name' => $request->input('bank_name'),
            'branch' => $request->input('branch'),
            'opening_balance' => $openingBalance,
            'current_balance' => $openingBalance,
            'is_default' => $isDefault,
        ]);

        return response()->json(['status' => 'success', 'data' => $account, 'message' => 'Bank account created successfully'], 201);
    }

    public function show(Request $request, $id)
    {
        $account = BankAccount::where('business_id', $request->user()->business_id)->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $account]);
    }

    public function update(Request $request, $id)
    {
        $account = BankAccount::where('business_id', $request->user()->business_id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'account_name' => 'sometimes|required|string|max:100',
            'account_number' => 'sometimes|required|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
            'bank_name' => 'sometimes|required|string|max:100',
            'branch' => 'nullable|string|max:100',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $businessId = $request->user()->business_id;
        if ($request->has('is_default') && $request->boolean('is_default')) {
            BankAccount::where('business_id', $businessId)->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $account->update($request->only([
            'account_name', 'account_number', 'ifsc_code', 'bank_name', 'branch', 'is_default'
        ]));

        return response()->json(['status' => 'success', 'data' => $account, 'message' => 'Bank account updated successfully']);
    }

    public function destroy(Request $request, $id)
    {
        $account = BankAccount::where('business_id', $request->user()->business_id)->findOrFail($id);
        
        // Don't delete if default and there are other accounts, or just set another as default
        $account->delete();

        $businessId = $request->user()->business_id;
        if (!BankAccount::where('business_id', $businessId)->where('is_default', true)->exists()) {
            BankAccount::where('business_id', $businessId)->first()?->update(['is_default' => true]);
        }

        return response()->json(['status' => 'success', 'message' => 'Bank account removed']);
    }
}

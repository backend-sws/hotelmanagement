<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\HotelCorporateAccount;
use App\Models\HotelCorporatePayment;
use App\Models\HotelBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HotelCorporateController extends BaseController
{
    public function index(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelCorporateAccount::where('business_id', $businessId)->get();
        });
    }

    public function store(Request $request)
    {
        return $this->executeAction(function () use ($request) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $data = $request->validate([
                'company_name' => 'required|string',
                'gst_number' => 'nullable|string',
                'credit_limit' => 'required|numeric',
                'billing_cycle' => 'required|in:weekly,fortnightly,monthly',
                'credit_days' => 'required|integer',
                'discount_percent' => 'nullable|numeric',
                'contact_person' => 'nullable|string',
                'contact_phone' => 'nullable|string',
                'contact_email' => 'nullable|email',
            ]);

            $data['business_id'] = $businessId;
            return HotelCorporateAccount::create($data);
        });
    }

    public function show(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            return HotelCorporateAccount::where('business_id', $businessId)->findOrFail($id);
        });
    }

    public function update(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $account = HotelCorporateAccount::where('business_id', $businessId)->findOrFail($id);
            
            $data = $request->validate([
                'company_name' => 'sometimes|string',
                'gst_number' => 'nullable|string',
                'credit_limit' => 'sometimes|numeric',
                'billing_cycle' => 'sometimes|in:weekly,fortnightly,monthly',
                'credit_days' => 'sometimes|integer',
                'discount_percent' => 'nullable|numeric',
                'contact_person' => 'nullable|string',
                'contact_phone' => 'nullable|string',
                'contact_email' => 'nullable|email',
                'status' => 'sometimes|in:active,suspended,expired'
            ]);

            $account->update($data);
            return $account;
        });
    }

    public function destroy(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $account = HotelCorporateAccount::where('business_id', $businessId)->findOrFail($id);
            $account->delete();
            return ['message' => 'Account deleted successfully'];
        });
    }

    public function statement(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            $account = HotelCorporateAccount::where('business_id', $businessId)->findOrFail($id);
            
            // Get all bookings (debits) where booking_source is 'corporate' and company matches?
            // Actually, we should ideally have a corporate_account_id on bookings. 
            // Since we don't right now, we can match by name or just fetch payments for now.
            // Let's assume booking notes or corporate_account_id exists. If not, we just show payments.
            // For now, let's fetch payments (credits)
            $payments = HotelCorporatePayment::where('hotel_corporate_account_id', $account->id)
                            ->orderBy('payment_date', 'desc')
                            ->get();

            return [
                'account' => $account,
                'payments' => $payments,
            ];
        });
    }

    public function recordPayment(Request $request, $id)
    {
        return $this->executeAction(function () use ($request, $id) {
            $businessId = app('current_business_id') ?? $request->user()->business_id;
            
            $data = $request->validate([
                'amount' => 'required|numeric|min:1',
                'payment_date' => 'required|date',
                'payment_mode' => 'required|in:bank_transfer,cheque,upi,neft,rtgs,cash',
                'transaction_ref' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            return DB::transaction(function () use ($id, $businessId, $data) {
                $account = HotelCorporateAccount::where('business_id', $businessId)->lockForUpdate()->findOrFail($id);
                
                $payment = $account->payments()->create($data);
                
                // Deduct from current outstanding
                $account->current_outstanding -= $data['amount'];
                $account->save();
                
                return $payment;
            });
        });
    }
}

<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\BusinessPayment;
use App\Models\Plan;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function history(Request $request)
    {
        $business = app('tenant');
        
        $payments = BusinessPayment::with('plan')
            ->where('business_id', $business->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json($payments);
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        $business = app('tenant');
        $plan = Plan::findOrFail($request->plan_id);

        $amount = $request->billing_cycle === 'yearly' ? $plan->price_yearly : $plan->price_monthly;
        
        // If amount is 0 (e.g. Free plan), just upgrade directly
        if ($amount <= 0) {
            $business->plan_id = $plan->id;
            $business->plan_expires_at = null; // lifetime free
            $business->save();

            BusinessPayment::create([
                'business_id' => $business->id,
                'plan_id' => $plan->id,
                'amount' => 0,
                'billing_cycle' => 'lifetime',
                'status' => 'successful',
                'plan_start_date' => now(),
            ]);

            return response()->json(['success' => true, 'message' => 'Upgraded to free plan']);
        }

        try {
            $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
            
            // Amount in paise
            $amountInPaise = intval($amount * 100);

            $order = $api->order->create([
                'receipt' => 'order_rcptid_' . uniqid(),
                'amount' => $amountInPaise,
                'currency' => 'INR'
            ]);

            $payment = BusinessPayment::create([
                'business_id' => $business->id,
                'plan_id' => $plan->id,
                'amount' => $amount,
                'billing_cycle' => $request->billing_cycle,
                'razorpay_order_id' => $order['id'],
                'status' => 'pending',
            ]);

            return response()->json([
                'order_id' => $order['id'],
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'payment_id' => $payment->id,
                'key' => env('RAZORPAY_KEY')
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not create order'], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required'
        ]);

        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        try {
            $attributes = array(
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            );

            $api->utility->verifyPaymentSignature($attributes);
        } catch (\Exception $e) {
            Log::error('Signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Payment verification failed'], 400);
        }

        $payment = BusinessPayment::where('razorpay_order_id', $request->razorpay_order_id)->firstOrFail();
        
        if ($payment->status === 'successful') {
            return response()->json(['success' => true]);
        }

        $payment->status = 'successful';
        $payment->razorpay_payment_id = $request->razorpay_payment_id;
        $payment->razorpay_signature = $request->razorpay_signature;
        
        $payment->plan_start_date = now();
        $payment->plan_end_date = $payment->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth();
        
        $payment->save();

        $business = app('tenant');
        $business->plan_id = $payment->plan_id;
        $business->plan_expires_at = $payment->plan_end_date;
        $business->save();

        return response()->json(['success' => true]);
    }

    public function invoicePdf(Request $request, $paymentId)
    {
        $business = app('tenant');
        $payment = BusinessPayment::with('plan')->where('business_id', $business->id)->findOrFail($paymentId);

        if ($payment->status !== 'successful') {
            return response()->json(['error' => 'Payment is not successful'], 400);
        }

        $data = [
            'payment' => $payment,
            'business' => $business,
            'date' => Carbon::parse($payment->created_at)->format('d M Y'),
        ];

        // For now, returning simple HTML. In production, we'll use PDF view.
        $pdf = Pdf::loadHTML('
            <h1>Subscription Invoice</h1>
            <p><strong>Business:</strong> ' . $business->name . '</p>
            <p><strong>Plan:</strong> ' . $payment->plan->name . '</p>
            <p><strong>Amount:</strong> Rs. ' . $payment->amount . '</p>
            <p><strong>Status:</strong> ' . $payment->status . '</p>
            <p><strong>Order ID:</strong> ' . $payment->razorpay_order_id . '</p>
            <p><strong>Payment ID:</strong> ' . $payment->razorpay_payment_id . '</p>
        ');

        return $pdf->download('subscription_invoice_' . $payment->id . '.pdf');
    }
}

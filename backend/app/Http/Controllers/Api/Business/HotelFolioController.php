<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\HotelBooking;
use App\Models\HotelFolioCharge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HotelFolioController extends Controller
{
    public function store(Request $request, $bookingId)
    {
        $booking = HotelBooking::findOrFail($bookingId);

        if ($booking->status === 'checked_out' || $booking->status === 'cancelled') {
            return response()->json(['message' => 'Cannot add charges to closed bookings'], 400);
        }

        $validated = $request->validate([
            'charge_type' => 'required|in:room_rent,room_service,restaurant,laundry,minibar,telephone,spa,extra_bed,early_checkin,late_checkout,cancellation_fee,other',
            'description' => 'required|string|max:255',
            'charge_date' => 'required|date',
            'qty' => 'required|numeric|min:0.1',
            'unit_price' => 'required|numeric|min:0',
            'tax_percent' => 'nullable|numeric|min:0'
        ]);

        $qty = $validated['qty'];
        $unitPrice = $validated['unit_price'];
        $taxPercent = $validated['tax_percent'] ?? 0;

        $totalPrice = $qty * $unitPrice;
        $taxAmount = ($totalPrice * $taxPercent) / 100;
        $grandTotal = $totalPrice + $taxAmount;

        return DB::transaction(function () use ($booking, $validated, $totalPrice, $taxAmount, $grandTotal) {
            $charge = $booking->folioCharges()->create([
                'charge_type' => $validated['charge_type'],
                'description' => $validated['description'],
                'charge_date' => $validated['charge_date'],
                'qty' => $validated['qty'],
                'unit_price' => $validated['unit_price'],
                'total_price' => $totalPrice,
                'tax_percent' => $validated['tax_percent'] ?? 0,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
                'posted_by' => auth()->id()
            ]);

            // Update booking totals
            $booking->total_extra_charges += $totalPrice;
            $booking->total_taxes += $taxAmount;
            $booking->grand_total += $grandTotal;
            $booking->balance_due = $booking->grand_total - $booking->amount_paid;
            $booking->save();

            return response()->json($charge, 201);
        });
    }

    public function destroy($bookingId, $chargeId)
    {
        $booking = HotelBooking::findOrFail($bookingId);

        if ($booking->status === 'checked_out' || $booking->status === 'cancelled') {
            return response()->json(['message' => 'Cannot modify charges in closed bookings'], 400);
        }

        $charge = HotelFolioCharge::where('booking_id', $bookingId)->findOrFail($chargeId);

        return DB::transaction(function () use ($booking, $charge) {
            // Revert totals
            $booking->total_extra_charges -= $charge->total_price;
            $booking->total_taxes -= $charge->tax_amount;
            $booking->grand_total -= $charge->grand_total;
            $booking->balance_due = $booking->grand_total - $booking->amount_paid;
            $booking->save();

            $charge->delete();

            return response()->json(['message' => 'Charge removed successfully']);
        });
    }
}

<?php

namespace App\Services\Business;

use App\Models\HotelBooking;
use App\Models\HotelRoom;
use App\Models\HotelGuest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HotelBookingService
{
    public function getBookings(int $businessId, array $filters = [], int $perPage = 50)
    {
        return HotelBooking::with(['guest', 'room.roomType'])
            ->where('business_id', $businessId)
            ->when(!empty($filters['status']), function ($q) use ($filters) {
                $status = $filters['status'];
                if ($status === 'active') {
                    $q->whereIn('status', ['confirmed', 'checked_in']);
                } else {
                    $q->where('status', $status);
                }
            })
            ->when(!empty($filters['date']), function ($q) use ($filters) {
                $date = $filters['date'];
                $q->where('check_in_date', '<=', $date)
                  ->where('check_out_date', '>', $date);
            })
            ->latest()
            ->paginate($perPage);
    }

    public function getBooking(int $bookingId, int $businessId): HotelBooking
    {
        return HotelBooking::where('business_id', $businessId)
            ->with(['guest', 'room.roomType', 'payments', 'folioCharges'])
            ->findOrFail($bookingId);
    }

    public function createBooking(int $businessId, array $data, ?int $userId = null): HotelBooking
    {
        return DB::transaction(function () use ($businessId, $data, $userId) {
            // 1. Guest Handling
            $guestId = $data['guest_id'] ?? null;
            if (!$guestId) {
                $guestData = $data['guest'];
                $guestData['business_id'] = $businessId;
                if (!empty($guestData['phone'])) {
                    $existingGuest = HotelGuest::where('business_id', $businessId)->where('phone', $guestData['phone'])->first();
                    if ($existingGuest) {
                        $guestId = $existingGuest->id;
                    } else {
                        $guest = HotelGuest::create($guestData);
                        $guestId = $guest->id;
                    }
                } else {
                    $guest = HotelGuest::create($guestData);
                    $guestId = $guest->id;
                }
            }

            // 2. Dates & Calculations
            $checkIn = Carbon::parse($data['check_in_date']);
            $checkOut = Carbon::parse($data['check_out_date']);
            $totalNights = max(1, (int) $checkIn->diffInDays($checkOut));
            $totalRoomCharges = floatval($data['room_rate_per_night']) * $totalNights;

            // 3. Generate Booking Number
            $prefix = 'BK-' . date('Ymd') . '-';
            $lastBooking = HotelBooking::where('business_id', $businessId)
                ->where('booking_number', 'like', $prefix . '%')
                ->orderBy('id', 'desc')
                ->first();

            $nextNum = 1;
            if ($lastBooking) {
                $parts = explode('-', $lastBooking->booking_number);
                $nextNum = intval(end($parts)) + 1;
            }
            $bookingNumber = $prefix . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

            $status = $data['status'] ?? 'confirmed';
            $amountPaid = floatval($data['advance_payment'] ?? 0);

            // 4. Create Record
            $booking = HotelBooking::create([
                'business_id' => $businessId,
                'booking_number' => $bookingNumber,
                'booking_source' => $data['booking_source'] ?? 'direct',
                'guest_id' => $guestId,
                'room_id' => $data['room_id'],
                'check_in_date' => $checkIn,
                'check_out_date' => $checkOut,
                'actual_check_in_at' => $status === 'checked_in' ? now() : null,
                'total_nights' => $totalNights,
                'adults' => $data['adults'] ?? 1,
                'children' => $data['children'] ?? 0,
                'room_rate_per_night' => $data['room_rate_per_night'],
                'total_room_charges' => $totalRoomCharges,
                'grand_total' => $totalRoomCharges,
                'amount_paid' => $amountPaid,
                'balance_due' => max(0, $totalRoomCharges - $amountPaid),
                'status' => $status,
                'notes' => $data['notes'] ?? null,
                'special_requests' => $data['special_requests'] ?? null,
                'created_by' => $userId,
            ]);

            // 5. Update Room Status
            $room = HotelRoom::find($data['room_id']);
            if ($room) {
                $room->status = $status === 'checked_in' ? 'occupied' : 'reserved';
                $room->save();
            }

            // 6. Record Advance Payments (Split or Single)
            $splitPayments = $data['split_payments'] ?? [];
            if (!empty($splitPayments) && is_array($splitPayments)) {
                foreach ($splitPayments as $sp) {
                    if (isset($sp['amount']) && floatval($sp['amount']) > 0) {
                        $booking->payments()->create([
                            'amount' => floatval($sp['amount']),
                            'payment_mode' => $sp['payment_mode'] ?? 'cash',
                            'collected_by' => $userId,
                            'notes' => 'Advance Split Payment',
                        ]);
                    }
                }
            } elseif ($amountPaid > 0) {
                $booking->payments()->create([
                    'amount' => $amountPaid,
                    'payment_mode' => $data['payment_mode'] ?? 'cash',
                    'collected_by' => $userId,
                    'notes' => 'Advance Payment',
                ]);
            }

            return $booking->load(['guest', 'room.roomType', 'payments']);
        });
    }

    public function updateBooking(int $bookingId, int $businessId, array $data): HotelBooking
    {
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        return DB::transaction(function () use ($booking, $data) {
            $oldRoomId = $booking->room_id;
            $oldStatus = $booking->status;

            $booking->fill(array_filter($data, fn($v) => !is_null($v)));

            if (isset($data['check_in_date']) || isset($data['check_out_date']) || isset($data['room_rate_per_night'])) {
                $checkIn = Carbon::parse($booking->check_in_date);
                $checkOut = Carbon::parse($booking->check_out_date);
                $booking->total_nights = max(1, (int) $checkIn->diffInDays($checkOut));
                $booking->total_room_charges = $booking->room_rate_per_night * $booking->total_nights;
                $booking->grand_total = $booking->total_room_charges + $booking->total_extra_charges;
                $booking->balance_due = max(0, $booking->grand_total - $booking->amount_paid);
            }

            $booking->save();

            if ($oldRoomId !== $booking->room_id || $oldStatus !== $booking->status) {
                if ($oldRoomId !== $booking->room_id) {
                    $oldRoom = HotelRoom::find($oldRoomId);
                    if ($oldRoom) {
                        $oldRoom->status = 'available';
                        $oldRoom->save();
                    }
                }

                $newRoom = HotelRoom::find($booking->room_id);
                if ($newRoom) {
                    if ($booking->status === 'checked_in') {
                        $newRoom->status = 'occupied';
                    } elseif ($booking->status === 'confirmed') {
                        $newRoom->status = 'reserved';
                    } elseif (in_array($booking->status, ['cancelled', 'no_show'])) {
                        $newRoom->status = 'available';
                    }
                    $newRoom->save();
                }
            }

            return $booking->load(['guest', 'room.roomType', 'payments', 'folioCharges']);
        });
    }

    public function addPayment(int $bookingId, int $businessId, array $data, ?int $userId = null): HotelBooking
    {
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        return DB::transaction(function () use ($booking, $data, $userId) {
            $totalAdded = 0;
            $splitPayments = $data['split_payments'] ?? [];

            if (!empty($splitPayments) && is_array($splitPayments)) {
                foreach ($splitPayments as $sp) {
                    $amt = floatval($sp['amount'] ?? 0);
                    if ($amt > 0) {
                        $booking->payments()->create([
                            'amount' => $amt,
                            'payment_mode' => $sp['payment_mode'] ?? 'cash',
                            'collected_by' => $userId,
                            'notes' => $data['notes'] ?? 'Payment Collection',
                        ]);
                        $totalAdded += $amt;
                    }
                }
            } else {
                $amt = floatval($data['amount'] ?? 0);
                if ($amt > 0) {
                    $booking->payments()->create([
                        'amount' => $amt,
                        'payment_mode' => $data['payment_mode'] ?? 'cash',
                        'collected_by' => $userId,
                        'notes' => $data['notes'] ?? 'Payment Collection',
                    ]);
                    $totalAdded += $amt;
                }
            }

            $booking->amount_paid += $totalAdded;
            $booking->balance_due = max(0, $booking->grand_total - $booking->amount_paid);
            $booking->save();

            return $booking->fresh(['payments', 'folioCharges', 'guest', 'room']);
        });
    }

    public function checkIn(int $bookingId, int $businessId): HotelBooking
    {
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        if ($booking->status !== 'confirmed') {
            throw new \InvalidArgumentException('Only confirmed bookings can be checked in');
        }

        $booking->status = 'checked_in';
        $booking->actual_check_in_at = now();
        $booking->save();

        $room = HotelRoom::find($booking->room_id);
        if ($room) {
            $room->status = 'occupied';
            $room->save();
        }

        return $booking;
    }

    public function checkOut(int $bookingId, int $businessId, array $data, ?int $userId = null): HotelBooking
    {
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        if ($booking->status !== 'checked_in') {
            throw new \InvalidArgumentException('Only checked-in bookings can be checked out');
        }

        return DB::transaction(function () use ($booking, $data, $userId) {
            $paymentAmount = floatval($data['amount_paid'] ?? 0);
            if ($paymentAmount > 0) {
                $booking->payments()->create([
                    'amount' => $paymentAmount,
                    'payment_mode' => $data['payment_mode'] ?? 'cash',
                    'collected_by' => $userId,
                    'notes' => 'Checkout Final Settlement',
                ]);
                $booking->amount_paid += $paymentAmount;
            }

            $booking->status = 'checked_out';
            $booking->actual_check_out_at = now();
            $booking->balance_due = max(0, $booking->grand_total - $booking->amount_paid);
            $booking->save();

            $guest = $booking->guest;
            if ($guest) {
                $guest->increment('total_stays');
                $guest->total_spent += $booking->grand_total;
                $guest->save();
            }

            $room = HotelRoom::find($booking->room_id);
            if ($room) {
                $room->status = 'dirty';
                $room->save();
            }

            return $booking->fresh(['payments', 'guest', 'room']);
        });
    }

    public function cancelBooking(int $bookingId, int $businessId): bool
    {
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        return DB::transaction(function () use ($booking) {
            $booking->status = 'cancelled';
            $booking->save();

            $room = HotelRoom::find($booking->room_id);
            if ($room) {
                $room->status = 'available';
                $room->save();
            }

            return true;
        });
    }
}

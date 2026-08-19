<?php

namespace App\Services\Business;

use App\Models\HotelOutlet;
use App\Models\HotelService;
use App\Models\HotelPosOrder;
use App\Models\HotelPosOrderItem;
use App\Models\HotelFolioCharge;
use App\Models\HotelBooking;
use App\Models\HotelPosTable;
use App\Models\HotelTableReservation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HotelPosService
{
    // ─── Outlets ─────────────────────────────────────────────────────────────

    public function getOutlets(int $businessId): \Illuminate\Database\Eloquent\Collection
    {
        return HotelOutlet::where('business_id', $businessId)
            ->withCount('services')
            ->orderBy('name')
            ->get();
    }

    public function createOutlet(int $businessId, array $data): HotelOutlet
    {
        return HotelOutlet::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateOutlet(int $outletId, int $businessId, array $data): HotelOutlet
    {
        $outlet = HotelOutlet::where('business_id', $businessId)->findOrFail($outletId);
        $outlet->update($data);
        return $outlet;
    }

    public function deleteOutlet(int $outletId, int $businessId): bool
    {
        $outlet = HotelOutlet::where('business_id', $businessId)->findOrFail($outletId);
        return $outlet->delete();
    }

    // ─── Services / Menu ─────────────────────────────────────────────────────

    public function getServices(int $businessId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return HotelService::with('outlet')
            ->where('business_id', $businessId)
            ->when(!empty($filters['outlet_id']), fn($q) => $q->where('outlet_id', $filters['outlet_id']))
            ->when(!empty($filters['category']),  fn($q) => $q->where('category', $filters['category']))
            ->when(isset($filters['is_available']), fn($q) => $q->where('is_available', filter_var($filters['is_available'], FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function createService(int $businessId, array $data): HotelService
    {
        return HotelService::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateService(int $serviceId, int $businessId, array $data): HotelService
    {
        $service = HotelService::where('business_id', $businessId)->findOrFail($serviceId);
        $service->update($data);
        return $service->fresh('outlet');
    }

    public function deleteService(int $serviceId, int $businessId): bool
    {
        $service = HotelService::where('business_id', $businessId)->findOrFail($serviceId);
        return $service->delete();
    }

    // ─── POS Orders ──────────────────────────────────────────────────────────

    public function getOrders(int $businessId, array $filters = [], int $perPage = 30)
    {
        return HotelPosOrder::with(['outlet', 'booking.guest', 'items'])
            ->where('business_id', $businessId)
            ->when(!empty($filters['outlet_id']), fn($q) => $q->where('outlet_id', $filters['outlet_id']))
            ->when(!empty($filters['status']),    fn($q) => $q->where('status', $filters['status']))
            ->when(!empty($filters['date']),      fn($q) => $q->whereDate('created_at', $filters['date']))
            ->latest()
            ->paginate($perPage);
    }

    public function getOrder(int $orderId, int $businessId): HotelPosOrder
    {
        return HotelPosOrder::with(['outlet', 'booking.guest', 'items.service'])
            ->where('business_id', $businessId)
            ->findOrFail($orderId);
    }

    public function createOrder(int $businessId, array $data, ?int $userId = null): HotelPosOrder
    {
        return DB::transaction(function () use ($businessId, $data, $userId) {
            // 1. Generate order number
            $outlet = HotelOutlet::findOrFail($data['outlet_id']);
            $prefix = strtoupper(substr($outlet->outlet_type, 0, 3)) . '-' . date('Ymd') . '-';
            $lastOrder = HotelPosOrder::where('business_id', $businessId)
                ->where('order_number', 'like', $prefix . '%')
                ->orderByDesc('id')->first();
            $nextNum = $lastOrder ? intval(substr($lastOrder->order_number, -4)) + 1 : 1;
            $orderNumber = $prefix . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

            // 2. Calculate totals from items
            $items = $data['items'] ?? [];
            $subtotal = 0;
            $taxTotal = 0;

            $itemModels = [];
            foreach ($items as $item) {
                $service = HotelService::find($item['service_id'] ?? null);
                $qty        = floatval($item['qty'] ?? 1);
                $unitPrice  = floatval($item['unit_price'] ?? $service?->price ?? 0);
                $taxPercent = floatval($item['tax_percent'] ?? $service?->tax_percent ?? 0);
                $taxAmt     = round($unitPrice * $qty * ($taxPercent / 100), 2);
                $totalPrice = round($unitPrice * $qty + $taxAmt, 2);

                $subtotal += $unitPrice * $qty;
                $taxTotal += $taxAmt;

                $itemModels[] = [
                    'service_id'  => $item['service_id'] ?? null,
                    'name'        => $item['name'] ?? $service?->name ?? 'Item',
                    'category'    => $item['category'] ?? $service?->category ?? 'misc',
                    'qty'         => $qty,
                    'unit_price'  => $unitPrice,
                    'tax_percent' => $taxPercent,
                    'tax_amount'  => $taxAmt,
                    'total_price' => $totalPrice,
                    'notes'       => $item['notes'] ?? null,
                ];
            }

            $discount = floatval($data['discount_amount'] ?? 0);
            
            // Adjust for reservation deposit if applicable
            $depositApplied = 0;
            if (!empty($data['reservation_id'])) {
                $reservation = HotelTableReservation::where('business_id', $businessId)->find($data['reservation_id']);
                if ($reservation) {
                    $depositApplied = floatval($reservation->deposit_amount);
                    $reservation->update(['status' => 'seated']);
                }
            }
            
            $total = round($subtotal + $taxTotal - $discount - $depositApplied, 2);
            $total = max(0, $total); // Prevent negative totals if deposit > order

            // Update table status if dine_in
            if (!empty($data['table_id']) && ($data['order_type'] ?? 'dine_in') === 'dine_in') {
                HotelPosTable::where('id', $data['table_id'])->update(['status' => 'occupied']);
            }

            // 3. Create order
            $order = HotelPosOrder::create([
                'business_id'     => $businessId,
                'order_number'    => $orderNumber,
                'outlet_id'       => $data['outlet_id'],
                'booking_id'      => $data['booking_id'] ?? null,
                'table_no'        => $data['table_no'] ?? null,
                'table_id'        => $data['table_id'] ?? null,
                'reservation_id'  => $data['reservation_id'] ?? null,
                'guest_name'      => $data['guest_name'] ?? null,
                'guest_phone'     => $data['guest_phone'] ?? null,
                'order_type'      => $data['order_type'] ?? 'dine_in',
                'status'          => 'pending',
                'subtotal'        => $subtotal,
                'tax_amount'      => $taxTotal,
                'discount_amount' => $discount,
                'deposit_applied' => $depositApplied,
                'total'           => $total,
                'notes'           => $data['notes'] ?? null,
                'billed_by'       => $userId,
            ]);

            // 4. Create items
            foreach ($itemModels as $itemData) {
                $order->items()->create($itemData);
            }

            return $order->load(['outlet', 'items']);
        });
    }

    public function updateOrderStatus(int $orderId, int $businessId, string $status): HotelPosOrder
    {
        $order = HotelPosOrder::where('business_id', $businessId)->findOrFail($orderId);
        $order->status = $status;
        $order->save();
        return $order->load(['outlet', 'items']);
    }

    public function billOrder(int $orderId, int $businessId, array $data, ?int $userId = null): HotelPosOrder
    {
        $order = HotelPosOrder::with('items')->where('business_id', $businessId)->findOrFail($orderId);

        return DB::transaction(function () use ($order, $data, $userId) {
            $order->status       = 'billed';
            $order->payment_mode = $data['payment_mode'] ?? 'cash';
            $order->billed_by    = $userId;
            $order->billed_at    = now();
            $order->save();

            // Free the table
            if ($order->table_id) {
                HotelPosTable::where('id', $order->table_id)->update(['status' => 'available']);
            }
            if ($order->reservation_id) {
                HotelTableReservation::where('id', $order->reservation_id)->update(['status' => 'completed']);
            }

            $order->logActivity('billed', "Settled POS Order #{$order->order_number} for ₹" . number_format($order->total, 2) . " via " . strtoupper($order->payment_mode), [
                'order_number' => $order->order_number,
                'total' => $order->total,
                'payment_mode' => $order->payment_mode,
                'outlet_id' => $order->outlet_id,
            ]);

            return $order->fresh(['outlet', 'items']);
        });
    }

    public function postToRoom(int $orderId, int $businessId, int $bookingId, ?int $userId = null): HotelPosOrder
    {
        $order = HotelPosOrder::with('items')->where('business_id', $businessId)->findOrFail($orderId);
        $booking = HotelBooking::where('business_id', $businessId)->findOrFail($bookingId);

        return DB::transaction(function () use ($order, $booking, $userId) {
            // Post each item as a folio charge on the booking
            foreach ($order->items as $item) {
                HotelFolioCharge::create([
                    'booking_id'   => $booking->id,
                    'charge_type'  => 'restaurant',
                    'description'  => $item->name . ($item->notes ? " ({$item->notes})" : ''),
                    'charge_date'  => now()->toDateString(),
                    'qty'          => $item->qty,
                    'unit_price'   => $item->unit_price,
                    'total_price'  => $item->total_price,
                    'tax_percent'  => $item->tax_percent,
                    'tax_amount'   => $item->tax_amount,
                    'posted_by'    => $userId,
                ]);
            }

            // Update booking totals
            $booking->grand_total     += $order->total;
            $booking->balance_due     += $order->total;
            $booking->save();

            // Mark order
            $order->status    = 'billed';
            $order->order_type= 'post_to_room';
            $order->booking_id= $booking->id;
            $order->payment_mode = 'post_to_room';
            $order->billed_at = now();
            $order->save();

            $order->logActivity('post_to_room', "Posted POS Order #{$order->order_number} (₹" . number_format($order->total, 2) . ") to Room Folio for Booking #{$booking->booking_number}", [
                'order_number' => $order->order_number,
                'booking_id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'total' => $order->total,
            ]);

            return $order->fresh(['outlet', 'items']);
        });
    }

    public function markKotPrinted(int $orderId, int $businessId): HotelPosOrder
    {
        $order = HotelPosOrder::where('business_id', $businessId)->findOrFail($orderId);
        $order->kot_printed_at = now();
        $order->status = 'processing';
        $order->save();
        return $order;
    }

    // ─── Tables ─────────────────────────────────────────────────────────────

    public function getTables(int $businessId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return HotelPosTable::with('outlet')
            ->where('business_id', $businessId)
            ->when(!empty($filters['outlet_id']), fn($q) => $q->where('outlet_id', $filters['outlet_id']))
            ->when(!empty($filters['status']),    fn($q) => $q->where('status', $filters['status']))
            ->orderBy('name')
            ->get();
    }

    public function createTable(int $businessId, array $data): HotelPosTable
    {
        return HotelPosTable::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateTable(int $tableId, int $businessId, array $data): HotelPosTable
    {
        $table = HotelPosTable::where('business_id', $businessId)->findOrFail($tableId);
        $table->update($data);
        return $table;
    }

    public function deleteTable(int $tableId, int $businessId): bool
    {
        $table = HotelPosTable::where('business_id', $businessId)->findOrFail($tableId);
        return $table->delete();
    }

    // ─── Reservations ──────────────────────────────────────────────────────────

    public function getReservations(int $businessId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return HotelTableReservation::with(['outlet', 'table'])
            ->where('business_id', $businessId)
            ->when(!empty($filters['outlet_id']), fn($q) => $q->where('outlet_id', $filters['outlet_id']))
            ->when(!empty($filters['status']),    fn($q) => $q->where('status', $filters['status']))
            ->when(!empty($filters['date']),      fn($q) => $q->whereDate('reservation_time', $filters['date']))
            ->orderBy('reservation_time')
            ->get();
    }

    public function createReservation(int $businessId, array $data): HotelTableReservation
    {
        return DB::transaction(function () use ($businessId, $data) {
            $reservation = HotelTableReservation::create(array_merge($data, ['business_id' => $businessId]));
            HotelPosTable::where('id', $data['table_id'])->update(['status' => 'reserved']);
            return $reservation->load(['outlet', 'table']);
        });
    }

    public function updateReservation(int $reservationId, int $businessId, array $data): HotelTableReservation
    {
        $reservation = HotelTableReservation::where('business_id', $businessId)->findOrFail($reservationId);
        $reservation->update($data);
        
        if (in_array($data['status'], ['cancelled', 'completed', 'no_show'])) {
            HotelPosTable::where('id', $reservation->table_id)->update(['status' => 'available']);
        }
        
        return $reservation->load(['outlet', 'table']);
    }

    public function deleteReservation(int $reservationId, int $businessId): bool
    {
        $reservation = HotelTableReservation::where('business_id', $businessId)->findOrFail($reservationId);
        HotelPosTable::where('id', $reservation->table_id)->update(['status' => 'available']);
        return $reservation->delete();
    }
}

<?php

namespace App\Services\Business;

use App\Models\HotelGuest;

class HotelGuestService
{
    public function getGuests(int $businessId, array $filters = [], int $perPage = 20)
    {
        return HotelGuest::where('business_id', $businessId)
            ->when(!empty($filters['search']), function ($query) use ($filters) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }

    public function getGuest(int $guestId, int $businessId): HotelGuest
    {
        return HotelGuest::where('business_id', $businessId)
            ->with(['bookings.room.roomType'])
            ->findOrFail($guestId);
    }

    public function createGuest(int $businessId, array $data): HotelGuest
    {
        $data['business_id'] = $businessId;
        return HotelGuest::create($data);
    }

    public function updateGuest(int $guestId, int $businessId, array $data): HotelGuest
    {
        $guest = HotelGuest::where('business_id', $businessId)->findOrFail($guestId);
        $guest->update($data);
        return $guest;
    }

    public function deleteGuest(int $guestId, int $businessId): bool
    {
        $guest = HotelGuest::where('business_id', $businessId)->findOrFail($guestId);
        return $guest->delete();
    }
}

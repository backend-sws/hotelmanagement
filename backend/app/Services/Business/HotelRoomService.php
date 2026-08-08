<?php

namespace App\Services\Business;

use App\Models\HotelPropertySetting;
use App\Models\HotelRoomType;
use App\Models\HotelRoom;
use App\Models\HotelRatePlan;

class HotelRoomService
{
    // ───────────────────────────────────────────────
    // Property Settings
    // ───────────────────────────────────────────────

    public function getPropertySettings(int $businessId): HotelPropertySetting
    {
        return HotelPropertySetting::firstOrCreate(
            ['business_id' => $businessId],
            [
                'property_type'        => '3star',
                'total_rooms'          => 0,
                'check_in_time'        => '14:00:00',
                'check_out_time'       => '11:00:00',
                'default_gst_category' => 'ac_room',
            ]
        );
    }

    public function updatePropertySettings(int $businessId, array $data): HotelPropertySetting
    {
        return HotelPropertySetting::updateOrCreate(
            ['business_id' => $businessId],
            $data
        );
    }

    // ───────────────────────────────────────────────
    // Room Types
    // ───────────────────────────────────────────────

    public function getRoomTypes(int $businessId): \Illuminate\Database\Eloquent\Collection
    {
        return HotelRoomType::where('business_id', $businessId)
            ->withCount('rooms')
            ->orderBy('name')
            ->get();
    }

    public function createRoomType(int $businessId, array $data): HotelRoomType
    {
        return HotelRoomType::create(array_merge($data, ['business_id' => $businessId]));
    }

    public function updateRoomType(HotelRoomType $roomType, array $data): HotelRoomType
    {
        $roomType->update($data);
        return $roomType->loadCount('rooms');
    }

    public function deleteRoomType(HotelRoomType $roomType): void
    {
        if ($roomType->rooms()->exists()) {
            throw new \Exception('Cannot delete room type with existing rooms. Please reassign or delete rooms first.');
        }
        $roomType->delete();
    }

    // ───────────────────────────────────────────────
    // Rooms
    // ───────────────────────────────────────────────

    public function getRooms(int $businessId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = HotelRoom::where('business_id', $businessId)->with('roomType');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['room_type_id'])) {
            $query->where('room_type_id', $filters['room_type_id']);
        }
        if (!empty($filters['floor'])) {
            $query->where('floor', $filters['floor']);
        }
        if (!empty($filters['search'])) {
            $query->where('room_number', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderByRaw("CAST(room_number AS UNSIGNED), room_number")->get();
    }

    public function createRoom(int $businessId, array $data): HotelRoom
    {
        // Verify room_type belongs to this business
        HotelRoomType::where('business_id', $businessId)
            ->findOrFail($data['room_type_id']);

        if (HotelRoom::where('business_id', $businessId)
            ->where('room_number', $data['room_number'])->exists()) {
            throw new \Exception("Room number '{$data['room_number']}' already exists.");
        }

        $room = HotelRoom::create(array_merge($data, ['business_id' => $businessId]));
        return $room->load('roomType');
    }

    public function updateRoom(HotelRoom $room, array $data): HotelRoom
    {
        if (isset($data['room_number'])) {
            $dup = HotelRoom::where('business_id', $room->business_id)
                ->where('room_number', $data['room_number'])
                ->where('id', '!=', $room->id)
                ->exists();
            if ($dup) {
                throw new \Exception("Room number '{$data['room_number']}' already exists.");
            }
        }
        $room->update($data);
        return $room->load('roomType');
    }

    public function updateRoomStatus(HotelRoom $room, string $status, ?string $notes = null): HotelRoom
    {
        $room->update(array_filter(['status' => $status, 'notes' => $notes], fn($v) => $v !== null));
        return $room->load('roomType');
    }

    public function deleteRoom(HotelRoom $room): void
    {
        if (in_array($room->status, ['occupied', 'reserved'])) {
            throw new \Exception('Cannot delete an occupied or reserved room. Please check out the guest first.');
        }
        $room->delete();
    }

    // ───────────────────────────────────────────────
    // Rate Plans
    // ───────────────────────────────────────────────

    public function getRatePlans(int $businessId): \Illuminate\Database\Eloquent\Collection
    {
        return HotelRatePlan::where('business_id', $businessId)
            ->with('roomType:id,name,short_code')
            ->orderBy('start_date')
            ->get();
    }

    public function createRatePlan(int $businessId, array $data): HotelRatePlan
    {
        if (!empty($data['room_type_id'])) {
            HotelRoomType::where('business_id', $businessId)->findOrFail($data['room_type_id']);
        }
        $plan = HotelRatePlan::create(array_merge($data, ['business_id' => $businessId]));
        return $plan->load('roomType:id,name,short_code');
    }

    public function updateRatePlan(HotelRatePlan $plan, array $data): HotelRatePlan
    {
        $plan->update($data);
        return $plan->load('roomType:id,name,short_code');
    }

    public function deleteRatePlan(HotelRatePlan $plan): void
    {
        $plan->delete();
    }
}

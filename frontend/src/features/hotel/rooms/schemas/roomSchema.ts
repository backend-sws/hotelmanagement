import { z } from 'zod';

// ---------- Types ----------

export interface HotelPropertySetting {
  id: number;
  business_id: number;
  property_type: 'boutique' | 'budget' | 'resort' | '3star' | '4star' | '5star' | 'luxury';
  total_rooms: number;
  check_in_time: string;
  check_out_time: string;
  late_checkout_charge: number;
  early_checkin_charge: number;
  default_gst_category: 'ac_room' | 'non_ac_room' | 'luxury';
  city_ledger_enabled: boolean;
  footer_for_bills: string | null;
  gstin: string | null;
  is_gst_registered: boolean;
}

export interface HotelRoomType {
  id: number;
  business_id: number;
  name: string;
  short_code: string | null;
  base_price_weekday: number;
  base_price_weekend: number;
  base_price_peak: number;
  extra_person_charge: number;
  max_occupancy: number;
  amenities: string[] | null;
  description: string | null;
  display_image_url: string | null;
  is_active: boolean;
  rooms_count?: number;
}

export interface HotelRoom {
  id: number;
  business_id: number;
  room_number: string;
  floor: string | null;
  room_type_id: number;
  room_type?: HotelRoomType;
  is_ac: boolean;
  current_tariff: number;
  status: 'available' | 'occupied' | 'reserved' | 'dirty' | 'maintenance' | 'blocked';
  view_type: string;
  bed_type: string;
  max_occupancy: number | null;
  notes: string | null;
}

export interface HotelRatePlan {
  id: number;
  business_id: number;
  name: string;
  start_date: string;
  end_date: string;
  room_type_id: number | null;
  room_type?: Pick<HotelRoomType, 'id' | 'name' | 'short_code'>;
  modifier_type: 'fixed' | 'percentage';
  modifier_value: number;
  min_stay_nights: number;
  is_active: boolean;
  description: string | null;
}

// ---------- Zod Validation Schemas ----------

export const hotelRoomTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  short_code: z.string().max(10).optional().nullable(),
  base_price_weekday: z.number().min(0),
  base_price_weekend: z.number().min(0).optional().nullable(),
  base_price_peak: z.number().min(0).optional().nullable(),
  extra_person_charge: z.number().min(0).optional().nullable(),
  max_occupancy: z.number().min(1),
  amenities: z.array(z.string()).optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});
export type HotelRoomTypeFormValues = z.infer<typeof hotelRoomTypeSchema>;

export const hotelRoomSchema = z.object({
  room_number: z.string().min(1, 'Required').max(20),
  floor: z.string().max(50).optional().nullable(),
  room_type_id: z.number().min(1, 'Required'),
  is_ac: z.boolean().default(true),
  current_tariff: z.number().min(0).optional().nullable(),
  status: z.enum(['available', 'occupied', 'reserved', 'dirty', 'maintenance', 'blocked']).default('available'),
  view_type: z.string().optional().nullable(),
  bed_type: z.string().optional().nullable(),
  max_occupancy: z.number().min(1).optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type HotelRoomFormValues = z.infer<typeof hotelRoomSchema>;

export const hotelRatePlanSchema = z.object({
  name: z.string().min(2, 'Required').max(100),
  start_date: z.string().min(10, 'Required'), // YYYY-MM-DD
  end_date: z.string().min(10, 'Required'),
  room_type_id: z.number().nullable().optional(),
  modifier_type: z.enum(['fixed', 'percentage']),
  modifier_value: z.number(),
  min_stay_nights: z.number().min(1).default(1),
  is_active: z.boolean().default(true),
  description: z.string().optional().nullable(),
});
export type HotelRatePlanFormValues = z.infer<typeof hotelRatePlanSchema>;

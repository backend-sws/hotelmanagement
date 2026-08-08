import { z } from 'zod';
import { guestSchema } from '../../guests/schemas/guestSchema';
import { hotelRoomSchema } from '../../rooms/schemas/roomSchema';

export const folioChargeSchema = z.object({
  id: z.number().optional(),
  booking_id: z.number(),
  charge_type: z.enum([
    'room_rent', 'room_service', 'restaurant', 'laundry', 
    'minibar', 'telephone', 'spa', 'extra_bed', 'early_checkin', 
    'late_checkout', 'cancellation_fee', 'other'
  ]),
  description: z.string().min(1),
  charge_date: z.string(),
  qty: z.number().min(0.1),
  unit_price: z.number().min(0),
  total_price: z.number().optional(),
  tax_percent: z.number().optional().default(0),
  tax_amount: z.number().optional(),
  grand_total: z.number().optional(),
  posted_by: z.number().optional(),
  created_at: z.string().optional()
});

export const bookingPaymentSchema = z.object({
  id: z.number().optional(),
  booking_id: z.number(),
  amount: z.number(),
  payment_mode: z.enum(['cash', 'upi', 'card', 'bank_transfer', 'corporate']),
  transaction_ref: z.string().optional(),
  collected_by: z.number().optional(),
  notes: z.string().optional(),
  created_at: z.string().optional()
});

export const hotelBookingSchema = z.object({
  id: z.number().optional(),
  booking_number: z.string().optional(),
  booking_source: z.string(),
  guest_id: z.number().optional(),
  room_id: z.number(),
  check_in_date: z.string(),
  check_out_date: z.string(),
  actual_check_in_at: z.string().nullable().optional(),
  actual_check_out_at: z.string().nullable().optional(),
  total_nights: z.number().optional(),
  adults: z.number().min(1),
  children: z.number().optional().default(0),
  
  room_rate_per_night: z.number().min(0),
  total_room_charges: z.number().optional(),
  total_extra_charges: z.number().optional(),
  total_taxes: z.number().optional(),
  grand_total: z.number().optional(),
  amount_paid: z.number().optional(),
  balance_due: z.number().optional(),
  
  status: z.enum(['reserved', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']),
  notes: z.string().optional(),
  special_requests: z.string().optional(),
  
  guest: z.any().optional(),
  room: z.any().optional(),
  payments: z.array(z.any()).optional(),
  folio_charges: z.array(z.any()).optional(),
});

export type HotelFolioCharge = z.infer<typeof folioChargeSchema>;
export type HotelBookingPayment = z.infer<typeof bookingPaymentSchema>;
export type HotelBooking = z.infer<typeof hotelBookingSchema>;

// For creating new reservations:
export const newBookingFormSchema = z.object({
  guest_id: z.number().optional().nullable(),
  guest: guestSchema.partial().optional(), // New guest details if no guest_id
  room_id: z.number().min(1, 'Room is required'),
  check_in_date: z.string().min(1, 'Check-in is required'),
  check_out_date: z.string().min(1, 'Check-out is required'),
  adults: z.number().min(1),
  children: z.number().default(0),
  room_rate_per_night: z.number().min(0),
  booking_source: z.string().default('direct'),
  status: z.enum(['confirmed', 'checked_in']).default('confirmed'),
  advance_payment: z.number().optional(),
  payment_mode: z.string().optional(),
  notes: z.string().optional(),
  special_requests: z.string().optional(),
});

export type NewBookingFormValues = z.infer<typeof newBookingFormSchema>;

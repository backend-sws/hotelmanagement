import { z } from 'zod';

export const guestSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  nationality: z.string().optional().default('Indian'),
  id_proof_type: z.enum(['aadhaar', 'pan', 'passport', 'driving_license', 'voter_id', 'other', '']).optional(),
  id_proof_number: z.string().optional(),
  date_of_birth: z.string().optional().nullable(),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  company_name: z.string().optional(),
  gst_number: z.string().optional(),
  total_stays: z.number().optional(),
  total_spent: z.number().optional(),
  notes: z.string().optional(),
  is_blacklisted: z.boolean().optional().default(false),
  blacklist_reason: z.string().optional(),
});

export type HotelGuest = z.infer<typeof guestSchema>;
export type GuestFormValues = Omit<HotelGuest, 'id' | 'total_stays' | 'total_spent'>;

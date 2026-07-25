import { z } from 'zod';

// --- Interfaces ---

export interface Customer {
  id: number;
  business_id: number;
  name: string;
  phone?: string | null;
  address?: string | null;
  gstin?: string | null;
  state_code?: string | null;
  state_name?: string | null;
  email?: string | null;
  credit_limit?: number | null;
  price_list_id?: number | null;
  price_list?: { id: number; name: string };
  sales_sum_final_amount?: number;
  sales_sum_paid_amount?: number;
  sales?: any[];
  created_at: string;
}

// --- Zod Schemas ---

export const customerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  phone: z.string().optional().nullable().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable().or(z.literal('')),
  gstin: z.string().optional().nullable().or(z.literal('')),
  state_code: z.string().optional().nullable().or(z.literal('')),
  state_name: z.string().optional().nullable().or(z.literal('')),
  credit_limit: z.coerce.number().optional().nullable(),
  price_list_id: z.coerce.number().optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

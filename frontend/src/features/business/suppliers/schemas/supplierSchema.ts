import { z } from 'zod';

// --- Interfaces ---

export interface Supplier {
  id: number;
  business_id: number;
  custom_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  items_supplied: string | null;
  gstin: string | null;
  pan: string | null;
  state_code: string | null;
  state_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  branch_name: string | null;
  opening_balance?: number | null;
  balance_type?: 'credit' | 'debit' | null;
  purchases_sum_bill_amount?: number;
  purchases_sum_paid_amount?: number;
  general_payments_sum?: number;
  created_at: string;
  updated_at: string;
  purchases?: any[];
  payments?: any[];
}

// --- Zod Schemas ---

export const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  phone: z.string().optional().nullable().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
  items_supplied: z.string().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable().or(z.literal('')),
  gstin: z.string().max(15, 'GSTIN cannot exceed 15 characters').optional().nullable().or(z.literal('')),
  pan: z.string().max(10, 'PAN cannot exceed 10 characters').optional().nullable().or(z.literal('')),
  state_code: z.string().optional().nullable().or(z.literal('')),
  state_name: z.string().optional().nullable().or(z.literal('')),
  bank_name: z.string().optional().nullable().or(z.literal('')),
  account_number: z.string().optional().nullable().or(z.literal('')),
  ifsc_code: z.string().max(20, 'IFSC cannot exceed 20 characters').optional().nullable().or(z.literal('')),
  branch_name: z.string().optional().nullable().or(z.literal('')),
  upi_id: z.string().optional().nullable().or(z.literal('')),
  opening_balance: z.coerce.number().optional().nullable(),
  balance_type: z.enum(['credit', 'debit']).optional().nullable(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;


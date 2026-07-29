import { z } from 'zod';

export const planSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().nullable(),
  price_monthly: z.coerce.number().min(0, 'Must be a positive number'),
  price_yearly: z.coerce.number().min(0, 'Must be a positive number'),
  features: z.object({
    max_locations: z.coerce.number().min(1).default(1),
    max_staff: z.coerce.number().min(1).default(1),
    attendance_photo_retention_days: z.coerce.number().min(0).default(0),
    has_expenses: z.boolean().default(false),
    has_purchase_bills: z.boolean().default(false),
    has_khata_ledger: z.boolean().default(false),
    has_cashbook: z.boolean().default(false),
    has_cheques: z.boolean().default(false),
    has_stock_transfer: z.boolean().default(false),
    has_projects: z.boolean().default(false),
    has_gst_reports: z.boolean().default(false),
    has_financial_reports: z.boolean().default(false),
    has_payroll: z.boolean().default(false),
    has_finance: z.boolean().default(false),
    can_whitelabel_invoice: z.boolean().default(false),
    has_activity_logs: z.boolean().default(false),
  }).default({
    max_locations: 1,
    max_staff: 1,
    attendance_photo_retention_days: 0,
    has_expenses: false,
    has_purchase_bills: false,
    has_khata_ledger: false,
    has_cashbook: false,
    has_cheques: false,
    has_stock_transfer: false,
    has_projects: false,
    has_gst_reports: false,
    has_financial_reports: false,
    has_payroll: false,
    has_finance: false,
    can_whitelabel_invoice: false,
    has_activity_logs: false,
  }),
  is_active: z.boolean()
});

export type PlanFormSchemaType = z.infer<typeof planSchema>;

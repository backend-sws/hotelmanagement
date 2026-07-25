import { z } from 'zod';

export const priceListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().nullable().optional(),
  is_default: z.boolean(),
  is_active: z.boolean(),
});

export type PriceListFormValues = z.infer<typeof priceListSchema>;

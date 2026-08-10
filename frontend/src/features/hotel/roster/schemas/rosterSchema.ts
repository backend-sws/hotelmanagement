import { z } from 'zod';

export const hotelDepartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string(),
  head_user_id: z.number().nullable(),
  is_active: z.boolean(),
  roster_entries_count: z.number().optional(),
  head: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
});

export const hotelShiftSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  is_overnight: z.boolean(),
  color: z.string(),
  is_active: z.boolean(),
  duration_hours: z.number().optional(),
});

export const rosterEntrySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  department_id: z.number().nullable(),
  shift_id: z.number().nullable(),
  roster_date: z.string(),
  status: z.enum(['scheduled', 'attended', 'absent', 'swapped', 'on_leave', 'week_off', 'holiday']),
  swap_with_user_id: z.number().nullable(),
  swap_reason: z.string().nullable(),
  swap_status: z.enum(['pending', 'approved', 'rejected']).nullable(),
  approved_by: z.number().nullable(),
  notes: z.string().nullable(),
  shift: hotelShiftSchema.nullable().optional(),
  department: hotelDepartmentSchema.nullable().optional(),
  swap_user: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable().optional(),
});

export type HotelDepartment = z.infer<typeof hotelDepartmentSchema>;
export type HotelShift = z.infer<typeof hotelShiftSchema>;
export type RosterEntry = z.infer<typeof rosterEntrySchema>;

export type RosterStaff = {
  id: number;
  name: string;
  avatar: string | null;
  phone?: string;
};

export type WeeklyRosterResponse = {
  week_start: string;
  week_end: string;
  dates: string[];
  staff: RosterStaff[];
  cells: Record<string, RosterEntry>;
};

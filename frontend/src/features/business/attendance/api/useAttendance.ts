import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  status: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_photo: string | null;
  check_out_photo: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  is_within_geofence: boolean;
  notes: string | null;
  work_type: 'office' | 'wfh' | 'field';
  actual_hours: number | null;
  late_mark_minutes: number | null;
  regularization_status: 'pending' | 'approved' | 'rejected' | null;
  regularization_requested_checkin: string | null;
  regularization_requested_checkout: string | null;
  regularization_reason: string | null;
  regularization_requested_at: string | null;
  user?: { id: number; name: string };
  approved_by?: number | null;
}

export interface BusinessHoliday {
  id: number;
  date: string;
  name: string;
  type: 'national' | 'optional' | 'custom';
  is_paid: boolean;
  description: string | null;
}

export interface BusinessWorkSetting {
  id: number;
  work_start_time: string;
  work_end_time: string;
  standard_hours_per_day: number;
  work_days: string[];
  late_mark_grace_minutes: number;
  auto_apply_holidays: boolean;
}

// ── Attendance Queries ─────────────────────────────────────────────────────

export const useAttendance = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: async () => {
      const { data } = await api.get('/business/attendance', { params: filters });
      return data.data;
    },
  });
};

export const useTodayAttendance = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const { data } = await api.get('/business/attendance/today');
      return data.data as AttendanceRecord | null;
    },
    enabled: options?.enabled,
  });
};

export const useAttendanceReport = (month: string) => {
  return useQuery({
    queryKey: ['attendance', 'report', month],
    queryFn: async () => {
      const { data } = await api.get('/business/attendance/report', { params: { month } });
      return data.data;
    },
    enabled: !!month,
  });
};

export const usePendingRegularizations = () => {
  return useQuery({
    queryKey: ['attendance', 'regularizations'],
    queryFn: async () => {
      const { data } = await api.get('/business/attendance/regularization-requests');
      return data.data;
    },
  });
};

// ── Attendance Mutations ───────────────────────────────────────────────────

export const useCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { photo: string; latitude?: number; longitude?: number }) => {
      const { data } = await api.post('/business/attendance/check-in', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Checked in successfully!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Check-in failed'),
  });
};

export const useCheckOut = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { photo: string; latitude?: number; longitude?: number }) => {
      const { data } = await api.post('/business/attendance/check-out', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Checked out successfully!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Check-out failed'),
  });
};

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { user_id: number; date: string; status: string; notes?: string }) => {
      const { data } = await api.post('/business/attendance/mark', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Attendance marked');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useApproveAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put(`/business/attendance/${id}/approve`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Attendance approved!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to approve attendance'),
  });
};

export const useUnapproveAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put(`/business/attendance/${id}/unapprove`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Attendance unapproved!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to unapprove attendance'),
  });
};

export const useImportAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (records: any[]) => {
      const { data } = await api.post('/business/attendance/import', { records });
      return data.data;
    },
    onSuccess: () => {
      toast.success('Attendance imported successfully!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to import attendance'),
  });
};

export const useRequestRegularization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      date: string;
      user_id?: number;
      requested_checkin?: string;
      requested_checkout?: string;
      reason: string;
    }) => {
      const { data } = await api.post('/business/attendance/regularize', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Regularization request submitted!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to submit request'),
  });
};

export const useApproveRegularization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/attendance/${id}/regularize/approve`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Regularization approved! Times updated.');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useRejectRegularization = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/attendance/${id}/regularize/reject`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Regularization request rejected.');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useAdminEditTime = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; check_in_time?: string; check_out_time?: string; notes?: string }) => {
      const { id, ...rest } = payload;
      const { data } = await api.patch(`/business/attendance/${id}/edit-time`, rest);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Attendance time updated!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useMarkWfhAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (leaveRequestId: number) => {
      const { data } = await api.post(`/business/attendance/wfh-mark/${leaveRequestId}`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('WFH attendance marked!');
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['leave-requests'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

// ── Work Settings Hooks ────────────────────────────────────────────────────

export const useWorkSettings = () => {
  return useQuery({
    queryKey: ['work-settings'],
    queryFn: async () => {
      const { data } = await api.get('/business/work-settings');
      return data.data as BusinessWorkSetting;
    },
  });
};

export const useSaveWorkSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BusinessWorkSetting>) => {
      const { data } = await api.post('/business/work-settings', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Work settings saved!');
      qc.invalidateQueries({ queryKey: ['work-settings'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save'),
  });
};

// ── Holiday Hooks ──────────────────────────────────────────────────────────

export const useHolidays = (month: string) => {
  return useQuery({
    queryKey: ['holidays', month],
    queryFn: async () => {
      const { data } = await api.get('/business/holidays', { params: { month } });
      return data.data as BusinessHoliday[];
    },
    enabled: !!month,
  });
};

export const useAddHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { date: string; name: string; type?: string; is_paid?: boolean; description?: string }) => {
      const { data } = await api.post('/business/holidays', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Holiday added!');
      qc.invalidateQueries({ queryKey: ['holidays'] });
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['attendance-report'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add holiday'),
  });
};

export const useDeleteHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/holidays/${id}`);
    },
    onSuccess: () => {
      toast.success('Holiday removed!');
      qc.invalidateQueries({ queryKey: ['holidays'] });
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['attendance-report'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

export const useAutoApplyHolidays = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (month: string) => {
      const { data } = await api.post('/business/holidays/auto-apply', { month });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Holidays applied to attendance!');
      qc.invalidateQueries({ queryKey: ['holidays'] });
      qc.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });
};

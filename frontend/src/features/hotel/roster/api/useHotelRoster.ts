import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import type { 
  HotelDepartment, 
  HotelShift, 
  RosterEntry, 
  WeeklyRosterResponse,
  RosterStaff
} from '../schemas/rosterSchema';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- DEPARTMENTS -------------------------------------------------------------

export function useDepartments() {
  return useQuery({
    queryKey: ['hotel-departments'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HotelDepartment[]>>('/business/hotel/departments');
      return data.data;
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HotelDepartment>) => {
      const { data } = await api.post<ApiResponse<HotelDepartment>>('/business/hotel/departments', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-departments'] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<HotelDepartment> & { id: number }) => {
      const { data } = await api.put<ApiResponse<HotelDepartment>>(`/business/hotel/departments/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-departments'] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-departments'] });
    },
  });
}

// --- SHIFTS ------------------------------------------------------------------

export function useShifts() {
  return useQuery({
    queryKey: ['hotel-shifts'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<HotelShift[]>>('/business/hotel/shifts');
      return data.data;
    },
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<HotelShift>) => {
      const { data } = await api.post<ApiResponse<HotelShift>>('/business/hotel/shifts', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-shifts'] });
    },
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<HotelShift> & { id: number }) => {
      const { data } = await api.put<ApiResponse<HotelShift>>(`/business/hotel/shifts/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-shifts'] });
    },
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/shifts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-shifts'] });
    },
  });
}

// --- ROSTER ------------------------------------------------------------------

export function useWeeklyRoster(weekStart: string, departmentId?: number) {
  return useQuery({
    queryKey: ['hotel-roster', weekStart, departmentId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<WeeklyRosterResponse>>('/business/hotel/roster', {
        params: { week_start: weekStart, department_id: departmentId },
      });
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useRosterStaffList() {
  return useQuery({
    queryKey: ['hotel-roster-staff'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<RosterStaff[]>>('/business/hotel/roster/staff-list');
      return data.data;
    },
  });
}

export function useAssignShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: number;
      roster_date: string;
      shift_id?: number;
      department_id?: number;
      status?: string;
      notes?: string;
    }) => {
      const { data } = await api.post<ApiResponse<RosterEntry>>('/business/hotel/roster', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}

export function useBulkAssignShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_ids: number[];
      dates: string[];
      shift_id: number;
      department_id?: number;
      override_existing?: boolean;
    }) => {
      const { data } = await api.post<ApiResponse<any>>('/business/hotel/roster/bulk-assign', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}

export function useUpdateRosterStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.patch<ApiResponse<RosterEntry>>(`/business/hotel/roster/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}

export function useRequestSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, swap_with_user_id, swap_reason }: { id: number; swap_with_user_id: number; swap_reason?: string }) => {
      const { data } = await api.patch<ApiResponse<RosterEntry>>(`/business/hotel/roster/${id}/swap-request`, { swap_with_user_id, swap_reason });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}

export function useApproveSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const { data } = await api.patch<ApiResponse<RosterEntry>>(`/business/hotel/roster/${id}/approve-swap`, { approved });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}

export function useDeleteRosterEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/roster/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-roster'] });
    },
  });
}


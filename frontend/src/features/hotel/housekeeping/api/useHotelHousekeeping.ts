import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { HousekeepingTask, HousekeepingStats } from '../schemas/housekeepingSchema';

export function useHousekeepingTasks(filters?: { status?: string, assigned_user_id?: string, room_id?: string, date?: string }) {
  return useQuery({
    queryKey: ['hotel-housekeeping-tasks', filters],
    queryFn: async () => {
      const res = await api.get('/business/hotel/housekeeping', { params: filters });
      return res.data as HousekeepingTask[];
    },
  });
}

export function useHousekeepingDailyReport(date?: string) {
  return useQuery({
    queryKey: ['hotel-housekeeping-daily-report', date],
    queryFn: async () => {
      const res = await api.get('/business/hotel/housekeeping/daily-report', { params: { date } });
      return res.data as HousekeepingStats;
    },
  });
}

export function useCreateHousekeepingTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/business/hotel/housekeeping', data);
      return res.data as HousekeepingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-daily-report'] });
    }
  });
}

export function useUpdateHousekeepingTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: HousekeepingTask['status'] }) => {
      const res = await api.patch(`/business/hotel/housekeeping/${id}/status`, { status });
      return res.data as HousekeepingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-daily-report'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] }); // Since room status might change
    }
  });
}

export function useAssignHousekeepingTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assigned_user_id }: { id: number; assigned_user_id: number | null }) => {
      const res = await api.patch(`/business/hotel/housekeeping/${id}/assign`, { assigned_user_id });
      return res.data as HousekeepingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-tasks'] });
    }
  });
}

export function useReportHousekeepingIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, issue_description }: { id: number; issue_description: string }) => {
      const res = await api.post(`/business/hotel/housekeeping/${id}/report-issue`, { issue_description });
      return res.data as HousekeepingTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-housekeeping-daily-report'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
    }
  });
}

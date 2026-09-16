import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface LeavePolicy {
  id: number;
  business_id: number;
  leave_type: string;
  monthly_quota: number;
  is_paid: boolean;
}

export interface LeaveBalanceItem {
  id: number;
  leave_type: string;
  is_paid: boolean;
  monthly_quota: number;
  annual_quota: number;
  used_days: number;
  remaining_days: number;
}

export interface LeaveBalancesResponse {
  user_id: number;
  year: number;
  balances: LeaveBalanceItem[];
  total_allocated_paid: number;
  total_used_paid: number;
  total_remaining_paid: number;
  pending_requests_count: number;
}

export const useLeavePolicies = () => {
  return useQuery({
    queryKey: ['leave-policies'],
    queryFn: async () => {
      const { data } = await api.get('/business/leave-policies');
      return data.data as LeavePolicy[];
    },
  });
};

export const useLeaveBalances = (userId?: number, year?: number) => {
  return useQuery({
    queryKey: ['leave-balances', userId, year],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (userId) params.user_id = userId;
      if (year) params.year = year;
      const { data } = await api.get('/business/leave-policies/balances', { params });
      return data.data as LeaveBalancesResponse;
    },
  });
};

export const useCreateLeavePolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { leave_type: string; monthly_quota: number; is_paid: boolean }) => {
      const { data } = await api.post('/business/leave-policies', payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Leave policy created successfully');
      qc.invalidateQueries({ queryKey: ['leave-policies'] });
      qc.invalidateQueries({ queryKey: ['leave-balances'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create leave policy'),
  });
};

export const useUpdateLeavePolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; leave_type?: string; monthly_quota?: number; is_paid?: boolean }) => {
      const { data } = await api.put(`/business/leave-policies/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Leave policy updated');
      qc.invalidateQueries({ queryKey: ['leave-policies'] });
      qc.invalidateQueries({ queryKey: ['leave-balances'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update policy'),
  });
};

export const useDeleteLeavePolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/leave-policies/${id}`);
    },
    onSuccess: () => {
      toast.success('Leave policy removed');
      qc.invalidateQueries({ queryKey: ['leave-policies'] });
      qc.invalidateQueries({ queryKey: ['leave-balances'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete policy'),
  });
};

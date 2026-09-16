import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface LeaveRequest {
  id: number;
  user_id: number;
  business_id: number;
  request_type: 'leave' | 'wfh';
  leave_type: string;
  leave_category: 'paid' | 'unpaid' | 'sick' | 'casual' | 'earned' | 'comp_off';
  admin_override_category: 'paid' | 'unpaid' | null;
  from_date: string;
  to_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  wfh_attendance_marked: boolean;
  admin_remark: string | null;
  created_at: string;
  user?: { id: number; name: string };
  approved_by_user?: { id: number; name: string };
}

export const useLeaveRequests = (filters: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['leave-requests', filters],
    queryFn: async () => {
      const { data } = await api.get('/business/leave-requests', { params: filters });
      return data.data as LeaveRequest[];
    },
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      request_type?: 'leave' | 'wfh';
      leave_type: string;
      leave_category?: string;
      from_date: string;
      to_date: string;
      reason: string;
    }) => {
      const { data } = await api.post('/business/leave-requests', payload);
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success(vars.request_type === 'wfh' ? 'WFH request submitted!' : 'Leave request submitted!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, admin_remark }: { id: number; status: 'approved' | 'rejected'; admin_remark?: string }) => {
      const { data } = await api.patch(`/business/leave-requests/${id}/status`, { status, admin_remark });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update leave status');
    }
  });
};

export const useOverrideLeaveCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, category, remark }: { id: number; category: 'paid' | 'unpaid'; remark?: string }) => {
      const { data } = await api.patch(`/business/leave-requests/${id}/override-category`, {
        admin_override_category: category,
        admin_remark: remark,
      });
      return data.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success(`Leave category overridden to ${vars.category}!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to override category');
    }
  });
};

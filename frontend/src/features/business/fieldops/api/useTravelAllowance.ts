import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface TravelAllowanceItem {
  id: number;
  business_id: number;
  staff_id: number;
  date: string;
  vehicle_type: 'bike' | 'car' | 'public_transit';
  start_location: string | null;
  end_location: string | null;
  total_km: number;
  rate_per_km: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approved_by: number | null;
  payroll_id: number | null;
  notes: string | null;
  created_at: string;
  staff?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  approver?: {
    id: number;
    name: string;
  };
}

export interface TravelMetrics {
  total_km: number;
  total_amount: number;
  approved_amount: number;
  pending_count: number;
  active_drivers: number;
}

export interface TravelAllowanceResponse {
  data: {
    data: TravelAllowanceItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
  metrics: TravelMetrics;
}

export const useTravelAllowances = (params?: {
  status?: string;
  staff_id?: number;
  date?: string;
  month?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['business', 'travel-allowances', params],
    queryFn: async () => {
      const { data } = await api.get('/business/travel-allowances', { params });
      return data as TravelAllowanceResponse;
    },
  });
};

export const useApproveClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/travel-allowances/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'travel-allowances'] });
    },
  });
};

export const useRejectClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const { data } = await api.post(`/business/travel-allowances/${id}/reject`, { notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'travel-allowances'] });
    },
  });
};

export const useRecalculateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/business/travel-allowances/${id}/recalculate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'travel-allowances'] });
    },
  });
};

export const useSyncPayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (month: string) => {
      const { data } = await api.post('/business/travel-allowances/sync-payroll', { month });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'travel-allowances'] });
    },
  });
};

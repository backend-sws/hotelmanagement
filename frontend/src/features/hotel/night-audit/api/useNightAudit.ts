import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useNightAuditPreview() {
  return useQuery({
    queryKey: ['hotel-night-audit-preview'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/night-audit/preview');
      return res.data?.data;
    },
  });
}

export function useNightAuditHistory() {
  return useQuery({
    queryKey: ['hotel-night-audit-history'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/night-audit');
      return res.data?.data || [];
    },
  });
}

export function useRunNightAudit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/business/hotel/night-audit/run');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-night-audit-history'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-night-audit-preview'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
    },
  });
}

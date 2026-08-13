import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useHotelGstConfig() {
  return useQuery({
    queryKey: ['hotel-gst-config'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/tax-config');
      return res.data?.data;
    },
  });
}

export function useUpdateHotelGstConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/business/hotel/tax-config', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-gst-config'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useGstSettings = () => {
  return useQuery({
    queryKey: ['gst-settings'],
    queryFn: async () => {
      const response = await api.get('/business/settings/gst');
      return response.data;
    }
  });
};

export const useUpdateGstSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/business/settings/gst', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gst-settings'] });
      queryClient.invalidateQueries({ queryKey: ['current-business'] }); // In case business_type changes
    }
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Unit {
  id: number;
  name: string;
}

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const res = await api.get('/business/units');
      return res.data.data as Unit[];
    }
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.post('/business/units', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    }
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// OTA Channels
export function useOtaChannels() {
  return useQuery({
    queryKey: ['ota-channels'],
    queryFn: async () => {
      const { data } = await api.get('/business/hotel/ota-channels');
      return data;
    },
  });
}

export function useCreateOtaChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/business/hotel/ota-channels', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ota-channels'] });
    },
  });
}

export function useDeleteOtaChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/business/hotel/ota-channels/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ota-channels'] });
    },
  });
}

// OTA Sync
export function useOtaSyncHistory() {
  return useQuery({
    queryKey: ['ota-sync-history'],
    queryFn: async () => {
      const { data } = await api.get('/business/hotel/ota/sync-history');
      return data;
    },
  });
}

export function useSyncOtaRates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/business/hotel/ota/sync-all', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ota-sync-history'] });
      queryClient.invalidateQueries({ queryKey: ['ota-channels'] });
    },
  });
}

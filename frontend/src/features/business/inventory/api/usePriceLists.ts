import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PriceList {
  id: number;
  business_id: number;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  items?: any[];
}

export const usePriceLists = () => {
  return useQuery({
    queryKey: ['price-lists'],
    queryFn: async () => {
      const { data } = await api.get('/business/price-lists');
      return data.data;
    }
  });
};

export const usePriceList = (id: number) => {
  return useQuery({
    queryKey: ['price-lists', id],
    queryFn: async () => {
      const { data } = await api.get(`/business/price-lists/${id}`);
      return data.data;
    },
    enabled: !!id
  });
};

export const useCreatePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/business/price-lists', data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['price-lists'] })
  });
};

export const useUpdatePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/business/price-lists/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['price-lists'] })
  });
};

export const useDeletePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/price-lists/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['price-lists'] })
  });
};

export const useAddPriceListItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priceListId, data }: { priceListId: number; data: any }) => {
      const res = await api.post(`/business/price-lists/${priceListId}/items`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-lists', variables.priceListId] });
    }
  });
};

export const useRemovePriceListItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priceListId, itemId }: { priceListId: number; itemId: number }) => {
      await api.delete(`/business/price-lists/${priceListId}/items/${itemId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['price-lists', variables.priceListId] });
    }
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCorporateAccounts() {
  return useQuery({
    queryKey: ['hotel-corporate-accounts'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/corporate-accounts');
      return res.data?.data || [];
    },
  });
}

export function useCorporateAccount(id: number | string | undefined) {
  return useQuery({
    queryKey: ['hotel-corporate-account', id],
    queryFn: async () => {
      const res = await api.get(`/business/hotel/corporate-accounts/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });
}

export function useCorporateStatement(id: number | string | undefined) {
  return useQuery({
    queryKey: ['hotel-corporate-statement', id],
    queryFn: async () => {
      const res = await api.get(`/business/hotel/corporate-accounts/${id}/statement`);
      return res.data?.data;
    },
    enabled: !!id,
  });
}

export function useCreateCorporateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/business/hotel/corporate-accounts', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-accounts'] });
    },
  });
}

export function useUpdateCorporateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number, data: any }) => {
      const res = await api.put(`/business/hotel/corporate-accounts/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-account', variables.id] });
    },
  });
}

export function useRecordCorporatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number, data: any }) => {
      const res = await api.post(`/business/hotel/corporate-accounts/${id}/payment`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-statement', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['hotel-corporate-account', variables.id] });
    },
  });
}

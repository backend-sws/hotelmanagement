import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Supplier } from '../schemas/supplierSchema';

export const useSuppliers = (page: number = 1, perPage: number = 15, search?: string) => {
  return useQuery({
    queryKey: ['suppliers', page, perPage, search],
    queryFn: async () => {
      let url = `/business/suppliers?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const { data } = await api.get(url);
      return data;
    },
  });
};

export const useSupplier = (id: number) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const { data } = await api.get(`/business/suppliers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (supplierData: Partial<Supplier>) => {
      const { data } = await api.post('/business/suppliers', supplierData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Supplier> }) => {
      const response = await api.put(`/business/suppliers/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
    },
  });
};

export const useCreateSupplierPurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ supplierId, payload }: { supplierId: number; payload: any }) => {
      const { data } = await api.post(`/business/suppliers/${supplierId}/purchases`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.supplierId] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useCreateSupplierPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ supplierId, data }: { supplierId: number; data: any }) => {
      const response = await api.post(`/business/suppliers/${supplierId}/payments`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.supplierId] });
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/business/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};

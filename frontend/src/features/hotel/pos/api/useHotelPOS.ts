import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { HotelOutlet, HotelService, PosOrder } from '../schemas/posSchema';

const unwrap = (res: any) => res.data?.data ?? res.data;

// ─── Outlets ──────────────────────────────────────────────────────────────────

export function useOutlets() {
  return useQuery({
    queryKey: ['hotel-outlets'],
    queryFn: async (): Promise<HotelOutlet[]> => {
      const res = await api.get('/business/hotel/outlets');
      const d = unwrap(res);
      return Array.isArray(d) ? d : [];
    },
  });
}

export function useCreateOutlet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HotelOutlet>) => api.post('/business/hotel/outlets', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-outlets'] }); toast.success('Outlet created!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create outlet'),
  });
}

export function useUpdateOutlet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<HotelOutlet> & { id: number }) => api.put(`/business/hotel/outlets/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-outlets'] }); toast.success('Outlet updated!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update outlet'),
  });
}

export function useDeleteOutlet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/business/hotel/outlets/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-outlets'] }); toast.success('Outlet deleted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete outlet'),
  });
}

// ─── Services / Menu ──────────────────────────────────────────────────────────

export function useServices(filters?: { outlet_id?: number; category?: string }) {
  return useQuery({
    queryKey: ['hotel-services', filters],
    queryFn: async (): Promise<HotelService[]> => {
      const res = await api.get('/business/hotel/services', { params: filters });
      const d = unwrap(res);
      return Array.isArray(d) ? d : [];
    },
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HotelService>) => api.post('/business/hotel/services', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-services'] }); toast.success('Service added!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to add service'),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<HotelService> & { id: number }) => api.put(`/business/hotel/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-services'] }); toast.success('Service updated!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update service'),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/business/hotel/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-services'] }); toast.success('Service deleted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete service'),
  });
}

// ─── POS Orders ───────────────────────────────────────────────────────────────

export function usePosOrders(filters?: { outlet_id?: number; status?: string; date?: string }) {
  return useQuery({
    queryKey: ['hotel-pos-orders', filters],
    queryFn: async () => {
      const res = await api.get('/business/hotel/pos-orders', { params: filters });
      const d = unwrap(res);
      return d?.data ?? (Array.isArray(d) ? d : []);
    },
    refetchInterval: 20_000,
  });
}

export function useCreatePosOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/business/hotel/pos-orders', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-pos-orders'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create order'),
  });
}

export function useBillOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; payment_mode: string }) => api.post(`/business/hotel/pos-orders/${id}/bill`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-pos-orders'] }); toast.success('Order billed!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to bill order'),
  });
}

export function usePostToRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, bookingId }: { orderId: number; bookingId: number }) =>
      api.post(`/business/hotel/pos-orders/${orderId}/post-to-room`, { booking_id: bookingId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-pos-orders'] }); toast.success('Charges posted to room folio!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to post to room'),
  });
}

export function useKotPrint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.post(`/business/hotel/pos-orders/${id}/kot`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-pos-orders'] }); toast.success('KOT sent to kitchen!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to send KOT'),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/business/hotel/pos-orders/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-pos-orders'] }); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update status'),
  });
}

// ─── Tables ──────────────────────────────────────────────────────────────────

import type { HotelPosTable, HotelTableReservation } from '../schemas/tableSchema';

export function useTables(filters?: { outlet_id?: number; status?: string }) {
  return useQuery({
    queryKey: ['hotel-tables', filters],
    queryFn: async (): Promise<HotelPosTable[]> => {
      const res = await api.get('/business/hotel/tables', { params: filters });
      const d = unwrap(res);
      return Array.isArray(d) ? d : [];
    },
  });
}

export function useCreateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HotelPosTable>) => api.post('/business/hotel/tables', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-tables'] }); toast.success('Table added!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to add table'),
  });
}

export function useUpdateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<HotelPosTable> & { id: number }) => api.put(`/business/hotel/tables/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-tables'] }); toast.success('Table updated!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update table'),
  });
}

export function useDeleteTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/business/hotel/tables/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hotel-tables'] }); toast.success('Table deleted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete table'),
  });
}

// ─── Table Reservations ──────────────────────────────────────────────────────

export function useReservations(filters?: { outlet_id?: number; status?: string; date?: string }) {
  return useQuery({
    queryKey: ['hotel-reservations', filters],
    queryFn: async (): Promise<HotelTableReservation[]> => {
      const res = await api.get('/business/hotel/table-reservations', { params: filters });
      const d = unwrap(res);
      return Array.isArray(d) ? d : [];
    },
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<HotelTableReservation>) => api.post('/business/hotel/table-reservations', data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['hotel-reservations'] }); 
      qc.invalidateQueries({ queryKey: ['hotel-tables'] }); 
      toast.success('Reservation created!'); 
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create reservation'),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<HotelTableReservation> & { id: number }) => api.put(`/business/hotel/table-reservations/${id}`, data),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['hotel-reservations'] });
      qc.invalidateQueries({ queryKey: ['hotel-tables'] }); 
      toast.success('Reservation updated!'); 
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update reservation'),
  });
}

export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/business/hotel/table-reservations/${id}`),
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ['hotel-reservations'] }); 
      qc.invalidateQueries({ queryKey: ['hotel-tables'] });
      toast.success('Reservation deleted!'); 
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete reservation'),
  });
}

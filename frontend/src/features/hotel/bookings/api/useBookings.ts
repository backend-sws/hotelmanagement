import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { HotelBooking, NewBookingFormValues, HotelFolioCharge } from '../schemas/bookingSchema';

export function useHotelBookings(params?: { status?: string, date?: string, page?: number }) {
  return useQuery({
    queryKey: ['hotel-bookings', params],
    queryFn: async () => {
      const res = await api.get('/business/hotel/bookings', { params });
      const payload = res.data?.data;
      if (Array.isArray(payload)) {
        return { data: payload, total: payload.length };
      }
      if (payload && Array.isArray(payload.data)) {
        return { data: payload.data, total: payload.total, current_page: payload.current_page };
      }
      return { data: [], total: 0 };
    },
  });
}

export function useHotelBooking(id: number | null) {
  return useQuery({
    queryKey: ['hotel-booking', id],
    queryFn: async () => {
      const res = await api.get(`/business/hotel/bookings/${id}`);
      return (res.data?.data || res.data) as HotelBooking;
    },
    enabled: !!id,
  });
}

export function useCreateHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewBookingFormValues) => {
      const res = await api.post('/business/hotel/bookings', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] }); // To update room statuses
    },
  });
}

export function useCheckInBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/business/hotel/bookings/${id}/check-in`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', id] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
    },
  });
}

export function useCheckOutBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { payment_mode: string, amount_paid: number } }) => {
      const res = await api.post(`/business/hotel/bookings/${id}/check-out`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', id] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
    },
  });
}

export function useUpdateHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HotelBooking> }) => {
      const res = await api.put(`/business/hotel/bookings/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', id] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
    },
  });
}

export function useAddBookingPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: number; data: { amount?: number, payment_mode?: string, split_payments?: any[], notes?: string } }) => {
      const res = await api.post(`/business/hotel/bookings/${bookingId}/payments`, data);
      return res.data;
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
    },
  });
}

export function useCancelHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/business/hotel/bookings/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', id] });
      queryClient.invalidateQueries({ queryKey: ['hotel-rooms'] });
    },
  });
}

// Folio Charges
export function useAddFolioCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: number, data: Partial<HotelFolioCharge> }) => {
      const res = await api.post(`/business/hotel/bookings/${bookingId}/folio`, data);
      return res.data;
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
    },
  });
}

export function useDeleteFolioCharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, chargeId }: { bookingId: number, chargeId: number }) => {
      const res = await api.delete(`/business/hotel/bookings/${bookingId}/folio/${chargeId}`);
      return res.data;
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
    },
  });
}

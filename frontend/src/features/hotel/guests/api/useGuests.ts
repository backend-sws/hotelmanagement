import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { HotelGuest, GuestFormValues } from '../schemas/guestSchema';

export function useHotelGuests(search?: string, page = 1) {
  return useQuery({
    queryKey: ['hotel-guests', { search, page }],
    queryFn: async () => {
      const res = await api.get('/business/hotel/guests', { params: { search, page } });
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

export function useHotelGuest(id: number | null) {
  return useQuery({
    queryKey: ['hotel-guest', id],
    queryFn: async () => {
      const res = await api.get(`/business/hotel/guests/${id}`);
      return (res.data?.data || res.data) as HotelGuest & { bookings?: any[] };
    },
    enabled: !!id,
  });
}

export function useCreateHotelGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GuestFormValues) => {
      const res = await api.post('/business/hotel/guests', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-guests'] });
    },
  });
}

export function useUpdateHotelGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GuestFormValues }) => {
      const res = await api.put(`/business/hotel/guests/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hotel-guests'] });
      queryClient.invalidateQueries({ queryKey: ['hotel-guest', id] });
    },
  });
}

export function useDeleteHotelGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/guests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-guests'] });
    },
  });
}

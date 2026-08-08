import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  HotelPropertySetting,
  HotelRoomType,
  HotelRoom,
  HotelRatePlan,
} from '../schemas/roomSchema';

// ---------- Keys ----------
const KEYS = {
  property: ['hotel', 'property-settings'],
  roomTypes: ['hotel', 'room-types'],
  rooms: (filters?: Record<string, any>) => ['hotel', 'rooms', filters],
  ratePlans: ['hotel', 'rate-plans'],
};

// ---------- Property Settings ----------
export function useHotelProperty() {
  return useQuery({
    queryKey: KEYS.property,
    queryFn: async () => {
      const res = await api.get('/business/hotel/property-settings');
      return res.data.data as HotelPropertySetting;
    },
  });
}

export function useUpdateHotelProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HotelPropertySetting>) => {
      const res = await api.post('/business/hotel/property-settings', data);
      return res.data.data as HotelPropertySetting;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.property }),
  });
}

// ---------- Room Types ----------
export function useHotelRoomTypes() {
  return useQuery({
    queryKey: KEYS.roomTypes,
    queryFn: async () => {
      const res = await api.get('/business/hotel/room-types');
      return res.data.data as HotelRoomType[];
    },
  });
}

export function useCreateHotelRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HotelRoomType>) => {
      const res = await api.post('/business/hotel/room-types', data);
      return res.data.data as HotelRoomType;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.roomTypes }),
  });
}

export function useUpdateHotelRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HotelRoomType> }) => {
      const res = await api.put(`/business/hotel/room-types/${id}`, data);
      return res.data.data as HotelRoomType;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.roomTypes }),
  });
}

export function useDeleteHotelRoomType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/room-types/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.roomTypes }),
  });
}

// ---------- Rooms ----------
export function useHotelRooms(filters?: Record<string, any>) {
  return useQuery({
    queryKey: KEYS.rooms(filters),
    queryFn: async () => {
      const res = await api.get('/business/hotel/rooms', { params: filters });
      return res.data.data as HotelRoom[];
    },
  });
}

export function useCreateHotelRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HotelRoom>) => {
      const res = await api.post('/business/hotel/rooms', data);
      return res.data.data as HotelRoom;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hotel', 'rooms'] }),
  });
}

export function useUpdateHotelRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HotelRoom> }) => {
      const res = await api.put(`/business/hotel/rooms/${id}`, data);
      return res.data.data as HotelRoom;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hotel', 'rooms'] }),
  });
}

export function useUpdateHotelRoomStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const res = await api.patch(`/business/hotel/rooms/${id}/status`, { status, notes });
      return res.data.data as HotelRoom;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hotel', 'rooms'] }),
  });
}

export function useDeleteHotelRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/rooms/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hotel', 'rooms'] }),
  });
}

// ---------- Rate Plans ----------
export function useHotelRatePlans() {
  return useQuery({
    queryKey: KEYS.ratePlans,
    queryFn: async () => {
      const res = await api.get('/business/hotel/rate-plans');
      return res.data.data as HotelRatePlan[];
    },
  });
}

export function useCreateHotelRatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HotelRatePlan>) => {
      const res = await api.post('/business/hotel/rate-plans', data);
      return res.data.data as HotelRatePlan;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ratePlans }),
  });
}

export function useUpdateHotelRatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<HotelRatePlan> }) => {
      const res = await api.put(`/business/hotel/rate-plans/${id}`, data);
      return res.data.data as HotelRatePlan;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ratePlans }),
  });
}

export function useDeleteHotelRatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/hotel/rate-plans/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ratePlans }),
  });
}

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  total_rooms: number;
  occupied: number;
  available: number;
  reserved: number;
  dirty: number;
  maintenance: number;
  blocked: number;
  occupancy_percent: number;
  arrivals_today: number;
  departures_today: number;
  revenue_today: number;
}

export interface RoomGridItem {
  id: number;
  room_number: string;
  floor: string;
  status: 'available' | 'occupied' | 'reserved' | 'dirty' | 'maintenance' | 'blocked';
  room_type?: string;
  bed_type?: string;
  is_ac?: boolean;
  booking_id?: number;
  booking_number?: string;
  guest_name?: string;
  guest_phone?: string;
  check_in_date?: string;
  check_out_date?: string;
  nights?: number;
  balance_due?: number;
}

const unwrap = (res: any) => res.data?.data ?? res.data;

export function useHotelDashboardStats() {
  return useQuery({
    queryKey: ['hotel-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const res = await api.get('/business/hotel/dashboard');
      return unwrap(res);
    },
    refetchInterval: 30_000,
  });
}

export function useHotelRoomGrid() {
  return useQuery({
    queryKey: ['hotel-room-grid'],
    queryFn: async (): Promise<RoomGridItem[]> => {
      const res = await api.get('/business/hotel/dashboard/room-grid');
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 30_000,
  });
}

export function useTodayArrivals() {
  return useQuery({
    queryKey: ['hotel-today-arrivals'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/dashboard/today-arrivals');
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 30_000,
  });
}

export function useTodayDepartures() {
  return useQuery({
    queryKey: ['hotel-today-departures'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/dashboard/today-departures');
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 30_000,
  });
}

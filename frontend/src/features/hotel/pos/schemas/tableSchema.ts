import type { HotelOutlet } from './posSchema';

export interface HotelPosTable {
  id: number;
  business_id: number;
  outlet_id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'out_of_service';
  created_at?: string;
  updated_at?: string;
  outlet?: HotelOutlet;
}

export interface HotelTableReservation {
  id: number;
  business_id: number;
  outlet_id: number;
  table_id: number;
  guest_name: string;
  guest_phone: string | null;
  guest_count: number;
  reservation_time: string;
  grace_period_minutes: number;
  deposit_amount: number;
  special_requests: string | null;
  status: 'pending' | 'seated' | 'cancelled' | 'completed' | 'no_show';
  created_at?: string;
  updated_at?: string;
  outlet?: HotelOutlet;
  table?: HotelPosTable;
}

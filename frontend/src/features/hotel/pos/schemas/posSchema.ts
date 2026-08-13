export interface HotelOutlet {
  id: number;
  name: string;
  outlet_type: 'restaurant' | 'bar' | 'spa' | 'room_service' | 'banquet' | 'laundry' | 'other';
  is_active: boolean;
  description?: string;
  services_count?: number;
}

export interface HotelService {
  id: number;
  outlet_id: number;
  name: string;
  category: 'food' | 'beverage' | 'laundry' | 'transport' | 'spa' | 'minibar' | 'misc';
  description?: string;
  price: number;
  tax_type: 'inclusive' | 'exclusive' | 'nil';
  tax_percent: number;
  is_available: boolean;
  sort_order: number;
  image_url?: string | null;
  outlet?: HotelOutlet;
}

export interface OrderItem {
  service_id?: number;
  name: string;
  category?: string;
  qty: number;
  unit_price: number;
  tax_percent?: number;
  tax_amount?: number;
  total_price: number;
  notes?: string;
}

export interface PosOrder {
  id: number;
  order_number: string;
  outlet_id: number;
  booking_id?: number;
  table_no?: string;
  guest_name?: string;
  guest_phone?: string;
  order_type: 'dine_in' | 'room_service' | 'takeaway' | 'post_to_room';
  status: 'pending' | 'processing' | 'served' | 'billed' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  payment_mode?: string;
  notes?: string;
  billed_at?: string;
  kot_printed_at?: string;
  outlet?: HotelOutlet;
  items?: OrderItem[];
}

export interface CartItem {
  service_id?: number;
  name: string;
  category?: string;
  qty: number;
  unit_price: number;
  tax_percent: number;
  notes?: string;
}

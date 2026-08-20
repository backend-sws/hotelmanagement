import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface HotelInvoiceSettings {
  template: 'default' | 'modern' | 'classic' | 'premium' | 'pos';
  receipt_template?: 'voucher' | 'pos';
  signature_label: string;
  default_terms: string;
  check_in_time: string;
  check_out_time: string;
  default_bank_details: string;
  upi_id: string;
  fields: {
    show_logo: boolean;
    logo_size?: number;
    show_gstin: boolean;
    show_stay_dates: boolean;
    show_guest_id_proof: boolean;
    show_room_details: boolean;
    show_folio_breakdown: boolean;
    show_tax_breakdown: boolean;
    show_payment_breakdown: boolean;
    show_amount_in_words: boolean;
    show_qr_code: boolean;
    show_terms: boolean;
    show_signature: boolean;
    show_receiver_signature: boolean;
  };
  styles: {
    primary_color: string;
    secondary_color: string;
    border_color: string;
    font_size: number;
    font_family: string;
    line_spacing: number;
    margin_top: number;
    margin_bottom: number;
    margin_left: number;
    margin_right: number;
    border_radius: number;
    frame_style: 'solid' | 'dashed' | 'dotted' | 'elegant' | 'none';
  };
  kot_settings: {
    show_restaurant_name: boolean;
    show_server_name: boolean;
    show_special_instructions: boolean;
    font_size: number;
  };
}

export function useHotelInvoiceSettings() {
  return useQuery<HotelInvoiceSettings>({
    queryKey: ['hotel-invoice-settings'],
    queryFn: async () => {
      const res = await api.get('/business/hotel/invoice-settings');
      return res.data?.data;
    },
  });
}

export function useUpdateHotelInvoiceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<HotelInvoiceSettings>) => {
      const res = await api.post('/business/hotel/invoice-settings', data);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-invoice-settings'] });
    },
  });
}

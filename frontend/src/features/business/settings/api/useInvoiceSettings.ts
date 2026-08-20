import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface InvoiceSettings {
  template: 'default' | 'modern' | 'classic' | 'premium' | 'pos';
  header_image: string | null;
  footer_image: string | null;
  signature_image: string | null;
  background_image?: string | null;
  signature_label: string;
  default_terms: string;
  default_bank_details: string;
  custom_fields: Array<{ key: string; value: string }>;
  fields: {
    show_logo: boolean;
    logo_size?: number;
    show_hsn: boolean;
    show_bank_details: boolean;
    show_terms: boolean;
    terms_on_new_page?: boolean;
    show_discount: boolean;
    show_vehicle_info: boolean;
    show_amount_in_words: boolean;
    show_gstin: boolean;
    show_place_of_supply: boolean;
    show_due_date: boolean;
    show_invoice_type?: boolean;
    show_signature: boolean;
    show_customer_phone: boolean;
    show_tax_amount?: boolean;
    show_tax_breakdown: boolean;
    show_payment_breakdown?: boolean;
    show_rate: boolean;
    show_qty: boolean;
    show_reference_number: boolean;
    show_watermark: boolean;
    show_receiver_signature: boolean;
    show_qr_code: boolean;
    watermark_text?: string;
    watermark_size?: number;
    watermark_use_document_type?: boolean;
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
}

export const useInvoiceSettings = () => {
  return useQuery({
    queryKey: ['invoice-settings'],
    queryFn: async () => {
      const response = await api.get('/business/settings/invoice');
      return response.data.data as InvoiceSettings;
    },
  });
};

export const useUpdateInvoiceSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<InvoiceSettings>) => {
      const response = await api.post('/business/settings/invoice', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['invoice-settings'], data);
    },
  });
};

export const useUploadInvoiceImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, file }: { type: 'header' | 'footer' | 'signature' | 'background'; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`/business/settings/invoice/image/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['invoice-settings'], data.data);
    },
  });
};

export const useDeleteInvoiceImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'header' | 'footer' | 'signature' | 'background') => {
      const response = await api.delete(`/business/settings/invoice/image/${type}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['invoice-settings'], data.data);
    },
  });
};

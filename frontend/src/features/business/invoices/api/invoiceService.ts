import api from '@/lib/api';

export interface InvoiceItem {
  product_id: number | null;
  name?: string;
  description?: string;
  quantity: number;
  rate: number;
  gst_rate: number;
  hsn_code?: string;
  unit?: string;
  taxable_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  cess_rate?: number;
  cess_amount?: number;
  amount?: number;
}

export interface InvoiceData {
  customer_id: number | null;
  invoice_type: 'sales_invoice' | 'proforma' | 'delivery_challan' | 'quotation' | 'credit_note' | 'debit_note' | 'purchase_bill';
  date: string;
  due_date?: string;
  place_of_supply?: string;
  discount: number;
  paid_amount: number;
  payment_mode?: string;
  notes?: string;
  terms_conditions?: string;
  items: InvoiceItem[];
}

export const invoiceService = {
  list: async (params: any) => {
    const response = await api.get('/business/invoices', { params });
    return response.data.data;
  },
  
  get: async (id: number) => {
    const response = await api.get(`/business/invoices/${id}`);
    return response.data.data;
  },
  
  create: async (data: InvoiceData) => {
    const response = await api.post('/business/invoices', data);
    return response.data.data;
  },
  
  update: async (id: number, data: Partial<InvoiceData>) => {
    const response = await api.put(`/business/invoices/${id}`, data);
    return response.data.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/business/invoices/${id}`);
    return response.data;
  },
  
  getPdf: async (id: number) => {
    const response = await api.get(`/business/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },
  
  getWhatsappUrl: async (id: number) => {
    const response = await api.get(`/business/invoices/${id}/whatsapp`);
    return response.data.data;
  },
  
  convert: async (id: number) => {
    const response = await api.post(`/business/invoices/${id}/convert`);
    return response.data;
  },
  
  stats: async () => {
    const response = await api.get('/business/invoices/stats');
    return response.data.data;
  },
};

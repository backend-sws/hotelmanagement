import api from '@/lib/api';

export interface Gstr1B2bItem {
  id: number;
  invoice_number: string;
  date: string;
  customer_name: string;
  gstin: string;
  state: string;
  invoice_type: string;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax: number;
  total_amount: number;
}

export interface Gstr1B2cItem {
  id: number;
  invoice_number: string;
  date: string;
  customer_name: string;
  state: string;
  invoice_type: string;
  taxable_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;
  total_tax: number;
  total_amount: number;
}

export interface Gstr1Response {
  data: {
    b2b: Gstr1B2bItem[];
    b2cl: Gstr1B2cItem[];
    b2cs: Gstr1B2cItem[];
    summary: {
      total_invoices: number;
      sales_invoices: number;
      credit_notes: number;
      debit_notes: number;
    };
    totals: {
      taxable_amount: number;
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      total_tax: number;
      total_invoice_value: number;
    };
    from_date: string;
    to_date: string;
  };
}

export interface Gstr3bResponse {
  data: {
    outward_supplies: {
      taxable_amount: number;
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      total_tax: number;
    };
    eligible_itc: {
      taxable_amount: number;
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      total_tax: number;
    };
    net_payable: {
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      total_tax: number;
    };
    itc_carry_forward: {
      cgst_amount: number;
      sgst_amount: number;
      igst_amount: number;
      total_tax: number;
    };
    from_date: string;
    to_date: string;
  };
}

export interface HsnItem {
  hsn_code: string;
  description: string;
  uom: string;
  gst_rate: number;
  total_quantity: number;
  taxable_value: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax: number;
  total_value: number;
}

export interface HsnResponse {
  data: {
    items: HsnItem[];
    from_date: string;
    to_date: string;
  };
}

export const gstReportService = {
  getGstr1: async (params?: { from_date?: string; to_date?: string }): Promise<Gstr1Response> => {
    const response = await api.get('/business/reports/gst/gstr1', { params });
    return response.data;
  },

  getGstr3b: async (params?: { from_date?: string; to_date?: string }): Promise<Gstr3bResponse> => {
    const response = await api.get('/business/reports/gst/gstr3b', { params });
    return response.data;
  },

  getHsnSummary: async (params?: { from_date?: string; to_date?: string }): Promise<HsnResponse> => {
    const response = await api.get('/business/reports/gst/hsn', { params });
    return response.data;
  },
};

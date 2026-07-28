import api from '@/lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface StockItem {
  id: number;
  name: string;
  model_name: string;
  item_code: string;
  category: string | null;
  brand: string | null;
  unit: string | null;
  current_qty: number;
  min_stock_alert: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  purchase_rate: number;
  sale_rate: number;
  stock_value: number;
  last_movement_at: string | null;
  last_movement_type: string | null;
  track_by_location: boolean;
}

export interface StockSummaryStats {
  total_items: number;
  low_stock_count: number;
  out_of_stock: number;
  total_value: number;
}

export interface StockMovement {
  id: number;
  date: string;
  type: 'in' | 'out';
  quantity: number;
  reference_type: string;
  reference_id: number;
  location_id: number | null;
  notes: string | null;
  balance: number;
}

export interface StockTransferItem {
  product_id: number;
  quantity: number;
  unit?: string;
  notes?: string;
}

export interface StockTransfer {
  id: number;
  transfer_number: string;
  from_location_id: number;
  to_location_id: number;
  transfer_date: string;
  notes: string | null;
  status: 'completed' | 'cancelled' | 'draft';
  transferred_by: number;
  from_location: { id: number; name: string } | null;
  to_location: { id: number; name: string } | null;
  items: Array<{
    id: number;
    product_id: number;
    quantity: number;
    unit: string | null;
    product: { id: number; name: string; item_code: string; unit: string } | null;
  }>;
}

export interface LocationStockEntry {
  location_id: number;
  location_name: string;
  items_count: number;
  total_value: number;
  products: Array<{
    product_id: number;
    name: string;
    item_code: string;
    unit: string;
    quantity: number;
    purchase_rate: number;
    stock_value: number;
    is_low_stock: boolean;
  }>;
}

// ─── Stock Summary ──────────────────────────────────────────────────────────

export const getStockSummary = async (params?: {
  location_id?: number;
  category_id?: number;
  low_stock_only?: boolean;
  search?: string;
}): Promise<{ data: StockItem[]; stats: StockSummaryStats }> => {
  const res = await api.get('/business/stock/summary', { params });
  return res.data;
};

export const getLocationWiseStock = async (): Promise<{ data: LocationStockEntry[] }> => {
  const res = await api.get('/business/stock/location-wise');
  return res.data;
};

export const getStockMovements = async (
  productId: number,
  params?: { from_date?: string; to_date?: string; location_id?: number }
): Promise<{
  product: { id: number; name: string; item_code: string; unit: string; current_qty: number };
  data: StockMovement[];
  stats: { total_in: number; total_out: number; net: number };
}> => {
  const res = await api.get(`/business/stock/movements/${productId}`, { params });
  return res.data;
};

export const getLowStockItems = async (): Promise<{
  data: Array<{
    id: number; name: string; item_code: string;
    current_qty: number; min_stock_alert: number;
    unit: string; shortage: number; is_out_of_stock: boolean;
  }>;
  count: number;
}> => {
  const res = await api.get('/business/stock/low-stock');
  return res.data;
};

// ─── Stock Transfers ────────────────────────────────────────────────────────

export const getStockTransfers = async (params?: {
  from_location_id?: number;
  to_location_id?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
  per_page?: number;
  page?: number;
}): Promise<{ data: { data: StockTransfer[]; total: number } }> => {
  const res = await api.get('/business/stock-transfers', { params });
  return res.data;
};

export const createStockTransfer = async (data: {
  from_location_id: number;
  to_location_id: number;
  transfer_date?: string;
  notes?: string;
  items: StockTransferItem[];
}): Promise<{ data: StockTransfer; message: string }> => {
  const res = await api.post('/business/stock-transfers', data);
  return res.data;
};

export const getStockTransfer = async (id: number): Promise<{ data: StockTransfer }> => {
  const res = await api.get(`/business/stock-transfers/${id}`);
  return res.data;
};

export const getTransferSlip = async (id: number) => {
  const res = await api.get(`/business/stock-transfers/${id}/slip`);
  return res.data;
};

export const cancelStockTransfer = async (id: number) => {
  const res = await api.patch(`/business/stock-transfers/${id}/cancel`);
  return res.data;
};

// ─── Barcode ────────────────────────────────────────────────────────────────

export const generateBarcode = async (productId: number): Promise<{
  barcode_value: string;
  barcode_image: string | null;
  product?: { id: number; name: string; item_code: string };
}> => {
  const res = await api.post(`/business/barcode/generate/${productId}`);
  return res.data;
};

export const scanBarcode = async (barcode: string): Promise<{
  data: {
    id: number;
    name: string;
    model_name: string;
    item_code: string;
    unit: string;
    gst_rate: number;
    hsn_code: string;
    sale_rate: number;
    purchase_rate: number;
    current_stock: number;
    is_available: boolean;
  };
}> => {
  const res = await api.post('/business/barcode/scan', { barcode });
  return res.data;
};

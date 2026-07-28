import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  today_sales: number;
  monthly_revenue: number;
  monthly_expenses: number;
  pending_payments: number;
  total_invoices: number;
  cash_in_hand: number;
  bank_balance: number;
  total_receivables: number;
  total_payables: number;
  staff: {
    active: number;
    present_today: number;
  };
  recent_sales: any[];
  recent_invoices: Array<{
    id: number;
    invoice_number: string;
    customer_name: string;
    date: string;
    amount: number;
    status: string;
  }>;
  top_customers: Array<{
    id: number;
    name: string;
    phone: string;
    total_volume: number;
    invoices_count: number;
  }>;
  low_stock_items: Array<{
    id: number;
    name: string;
    unit: string;
    min_stock_alert: number;
    total_stock: number;
  }>;
  pending_cheques: Array<{
    id: number;
    cheque_number: string;
    bank_name: string;
    party_type: string;
    cheque_date: string;
    amount: number;
    status: string;
    type: string;
  }>;
  active_projects: Array<{
    id: number;
    name: string;
    project_code: string;
    client_name: string;
    contract_value: number;
    total_cost: number;
    progress: number;
  }>;
  revenue_chart: Array<{
    date: string;
    label: string;
    revenue: number;
    expense: number;
  }>;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/business/dashboard/stats');
      return data.data as DashboardStats;
    },
  });
};

export interface StaffEarnings {
  today_earnings: number;
  monthly_earnings: number;
  advance_taken: number;
  total_dues: number;
}

export const useStaffEarnings = () => {
  return useQuery({
    queryKey: ['dashboard', 'staff-earnings'],
    queryFn: async () => {
      const { data } = await api.get('/business/dashboard/staff-earnings');
      return data.data as StaffEarnings;
    },
  });
};

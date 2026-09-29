import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface RateCard {
  id: number;
  business_id: number | null;
  category: 'utility' | 'authentication' | 'service' | 'marketing' | 'ai_vision';
  wholesale_cost: string;
  retail_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformMetrics {
  total_float: number;
  total_recharged: number;
  total_consumed: number;
  total_wholesale_cost: number;
  total_platform_profit: number;
  margin_percentage: number;
  active_wallets_count: number;
  total_wallets_count: number;
}

export interface TenantWallet {
  id: number;
  business_id: number;
  balance: string;
  currency: string;
  low_balance_threshold: string;
  total_recharged: string;
  total_consumed: string;
  status: 'active' | 'low_balance' | 'suspended' | 'depleted';
  business?: {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: string;
  };
}

export const useWhatsAppPricing = () => {
  return useQuery({
    queryKey: ['superadmin', 'whatsapp-pricing'],
    queryFn: async () => {
      const { data } = await api.get('/superadmin/whatsapp-pricing');
      return data.data as {
        global_rates: RateCard[];
        platform_metrics: PlatformMetrics;
      };
    },
  });
};

export const useUpdateGlobalRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { category: string; wholesale_cost: number; retail_price: number }) => {
      const { data } = await api.put('/superadmin/whatsapp-pricing/rates', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'whatsapp-pricing'] });
    },
  });
};

export interface TenantWalletsFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: 'all' | 'healthy' | 'low_balance' | 'depleted' | '';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const useTenantWallets = (params: TenantWalletsFilters = {}) => {
  const { page = 1, per_page = 10, search = '', status = '', sort_by = 'balance', sort_order = 'desc' } = params;
  return useQuery({
    queryKey: ['superadmin', 'tenant-wallets', { page, per_page, search, status, sort_by, sort_order }],
    queryFn: async () => {
      const { data } = await api.get('/superadmin/whatsapp-pricing/tenant-wallets', {
        params: {
          page,
          per_page,
          search: search || undefined,
          status: status && status !== 'all' ? status : undefined,
          sort_by,
          sort_order,
        }
      });
      return data.data;
    },
  });
};

export const useCreditTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { business_id: number; amount: number; description: string; reference?: string }) => {
      const { data } = await api.post('/superadmin/whatsapp-pricing/credit-tenant', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'whatsapp-pricing'] });
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'tenant-wallets'] });
    },
  });
};

export const useSetTenantRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { business_id: number; category: string; wholesale_cost: number; retail_price: number }) => {
      const { data } = await api.post('/superadmin/whatsapp-pricing/tenant-rate', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'whatsapp-pricing'] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface WalletInfo {
  id: number;
  business_id: number;
  balance: number;
  currency: string;
  status: 'active' | 'low_balance' | 'suspended' | 'depleted';
  low_balance_threshold: number;
  is_low_balance: boolean;
  is_depleted: boolean;
  total_recharged: number;
  total_consumed: number;
}

export interface RateItem {
  category: string;
  retail_price: number;
  is_custom: boolean;
}

export interface RechargePack {
  amount: number;
  label: string;
  tag: string;
  popular?: boolean;
}

export interface WalletResponse {
  wallet: WalletInfo;
  rates: Record<string, RateItem>;
  packs: RechargePack[];
}

export interface TransactionItem {
  id: number;
  business_id: number;
  wallet_id: number;
  type: 'credit' | 'debit';
  category: string;
  amount: string;
  balance_before: string;
  balance_after: string;
  reference_id: string | null;
  description: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export const useWhatsAppWallet = () => {
  return useQuery({
    queryKey: ['business', 'whatsapp-wallet'],
    queryFn: async () => {
      const { data } = await api.get('/business/whatsapp/wallet');
      return data.data as WalletResponse;
    },
  });
};

export const useWalletTransactions = (page: number = 1, filters?: { type?: string; category?: string }) => {
  return useQuery({
    queryKey: ['business', 'whatsapp-transactions', page, filters],
    queryFn: async () => {
      const { data } = await api.get('/business/whatsapp/wallet/transactions', {
        params: { page, ...filters },
      });
      return data.data;
    },
  });
};

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentPayload {
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const useCreateRechargeOrder = () => {
  return useMutation({
    mutationFn: async (payload: { amount: number }) => {
      const { data } = await api.post('/business/whatsapp/wallet/create-order', payload);
      return data.data as RazorpayOrderResponse;
    },
  });
};

export const useVerifyRechargePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload) => {
      const { data } = await api.post('/business/whatsapp/wallet/verify-payment', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-transactions'] });
    },
  });
};

export const useRechargeWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { amount: number; payment_method?: string; payment_id?: string }) => {
      const { data } = await api.post('/business/whatsapp/wallet/recharge', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['business', 'whatsapp-transactions'] });
    },
  });
};

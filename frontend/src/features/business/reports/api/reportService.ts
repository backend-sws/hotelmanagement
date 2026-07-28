import api from '@/lib/api';

export interface ProfitLossResponse {
  data: {
    revenue: {
      gross_sales: number;
      credit_notes: number;
      debit_notes: number;
      net_revenue: number;
    };
    direct_costs: {
      material_consumption: number;
      labour_and_wages: number;
      total_direct_costs: number;
    };
    gross_profit: {
      amount: number;
      margin_percentage: number;
    };
    indirect_expenses: {
      items: {
        category: string;
        amount: number;
        percentage: number;
      }[];
      total_amount: number;
    };
    net_profit: {
      amount: number;
      margin_percentage: number;
    };
    from_date: string;
    to_date: string;
  };
}

export interface BalanceSheetResponse {
  data: {
    as_of_date: string;
    assets: {
      current_assets: {
        cash_in_hand: number;
        bank_accounts: {
          items: {
            id: number;
            name: string;
            balance: number;
          }[];
          total_balance: number;
        };
        accounts_receivable: number;
        inventory_valuation: number;
      };
      total_assets: number;
    };
    liabilities: {
      current_liabilities: {
        accounts_payable: number;
        uncleared_cheques: number;
      };
      total_liabilities: number;
    };
    equity: {
      retained_earnings: number;
      total_equity: number;
    };
    total_liabilities_and_equity: number;
    is_balanced: boolean;
  };
}

export interface SalesAnalysisResponse {
  data: {
    summary: {
      total_revenue: number;
      total_invoices: number;
      average_invoice_value: number;
    };
    by_customer: {
      customer_id: number;
      customer_name: string;
      phone: string;
      invoice_count: number;
      total_revenue: number;
    }[];
    by_product: {
      product_id: number;
      product_name: string;
      uom: string;
      total_quantity: number;
      total_revenue: number;
    }[];
    by_sales_rep: {
      user_id: number;
      rep_name: string;
      invoice_count: number;
      total_revenue: number;
    }[];
    trends: {
      date: string;
      invoice_count: number;
      total_revenue: number;
    }[];
    from_date: string;
    to_date: string;
  };
}

export const reportService = {
  getProfitLoss: async (params?: { from_date?: string; to_date?: string }): Promise<ProfitLossResponse> => {
    const response = await api.get('/business/reports/profit-loss', { params });
    return response.data;
  },

  getBalanceSheet: async (params?: { date?: string }): Promise<BalanceSheetResponse> => {
    const response = await api.get('/business/reports/balance-sheet', { params });
    return response.data;
  },

  getSalesAnalysis: async (params?: { from_date?: string; to_date?: string }): Promise<SalesAnalysisResponse> => {
    const response = await api.get('/business/reports/sales-analysis', { params });
    return response.data;
  },
};

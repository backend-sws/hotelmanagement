import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Percent, 
  Edit3, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  useWhatsAppPricing, 
  useUpdateGlobalRate, 
  useTenantWallets, 
  useCreditTenant,
  useSetTenantRate,
  type RateCard 
} from '../api/useWhatsAppPricing';
import { useSuperadminTenants } from '@/features/superadmin/tenants/api/useSuperadminTenants';
import { toast } from 'sonner';

const categoryLabels: Record<string, { label: string; desc: string; icon: string }> = {
  utility: {
    label: 'Utility Template',
    desc: 'Punch In/Out confirms, shift alerts, task assigned notifications',
    icon: '⚡',
  },
  authentication: {
    label: 'Authentication / OTP',
    desc: 'Client task completion verification OTP, login passcodes',
    icon: '🔐',
  },
  service: {
    label: 'Service Conversation',
    desc: 'Staff-initiated 24hr free-form conversational window',
    icon: '💬',
  },
  marketing: {
    label: 'Marketing Template',
    desc: 'Broadcast announcements, festive wishes, policy updates',
    icon: '📢',
  },
  ai_vision: {
    label: 'AI Vision Verification',
    desc: 'Gemini Vision photo anti-fraud inspection surcharge',
    icon: '🤖',
  },
};

export default function WhatsAppPricingPage() {
  const { data, isLoading } = useWhatsAppPricing();

  // Tenant Wallets Pagination, Search, and Status state
  const [walletPage, setWalletPage] = useState<number>(1);
  const [walletPerPage, setWalletPerPage] = useState<number>(10);
  const [searchTenant, setSearchTenant] = useState<string>('');
  const debouncedSearchTenant = useDebounce(searchTenant, 350);
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'low_balance' | 'depleted'>('all');

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setWalletPage(1);
  }, [debouncedSearchTenant, statusFilter, walletPerPage]);

  const { data: walletsData, isLoading: isWalletsLoading } = useTenantWallets({
    page: walletPage,
    per_page: walletPerPage,
    search: debouncedSearchTenant,
    status: statusFilter === 'all' ? '' : statusFilter,
  });

  const { data: allTenantsResponse } = useSuperadminTenants({ all: true });
  const allTenants = Array.isArray(allTenantsResponse?.data) ? allTenantsResponse.data : [];
  const updateRateMutation = useUpdateGlobalRate();
  const creditTenantMutation = useCreditTenant();

  // Edit Rate Modal state
  const [editingRate, setEditingRate] = useState<RateCard | null>(null);
  const [editWholesale, setEditWholesale] = useState<number>(0);
  const [editRetail, setEditRetail] = useState<number>(0);

  // Credit Tenant Modal state
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | ''>('');
  const [modalSearch, setModalSearch] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<number>(100);
  const [creditDesc, setCreditDesc] = useState<string>('Welcome Promotional Trial Credit');

  // Custom Tenant Tariff Modal state
  const [customTariffTenant, setCustomTariffTenant] = useState<{ id: number; name: string } | null>(null);
  const [customCategory, setCustomCategory] = useState<'utility' | 'authentication' | 'service' | 'marketing' | 'ai_vision'>('utility');
  const [customWholesale, setCustomWholesale] = useState<number>(0.125);
  const [customRetail, setCustomRetail] = useState<number>(0.25);
  const setTenantRateMutation = useSetTenantRate();

  const metrics = data?.platform_metrics;
  const rates = data?.global_rates || [];

  const wallets = walletsData?.data || [];
  const totalWallets = walletsData?.total ?? 0;
  const lastPage = walletsData?.last_page ?? 1;
  const fromRecord = walletsData?.from ?? 0;
  const toRecord = walletsData?.to ?? 0;

  // Wallet lookup map by business ID
  const walletMap = new Map<number, any>((wallets || []).map((w: any) => [w.business_id, w]));

  // Comprehensive business list for selection modals
  const businessOptions = (allTenants && allTenants.length > 0)
    ? allTenants.map((b: any) => {
        const w: any = walletMap.get(b.id);
        return {
          id: b.id,
          name: b.name,
          balance: w ? parseFloat(w.balance).toFixed(2) : '0.00',
        };
      })
    : (wallets || []).map((w: any) => ({
        id: w.business_id,
        name: w.business?.name || `Business #${w.business_id}`,
        balance: parseFloat(w.balance).toFixed(2),
      }));

  const filteredModalBusinesses = businessOptions.filter((b: any) => {
    if (!modalSearch.trim()) return true;
    const q = modalSearch.toLowerCase();
    return b.name.toLowerCase().includes(q) || String(b.id).includes(q);
  });

  const selectedTenant = businessOptions.find((b: any) => b.id === Number(selectedTenantId));

  const handleOpenEdit = (rate: RateCard) => {
    setEditingRate(rate);
    setEditWholesale(parseFloat(rate.wholesale_cost));
    setEditRetail(parseFloat(rate.retail_price));
  };

  const handleSaveRate = async () => {
    if (!editingRate) return;
    try {
      await updateRateMutation.mutateAsync({
        category: editingRate.category,
        wholesale_cost: editWholesale,
        retail_price: editRetail,
      });
      toast.success(`${categoryLabels[editingRate.category]?.label || editingRate.category} rate updated!`);
      setEditingRate(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update rate');
    }
  };

  const handleGrantCredit = async () => {
    if (!selectedTenantId || creditAmount <= 0) {
      toast.error('Please select a business and enter a valid credit amount.');
      return;
    }

    try {
      await creditTenantMutation.mutateAsync({
        business_id: Number(selectedTenantId),
        amount: creditAmount,
        description: creditDesc,
      });
      toast.success(`Successfully credited ₹${creditAmount} to tenant wallet!`);
      setIsCreditModalOpen(false);
      setSelectedTenantId('');
      setCreditAmount(100);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to credit wallet');
    }
  };

  const handleOpenCustomTariff = (businessId: number, businessName: string) => {
    setCustomTariffTenant({ id: businessId, name: businessName });
    setCustomCategory('utility');
    setCustomWholesale(0.125);
    setCustomRetail(0.25);
  };

  const handleSaveCustomTariff = async () => {
    if (!customTariffTenant) return;
    try {
      await setTenantRateMutation.mutateAsync({
        business_id: customTariffTenant.id,
        category: customCategory,
        wholesale_cost: customWholesale,
        retail_price: customRetail,
      });
      toast.success(`Custom tariff for ${customTariffTenant.name} saved successfully!`);
      setCustomTariffTenant(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to set custom tenant rate');
    }
  };

  const filteredWallets = wallets.filter((w: any) => {
    const name = w.business?.name || `Business #${w.business_id}`;
    return name.toLowerCase().includes(searchTenant.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              WhatsApp Pricing & Margin Control
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure wholesale Meta costs vs retail tariffs, monitor gross profit margins, and manage tenant wallets.
          </p>
        </div>

        <button
          onClick={() => setIsCreditModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm shadow-emerald-600/20 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          Grant Promotional Credit
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Float */}
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Wallet Float
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{metrics?.total_float?.toLocaleString('en-IN') || '0.00'}
            </span>
            <p className="text-xs text-slate-500 mt-1">Prepaid funds held across {metrics?.active_wallets_count || 0} active wallets</p>
          </div>
        </div>

        {/* Total Consumed */}
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Consumed
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{metrics?.total_consumed?.toLocaleString('en-IN') || '0.00'}
            </span>
            <p className="text-xs text-slate-500 mt-1">Total revenue deducted for messages & AI</p>
          </div>
        </div>

        {/* Net Platform Profit */}
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Net Platform Profit
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              ₹{metrics?.total_platform_profit?.toLocaleString('en-IN') || '0.00'}
            </span>
            <p className="text-xs text-slate-500 mt-1">Total markup earned after Meta wholesale cost</p>
          </div>
        </div>

        {/* Margin % */}
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Gross Margin
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {metrics?.margin_percentage || 0}%
            </span>
            <p className="text-xs text-slate-500 mt-1">Average platform profit margin</p>
          </div>
        </div>
      </div>

      {/* Section 1: Global Master Rate Cards */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Master Rate Cards (Global Retail Tariffs)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These tariffs apply by default to all businesses unless a custom tenant contract is set.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Message / Event Category</th>
                <th className="py-3 px-4">Meta/Wholesale Cost</th>
                <th className="py-3 px-4">Client Retail Price</th>
                <th className="py-3 px-4">Your Net Profit</th>
                <th className="py-3 px-4">Margin %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {rates.map((rate) => {
                const wholesale = parseFloat(rate.wholesale_cost);
                const retail = parseFloat(rate.retail_price);
                const profit = retail - wholesale;
                const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : '0';
                const meta = categoryLabels[rate.category] || { label: rate.category, desc: '', icon: '📄' };

                return (
                  <tr key={rate.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{meta.icon}</span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{meta.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">{meta.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                      ₹{wholesale.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{retail.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      +₹{profit.toFixed(4)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        {margin}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(rate)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Tariff
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Tenant Wallets & Balances */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                Tenant Prepaid Wallets
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {totalWallets} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live balances, consumption rates, and wallet health for all registered businesses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search business, email, phone..."
                value={searchTenant}
                onChange={(e) => setSearchTenant(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTenant && (
                <button
                  type="button"
                  onClick={() => setSearchTenant('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'healthy', label: 'Healthy' },
                { id: 'low_balance', label: 'Low' },
                { id: 'depleted', label: 'Depleted' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === tab.id
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={walletPerPage}
                onChange={(e) => setWalletPerPage(Number(e.target.value))}
                className="px-2 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Recharged</th>
                <th className="py-3 px-4">Total Consumed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isWalletsLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                      Loading tenant wallets...
                    </div>
                  </td>
                </tr>
              ) : wallets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No tenant wallets found</p>
                    <p className="text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
                    {(searchTenant || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTenant('');
                          setStatusFilter('all');
                        }}
                        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                      >
                        Reset Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                wallets.map((w: any) => {
                  const bal = parseFloat(w.balance);
                  const isLow = bal < parseFloat(w.low_balance_threshold);
                  const isDepleted = bal <= 0;

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {w.business?.name || `Business #${w.business_id}`}
                          </p>
                          <p className="text-xs text-slate-500">{w.business?.phone || w.business?.email || 'No contact'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-mono text-base font-bold ${
                          isDepleted ? 'text-rose-600 dark:text-rose-400' :
                          isLow ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          ₹{bal.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {isDepleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400">
                            <AlertCircle className="w-3 h-3" /> Depleted
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            <AlertCircle className="w-3 h-3" /> Low Balance
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        ₹{parseFloat(w.total_recharged).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        ₹{parseFloat(w.total_consumed).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenCustomTariff(w.business_id, w.business?.name || `Business #${w.business_id}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Custom Tariff
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTenantId(w.business_id);
                              setModalSearch('');
                              setCreditAmount(100);
                              setCreditDesc('Promotional Credit Grant');
                              setIsCreditModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            +₹100 Credit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{fromRecord}</span> to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{toRecord}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{totalWallets}</span> businesses
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWalletPage((p) => Math.max(1, p - 1))}
              disabled={walletPage <= 1 || isWalletsLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === lastPage || Math.abs(p - walletPage) <= 1)
                .reduce((acc: (number | string)[], p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push('...');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${item}`}
                      onClick={() => setWalletPage(Number(item))}
                      disabled={isWalletsLoading}
                      className={`min-w-8 h-8 px-2 rounded-lg font-semibold transition-all ${
                        walletPage === item
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setWalletPage((p) => Math.min(lastPage, p + 1))}
              disabled={walletPage >= lastPage || isWalletsLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Rate Modal */}
      {editingRate && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setEditingRate(null)}
        >
          <div 
            className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-500" />
              Edit Tariff: {categoryLabels[editingRate.category]?.label || editingRate.category}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust wholesale base cost and client selling price.
            </p>

            <div className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Meta/AI Wholesale Cost (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editWholesale}
                  onChange={(e) => setEditWholesale(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Client Retail Selling Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editRetail}
                  onChange={(e) => setEditRetail(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Real-time Profit Preview */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-emerald-900 dark:text-emerald-300">
                  <span>Gross Profit per Message:</span>
                  <span className="font-mono font-bold">+₹{(editRetail - editWholesale).toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-emerald-900 dark:text-emerald-300">
                  <span>Gross Profit Margin:</span>
                  <span className="font-mono font-bold">
                    {editRetail > 0 ? (((editRetail - editWholesale) / editRetail) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingRate(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRate}
                disabled={updateRateMutation.isPending}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {updateRateMutation.isPending ? 'Saving...' : 'Save Tariff'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Credit Tenant Modal */}
      {isCreditModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsCreditModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-500" />
              Grant Wallet Credits / Trial
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add prepaid WhatsApp funds to an onboarded business.
            </p>

            <div className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Business
                </label>

                {/* Instant Search Filter for Businesses */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Type to filter businesses..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {modalSearch && (
                    <button
                      type="button"
                      onClick={() => setModalSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">-- Choose Business ({filteredModalBusinesses.length} available) --</option>
                  {filteredModalBusinesses.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Current: ₹{b.balance})
                    </option>
                  ))}
                </select>

                {selectedTenant && (
                  <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">{selectedTenant.name}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      Current: ₹{selectedTenant.balance}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Credit Amount (₹)
                </label>
                <div className="flex gap-2 mb-2">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCreditAmount(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        creditAmount === amt
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={creditDesc}
                  onChange={(e) => setCreditDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrantCredit}
                disabled={creditTenantMutation.isPending}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {creditTenantMutation.isPending ? 'Crediting...' : 'Confirm Credit'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Tenant Tariff Modal */}
      {customTariffTenant && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setCustomTariffTenant(null)}
        >
          <div 
            className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              Custom Tariff: {customTariffTenant.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Set dedicated contract rates for this tenant. Overrides the global master tariff.
            </p>

            <div className="space-y-4 my-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Message / Event Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(categoryLabels).map(([cat, info]) => (
                    <option key={cat} value={cat}>
                      {info.icon} {info.label} ({cat})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Meta/AI Wholesale Cost (₹)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={customWholesale}
                  onChange={(e) => setCustomWholesale(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Client Retail Selling Price (₹)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={customRetail}
                  onChange={(e) => setCustomRetail(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Profit Preview */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-blue-900 dark:text-blue-300">
                  <span>Net Profit per Event:</span>
                  <span className="font-mono font-bold">+₹{(customRetail - customWholesale).toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-blue-900 dark:text-blue-300">
                  <span>Margin %:</span>
                  <span className="font-mono font-bold">
                    {customRetail > 0 ? (((customRetail - customWholesale) / customRetail) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCustomTariffTenant(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomTariff}
                disabled={setTenantRateMutation.isPending}
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {setTenantRateMutation.isPending ? 'Saving...' : 'Apply Tenant Rate'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

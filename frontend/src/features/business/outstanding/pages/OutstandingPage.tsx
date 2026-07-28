import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  HelpCircle, DollarSign, Clock, 
  TrendingUp, TrendingDown, CheckCircle, Smartphone,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterReset } from '@/components/ui/filter-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { outstandingService, type AgingRow } from '../api/outstandingService';
import { toast } from 'sonner';

export default function OutstandingPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'supplier'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [showZero, setShowZero] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch KPI summary
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['outstanding-summary'],
    queryFn: () => outstandingService.getSummary(),
  });

  // Fetch aging list based on tab
  const { data: listResponse, isLoading: loadingList } = useQuery({
    queryKey: ['outstanding-list', activeTab, debouncedSearch, showZero],
    queryFn: () => activeTab === 'customer'
      ? outstandingService.getCustomers({ search: debouncedSearch || undefined, show_zero: showZero })
      : outstandingService.getSuppliers({ search: debouncedSearch || undefined, show_zero: showZero }),
  });

  const agingItems: AgingRow[] = listResponse?.data || [];

  const handleSendReminder = async (partyType: 'customer' | 'supplier', partyId: number) => {
    try {
      const res = await outstandingService.sendReminder(partyType, partyId);
      if (res.whatsapp_url) {
        window.open(res.whatsapp_url, '_blank');
        toast.success(`WhatsApp reminder drafted for ${res.party_name || 'party'}`);
      }
    } catch {
      toast.error('Could not generate reminder link');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <Clock className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Outstanding Aging Reports <span className="text-indigo-600 dark:text-indigo-400 text-base font-bold px-2 py-0.5 rounded-md bg-indigo-500/10">Dues & Cashflow</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Track overdue Udhar, categorize credit by aging buckets (0-30, 31-60, 61-90+ days), and expedite collection with 1-click WhatsApp payment links.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'How does Aging Analysis work?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-5 h-5 fill-indigo-500 text-indigo-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Outstanding Dues & Aging Buckets</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                Aging analysis categorizes unpaid invoices based on the number of days they have been overdue, helping you manage cash flow and collection efforts effectively.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>⏱️</span> 1. Why 30-Day Buckets?
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Separating dues into 0-30 (Current), 31-60 (Overdue), 61-90 (Critical), and 90+ (Severe) days helps prioritize follow-ups on the oldest, highest-risk Udhar accounts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>💬</span> 2. 1-Click WhatsApp Reminders
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Clicking "WhatsApp Reminder" formats a polite collection message containing the exact outstanding figure and opens a direct chat with the party's mobile number.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    <span>⚖️</span> 3. Net Working Capital
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Comparing total receivables against supplier payables reveals your net liquidity position, preventing cash flow deficit during vendor payment deadlines.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CustomKpiCard
            title="Total Receivables (To Collect)"
            value={loadingSummary ? '...' : formatCurrency(summary?.total_receivable || 0)}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Customer Udhar accounts"
          />
          <CustomKpiCard
            title="Total Payables (To Pay Vendors)"
            value={loadingSummary ? '...' : formatCurrency(summary?.total_payable || 0)}
            icon={<TrendingDown className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Supplier bills outstanding"
          />
          <CustomKpiCard
            title="Net Working Position"
            value={loadingSummary ? '...' : `₹ ${Math.abs(summary?.net_position || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            glowColor="indigo"
            subtitle={(summary?.net_position || 0) >= 0 ? 'Cash Surplus (Favorable)' : 'Deficit (Payables Exceed Receivables)'}
          />
        </div>

        {/* Filter Controls & Tab Bar */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
                activeTab === 'customer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              Customer Receivables ({activeTab === 'customer' ? agingItems.length : ''})
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
                activeTab === 'supplier'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              Supplier Payables ({activeTab === 'supplier' ? agingItems.length : ''})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 justify-end">
            <label className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={showZero}
                onChange={(e) => setShowZero(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show settled (₹0)
            </label>

            <FilterSearch
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder={`SEARCH ${activeTab.toUpperCase()} NAME OR PHONE...`}
              wrapperClassName="w-full sm:w-72 h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />

            {(searchQuery || showZero) && (
              <FilterReset
                onClick={() => {
                  setSearchQuery('');
                  setShowZero(false);
                }}
              />
            )}
          </div>
        </FilterContainer>

        {/* Documents Table Card */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-[11px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
                  <th className="py-4 px-6">Party Detail</th>
                  <th className="py-4 px-5 text-right text-slate-900 dark:text-white">Total Due (₹)</th>
                  <th className="py-4 px-5 text-right text-emerald-600 dark:text-emerald-400">0 - 30 Days<br/><span className="text-[9px] font-normal text-slate-400">(Current)</span></th>
                  <th className="py-4 px-5 text-right text-amber-600 dark:text-amber-400">31 - 60 Days<br/><span className="text-[9px] font-normal text-slate-400">(Overdue)</span></th>
                  <th className="py-4 px-5 text-right text-orange-600 dark:text-orange-400">61 - 90 Days<br/><span className="text-[9px] font-normal text-slate-400">(Critical)</span></th>
                  <th className="py-4 px-5 text-right text-rose-600 dark:text-rose-400">90+ Days<br/><span className="text-[9px] font-normal text-slate-400">(Severe)</span></th>
                  <th className="py-4 px-5 text-center">Last Bill</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {loadingList ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-36 rounded-lg" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-24 ml-auto rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-4 w-20 mx-auto rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-28 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : agingItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">All accounts settled!</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {searchQuery || showZero
                            ? "No accounts match your current filter criteria."
                            : `No pending outstanding dues found for your ${activeTab}s.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  agingItems.map((item) => (
                    <tr key={item.party_id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{item.name}</span>
                        <span className="text-xs text-slate-400 font-normal">{item.phone || 'No Phone'} {item.gstin ? `• ${item.gstin}` : ''}</span>
                      </td>
                      <td className="py-4 px-5 text-right font-black text-base text-slate-900 dark:text-white">
                        ₹ {item.total_outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-5 text-right font-bold">
                        {item.current_0_30 > 0 ? (
                          <span className="inline-flex px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                            ₹ {item.current_0_30.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : <span className="text-slate-300 dark:text-slate-700">-</span>}
                      </td>
                      <td className="py-4 px-5 text-right font-bold">
                        {item.overdue_31_60 > 0 ? (
                          <span className="inline-flex px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                            ₹ {item.overdue_31_60.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : <span className="text-slate-300 dark:text-slate-700">-</span>}
                      </td>
                      <td className="py-4 px-5 text-right font-bold">
                        {item.overdue_61_90 > 0 ? (
                          <span className="inline-flex px-2 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold">
                            ₹ {item.overdue_61_90.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : <span className="text-slate-300 dark:text-slate-700">-</span>}
                      </td>
                      <td className="py-4 px-5 text-right font-black">
                        {item.overdue_90_plus > 0 ? (
                          <span className="inline-flex px-2 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                            ₹ {item.overdue_90_plus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        ) : <span className="text-slate-300 dark:text-slate-700">-</span>}
                      </td>
                      <td className="py-4 px-5 text-center text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                        {item.last_invoice_date ? new Date(item.last_invoice_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleSendReminder(activeTab, item.party_id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-9 px-3.5 shadow-sm gap-1.5"
                        >
                          <Smartphone className="w-3.5 h-3.5" /> WhatsApp Reminder
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

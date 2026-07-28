import React, { useState, useEffect } from 'react';
import { 
  Clock, Plus, HelpCircle, 
  CheckCircle, Trash2, 
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { chequeService } from '../api/chequeService';
import { cashbookService } from '@/features/business/cashbook/api/cashbookService';
import { ChequeSummaryCards } from '../components/ChequeSummaryCards';
import { ChequeForm } from '../components/ChequeForm';
import { ChequeStatusModal } from '../components/ChequeStatusModal';
import { toast } from 'sonner';

export default function ChequeRegisterPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'issued'>('received');
  const [cheques, setCheques] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 400);
  
  // Alert data
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formType, setFormType] = useState<'received' | 'issued'>('received');
  const [selectedCheque, setSelectedCheque] = useState<any>(null);
  const [statusModalType, setStatusModalType] = useState<'deposited' | 'cleared' | 'bounced' | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const fetchCheques = async () => {
    setLoading(true);
    try {
      const res = await chequeService.list({
        type: activeTab,
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
        page,
        per_page: 30
      });
      setCheques(res.data?.data || []);
      if (res.stats) {
        setStats(res.stats);
        setPendingCount(res.stats.pending_deposit_count || 0);
      }
      
      const sumRes = await chequeService.getSummary();
      if (sumRes?.data?.upcoming_count) {
        setUpcomingCount(sumRes.data.upcoming_count);
      }

      const banksRes = await cashbookService.listBankAccounts();
      setBankAccounts(banksRes.data || []);
    } catch {
      toast.error('Failed to load Cheque Register');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheques();
  }, [activeTab, statusFilter, debouncedSearch, page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this cheque record?')) return;
    try {
      await chequeService.delete(id);
      toast.success('Cheque removed from register');
      fetchCheques();
    } catch {
      toast.error('Failed to remove cheque');
    }
  };

  const openStatusModal = (cheque: any, target: 'deposited' | 'cleared' | 'bounced') => {
    setSelectedCheque(cheque);
    setStatusModalType(target);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Top Alerts Section */}
        {(pendingCount > 0 || upcomingCount > 0) && (
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-800 dark:text-amber-300 shadow-sm relative z-20">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-200">
                ⚠️ <span className="font-extrabold">{pendingCount} customer cheques pending bank deposit!</span>
              </div>
            )}
            {upcomingCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-700 dark:text-blue-200">
                ⏰ <span className="font-extrabold">{upcomingCount} cheques due for clearance within next 7 days</span>
              </div>
            )}
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 ml-auto">
              Ensure timely banking to avoid cash flow delays & bounced PDCs.
            </span>
          </div>
        )}

        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <Clock className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Cheque Register <span className="text-indigo-600 dark:text-indigo-400 text-base font-bold px-2 py-0.5 rounded-md bg-indigo-500/10">PDC Tracker</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage customer cheques & post-dated cheques (PDCs), track clearance statuses, and sync automatically with banking ledgers.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              variant="outline"
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-indigo-200 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm h-11 px-4 text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'Cheque Lifecycle Guide'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
            <Button
              onClick={() => { setFormType(activeTab); setIsFormOpen(true); }}
              className="rounded-xl font-black text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 h-11 px-6"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Record New Cheque
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/20 border-2 border-indigo-200 dark:border-indigo-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-5 h-5 fill-indigo-500 text-indigo-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Automated Cheque Clearance Workflow</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                Our cheque engine automates accounting transactions as cheques transition through their physical and banking lifecycles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 font-black text-xs text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    <span>⚪</span> 1. Pending Deposit
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Cheques collected from customers (or issued PDCs) waiting in your drawer until their printed date arrives.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <span>🟡</span> 2. Marked Deposited
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Click 'Mark Deposited' when submitting the cheque slip to your bank. Tracks bank clearing transit days.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>🟢</span> 3. Marked Cleared
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    When funds hit your account, click 'Mark Cleared'. Our engine credits your bank balance and settles Udhar Khata!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    <span>🔴</span> 4. Cheque Bounced
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    If dishonoured due to balance or signature discrepancy, marking as bounced immediately re-debits the customer!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Summary Cards */}
        <ChequeSummaryCards stats={stats} />

        {/* Tabs and Filter Controls */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setActiveTab('received'); setPage(1); }}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
                activeTab === 'received'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              📥 Received from Customers ({activeTab === 'received' ? cheques.length : ''})
            </button>
            <button
              onClick={() => { setActiveTab('issued'); setPage(1); }}
              className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
                activeTab === 'issued'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              📤 Issued to Suppliers (PDCs) ({activeTab === 'issued' ? cheques.length : ''})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 justify-end">
            <FilterSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="SEARCH CHEQUE#, BANK OR PARTY..."
              wrapperClassName="w-full sm:w-64 h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />

            <FilterSelect
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val || '');
                setPage(1);
              }}
              placeholder="All Statuses"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: '⚪ Pending Deposit' },
                { value: 'deposited', label: '🟡 Deposited (Clearing)' },
                { value: 'cleared', label: '🟢 Cleared & Realized' },
                { value: 'bounced', label: '🔴 Bounced / Dishonoured' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />

            {(search || statusFilter) && (
              <FilterReset
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPage(1);
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
                  <th className="py-4 px-6">Cheque # & Bank</th>
                  <th className="py-4 px-5">Cheque Date</th>
                  <th className="py-4 px-5">Party & Payee</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Lifecycle Actions</th>
                  <th className="py-4 px-6 text-center">Del</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-28 rounded-lg" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-24 rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-40 rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-5 w-24 rounded" /></td>
                      <td className="py-4 px-5"><Skeleton className="h-6 w-28 rounded-full" /></td>
                      <td className="py-4 px-5 text-center"><Skeleton className="h-8 w-36 mx-auto rounded-xl" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : cheques.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No cheques found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || statusFilter
                            ? "Try clearing your search query or status filter."
                            : "No cheques recorded in this tab yet."}
                        </p>
                        <Button
                          onClick={() => { setFormType(activeTab); setIsFormOpen(true); }}
                          size="sm"
                          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Record First Cheque
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cheques.map((chq) => (
                    <tr key={chq.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                          #{chq.cheque_number}
                        </div>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {chq.bank_name} {chq.branch ? `(${chq.branch})` : ''}
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-zinc-200">
                          {new Date(chq.cheque_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">Printed Date</span>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        {chq.party_name && (
                          <span className="font-black text-slate-900 dark:text-white block text-sm">
                            {chq.party_type === 'customer' ? '👤' : '🏢'} {chq.party_name}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                          Favour: {chq.in_favour_of || 'Company A/C'}
                        </span>
                        {chq.notes && <div className="text-[11px] text-slate-400 italic mt-0.5">&ldquo;{chq.notes}&rdquo;</div>}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-black text-slate-900 dark:text-white text-base font-mono">
                          ₹ {Number(chq.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        {chq.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-white/10">
                            ⚪ Pending Deposit
                          </span>
                        )}
                        {chq.status === 'deposited' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            🟡 Deposited
                            {chq.deposit_date && <span className="text-[10px] font-normal ml-1">({chq.deposit_date})</span>}
                          </span>
                        )}
                        {chq.status === 'cleared' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Cleared ({chq.clearance_date})
                          </span>
                        )}
                        {chq.status === 'bounced' && (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                              🔴 Bounced ({chq.bounce_date})
                            </span>
                            {chq.bounce_reason && <div className="text-[11px] text-rose-500 font-bold mt-1">{chq.bounce_reason}</div>}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50/80 dark:bg-white/[0.02] p-1.5 rounded-xl border border-slate-200/80 dark:border-white/10">
                          {chq.status === 'pending' && (
                            <button
                              onClick={() => openStatusModal(chq, 'deposited')}
                              className="px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 transition-colors shadow-xs"
                            >
                              Mark Deposited
                            </button>
                          )}
                          {chq.status !== 'cleared' && (
                            <button
                              onClick={() => openStatusModal(chq, 'cleared')}
                              className="px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark Cleared
                            </button>
                          )}
                          {chq.status !== 'bounced' && (
                            <button
                              onClick={() => openStatusModal(chq, 'bounced')}
                              className="px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 transition-colors shadow-xs"
                            >
                              Mark Bounced
                            </button>
                          )}
                          {chq.status === 'cleared' && (
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 px-2 flex items-center gap-1">✓ Realized in Bank</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(chq.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="Delete Cheque"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChequeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchCheques()}
        bankAccounts={bankAccounts}
        defaultType={formType}
      />

      <ChequeStatusModal
        isOpen={statusModalType !== null}
        onClose={() => { setStatusModalType(null); setSelectedCheque(null); }}
        onSuccess={() => fetchCheques()}
        cheque={selectedCheque}
        targetStatus={statusModalType}
        bankAccounts={bankAccounts}
      />
    </div>
  );
}

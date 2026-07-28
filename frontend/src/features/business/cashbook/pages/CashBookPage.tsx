import React, { useState, useEffect } from 'react';
import { 
  Wallet, Plus, HelpCircle, ArrowUpRight, 
  ArrowDownRight, Trash2, Calendar, Landmark,
  FileSpreadsheet, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { cashbookService } from '../api/cashbookService';
import { BalanceCard } from '../components/BalanceCard';
import { CashEntryForm } from '../components/CashEntryForm';
import { AddBankAccountModal } from '../components/AddBankAccountModal';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function CashBookPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    cash_in_hand: 0,
    total_bank_balance: 0,
    bank_accounts: [],
    total_liquidity: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [accountType, setAccountType] = useState<string>(''); 
  const [entryType, setEntryType] = useState<string>(''); 
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 400);

  // Modals & Guide state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [defaultModalType, setDefaultModalType] = useState<'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment'>('cash_receipt');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const fetchCashBook = async () => {
    setLoading(true);
    try {
      const res = await cashbookService.list({
        page,
        search: debouncedSearch || undefined,
        account_type: accountType || undefined,
        entry_type: entryType || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        per_page: 30
      });
      setEntries(res.data?.data || []);
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch {
      toast.error('Failed to fetch Cash & Bank entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashBook();
  }, [page, debouncedSearch, accountType, entryType, fromDate, toDate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction? It will reverse account balances & Khata ledgers.')) return;
    try {
      await cashbookService.delete(id);
      toast.success('Transaction removed and balances restored');
      fetchCashBook();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to remove entry');
    }
  };

  const openModalWithType = (type: 'cash_receipt' | 'cash_payment' | 'bank_receipt' | 'bank_payment') => {
    setDefaultModalType(type);
    setIsEntryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-teal-500/10 dark:bg-teal-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Cash & Bank Book <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold px-2 py-0.5 rounded-md bg-emerald-500/10">Liquidity & Ledgers</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Monitor company liquidity, track cash flows, and sync entries with Party Udhar ledgers automatically.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/business/daybook">
              <Button 
                variant="outline"
                className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm h-11 px-4 text-xs uppercase"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Rozka Day Book
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm h-11 px-4 text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Cash Book?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
            <Button
              onClick={() => openModalWithType('cash_receipt')}
              className="rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 h-11 px-6"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Record Transaction
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-5 h-5 fill-emerald-500 text-emerald-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Mastering Cash & Bank Flows</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                The Cash & Bank Book ensures you have an exact, real-time pulse on your business liquidity across physical cash drawers and digital bank accounts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>💵</span> 1. Cash vs. Bank Book
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Keep physical store cash separate from digital bank deposits. Use Cash Receipt/Payment for notes, and Bank flows for UPI, NEFT, or Cheques.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <span>🤝</span> 2. Automated Party Khata Link
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    When recording a receipt or payment, link a Customer or Supplier account. Our engine instantly credits or debits their Udhar ledger automatically!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>🏦</span> 3. Multi-Bank Running Balances
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Add all company bank accounts (HDFC, SBI, ICICI). As you log transactions or clear cheques, your running account balances update seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Summary Cards & Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BalanceCard
            title="Cash In Hand (Petty Cash)"
            amount={summary.cash_in_hand || 0}
            type="cash"
            subtitle="Physical notes available"
          />
          <BalanceCard
            title="Total Bank Balances"
            amount={summary.total_bank_balance || 0}
            type="bank"
            subtitle="Across all active bank A/Cs"
            onAddClick={() => setIsBankModalOpen(true)}
            addLabel="Add Bank A/C"
          />
          <BalanceCard
            title="Net Business Liquidity"
            amount={summary.total_liquidity || 0}
            type="liquidity"
            subtitle="Total cash + bank balance"
          />

          {/* Quick Action Shortcut Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">⚡ Quick Action Pad</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => openModalWithType('cash_receipt')}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" /> + Cash In
              </button>
              <button
                onClick={() => openModalWithType('cash_payment')}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-xs border border-rose-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" /> - Cash Out
              </button>
              <button
                onClick={() => openModalWithType('bank_receipt')}
                className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold text-xs border border-blue-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <Landmark className="w-3.5 h-3.5" /> + Bank In
              </button>
              <button
                onClick={() => openModalWithType('bank_payment')}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-xs border border-amber-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <Landmark className="w-3.5 h-3.5" /> - Bank Out
              </button>
            </div>
          </div>
        </div>

        {/* Individual Bank Account Cards */}
        {(summary.bank_accounts || []).length > 0 && (
          <div className="bg-white/60 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3.5">
              Active Company Bank Accounts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(summary.bank_accounts || []).map((bank: any) => (
                <div key={bank.id} className="p-4 rounded-2xl bg-white dark:bg-[#0f0f13] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {bank.account_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                          {bank.bank_name} {bank.account_number ? `• ${bank.account_number.slice(-4)}` : ''}
                        </p>
                      </div>
                    </div>
                    {bank.is_default && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Running Balance</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                      ₹ {(bank.current_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <FilterContainer className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <FilterSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="SEARCH BY NARRATION, REF # OR PARTY NAME..."
              wrapperClassName="flex-1 min-w-[240px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />

            <FilterSelect
              value={accountType}
              onChange={(val) => {
                setAccountType(val || '');
                setPage(1);
              }}
              placeholder="All Accounts (Cash & Bank)"
              options={[
                { value: '', label: 'All Accounts (Cash & Bank)' },
                { value: 'cash', label: '💵 Cash Book Only' },
                { value: 'bank', label: '🏦 Bank Ledger Only' },
              ]}
              wrapperClassName="w-full sm:w-56 shrink-0"
            />

            <FilterSelect
              value={entryType}
              onChange={(val) => {
                setEntryType(val || '');
                setPage(1);
              }}
              placeholder="All Entry Types"
              options={[
                { value: '', label: 'All Entry Types' },
                { value: 'cash_receipt', label: 'Cash Receipts (+)' },
                { value: 'cash_payment', label: 'Cash Payments (-)' },
                { value: 'bank_receipt', label: 'Bank Receipts (+)' },
                { value: 'bank_payment', label: 'Bank Payments (-)' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />

            <div className="flex items-center gap-1.5 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 h-10 bg-slate-50 dark:bg-white/[0.02]">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none"
              />
              <span className="text-slate-400 font-bold text-xs">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none"
              />
            </div>
          </div>

          {(search || accountType || entryType || fromDate || toDate) && (
            <FilterReset
              onClick={() => {
                setSearch('');
                setAccountType('');
                setEntryType('');
                setFromDate('');
                setToDate('');
                setPage(1);
              }}
            />
          )}
        </FilterContainer>

        {/* Documents Table Card */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-[11px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
                  <th className="py-4 px-6">Date & Account</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Party & Narration</th>
                  <th className="py-4 px-6">Mode / Ref #</th>
                  <th className="py-4 px-6 text-right">Receipt (Dr +)</th>
                  <th className="py-4 px-6 text-right">Payment (Cr -)</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-28 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-48 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-8 w-8 mx-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No transactions found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || accountType || entryType || fromDate || toDate
                            ? "Try adjusting your search query or filter date criteria."
                            : "You haven't logged any cash or bank transactions yet."}
                        </p>
                        <Button
                          onClick={() => openModalWithType('cash_receipt')}
                          size="sm"
                          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> Record First Entry
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isReceipt = entry.entry_type.includes('receipt');
                    const isBank = entry.account_type === 'bank';
                    return (
                      <tr 
                        key={entry.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-tight">
                            {isBank ? `🏦 ${entry.bank_account?.account_name || 'Bank A/C'}` : '💵 Petty Cash'}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                            isReceipt
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                          }`}>
                            {isReceipt ? <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" /> : <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                            {entry.entry_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          {entry.party_name && (
                            <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                              {entry.party_type === 'customer' ? '👤 Customer' : '🏢 Supplier'}: {entry.party_name}
                            </div>
                          )}
                          <div className="text-slate-700 dark:text-zinc-300 text-sm font-medium line-clamp-2">
                            {entry.narration || '—'}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">
                          <div className="font-bold text-slate-800 dark:text-zinc-200">{entry.payment_mode || 'cash'}</div>
                          {entry.reference_no && <div className="text-[11px] text-slate-400 font-semibold">Ref: {entry.reference_no}</div>}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isReceipt ? (
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                              +₹ {Number(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {!isReceipt ? (
                            <span className="font-black text-rose-600 dark:text-rose-400 text-base">
                              -₹ {Number(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CashEntryForm
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={() => fetchCashBook()}
        bankAccounts={summary.bank_accounts || []}
        defaultEntryType={defaultModalType}
      />

      <AddBankAccountModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSuccess={() => fetchCashBook()}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { 
  Calendar, ArrowLeft, FileSpreadsheet, HelpCircle, 
  ArrowUpRight, ArrowDownRight, Printer,
  ChevronDown, ChevronUp, Sparkles, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { cashbookService } from '../api/cashbookService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function DayBookPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    opening_cash_balance: 0,
    total_cash_receipts: 0,
    total_cash_payments: 0,
    closing_cash_balance: 0,
    total_bank_receipts: 0,
    total_bank_payments: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const fetchDayBook = async () => {
    setLoading(true);
    try {
      const res = await cashbookService.getDayBook(date);
      setEntries(res.data || []);
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch {
      toast.error('Failed to fetch Day Book entries for selected date');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayBook();
  }, [date]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-teal-500/10 dark:bg-teal-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        
        {/* Navigation back & Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-white/[0.02] p-3 rounded-2xl border border-slate-200/80 dark:border-white/10">
          <Link 
            to="/business/cash-bank"
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cash Book
          </Link>

          <div className="flex items-center gap-2.5 bg-white dark:bg-[#0f0f12] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Select Audit Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-black text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-500/30 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Roz ka Day Book <span className="text-teal-600 dark:text-teal-400 text-base font-bold px-2 py-0.5 rounded-md bg-teal-500/10">Daily Cashier Audit</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Review today&apos;s complete chronological transaction trail and verify opening drawer cash against daily closing figures.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-teal-200 dark:border-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm h-11 px-4 text-xs uppercase"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print Register
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-teal-200 dark:border-teal-900/30 text-teal-600 dark:text-teal-400 shadow-sm h-11 px-4 text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'Why Day Book?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-teal-200 dark:border-teal-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Sparkles className="w-5 h-5 fill-teal-500 text-teal-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Managing Daily Cashier Verification</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                The Roz ka Day Book provides an unambiguous audit trail to protect store owners from cashier calculation discrepancies or cash leakage.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>🌅</span> 1. Opening Cash Balance
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    The exact physical cash leftover in your cash drawer from previous days. It carries forward automatically at midnight without manual intervention.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>⚡</span> 2. Day Receipts & Payments
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    All cash sales, customer recoveries, supplier payouts, and store expenses logged on this date are aggregated here in chronological order.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <span>🌙</span> 3. Closing Drawer Balance
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    At store closing, your cashier should count physical currency notes and match them exactly against this Closing Cash Balance figure!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Opening Cash Balance"
            value={formatCurrency(summary.opening_cash_balance || 0)}
            icon={<Wallet className="w-5 h-5 text-white" />}
            glowColor="blue"
            subtitle="Carried forward from yesterday"
          />
          <CustomKpiCard
            title="Today's Cash Receipts (+)"
            value={formatCurrency(summary.total_cash_receipts || 0)}
            icon={<ArrowDownRight className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle={`+ ₹${(summary.total_bank_receipts || 0).toLocaleString('en-IN')} in Bank`}
          />
          <CustomKpiCard
            title="Today's Cash Payments (-)"
            value={formatCurrency(summary.total_cash_payments || 0)}
            icon={<ArrowUpRight className="w-5 h-5 text-white" />}
            glowColor="rose"
            subtitle={`- ₹${(summary.total_bank_payments || 0).toLocaleString('en-IN')} from Bank`}
          />
          <CustomKpiCard
            title="Closing Drawer Balance"
            value={formatCurrency(summary.closing_cash_balance || 0)}
            icon={<FileSpreadsheet className="w-5 h-5 text-white" />}
            glowColor="cyan"
            subtitle="Exact currency notes required"
          />
        </div>

        {/* Documents Table Card */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20">
          <div className="p-5 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span>📋</span> Chronological Transaction Trail ({entries.length} entries)
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Sorted by exact time recorded</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-[11px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
                  <th className="py-4 px-6">Time & Account</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Party & Narration</th>
                  <th className="py-4 px-6">Payment Mode</th>
                  <th className="py-4 px-6 text-right">Receipt (Dr +)</th>
                  <th className="py-4 px-6 text-right">Payment (Cr -)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-48 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                    </tr>
                  ))
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No entries recorded on this date</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Try selecting another audit date using the date picker at the top right.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isReceipt = entry.entry_type.includes('receipt');
                    const isBank = entry.account_type === 'bank';
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-black text-slate-900 dark:text-white">
                            {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
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
                        <td className="py-4 px-6 max-w-sm">
                          {entry.party_name && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-black block text-xs">
                              {entry.party_name}
                            </span>
                          )}
                          <span className="text-slate-700 dark:text-zinc-300 text-sm font-medium">
                            {entry.narration || '—'}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-xs uppercase font-mono font-bold text-slate-500 dark:text-slate-400">
                          {entry.payment_mode || 'cash'} {entry.reference_no ? `(${entry.reference_no})` : ''}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {isReceipt ? (
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                              +₹ {Number(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {!isReceipt ? (
                            <span className="font-black text-rose-600 dark:text-rose-400 text-base">
                              -₹ {Number(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          ) : '—'}
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
    </div>
  );
}

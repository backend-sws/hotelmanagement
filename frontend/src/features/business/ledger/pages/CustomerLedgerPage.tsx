import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, HelpCircle, FileText, Share2, Printer, 
  Calendar, TrendingUp, CheckCircle2, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomers } from '@/features/business/customers/api/useCustomers';
import { ledgerService } from '../api/ledgerService';

export default function CustomerLedgerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const { data: customersResponse, isLoading: loadingCustomers } = useCustomers(1, 50, { 
    search: searchQuery || undefined 
  });

  const customers = customersResponse?.data || [];

  // Auto-select first customer when loaded
  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  const { data: statement, isLoading: loadingStatement } = useQuery({
    queryKey: ['customer-ledger', selectedCustomerId, fromDate, toDate],
    queryFn: () => ledgerService.getCustomerStatement(selectedCustomerId!, { 
      from_date: fromDate || undefined, 
      to_date: toDate || undefined 
    }),
    enabled: !!selectedCustomerId,
  });

  const handleWhatsAppShare = () => {
    if (!statement || !statement.party) return;
    const isDue = statement.closing_balance > 0;
    const dueStatusText = isDue ? "To Receive (Lena Hai)" : statement.closing_balance < 0 ? "Advance Received (Jama Hai)" : "Settled & Cleared";
    const msg = `Dear ${statement.party.name},\nHere is your account summary:\nOpening Balance: ₹${statement.opening_balance}\nClosing Net Balance: ₹${Math.abs(statement.closing_balance)} (${dueStatusText}).\nKindly check and settle any pending account dues.\nThank you!`;
    const phone = (statement.party.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${phone.length === 10 ? '91' + phone : phone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getBalanceBadgeText = (val: number, isShort = false) => {
    if (val === 0) return '₹ 0 (Cleared)';
    const amount = `₹ ${Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: val % 1 === 0 ? 0 : 2 })}`;
    if (val > 0) {
      return isShort ? `${amount} (Lena Hai)` : `${amount} • To Receive (Lena Hai)`;
    }
    return isShort ? `${amount} (Advance)` : `${amount} • Advance Received (Jama Hai)`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Full-Width Responsive Layout */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Informative Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                  Customer Account Ledgers <span className="text-blue-600 dark:text-blue-400 text-sm md:text-base font-bold px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">Udhar Khata & Receivables</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                  Inspect sales bills, received payments, and running dues for every customer in simple, easy-to-understand terms. Send instant WhatsApp reminders!
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm h-10 px-4 text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4 mr-1.5 text-blue-500" />
              {showGuide ? 'Hide Guide' : 'How does Khata work?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1.5" /> : <ChevronDown className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Sparkles className="w-5 h-5 fill-blue-500 text-blue-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Customer Udhar Khata (Simplified Terms)</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                We use straightforward Hindi & English terms so you and your team can instantly see who owes money without confusing accounting jargon!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>📈</span> 1. Billed (+) vs Received (-)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    When you make a sales invoice, the balance to receive increases (+). When the customer pays cash, online, or cheque, it decreases (-).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    <span>🔴</span> 2. &quot;To Receive (Lena Hai)&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    This tag means the customer has an outstanding bill amount remaining. It shows exactly how much money you need to collect from them.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>🟢</span> 3. &quot;Advance Received (Jama Hai)&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    If a customer pays in advance before taking goods, their account will clearly indicate that extra funds are stored with you!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Full-Width Split Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Party Selector (Fluid width on wide screens) */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-fit lg:sticky lg:top-4 max-h-[820px]">
            <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>👤</span> Select Customer Party
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {customers.length} listed
                </span>
              </div>
              <div className="relative">
                <Search className="absolute z-10 pointer-events-none left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search customer name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-xs h-10 rounded-xl font-medium focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-2.5 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 flex-1 max-h-[660px] min-h-[350px]">
              {loadingCustomers ? (
                <div className="p-8 space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : customers.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No customers found</p>
                  <p className="text-xs text-slate-400">Try adjusting your search query above.</p>
                </div>
              ) : (
                customers.map((c: any) => {
                  const isSelected = selectedCustomerId === c.id;
                  const bal = parseFloat(c.opening_balance || '0');
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between my-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="truncate pr-3">
                        <span className={`font-extrabold text-sm block truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {c.name}
                        </span>
                        <span className={`text-xs font-medium block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                          {c.phone || 'No Phone'}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block ${
                          isSelected
                            ? 'bg-white/20 text-white border border-white/20'
                            : bal > 0 
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : bal < 0
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10'
                        }`}>
                          {getBalanceBadgeText(bal, true)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Account Statement (Expansive full width) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[650px]">
            {loadingStatement ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-slate-500 space-y-4">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
                <p className="text-sm font-bold tracking-wide">Generating complete chronological account statement...</p>
              </div>
            ) : !statement || !statement.party ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-2">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">No Customer Selected</h3>
                <p className="text-sm max-w-md mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select a customer party from the left directory to view their complete transaction history and live running balance.
                </p>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Statement Header */}
                <div className="p-6 border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                      <span>{statement.party.name}</span>
                      {statement.party.gstin && (
                        <span className="text-xs font-extrabold px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md">
                          GSTIN: {statement.party.gstin}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>📱 {statement.party.phone || 'N/A'}</span>
                      {statement.party.address && <span>• 📍 {statement.party.address}</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Button
                      onClick={handleWhatsAppShare}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 h-10 rounded-xl shadow-md shadow-emerald-500/20 gap-1.5 uppercase tracking-wider"
                    >
                      <Share2 className="w-4 h-4" /> WhatsApp Reminder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900 hover:bg-slate-50 border-slate-300 dark:border-white/10 font-black text-xs px-4 h-10 rounded-xl gap-1.5 uppercase tracking-wider shadow-xs"
                    >
                      <Printer className="w-4 h-4" /> Print Statement
                    </Button>
                  </div>
                </div>

                {/* Date Filter & Opening Balance Banner */}
                <div className="p-4 px-6 bg-slate-100/50 dark:bg-zinc-900/50 border-b border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Calendar className="w-4 h-4 text-blue-500 mr-0.5" />
                    <span className="uppercase tracking-wide text-slate-700 dark:text-zinc-300 mr-1">Date Range:</span>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-9 text-xs font-bold w-36 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl"
                    />
                    <span className="text-slate-400 font-extrabold px-1">to</span>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-9 text-xs font-bold w-36 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl"
                    />
                    {(fromDate || toDate) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setFromDate(''); setToDate(''); }} 
                        className="h-9 px-3 text-xs font-extrabold uppercase text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/80 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xs self-start md:self-auto">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Opening Balance:</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                      ₹ {Number(statement.opening_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Ledger Entries Table */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/[0.02] text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/10">
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Voucher Type</th>
                        <th className="py-4 px-6">Narration / Remarks</th>
                        <th className="py-4 px-6 text-right text-rose-600 dark:text-rose-400">Billed Amount (+)</th>
                        <th className="py-4 px-6 text-right text-emerald-600 dark:text-emerald-400">Payment Received (-)</th>
                        <th className="py-4 px-6 text-right text-blue-600 dark:text-blue-400">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                      {/* Opening balance row */}
                      <tr className="bg-blue-500/[0.03] dark:bg-blue-500/[0.02] font-extrabold text-slate-700 dark:text-slate-300 text-xs">
                        <td className="py-3.5 px-6 font-mono">-</td>
                        <td className="py-3.5 px-6 uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">OPENING_BALANCE</td>
                        <td className="py-3.5 px-6 font-semibold text-slate-500">Opening balance brought forward into period</td>
                        <td className="py-3.5 px-6 text-right font-mono">-</td>
                        <td className="py-3.5 px-6 text-right font-mono">-</td>
                        <td className="py-3.5 px-6 text-right font-black text-blue-600 dark:text-blue-400 font-mono text-sm">
                          ₹ {Number(statement.opening_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>

                      {statement.entries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-xs font-semibold text-slate-400 italic">
                            No account transactions recorded in this selected timeframe.
                          </td>
                        </tr>
                      ) : (
                        statement.entries.map((ent) => (
                          <tr key={ent.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] text-xs font-medium transition-colors">
                            <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                              {new Date(ent.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-6 font-mono uppercase font-extrabold text-slate-700 dark:text-zinc-300">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/5">
                                {ent.entry_type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-700 dark:text-zinc-300 font-semibold max-w-sm">
                              {ent.narration || '—'}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-rose-600 dark:text-rose-400 font-mono text-sm">
                              {ent.debit > 0 ? `₹ ${Number(ent.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                              {ent.credit > 0 ? `₹ ${Number(ent.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white font-mono text-sm">
                              ₹ {Number(ent.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Responsive Statement Footer */}
                <div className="p-6 bg-slate-100/80 dark:bg-zinc-900/80 border-t-2 border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 shrink-0">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-black uppercase tracking-wider">Total Invoiced Amount (Sales):</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black text-lg font-mono block">
                        ₹ {Number(statement.total_debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-300 dark:bg-white/10 hidden sm:block" />
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-black uppercase tracking-wider">Total Payments Received (Recovered):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg font-mono block">
                        ₹ {Number(statement.total_credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-blue-500/25 text-left sm:text-right shrink-0 flex flex-col justify-center">
                    <span className="text-[11px] uppercase font-black tracking-widest text-blue-100 block">Final Net Due Balance</span>
                    <span className="text-2xl font-black block mt-1 font-mono tracking-tight text-white">
                      {getBalanceBadgeText(statement.closing_balance, false)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

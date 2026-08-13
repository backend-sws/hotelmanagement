import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, HelpCircle, FileText, Printer, 
  Calendar, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSuppliers } from '@/features/business/suppliers/api/useSuppliers';
import { ledgerService } from '../api/ledgerService';

export default function SupplierLedgerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const { data: suppliersResponse, isLoading: loadingSuppliers } = useSuppliers(1);
  const suppliers = (suppliersResponse?.data || []).filter((s: any) => 
    !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone?.includes(searchQuery)
  );

  useEffect(() => {
    if (!selectedSupplierId && suppliers.length > 0) {
      setSelectedSupplierId(suppliers[0].id);
    }
  }, [suppliers, selectedSupplierId]);

  const { data: statement, isLoading: loadingStatement } = useQuery({
    queryKey: ['supplier-ledger', selectedSupplierId, fromDate, toDate],
    queryFn: () => ledgerService.getSupplierStatement(selectedSupplierId!, { 
      from_date: fromDate || undefined, 
      to_date: toDate || undefined 
    }),
    enabled: !!selectedSupplierId,
  });

  const getBalanceBadgeText = (val: number, isShort = false) => {
    if (val === 0) return '₹ 0 (Cleared)';
    const amount = `₹ ${Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: val % 1 === 0 ? 0 : 2 })}`;
    if (val > 0) {
      return isShort ? `${amount} (Dena Hai)` : `${amount} • To Pay (Dena Hai)`;
    }
    return isShort ? `${amount} (Advance Given)` : `${amount} • Advance Given (Jama Hai)`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-500/10 dark:bg-amber-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-stone-500/10 dark:bg-stone-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Full-Width Responsive Layout */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-4 pb-14 space-y-6 z-10">
        
        {/* Premium Informative Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20 print:hidden">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                  Supplier Account Khata <span className="text-amber-600 dark:text-amber-400 text-sm md:text-base font-bold px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">Payables & Settlements</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                  Verify accounts payable against purchase bills and outward settlements in simple, easy-to-understand terms without confusing accounting jargon.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm h-10 px-4 text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4 mr-1.5 text-amber-500" />
              {showGuide ? 'Hide Guide' : 'How does Payables Khata work?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1.5" /> : <ChevronDown className="w-4 h-4 ml-1.5" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300 print:hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-5 h-5 fill-amber-500 text-amber-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Supplier Payables & Reconciliations (Simplified Terms)</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                We use everyday Hindi & English terms so anyone can instantly tell if money is owed to a vendor or if an advance was paid!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <span>📦</span> 1. Purchase Bills (+) vs Paid (-)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    When a supplier sends stock and bills you, the payable amount increases (+). When you make a bank transfer or cash payment outward, it reduces (-).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    <span>⚠️</span> 2. &quot;To Pay (Dena Hai)&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    This tag clearly signifies that you owe money to this supplier vendor. This is the outstanding bill amount you need to pay them.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>✨</span> 3. &quot;Advance Given (Jama Hai)&quot;
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    If you paid a supplier in advance before receiving stock, the account will show that your funds are safely deposited with them!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Full-Width Split Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Supplier Selector (Fluid width on wide screens) */}
          <div className="lg:col-span-4 xl:col-span-3 print:hidden bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-fit lg:sticky lg:top-4 max-h-[820px]">
            <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏢</span> Select Supplier Vendor
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {suppliers.length} listed
                </span>
              </div>
              <div className="relative">
                <Search className="absolute z-10 pointer-events-none left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search vendor name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-xs h-10 rounded-xl font-medium focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="p-2.5 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 flex-1 max-h-[660px] min-h-[350px]">
              {loadingSuppliers ? (
                <div className="p-8 space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : suppliers.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching vendors found</p>
                  <p className="text-xs text-slate-400">Try adjusting your search filter above.</p>
                </div>
              ) : (
                suppliers.map((s: any) => {
                  const isSelected = selectedSupplierId === s.id;
                  const bal = parseFloat((s.current_balance ?? s.opening_balance) || '0');
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSupplierId(s.id)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between my-1 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25 scale-[1.01]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="truncate pr-3">
                        <span className={`font-extrabold text-sm block truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {s.name}
                        </span>
                        <span className={`text-xs font-medium block mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                          {s.phone || 'No Phone'}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block ${
                          isSelected
                            ? 'bg-white/20 text-white border border-white/20'
                            : bal > 0 
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
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
          <div className="lg:col-span-8 xl:col-span-9 print:col-span-12 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 print:border-none rounded-2xl print:rounded-none shadow-xl print:shadow-none overflow-hidden flex flex-col min-h-[650px] print:min-h-0">
            {loadingStatement ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-slate-500 space-y-4">
                <div className="animate-spin w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full" />
                <p className="text-sm font-bold tracking-wide">Generating complete supplier account statement...</p>
              </div>
            ) : !statement || !statement.party ? (
              <div className="flex-1 flex flex-col items-center justify-center p-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-2">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">No Vendor Selected</h3>
                <p className="text-sm max-w-md mx-auto text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select a supplier party from the left directory to inspect our payables account statement, bill settlements, and running liability.
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
                        <span className="text-xs font-extrabold px-2.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-md">
                          GSTIN: {statement.party.gstin}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>📱 {statement.party.phone || 'N/A'}</span>
                      {statement.party.address && <span>• 📍 {statement.party.address}</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900 hover:bg-slate-50 border-slate-300 dark:border-white/10 font-black text-xs px-4 h-10 rounded-xl gap-1.5 uppercase tracking-wider shadow-xs"
                    >
                      <Printer className="w-4 h-4" /> Print Statement Vouchers
                    </Button>
                  </div>
                </div>

                {/* Date Filter & Opening Balance Banner */}
                <div className="p-4 px-6 bg-slate-100/50 dark:bg-zinc-900/50 border-b border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 print:hidden">
                    <Calendar className="w-4 h-4 text-amber-500 mr-0.5" />
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
                    <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
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
                        <th className="py-4 px-6">Narration / Bill Ref</th>
                        <th className="py-4 px-6 text-right text-emerald-600 dark:text-emerald-400">Payment Outward (-)</th>
                        <th className="py-4 px-6 text-right text-amber-600 dark:text-amber-400">Purchase Billed (+)</th>
                        <th className="py-4 px-6 text-right text-slate-800 dark:text-zinc-200">Running Balance</th>
                        <th className="py-4 px-6 text-right print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                      {/* Opening balance row */}
                      <tr className="bg-amber-500/[0.03] dark:bg-amber-500/[0.02] font-extrabold text-slate-700 dark:text-slate-300 text-xs">
                        <td className="py-3.5 px-6 font-mono">-</td>
                        <td className="py-3.5 px-6 uppercase font-black tracking-wider text-amber-600 dark:text-amber-400">OPENING_BALANCE</td>
                        <td className="py-3.5 px-6 font-semibold text-slate-500">Opening liability balance brought forward into period</td>
                        <td className="py-3.5 px-6 text-right font-mono">-</td>
                        <td className="py-3.5 px-6 text-right font-mono">-</td>
                        <td className="py-3.5 px-6 text-right font-black text-slate-900 dark:text-white font-mono text-sm">
                          ₹ {Number(statement.opening_balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-6 text-right print:hidden"></td>
                      </tr>

                      {statement.entries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-xs font-semibold text-slate-400 italic">
                            No purchase bills or payment outward entries recorded in this selected timeframe.
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
                            <td className="py-4 px-6 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                              {ent.debit > 0 ? `₹ ${Number(ent.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-amber-600 dark:text-amber-400 font-mono text-sm">
                              {ent.credit > 0 ? `₹ ${Number(ent.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white font-mono text-sm">
                              ₹ {Number(ent.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 px-6 text-right print:hidden">
                              {ent.reference_type === 'payment' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`/api/v1/business/ledger/receipt/${ent.id}/pdf`, '_blank')}
                                  className="h-8 px-3 text-[10px] font-bold text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <Printer className="w-3 h-3 mr-1" /> Receipt
                                </Button>
                              )}
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
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-black uppercase tracking-wider">Total Payments Outward (Paid):</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg font-mono block">
                        ₹ {Number(statement.total_debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-[1px] h-10 bg-slate-300 dark:bg-white/10 hidden sm:block" />
                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-black uppercase tracking-wider">Total Purchases Billed (Bought):</span>
                      <span className="text-amber-600 dark:text-amber-400 font-black text-lg font-mono block">
                        ₹ {Number(statement.total_credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 px-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl shadow-xl shadow-amber-500/25 text-left sm:text-right shrink-0 flex flex-col justify-center">
                    <span className="text-[11px] uppercase font-black tracking-widest text-amber-100 block">Final Net Payable Amount</span>
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

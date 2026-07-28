import React, { useState, useEffect } from 'react';
import { 
  Scale, ShieldCheck, DollarSign, 
  Calendar, RefreshCw, Download, 
  CheckCircle2, AlertTriangle, Building2, Wallet, Package, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { reportService } from '../api/reportService';
import type { BalanceSheetResponse } from '../api/reportService';
import { toast } from 'sonner';

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BalanceSheetResponse['data'] | null>(null);

  const fetchBalanceSheet = async () => {
    setLoading(true);
    try {
      const res = await reportService.getBalanceSheet({ date: asOfDate });
      setData(res.data);
    } catch (err: any) {
      toast.error('Failed to load Balance Sheet statement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheet();
  }, [asOfDate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-1">
            <Scale className="w-4 h-4" />
            <span>Statement of Financial Position</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Balance Sheet</h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time snapshot of company Assets, outstanding debt Liabilities, and net worth Capital Equity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-slate-300">As of:</span>
            <input 
              type="date" 
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
          </div>

          <Button 
            onClick={fetchBalanceSheet} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
            <Download className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Equilibrium Status Banner */}
          <Card className={`p-4 border flex items-center justify-between ${
            data.is_balanced 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/40 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              {data.is_balanced ? (
                <div className="p-2 bg-emerald-500 text-white rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 bg-amber-500 text-white rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-base">
                  {data.is_balanced ? 'Balance Sheet is in 100% Equilibrium (A = L + E)' : 'Balance Sheet Check Warning'}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  Total Assets (₹{data.assets.total_assets.toLocaleString('en-IN')}) exactly match Total Liabilities & Equity (₹{data.total_liabilities_and_equity.toLocaleString('en-IN')}).
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs uppercase font-semibold opacity-70 block">Net Worth / Book Value</span>
              <span className="text-xl font-bold font-mono">₹{data.equity.total_equity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </Card>

          {/* Side-by-Side Balance Sheet Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* COLUMN 1: ASSETS */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-blue-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Wallet className="w-5 h-5 text-blue-300" />
                  <span>ASSETS</span>
                </div>
                <span className="text-xs bg-blue-800 px-2.5 py-1 rounded-full text-blue-200 font-mono">
                  Current & Tangible
                </span>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                    Current Liquid Assets
                  </h3>
                  <div className="space-y-3 text-sm">
                    {/* Cash in Hand */}
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span>Cash in Hand (Rozka Daybook)</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{data.assets.current_assets.cash_in_hand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Bank Accounts */}
                    <div className="py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>Bank Account Balances</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          ₹{data.assets.current_assets.bank_accounts.total_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="pl-6 space-y-1 text-xs text-slate-500">
                        {data.assets.current_assets.bank_accounts.items.length === 0 ? (
                          <div className="italic">No bank accounts registered.</div>
                        ) : (
                          data.assets.current_assets.bank_accounts.items.map((acc) => (
                            <div key={acc.id} className="flex justify-between py-0.5">
                              <span>{acc.name}</span>
                              <span className="font-mono">₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Accounts Receivable */}
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>Accounts Receivable (Customer Khata Dues)</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{data.assets.current_assets.accounts_receivable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Inventory Valuation */}
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Package className="w-4 h-4 text-amber-500" />
                        <span>Closing Inventory Valuation (At Cost)</span>
                      </div>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{data.assets.current_assets.inventory_valuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Assets Footnote */}
                <div className="pt-4 border-t-2 border-slate-900 dark:border-white flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl">
                  <span className="font-bold text-slate-900 dark:text-white uppercase text-sm">Total Assets</span>
                  <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                    ₹{data.assets.total_assets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </Card>

            {/* COLUMN 2: LIABILITIES & EQUITY */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>LIABILITIES & EQUITY</span>
                </div>
                <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                  Claims & Capital
                </span>
              </div>

              <div className="p-5 space-y-6">
                {/* Liabilities Section */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                    Current Liabilities & Debts
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Users className="w-4 h-4 text-rose-500" />
                        <span>Accounts Payable (Supplier Khata Dues)</span>
                      </div>
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                        ₹{data.liabilities.current_liabilities.accounts_payable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Building2 className="w-4 h-4 text-amber-500" />
                        <span>Uncleared Cheques Issued</span>
                      </div>
                      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                        ₹{data.liabilities.current_liabilities.uncleared_cheques.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 px-3 rounded-lg">
                      <span className="text-xs uppercase">Total Liabilities:</span>
                      <span className="font-mono">
                        ₹{data.liabilities.total_liabilities.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equity Section */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100 dark:border-slate-800">
                    Capital & Retained Earnings
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 bg-emerald-50/50 dark:bg-emerald-950/20 px-3 rounded-lg border border-emerald-500/20">
                      <div>
                        <div className="font-bold text-emerald-900 dark:text-emerald-200">Retained Earnings (Net Worth)</div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Accumulated business surpluses from P&L</p>
                      </div>
                      <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                        ₹{data.equity.retained_earnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Liabilities and Equity Footnote */}
                <div className="pt-4 border-t-2 border-slate-900 dark:border-white flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
                  <span className="font-bold uppercase text-sm">Total Liabilities & Equity</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    ₹{data.total_liabilities_and_equity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

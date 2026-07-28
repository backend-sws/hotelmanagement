import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Users, ShoppingBag, ArrowUpRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgingDonutProps {
  receivables: number;
  payables: number;
  cashInHand: number;
  bankBalance: number;
}

export function AgingDonut({ receivables = 0, payables = 0, cashInHand = 0, bankBalance = 0 }: AgingDonutProps) {
  const navigate = useNavigate();
  
  const totalDebt = receivables + payables;
  const recPct = totalDebt > 0 ? Math.round((receivables / totalDebt) * 100) : 50;
  const payPct = 100 - recPct;
  const netPosition = receivables - payables;

  return (
    <Card className="p-5 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Khata Debt & Receivables
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer due balances vs Supplier payables
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            netPosition >= 0 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50' 
              : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50'
          }`}>
            {netPosition >= 0 ? 'Net Positive Surplus' : 'Payables Deficit'}
          </span>
        </div>

        {/* Visual Distribution Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-medium px-0.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Receivables ({recPct}%)
            </span>
            <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1">
              Payables ({payPct}%) <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full flex overflow-hidden p-0.5 shadow-inner">
            <div 
              style={{ width: `${recPct}%` }} 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-l-full transition-all duration-700" 
            />
            <div 
              style={{ width: `${payPct}%` }} 
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-r-full transition-all duration-700" 
            />
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Customer Khata Due
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ₹{receivables.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Supplier Payables Due
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-base md:text-lg font-bold text-rose-600 dark:text-rose-400">
                ₹{payables.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Net Cash Pool Status */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Total Liquid Reserves (Cash + Bank):</span>
          </div>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{(cashInHand + bankBalance).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2">
        <Button
          onClick={() => navigate('/customers')}
          variant="ghost"
          size="sm"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 justify-center"
        >
          Collect Receivables <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
        <Button
          onClick={() => navigate('/suppliers')}
          variant="ghost"
          size="sm"
          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 justify-center"
        >
          Pay Supplier Bills <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </Card>
  );
}

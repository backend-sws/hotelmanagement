import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  Calendar, RefreshCw, Download, Award, 
  PieChart, ChevronRight, Layers, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { reportService } from '../api/reportService';
import type { ProfitLossResponse } from '../api/reportService';
import { toast } from 'sonner';

export default function ProfitLossPage() {
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ProfitLossResponse['data'] | null>(null);

  const fetchPnl = async () => {
    setLoading(true);
    try {
      const res = await reportService.getProfitLoss({ from_date: fromDate, to_date: toDate });
      setData(res.data);
    } catch (err: any) {
      toast.error('Failed to load Profit & Loss statement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPnl();
  }, [fromDate, toDate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-1">
            <Award className="w-4 h-4" />
            <span>Executive Financial Statements</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Profit & Loss Statement</h1>
          <p className="text-slate-300 text-sm mt-1">
            Comprehensive breakdown of revenues, direct project costs, operating overheads, and net profit margins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
          </div>

          <Button 
            onClick={fetchPnl} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30">
            <Download className="w-4 h-4 mr-2" />
            Print Statement
          </Button>
        </div>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Gross Operating Revenue</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    ₹{data.revenue.net_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                <span>Gross Invoiced: ₹{data.revenue.gross_sales.toLocaleString('en-IN')}</span>
                <span>Cr Notes: -₹{data.revenue.credit_notes.toLocaleString('en-IN')}</span>
              </div>
            </Card>

            <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Gross Profit (After COGS)</span>
                  <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    ₹{data.gross_profit.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Gross Margin %:</span>
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-0.5 rounded">
                  {data.gross_profit.margin_percentage}%
                </span>
              </div>
            </Card>

            <Card className={`p-5 border shadow-sm ${
              data.net_profit.amount >= 0 
                ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-500/30' 
                : 'bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-rose-500/30'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500">Net Profit / (Loss)</span>
                  <div className={`text-2xl font-bold font-mono mt-1 ${
                    data.net_profit.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    ₹{data.net_profit.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${
                  data.net_profit.amount >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40'
                }`}>
                  {data.net_profit.amount >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Net Margin %:</span>
                <span className={`px-2 py-0.5 rounded ${
                  data.net_profit.amount >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40'
                }`}>
                  {data.net_profit.margin_percentage}%
                </span>
              </div>
            </Card>
          </div>

          {/* Statement Table */}
          <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Statement of Profit & Loss</h2>
                <p className="text-xs text-slate-400 mt-0.5">For the period from {data.from_date} to {data.to_date}</p>
              </div>
              <div className="text-right font-mono text-sm">
                <span className="text-slate-400 text-xs block">Currency</span>
                <span className="font-semibold text-emerald-400">INR (₹)</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Section 1: Revenue */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white uppercase bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg">
                  <span>1. Gross Operating Revenues</span>
                  <span className="font-mono">₹{data.revenue.net_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-3 space-y-2 pl-4 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <span>Sales Invoices (Outward Supply)</span>
                    <span className="font-mono">₹{data.revenue.gross_sales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {data.revenue.credit_notes > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                      <span>Less: Sales Returns & Credit Notes</span>
                      <span className="font-mono">-₹{data.revenue.credit_notes.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {data.revenue.debit_notes > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                      <span>Add: Debit Notes Issued</span>
                      <span className="font-mono">+₹{data.revenue.debit_notes.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: COGS / Direct Costs */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white uppercase bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg">
                  <span>2. Direct Costs & Cost of Goods Sold (COGS)</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -₹{data.direct_costs.total_direct_costs.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-3 space-y-2 pl-4 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <span>Direct Material Consumption (Sites & Godowns)</span>
                    <span className="font-mono">₹{data.direct_costs.material_consumption.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <span>Direct Site Labour, Wages & Contractor Payroll</span>
                    <span className="font-mono">₹{data.direct_costs.labour_and_wages.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Gross Profit */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-base">3. Gross Profit (Revenue - Direct Costs)</h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">Operating efficiency margin: {data.gross_profit.margin_percentage}%</p>
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-300">
                  ₹{data.gross_profit.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Section 4: Indirect Expenses */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white uppercase bg-slate-100 dark:bg-slate-800/60 p-3 rounded-lg">
                  <span>4. Indirect Operating & Administrative Expenses</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -₹{data.indirect_expenses.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-3 space-y-2 pl-4 text-sm">
                  {data.indirect_expenses.items.length === 0 ? (
                    <div className="py-2 text-slate-400 text-xs">No indirect expenses recorded in this period.</div>
                  ) : (
                    data.indirect_expenses.items.map((exp, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <span>{exp.category}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded">
                            {exp.percentage}% of total
                          </span>
                        </div>
                        <span className="font-mono font-medium">₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 5: Net Profit */}
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                data.net_profit.amount >= 0
                  ? 'bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-emerald-500/40 shadow-xl shadow-emerald-900/20'
                  : 'bg-gradient-to-r from-rose-900 to-slate-900 text-white border-rose-500/40 shadow-xl shadow-rose-900/20'
              }`}>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider opacity-80">Final Statement Balance</div>
                  <h3 className="text-2xl font-extrabold mt-0.5">
                    {data.net_profit.amount >= 0 ? '5. Net Operating Profit' : '5. Net Operating Loss'}
                  </h3>
                  <p className="text-xs opacity-75 mt-1">
                    Net Profit Margin on Revenues: <strong className="underline">{data.net_profit.margin_percentage}%</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-mono">
                    ₹{data.net_profit.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] uppercase tracking-wider opacity-75">Transferred to Balance Sheet Equity</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

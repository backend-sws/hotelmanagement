import React from 'react';
import type { ProjectSummary } from '../api/projectService';
import { formatCurrency } from '@/lib/formatters';
import { DollarSign, TrendingUp, TrendingDown, Layers, HardHat, Receipt, PieChart } from 'lucide-react';

interface ProjectPnlCardProps {
  summary?: ProjectSummary;
}

export const ProjectPnlCard: React.FC<ProjectPnlCardProps> = ({ summary }) => {
  if (!summary) return null;

  const isProfit = summary.net_profit >= 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/80 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            Real-Time P&L Overview
          </span>
          <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-blue-400" />
            Project Financial Analytics
          </h2>
        </div>

        <div className="text-left sm:text-right bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
          <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Contract / Total Value</span>
          <span className="text-2xl font-black text-white">{formatCurrency(summary.contract_value)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inflow Section */}
        <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/50 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Revenue & Collections
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total Invoiced to Client</span>
            <span className="font-bold text-slate-200">{formatCurrency(summary.total_invoiced)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total Payments Received</span>
            <span className="font-bold text-emerald-400">{formatCurrency(summary.total_received)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Pending Collection (Udhar)</span>
            <span className="font-bold text-amber-400">
              {formatCurrency(Math.max(0, summary.total_invoiced - summary.total_received))}
            </span>
          </div>
        </div>

        {/* Cost Section */}
        <div className="space-y-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-700/50 pb-2">
            <Layers className="w-4 h-4 text-rose-400" />
            Cost Breakdown
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Material Consumed Cost
            </span>
            <span className="font-bold text-slate-200">{formatCurrency(summary.material_cost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-amber-400" /> Labour & Wages Cost
            </span>
            <span className="font-bold text-slate-200">{formatCurrency(summary.labour_cost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-purple-400" /> Other Site Expenses
            </span>
            <span className="font-bold text-slate-200">{formatCurrency(summary.expense_cost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/50 font-bold">
            <span className="text-rose-300">Total Project Cost</span>
            <span className="text-rose-400 text-base">{formatCurrency(summary.total_cost)}</span>
          </div>
        </div>
      </div>

      {/* Net Profit Banner */}
      <div className={`mt-6 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isProfit 
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
          : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isProfit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {isProfit ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-80">Estimated Net Profit / Loss</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{formatCurrency(summary.net_profit)}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Profit Margin</span>
          <span className={`text-xl font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.profit_margin}%
          </span>
        </div>
      </div>
    </div>
  );
};

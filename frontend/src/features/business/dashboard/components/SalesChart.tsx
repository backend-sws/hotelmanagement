import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChartItem {
  date: string;
  label: string;
  revenue: number;
  expense: number;
}

interface SalesChartProps {
  data: ChartItem[];
}

export function SalesChart({ data = [] }: SalesChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(data.length > 0 ? data.length - 1 : 0);

  // Find max value across revenue & expenses for relative scaling
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.revenue, d.expense]),
    1000 // default minimum base scale
  );

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpense = data.reduce((acc, curr) => acc + curr.expense, 0);
  const netMargin = totalRevenue - totalExpense;

  const selectedDay = data[selectedIndex] || { label: 'Today', revenue: 0, expense: 0, date: '' };

  return (
    <Card className="p-6 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      {/* Header & Subtotals */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>14-Day Executive Trend Analysis</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Revenue vs Operating Expenses
            </h3>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">14-Day Turnover</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">14-Day Expenses</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                ₹{totalExpense.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Net Surplus</span>
              <span className={`text-base font-bold ${netMargin >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
                ₹{netMargin.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Day Highlights Bar */}
        <div className="my-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedDay.label} ({selectedDay.date})
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs md:text-sm font-medium">
            <span className="text-emerald-600 dark:text-emerald-400">
              ● Revenue: <strong className="font-bold">₹{selectedDay.revenue.toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-rose-500 dark:text-rose-400">
              ● Expense: <strong className="font-bold">₹{selectedDay.expense.toLocaleString('en-IN')}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart Area */}
      <div className="mt-4 pt-4 flex items-end justify-between gap-1.5 md:gap-3 h-[200px] md:h-[230px] w-full">
        {data.map((item, idx) => {
          const revHeightPct = Math.max(8, Math.min(100, Math.round((item.revenue / maxVal) * 100)));
          const expHeightPct = Math.max(4, Math.min(100, Math.round((item.expense / maxVal) * 100)));
          const isSelected = selectedIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group h-full justify-end"
            >
              {/* Dual bars container */}
              <div className="flex items-end justify-center gap-1 w-full h-[180px] bg-slate-50 dark:bg-slate-900/40 rounded-lg p-1 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/60 transition-colors relative">
                {/* Revenue Bar */}
                <div
                  style={{ height: `${revHeightPct}%` }}
                  className={`w-2.5 md:w-3.5 rounded-t transition-all duration-500 ${
                    isSelected
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-500/70 group-hover:bg-emerald-500'
                  }`}
                />
                {/* Expense Bar */}
                <div
                  style={{ height: `${expHeightPct}%` }}
                  className={`w-2.5 md:w-3.5 rounded-t transition-all duration-500 ${
                    isSelected
                      ? 'bg-gradient-to-t from-rose-600 to-red-400 shadow-lg shadow-rose-500/30'
                      : 'bg-rose-500/60 group-hover:bg-rose-500'
                  }`}
                />

                {isSelected && (
                  <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </div>

              {/* Day label */}
              <span
                className={`text-[10px] md:text-xs font-medium truncate transition-colors ${
                  isSelected
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-600 to-teal-400 block" />
            Gross Revenue (Bills)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-rose-600 to-red-400 block" />
            Operating Overhead (Expenses)
          </span>
        </div>
        <span className="text-slate-400 dark:text-slate-500 italic hidden sm:inline">
          Click any bar to inspect daily cash volume
        </span>
      </div>
    </Card>
  );
}

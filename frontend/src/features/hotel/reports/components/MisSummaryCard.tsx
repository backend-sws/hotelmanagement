import React from 'react';
import { useMisSummaryReport } from '../api/useHotelReports';
import { TrendingUp, Users, Wallet, BedDouble } from 'lucide-react';

export function MisSummaryCard() {
  const { data, isLoading } = useMisSummaryReport();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-xl shadow-sm flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">RevPAR</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{parseFloat(data?.revpar || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-xl shadow-sm flex items-center gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">ADR</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{parseFloat(data?.adr || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-xl shadow-sm flex items-center gap-4">
        <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Occupancy</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{parseFloat(data?.occupancy_percent || 0).toFixed(1)}%</div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-xl shadow-sm flex items-center gap-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
          <BedDouble className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-500">Latest Revenue</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{parseFloat(data?.total_revenue || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

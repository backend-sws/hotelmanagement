import React from 'react';
import { useOccupancyReport } from '../api/useHotelReports';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function OccupancyChart() {
  const { data, isLoading } = useOccupancyReport();

  if (isLoading) {
    return <div className="h-[300px] bg-slate-50 animate-pulse rounded-xl"></div>;
  }

  // Format data for Recharts
  const chartData = data?.map((item: any) => ({
    date: format(parseISO(item.audit_date), 'MMM dd'),
    occupancy: parseFloat(item.occupancy_percent)
  })) || [];

  return (
    <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Occupancy Trend (Last 30 Days)</h3>
      <div className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${Number(value || 0).toFixed(1)}%`, 'Occupancy']}
              />
              <Area type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOccupancy)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

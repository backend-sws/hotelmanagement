import React from 'react';
import { useRevenueReport } from '../api/useHotelReports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function RevenueBarChart() {
  const { data, isLoading } = useRevenueReport();

  if (isLoading) {
    return <div className="h-[300px] bg-slate-50 animate-pulse rounded-xl"></div>;
  }

  const chartData = data?.map((item: any) => ({
    date: format(parseISO(item.audit_date), 'MMM dd'),
    Room: parseFloat(item.total_revenue_room),
    POS: parseFloat(item.total_revenue_pos)
  })) || [];

  return (
    <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Revenue Breakdown</h3>
      <div className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Room" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={20} />
              <Bar dataKey="POS" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

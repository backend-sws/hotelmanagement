import React from 'react';
import { useChannelWiseReport } from '../api/useHotelReports';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export function ChannelPieChart() {
  const { data, isLoading } = useChannelWiseReport();

  if (isLoading) {
    return <div className="h-[300px] bg-slate-50 animate-pulse rounded-xl"></div>;
  }

  const chartData = data?.map((item: any) => ({
    name: item.booking_source.replace('_', ' ').toUpperCase(),
    value: parseFloat(item.total_revenue)
  })) || [];

  return (
    <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Revenue by Channel</h3>
      <div className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

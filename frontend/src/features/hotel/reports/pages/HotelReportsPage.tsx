import React from 'react';
import { MisSummaryCard } from '../components/MisSummaryCard';
import { OccupancyChart } from '../components/OccupancyChart';
import { RevenueBarChart } from '../components/RevenueBarChart';
import { ChannelPieChart } from '../components/ChannelPieChart';
import { BarChart3 } from 'lucide-react';

export default function HotelReportsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-fuchsia-500" />
          Revenue Reports & Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">Management Information System (MIS) and key hotel performance indicators.</p>
      </div>

      <MisSummaryCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart />
        <RevenueBarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChannelPieChart />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
           <img src="https://illustrations.popsy.co/amber/keynote-presentation.svg" alt="More reports coming soon" className="w-48 opacity-80 mb-4" />
           <h3 className="font-bold text-slate-900 dark:text-white text-lg">More Reports Coming Soon</h3>
           <p className="text-slate-500 text-sm max-w-sm mt-2">We are adding Staff Productivity and Housekeeping Efficiency reports in the next update.</p>
        </div>
      </div>
    </div>
  );
}

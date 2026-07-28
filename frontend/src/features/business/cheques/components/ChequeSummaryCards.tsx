import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Landmark } from 'lucide-react';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { formatCurrency } from '@/lib/formatters';

interface ChequeSummaryCardsProps {
  stats: {
    pending_deposit?: number;
    pending_deposit_count?: number;
    total_deposited?: number;
    total_cleared?: number;
    total_bounced?: number;
    total_issued_pending?: number;
  };
}

export const ChequeSummaryCards: React.FC<ChequeSummaryCardsProps> = ({ stats }) => {
  return (
    <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-5 shadow-2xl shadow-slate-200/30 dark:shadow-black/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="transition-transform hover:-translate-y-1 duration-300">
          <CustomKpiCard
            title="Pending Deposit (In Hand)"
            value={formatCurrency(stats.pending_deposit || 0)}
            subtitle={`${stats.pending_deposit_count || 0} customer cheques in office`}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="amber"
          />
        </div>

        <div className="transition-transform hover:-translate-y-1 duration-300">
          <CustomKpiCard
            title="Deposited & Clearing"
            value={formatCurrency(stats.total_deposited || 0)}
            subtitle="Awaiting bank clearance confirmation"
            icon={<Landmark className="w-5 h-5 text-white" />}
            glowColor="blue"
          />
        </div>

        <div className="transition-transform hover:-translate-y-1 duration-300">
          <CustomKpiCard
            title="Cleared & Realized"
            value={formatCurrency(stats.total_cleared || 0)}
            subtitle="Successfully credited to Bank A/C"
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            glowColor="emerald"
          />
        </div>

        <div className="transition-transform hover:-translate-y-1 duration-300">
          <CustomKpiCard
            title="Bounced / Returned"
            value={formatCurrency(stats.total_bounced || 0)}
            subtitle="Requires urgent customer follow-up"
            icon={<AlertTriangle className="w-5 h-5 text-white" />}
            glowColor="rose"
          />
        </div>
      </div>
    </div>
  );
};

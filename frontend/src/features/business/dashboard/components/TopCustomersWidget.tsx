import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Award, ArrowUpRight, Trophy, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CustomerRank {
  id: number;
  name: string;
  phone: string;
  total_volume: number;
  invoices_count: number;
}

interface TopCustomersWidgetProps {
  customers: CustomerRank[];
}

export function TopCustomersWidget({ customers = [] }: TopCustomersWidgetProps) {
  const navigate = useNavigate();

  const rankBadgeColors = [
    'from-amber-500 to-yellow-400 text-slate-900 shadow-amber-500/30 font-extrabold', // Gold
    'from-slate-300 to-slate-400 text-slate-900 shadow-slate-400/20 font-bold',     // Silver
    'from-amber-700 to-amber-600 text-white shadow-amber-700/20 font-bold',         // Bronze
  ];

  return (
    <Card className="p-5 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Top Client Leaderboard
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest turnover buyers this month
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/30">
            Monthly Peak
          </span>
        </div>

        {/* List */}
        {customers.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center mx-auto border border-purple-500/20">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Client Activity Recorded
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto">
              Generate invoices tagged with customer profiles to build real-time volume ranking analytics.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[260px] overflow-y-auto pr-1">
            {customers.map((cust, idx) => {
              const badgeStyle = rankBadgeColors[idx] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium';
              const isPodium = idx < 3;

              return (
                <div 
                  key={cust.id} 
                  onClick={() => navigate(`/customers/${cust.id}`)}
                  className="py-2.5 flex items-center justify-between gap-3 cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ${
                      isPodium ? `bg-gradient-to-tr ${badgeStyle}` : badgeStyle
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-500 transition-colors">
                        {cust.name}
                      </p>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                        {cust.phone || 'Direct Customer'} • {cust.invoices_count} {cust.invoices_count === 1 ? 'bill' : 'bills'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white block">
                      ₹{cust.total_volume.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Top Volume
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Button
          onClick={() => navigate('/customers')}
          variant="ghost"
          size="sm"
          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Manage All Customers & Khata <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
}

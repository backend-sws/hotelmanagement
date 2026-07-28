import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  HardHat, Plus, DollarSign, Users, Calendar, Building2, 
  Receipt, ArrowRight, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { EmptyState } from '@/components/ui/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { labourService } from '../api/labourService';
import { formatCurrency } from '@/lib/formatters';
import { RecordLabourPaymentModal } from '../components/RecordLabourPaymentModal';

export default function LabourSummaryPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ['labour-summary'],
    queryFn: () => labourService.getSummary(),
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-16 relative overflow-x-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-float2" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6 z-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Labour & Contractor Wage Tracking
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Monitor project-wise worker days, daily wage disbursements, and site contractor costs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 rounded-xl font-bold h-10 px-4 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Record Labour Wage / Payment
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl h-10 px-3">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Worker Days"
            value={`${summary?.total_worker_days || 0} Mandays`}
            icon={<Users className="w-5 h-5 text-white" />}
            glowColor="amber"
          />
          <CustomKpiCard
            title="Total Labour Cost"
            value={formatCurrency(summary?.total_labour_cost || 0)}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            glowColor="rose"
          />
          <CustomKpiCard
            title="Average Daily Wage"
            value={formatCurrency(summary?.avg_daily_cost || 0)}
            icon={<Calendar className="w-5 h-5 text-white" />}
            glowColor="blue"
          />
          <CustomKpiCard
            title="Active Sites with Labour"
            value={`${summary?.project_summary?.length || 0} Sites`}
            icon={<Building2 className="w-5 h-5 text-white" />}
            glowColor="emerald"
          />
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton count={2} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project-Wise Labour Breakdown Table */}
            <div className="lg:col-span-2 bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  Project-Wise Labour Cost Summary
                </h3>
              </div>

              {!summary?.project_summary || summary.project_summary.length === 0 ? (
                <EmptyState
                  title="No Site Labour Recorded"
                  description="Record worker attendance or labour expenses linked to projects to see project-wise wage costs."
                  icon={<HardHat className="w-12 h-12 text-slate-300" />}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4">Site / Project</th>
                        <th className="p-4 text-center">Worker Mandays</th>
                        <th className="p-4 text-right">Total Labour Cost</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                      {summary.project_summary.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                            {p.project_code && <span className="text-xs font-mono text-slate-400 block mb-0.5">{p.project_code}</span>}
                            {p.project_name}
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs">
                              {p.worker_days} Mandays
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-rose-600 text-base">
                            {formatCurrency(p.total_labour_cost)}
                          </td>
                          <td className="p-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/business/projects/${p.project_id}`)}
                              className="h-8 text-xs text-blue-600 hover:text-blue-700"
                            >
                              View Site <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Labour Payments */}
            <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-500" />
                  Recent Wage Payments
                </h3>
              </div>

              <div className="p-6 flex-1 overflow-y-auto max-h-[500px] space-y-4">
                {!summary?.recent_payments || summary.recent_payments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No recent labour wage payments recorded.
                  </div>
                ) : (
                  summary.recent_payments.map((exp: any, i: number) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm truncate">{exp.description || exp.title || 'Labour Payment'}</span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {new Date(exp.expense_date || exp.created_at).toLocaleDateString()} • {exp.category || 'Labour Charges'}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-rose-600 text-sm block">{formatCurrency(exp.amount)}</span>
                        {exp.project && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded">
                            {exp.project.project_code || exp.project.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <RecordLabourPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

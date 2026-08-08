import { useState } from 'react';
import { Plus, Percent, CalendarDays, Edit2, Trash2, CalendarRange } from 'lucide-react';
import { toast } from 'sonner';
import { useHotelRatePlans, useDeleteHotelRatePlan } from '../api/useHotelRooms';
import type { HotelRatePlan } from '../schemas/roomSchema';
import { Button } from '@/components/ui/button';
import { PlanCardSkeleton } from '@/components/ui/skeleton-loaders';
import { AddRatePlanModal } from '../components/AddRatePlanModal';
import { format } from 'date-fns';

export function RatePlansPage() {
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<HotelRatePlan | null>(null);

  const { data: ratePlans = [], isLoading } = useHotelRatePlans();
  const deletePlan = useDeleteHotelRatePlan();

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this rate plan?')) return;
    try {
      await deletePlan.mutateAsync(id);
      toast.success('Rate plan deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleEdit = (plan: HotelRatePlan) => {
    setEditingPlan(plan);
    setAddOpen(true);
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <Percent className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Seasonal Rate Plans <span className="text-indigo-600 dark:text-indigo-400 text-base font-bold px-2 py-0.5 rounded-md bg-indigo-500/10">Pricing Rules</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage promotional and seasonal pricing rules to override standard room rates.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => { setEditingPlan(null); setAddOpen(true); }}
              className="rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Rate Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-30">
          {isLoading ? (
            <PlanCardSkeleton count={3} />
          ) : ratePlans.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white/50 dark:bg-[#111118]/50 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20 text-slate-400 dark:text-slate-500">
              <div className="text-6xl mb-4 opacity-50">🗓️</div>
              <p className="font-bold text-lg text-slate-700 dark:text-slate-300">No active rate plans</p>
              <p className="text-sm mt-1">Create a rate plan to override standard prices for specific dates.</p>
              <Button 
                onClick={() => { setEditingPlan(null); setAddOpen(true); }}
                className="mt-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-6"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Rate Plan
              </Button>
            </div>
          ) : (
            ratePlans.map((plan) => (
              <div key={plan.id} className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      {plan.name}
                      {!plan.is_active && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                      )}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{plan.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)} className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    <span>
                      {format(new Date(plan.start_date), 'dd MMM yyyy')} - {format(new Date(plan.end_date), 'dd MMM yyyy')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-3 rounded-xl">
                    <div className="text-sm">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Modifier</span>
                      <span className={`font-black text-lg ${plan.modifier_value > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {plan.modifier_value > 0 ? '+' : ''}{plan.modifier_value}{plan.modifier_type === 'percentage' ? '%' : ' flat'}
                      </span>
                    </div>
                    <div className="text-sm text-right">
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Applies To</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {plan.room_type ? plan.room_type.name : 'All Room Types'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#111118] px-3 py-2 rounded-lg border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span>Minimum Stay Requirements</span>
                    <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">{plan.min_stay_nights} Nights</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <AddRatePlanModal
          isOpen={isAddOpen}
          onClose={() => setAddOpen(false)}
          editingPlan={editingPlan}
        />
      </div>
    </div>
  );
}

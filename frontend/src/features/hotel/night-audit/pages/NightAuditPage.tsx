import React from 'react';
import { useNightAuditPreview, useNightAuditHistory, useRunNightAudit } from '../api/useNightAudit';
import { Moon, CheckCircle2, AlertCircle, PlayCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NightAuditPage() {
  const { data: preview, isLoading: isPreviewLoading } = useNightAuditPreview();
  const { data: history, isLoading: isHistoryLoading } = useNightAuditHistory();
  const runAudit = useRunNightAudit();

  const handleRunAudit = () => {
    if (!window.confirm('Are you sure you want to run the Night Audit? This will post all daily room charges and rollover the business day.')) {
      return;
    }
    
    runAudit.mutate(undefined, {
      onSuccess: () => toast.success('Night Audit completed successfully.'),
      onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to run Night Audit'),
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Moon className="w-6 h-6 text-indigo-500" />
          Night Audit
        </h1>
        <p className="text-slate-500 text-sm mt-1">End of day rollover and daily charge posting.</p>
      </div>

      {/* Preview Section */}
      <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Today's Audit Preview</h3>
          <Button 
            onClick={handleRunAudit} 
            disabled={runAudit.isPending || isPreviewLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <PlayCircle className={`w-4 h-4 mr-2 ${runAudit.isPending ? 'animate-spin' : ''}`} />
            {runAudit.isPending ? 'Running...' : 'Run Night Audit'}
          </Button>
        </div>

        {isPreviewLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-100 rounded"></div>
            <div className="h-12 bg-slate-100 rounded"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="text-sm text-slate-500 mb-1">Active Rooms (Checked In)</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{preview?.rooms_occupied}</div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="text-sm text-slate-500 mb-1">Pending Check-outs</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{preview?.expected_checkouts}</div>
              <div className="text-xs text-slate-400 mt-1">Expected to leave today</div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <div className="text-sm text-slate-500 mb-1">Pending No-shows</div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{preview?.no_shows}</div>
              <div className="text-xs text-slate-400 mt-1">Will be auto-cancelled</div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
              <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">Expected Room Revenue</div>
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                ₹{parseFloat(preview?.expected_room_revenue || 0).toLocaleString()}
              </div>
              <div className="text-xs text-indigo-500/70 mt-1">To be posted to folios</div>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          Audit History
        </h3>
        
        {isHistoryLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        ) : history?.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl">
            <p className="text-slate-500">No night audits run yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3">Audit Date</th>
                    <th className="px-4 py-3">Run At</th>
                    <th className="px-4 py-3">Run By</th>
                    <th className="px-4 py-3">Occupancy</th>
                    <th className="px-4 py-3">Gross Revenue</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history?.map((audit: any) => (
                    <tr key={audit.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                        {new Date(audit.audit_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(audit.run_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {audit.runner?.name || 'System'}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {audit.rooms_occupied} Rooms ({parseFloat(audit.occupancy_percent).toFixed(1)}%)
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{parseFloat(audit.total_revenue_gross).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {audit.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertCircle className="w-3 h-3" /> {audit.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

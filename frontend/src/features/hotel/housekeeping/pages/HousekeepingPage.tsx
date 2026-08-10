import React, { useState } from 'react';
import { 
  useHousekeepingTasks, 
  useHousekeepingDailyReport, 
  useUpdateHousekeepingTaskStatus,
  useAssignHousekeepingTask,
  useReportHousekeepingIssue
} from '../api/useHotelHousekeeping';
import { HousekeepingTaskCard } from '../components/HousekeepingTaskCard';
import { AssignStaffModal } from '../components/AssignStaffModal';
import { ReportIssueModal } from '../components/ReportIssueModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import type { HousekeepingTask } from '../schemas/housekeepingSchema';
import { Sparkles, Loader2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function HousekeepingPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: tasks, isLoading, refetch } = useHousekeepingTasks({ date: selectedDate });
  const { data: report } = useHousekeepingDailyReport(selectedDate);
  
  const updateStatus = useUpdateHousekeepingTaskStatus();
  const assignTask = useAssignHousekeepingTask();
  const reportIssue = useReportHousekeepingIssue();

  const [assignModalTask, setAssignModalTask] = useState<HousekeepingTask | null>(null);
  const [issueModalTask, setIssueModalTask] = useState<HousekeepingTask | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress') || [];
  const inspectTasks = tasks?.filter(t => t.status === 'completed') || [];
  const issueTasks = tasks?.filter(t => t.status === 'issue_reported') || [];

  const handleStatusChange = async (id: number, status: HousekeepingTask['status']) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success('Task status updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] p-4 md:p-6 overflow-x-auto">
      <div className="min-w-[1200px] max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Housekeeping
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage room cleaning, maintenance, and inspections</p>
          </div>
          
          <div className="flex gap-4">
            {report && (
              <div className="flex gap-4 bg-white dark:bg-[#111118] px-4 py-2 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm text-sm">
                <div className="text-center px-2">
                  <div className="text-xl font-black text-slate-800 dark:text-slate-200">{report.pending}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Pending</div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-white/10 my-1" />
                <div className="text-center px-2">
                  <div className="text-xl font-black text-blue-600 dark:text-blue-500">{report.in_progress}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">In Progress</div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-white/10 my-1" />
                <div className="text-center px-2">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-500">{report.completed}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Completed</div>
                </div>
                <div className="w-px bg-slate-200 dark:bg-white/10 my-1" />
                <div className="text-center px-2">
                  <div className="text-xl font-black text-rose-600 dark:text-rose-500">{report.issues}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Issues</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center bg-white dark:bg-[#111118] px-3 h-14 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0 cursor-pointer"
              />
            </div>
            
            <Button variant="outline" className="h-14 rounded-2xl bg-white dark:bg-[#111118]" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 px-6">
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 items-start pb-8">
            
            {/* Column 1: Pending */}
            <div className="bg-slate-100/50 dark:bg-white/[0.02] rounded-3xl p-4 border border-slate-200/50 dark:border-white/5">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400" /> Needs Cleaning
                </h3>
                <span className="text-xs font-black bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">{pendingTasks.length}</span>
              </div>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <HousekeepingTaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onAssignClick={setAssignModalTask}
                    onReportIssueClick={setIssueModalTask}
                  />
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center text-sm text-slate-400 py-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                    No pending tasks
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-4 border border-blue-100 dark:border-blue-500/20">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> In Progress
                </h3>
                <span className="text-xs font-black bg-blue-200 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{inProgressTasks.length}</span>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map(task => (
                  <HousekeepingTaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onAssignClick={setAssignModalTask}
                    onReportIssueClick={setIssueModalTask}
                  />
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center text-sm text-blue-400/60 py-8 border-2 border-dashed border-blue-200 dark:border-blue-500/20 rounded-2xl">
                    No active tasks
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Inspect / Completed */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-4 border border-emerald-100 dark:border-emerald-500/20">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Cleaned & Inspect
                </h3>
                <span className="text-xs font-black bg-emerald-200 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{inspectTasks.length}</span>
              </div>
              <div className="space-y-3">
                {inspectTasks.map(task => (
                  <HousekeepingTaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onAssignClick={setAssignModalTask}
                    onReportIssueClick={setIssueModalTask}
                  />
                ))}
                {inspectTasks.length === 0 && (
                  <div className="text-center text-sm text-emerald-400/60 py-8 border-2 border-dashed border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
                    No tasks completed
                  </div>
                )}
              </div>
            </div>

            {/* Column 4: Issues */}
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-4 border border-rose-100 dark:border-rose-500/20">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" /> Maintenance Issue
                </h3>
                <span className="text-xs font-black bg-rose-200 dark:bg-rose-500/30 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">{issueTasks.length}</span>
              </div>
              <div className="space-y-3">
                {issueTasks.map(task => (
                  <HousekeepingTaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onAssignClick={setAssignModalTask}
                    onReportIssueClick={setIssueModalTask}
                  />
                ))}
                {issueTasks.length === 0 && (
                  <div className="text-center text-sm text-rose-400/60 py-8 border-2 border-dashed border-rose-200 dark:border-rose-500/20 rounded-2xl">
                    No issues reported
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {assignModalTask && (
        <AssignStaffModal 
          isOpen={!!assignModalTask} 
          onClose={() => setAssignModalTask(null)} 
          task={assignModalTask} 
          onAssign={async (userId) => {
            await assignTask.mutateAsync({ id: assignModalTask.id, assigned_user_id: userId });
            toast.success('Staff assigned successfully');
          }}
        />
      )}

      {issueModalTask && (
        <ReportIssueModal 
          isOpen={!!issueModalTask} 
          onClose={() => setIssueModalTask(null)} 
          task={issueModalTask}
          onReport={async (desc) => {
            await reportIssue.mutateAsync({ id: issueModalTask.id, issue_description: desc });
            toast.success('Issue reported and room status updated');
          }}
        />
      )}

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}

import React from 'react';
import type { HousekeepingTask } from '../schemas/housekeepingSchema';
import { BedDouble, AlertCircle, Clock, User as UserIcon, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: HousekeepingTask;
  onStatusChange: (id: number, status: HousekeepingTask['status']) => void;
  onAssignClick: (task: HousekeepingTask) => void;
  onReportIssueClick: (task: HousekeepingTask) => void;
}

export function HousekeepingTaskCard({ task, onStatusChange, onAssignClick, onReportIssueClick }: TaskCardProps) {
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      case 'high': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'low': return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border-slate-200 dark:border-white/10';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    }
  };

  const getTaskTypeDisplay = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
            <BedDouble className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Room {task.room?.room_number || '---'}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wide text-slate-500 mt-0.5">
              {getTaskTypeDisplay(task.task_type)}
            </div>
          </div>
        </div>
        <div className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </div>
      </div>

      {task.notes && (
        <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-white/5 p-2 rounded-xl italic">
          "{task.notes}"
        </div>
      )}

      {task.issue_description && (
        <div className="text-xs text-rose-600 dark:text-rose-400 mb-3 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-xl border border-rose-100 dark:border-rose-500/20 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{task.issue_description}</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <button 
          onClick={() => onAssignClick(task)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.assignee ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20'}`}>
            <UserIcon className="w-3 h-3" />
          </div>
          <span className="truncate max-w-[100px]">
            {task.assignee ? task.assignee.name.split(' ')[0] : 'Assign Staff'}
          </span>
        </button>
        
        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(task.created_at), 'HH:mm')}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex gap-2">
        {task.status === 'pending' && (
          <Button size="sm" className="w-full h-8 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onStatusChange(task.id, 'in_progress')}>
            Start Work
          </Button>
        )}
        
        {task.status === 'in_progress' && (
          <>
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs font-bold rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10" onClick={() => onReportIssueClick(task)}>
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Issue
            </Button>
            <Button size="sm" className="flex-1 h-8 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onStatusChange(task.id, 'completed')}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Done
            </Button>
          </>
        )}

        {task.status === 'issue_reported' && (
          <Button size="sm" className="w-full h-8 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onStatusChange(task.id, 'in_progress')}>
            Resume Work
          </Button>
        )}

        {task.status === 'completed' && (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-500 py-1">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </div>
        )}
      </div>
    </div>
  );
}

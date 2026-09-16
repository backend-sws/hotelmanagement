import React from 'react';
import type { ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X, Home, Calendar, Sparkles, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import type { LeaveRequest } from '../api/useLeaveRequests';

interface GetLeaveColumnsProps {
  isManager: boolean | undefined;
  updateStatusMutation: any;
  overrideCategoryMutation?: any;
  markWfhAttendanceMutation?: any;
}

export const getLeaveColumns = ({
  isManager,
  updateStatusMutation,
  overrideCategoryMutation,
  markWfhAttendanceMutation,
}: GetLeaveColumnsProps): ColumnDef<LeaveRequest>[] => {
  return [
    {
      header: 'Staff Member',
      accessorKey: 'user',
      cell: (row: LeaveRequest) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {row.user?.name || '-'}
        </div>
      ),
    },
    {
      header: 'Request Type',
      cell: (row: LeaveRequest) => (
        <div className="flex items-center gap-1.5">
          {row.request_type === 'wfh' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Home className="w-3 h-3" /> WFH
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/30">
              <Calendar className="w-3 h-3" /> Leave
            </span>
          )}
          <span className="text-xs text-slate-400 capitalize">({row.leave_type})</span>
        </div>
      ),
    },
    {
      header: 'Category / Pay',
      cell: (row: LeaveRequest) => {
        const effectiveCategory = row.admin_override_category || row.leave_category || 'paid';
        const isOverridden = !!row.admin_override_category;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                effectiveCategory === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {effectiveCategory}
            </span>
            {isOverridden && (
              <span className="text-[9px] font-bold text-violet-400 border border-violet-500/20 px-1.5 py-0.2 rounded bg-violet-500/10">
                Override
              </span>
            )}
            {isManager && (
              <button
                title={`Change to ${effectiveCategory === 'paid' ? 'unpaid' : 'paid'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  overrideCategoryMutation?.mutate({
                    id: row.id,
                    category: effectiveCategory === 'paid' ? 'unpaid' : 'paid',
                  });
                }}
                disabled={overrideCategoryMutation?.isPending}
                className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeftRight className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: 'Duration',
      cell: (row: LeaveRequest) => (
        <span className="text-xs text-slate-300 font-mono">
          {format(new Date(row.from_date), 'dd MMM yyyy')} - {format(new Date(row.to_date), 'dd MMM yyyy')}
        </span>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (row: LeaveRequest) => (
        <span className="text-xs text-slate-400 truncate max-w-[180px] block" title={row.reason}>
          {row.reason}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: LeaveRequest) => (
        <Badge
          variant={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'destructive' : 'warning'}
          className="capitalize text-[10px]"
        >
          {row.status}
        </Badge>
      ),
    },
    ...(isManager
      ? [
          {
            header: 'Actions',
            cell: (row: LeaveRequest) => {
              return (
                <div className="flex items-center gap-2 justify-end">
                  {/* Pending Approval / Rejection */}
                  {row.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ id: row.id, status: 'approved' });
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ id: row.id, status: 'rejected' });
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {/* WFH Mark Attendance Action */}
                  {row.request_type === 'wfh' && row.status === 'approved' && (
                    row.wfh_attendance_marked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Marked
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markWfhAttendanceMutation?.mutate(row.id);
                        }}
                        disabled={markWfhAttendanceMutation?.isPending}
                        className="inline-flex items-center gap-1 h-7 px-2.5 text-[10px] font-black uppercase tracking-widest bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 rounded-lg transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
                        title="Auto-mark staff attendance for this approved WFH request"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Mark Attendance</span>
                      </button>
                    )
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];
};

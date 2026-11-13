import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CheckCircle, Camera, Check, MapPin, Home, Utensils } from 'lucide-react';
import React from 'react';
import type { AttendanceRecord } from '../api/useAttendance';
import { formatTime12Hour } from '../utils/timeFormat';

interface AttendanceColumnProps {
  handleApprove: (id: number) => void;
  handleUnapprove: (id: number) => void;
  handleViewPhoto: (record: AttendanceRecord) => void;
  isManager: boolean;
}

export const getAttendanceColumns = ({ handleApprove, handleUnapprove, handleViewPhoto, isManager }: AttendanceColumnProps): any[] => [
  {
    header: 'Date',
    accessorKey: 'date',
    cell: (row: AttendanceRecord) => format(new Date(row.date), 'dd MMM yyyy')
  },
  {
    header: 'Staff Member',
    accessorKey: 'user.name',
    cell: (row: AttendanceRecord) => row.user?.name || '-'
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (row: AttendanceRecord) => {
      const status = row.status;
      const colors: Record<string, string> = {
        present: 'success',
        absent: 'destructive',
        half_day: 'warning',
        leave: 'secondary',
        week_off: 'outline',
        holiday: 'outline'
      };
      return (
        <Badge variant={(colors[status] || 'default') as any} className="capitalize">
          {status.replace('_', ' ')}
        </Badge>
      );
    }
  },
  {
    header: 'Check In',
    accessorKey: 'check_in_time',
    cell: (row: AttendanceRecord) => row.check_in_time ? formatTime12Hour(row.check_in_time) : '-'
  },
  {
    header: 'Check Out',
    accessorKey: 'check_out_time',
    cell: (row: AttendanceRecord) => row.check_out_time ? formatTime12Hour(row.check_out_time) : '-'
  },
  {
    header: 'Office Present Time',
    cell: (row: AttendanceRecord) => {
      const gross = row.gross_presence_hours ?? row.office_present_hours;
      if (gross !== undefined && gross !== null) {
        return <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{gross} hrs</span>;
      }
      if (row.check_in_time && !row.check_out_time) {
        return <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">In Progress</span>;
      }
      return <span className="text-xs text-slate-400">—</span>;
    }
  },
  {
    header: 'Lunch Break',
    cell: (row: AttendanceRecord) => {
      if (row.is_on_lunch) {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/50">
            <Utensils size={10} /> Active Lunch
          </span>
        );
      }
      const mins = row.lunch_minutes;
      if (mins !== undefined && mins !== null && mins > 0) {
        return <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">-{mins}m</span>;
      }
      return <span className="text-xs text-slate-400">0m</span>;
    }
  },
  {
    header: 'Exact Working Hours',
    cell: (row: AttendanceRecord) => {
      const net = row.exact_working_hours ?? row.actual_hours;
      if (net !== undefined && net !== null && net > 0) {
        return (
          <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/50">
            {net} hrs
          </span>
        );
      }
      if (row.check_in_time && !row.check_out_time) {
        return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Live Duty</span>;
      }
      return <span className="text-xs text-slate-400">—</span>;
    }
  },
  {
    header: 'Location / Work Type',
    accessorKey: 'is_within_geofence',
    cell: (row: AttendanceRecord) => {
      if (row.work_type === 'wfh') {
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Home size={12} className="shrink-0" /> WFH (Photo Only)
          </span>
        );
      }

      const isValid = row.is_within_geofence;
      const hasLocation = row.check_in_latitude && row.check_in_longitude;
      
      return (
        <div className="flex flex-col gap-1">
          {isValid ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle size={12} className="mr-1" /> Valid Geofence
            </span>
          ) : (
            <span className="flex items-center text-rose-500 text-xs font-bold">
              Outside Geofence
            </span>
          )}
          {hasLocation && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${row.check_in_latitude},${row.check_in_longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-primary-500 hover:underline flex items-center"
            >
              <MapPin size={10} className="mr-1" /> View Map
            </a>
          )}
        </div>
      );
    }
  },
  {
    header: 'Photo',
    cell: (row: AttendanceRecord) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleViewPhoto(row)}
          disabled={!row.check_in_photo}
        >
          <Camera className={`h-4 w-4 ${row.check_in_photo ? 'text-primary-500' : 'text-slate-300'}`} />
        </Button>
      );
    }
  },
  ...(isManager ? [{
    header: 'Approval',
    cell: (row: AttendanceRecord & { approved_by?: number }) => {
      if (row.approved_by) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="success">Approved</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
              onClick={() => handleUnapprove(row.id)}
              title="Revoke Approval"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
        );
      }
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          onClick={() => handleApprove(row.id)}
        >
          <Check className="h-4 w-4 mr-1" /> Approve
        </Button>
      );
    }
  }] : [])
];

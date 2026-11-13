import React, { useState } from 'react';
import { getDaysInMonth, format } from 'date-fns';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FilterSelect } from '@/components/ui/filter-controls';
import { Input } from '@/components/ui/input';
import {
  useMarkAttendance,
  useApproveAttendance,
  useAdminEditTime,
  useApproveOvertime,
  useRejectOvertime,
  useEditOvertime,
  useApproveRegularization,
  useRejectRegularization,
  type AttendanceRecord,
  type BusinessHoliday,
} from '../api/useAttendance';
import { Check, Camera, Clock, AlertCircle, Gift, Calendar, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RegularizationModal } from './RegularizationModal';

interface AttendanceMonthlyGridProps {
  month: string; // format: 'yyyy-MM'
  staffList: any[];
  attendanceData: AttendanceRecord[];
  isManager: boolean;
  loggedInUserId: number;
  isLoading?: boolean;
  monthlyReport?: any[];
  holidays?: BusinessHoliday[];
}

export function AttendanceMonthlyGrid({ 
  month, 
  staffList, 
  attendanceData,
  isManager,
  loggedInUserId,
  isLoading,
  monthlyReport = [],
  holidays = []
}: AttendanceMonthlyGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ userId: number; date: string } | null>(null);
  const [isRegularizeOpen, setIsRegularizeOpen] = useState(false);
  
  const [year, monthStr] = month.split('-');
  const dateObj = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
  const daysInMonth = getDaysInMonth(dateObj);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const markMutation = useMarkAttendance();
  const approveMutation = useApproveAttendance();
  const adminEditMutation = useAdminEditTime();
  const approveOtMutation = useApproveOvertime();
  const rejectOtMutation = useRejectOvertime();
  const editOtMutation = useEditOvertime();
  const approveRegMutation = useApproveRegularization();
  const rejectRegMutation = useRejectRegularization();

  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editCheckIn, setEditCheckIn] = useState<string>('');
  const [editCheckOut, setEditCheckOut] = useState<string>('');
  const [editLateMinutes, setEditLateMinutes] = useState<number>(0);
  const [editOvertimeHours, setEditOvertimeHours] = useState<number>(0);
  const [editOvertimeApproved, setEditOvertimeApproved] = useState<boolean>(false);

  // Filter staff if not manager
  const visibleStaff = isManager 
    ? staffList 
    : staffList.filter(s => s.id === loggedInUserId);

  // Group attendance by user_id and then by date (e.g., '2026-07-01')
  const attendanceMap: Record<number, Record<string, AttendanceRecord>> = {};
  
  attendanceData.forEach(record => {
    if (!attendanceMap[record.user_id]) {
      attendanceMap[record.user_id] = {};
    }
    const dateOnly = record.date.includes('T') 
      ? format(new Date(record.date), 'yyyy-MM-dd') 
      : record.date;
    attendanceMap[record.user_id][dateOnly] = record;
  });

  // Map company holidays by date ('yyyy-MM-dd')
  const holidayMap = React.useMemo(() => {
    const map: Record<string, BusinessHoliday> = {};
    (holidays || []).forEach(h => {
      const d = h.date.includes('T') ? h.date.split('T')[0] : h.date;
      map[d] = h;
    });
    return map;
  }, [holidays]);

  const getStatusColor = (status: string, record?: AttendanceRecord) => {
    const isLate = status === 'late' || (record && record.late_mark_minutes && record.late_mark_minutes > 0) || (record?.notes && record.notes.toLowerCase().includes('late entry'));
    if (isLate) return 'bg-orange-500 text-white';

    switch(status) {
      case 'present': return 'bg-emerald-500 text-white';
      case 'absent': return 'bg-rose-500 text-white';
      case 'half_day': return 'bg-amber-500 text-white';
      case 'leave': return 'bg-blue-500 text-white';
      case 'holiday': return 'bg-purple-500 text-white';
      case 'week_off': return 'bg-rose-400 text-white';
      case 'late': return 'bg-orange-500 text-white';
      default: return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string, record?: AttendanceRecord) => {
    const isLate = status === 'late' || (record && record.late_mark_minutes && record.late_mark_minutes > 0) || (record?.notes && record.notes.toLowerCase().includes('late entry'));
    if (isLate) return 'LATE ENTRY';
    if (status === 'half_day') return 'HALF DAY';
    return status.replace('_', ' ').toUpperCase();
  };

  const handleCellClick = (userId: number, day: number) => {
    const dateStr = `${month}-${String(day).padStart(2, '0')}`;
    setSelectedCell({ userId, date: dateStr });
    
    const record = attendanceMap[userId]?.[dateStr];
    const holiday = holidayMap[dateStr];
    const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
    const isSunday = dayOfWeek === 0;

    if (record) {
      const isLate = record.status === 'late' || (record.late_mark_minutes && record.late_mark_minutes > 0) || (record.notes && record.notes.toLowerCase().includes('late entry'));
      setEditStatus(isLate ? 'late' : record.status);
      setEditLateMinutes(record.late_mark_minutes || (isLate ? 30 : 0));
      setEditNotes(record.notes || '');
      setEditCheckIn(record.check_in_time ? record.check_in_time.slice(0, 5) : '');
      setEditCheckOut(record.check_out_time ? record.check_out_time.slice(0, 5) : '');
      setEditOvertimeHours(record.overtime_hours || 0);
      setEditOvertimeApproved(!!record.overtime_approved);
    } else if (holiday) {
      setEditStatus('holiday');
      setEditLateMinutes(0);
      setEditNotes(holiday.name);
      setEditCheckIn('');
      setEditCheckOut('');
      setEditOvertimeHours(0);
      setEditOvertimeApproved(false);
    } else if (isSunday) {
      setEditStatus('week_off');
      setEditLateMinutes(0);
      setEditNotes('Sunday Off');
      setEditCheckIn('');
      setEditCheckOut('');
      setEditOvertimeHours(0);
      setEditOvertimeApproved(false);
    } else {
      setEditStatus('present');
      setEditLateMinutes(0);
      setEditNotes('');
      setEditCheckIn('');
      setEditCheckOut('');
      setEditOvertimeHours(0);
      setEditOvertimeApproved(false);
    }
  };

  const selectedRecord = selectedCell 
    ? attendanceMap[selectedCell.userId]?.[selectedCell.date]
    : null;

  const handleSaveEdit = () => {
    if (!selectedCell) return;

    markMutation.mutate({
      user_id: selectedCell.userId,
      date: selectedCell.date,
      status: editStatus,
      late_mark_minutes: editStatus === 'late' ? (editLateMinutes || 30) : undefined,
      notes: editNotes || (editStatus === 'late' ? `Late Entry (${editLateMinutes || 30}m)` : undefined),
    }, {
      onSuccess: () => {
        // If times were changed on an existing record, update times as admin
        if (selectedRecord && (editCheckIn || editCheckOut)) {
          adminEditMutation.mutate({
            id: selectedRecord.id,
            check_in_time: editCheckIn ? `${editCheckIn}:00` : undefined,
            check_out_time: editCheckOut ? `${editCheckOut}:00` : undefined,
            notes: editNotes,
          });
        }
        // If overtime was edited on an existing record
        if (selectedRecord && (editOvertimeHours !== (selectedRecord.overtime_hours || 0) || editOvertimeApproved !== !!selectedRecord.overtime_approved)) {
          editOtMutation.mutate({
            id: selectedRecord.id,
            overtime_hours: editOvertimeHours,
            overtime_approved: editOvertimeApproved,
          });
        }
        setSelectedCell(null);
      }
    });
  };

  const getPhotoUrl = (path: string | null) => {
    if (!path) return null;
    return path.startsWith('http') 
      ? path 
      : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${path}`;
  };

  return (
    <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Legend */}
      <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-wrap gap-3.5 text-xs font-semibold items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs">P</div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-orange-500 text-white font-black text-[8px] flex items-center justify-center shadow-xs">LE</div>
          <span className="text-orange-600 dark:text-orange-400 font-bold">Late Entry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-500 text-white font-black text-[8px] flex items-center justify-center shadow-xs">HD</div>
          <span className="text-amber-600 dark:text-amber-400 font-bold">Half Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-rose-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs">A</div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-blue-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs">L</div>
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-rose-400 text-white font-black text-[8px] flex items-center justify-center shadow-xs">WO</div>
          <span>Sunday / Week Off</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-purple-500 text-white font-black text-[9px] flex items-center justify-center shadow-xs">H</div>
          <span>Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-indigo-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs">OT</div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Overtime (+Xh)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-500 border border-white dark:border-zinc-900 ring-2 ring-amber-400 flex items-center justify-center text-white font-black text-[9px]">P</div>
          <span className="text-amber-600 dark:text-amber-400 font-bold">Pending Approval</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-[#111118] border-b border-slate-200 dark:border-white/5 text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-widest">
            <tr>
              <th className="px-4 py-3 font-black sticky left-0 bg-slate-50 dark:bg-[#111118] z-10 min-w-[150px]">Staff Member</th>
              {daysArray.map(day => {
                const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                const holiday = holidayMap[dateStr];
                const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
                const isSunday = dayOfWeek === 0;

                return (
                  <th 
                    key={day} 
                    className={`px-1.5 py-2.5 text-center min-w-[38px] font-semibold transition-colors ${
                      holiday ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-black' : 
                      isSunday ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black' : ''
                    }`}
                    title={holiday ? `Holiday: ${holiday.name}` : isSunday ? 'Sunday (Weekly Off)' : undefined}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span>{day}</span>
                      {holiday ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                      ) : isSunday ? (
                        <span className="text-[8px] font-black uppercase tracking-tight text-rose-500 dark:text-rose-400 leading-none">Sun</span>
                      ) : null}
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-3 font-black text-center min-w-[150px] border-l border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#18181c]">Total (P/LE/HD/A/L/H/WO)</th>
              <th className="px-4 py-3 font-black text-center min-w-[120px] border-l border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#18181c]">Hours (Act / Std)</th>
              <th className="px-4 py-3 font-black text-center min-w-[100px] border-l border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#18181c]">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-[#111115] z-10 border-r border-slate-200 dark:border-white/5">
                    <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </td>
                  {daysArray.map(day => (
                    <td key={day} className="px-1 py-2 text-center">
                      <div className="mx-auto w-7 h-7 rounded-md bg-slate-200/60 dark:bg-zinc-800/60 opacity-60 animate-pulse" />
                    </td>
                  ))}
                  <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#18181b]/50 text-center animate-pulse">
                    <div className="mx-auto h-5 w-20 rounded bg-slate-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#18181b]/50 text-center animate-pulse">
                    <div className="mx-auto h-5 w-16 rounded bg-slate-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#18181b]/50 text-center animate-pulse">
                    <div className="mx-auto h-5 w-12 rounded bg-slate-200 dark:bg-zinc-800" />
                  </td>
                </tr>
              ))
            ) : visibleStaff.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 4} className="px-4 py-8 text-center text-slate-500">
                  No staff members found.
                </td>
              </tr>
            ) : (
              visibleStaff.map(staff => {
                const staffReport = monthlyReport.find((r: any) => r.user_id === staff.id);
                const stdHours = staffReport?.total_standard_hours;
                const actHours = staffReport?.total_actual_hours;
                const effPct = staffReport?.efficiency_pct;
                const isInactiveStaff = staff.status === 'inactive';

                return (
                  <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-[#111115] z-10 border-r border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={staff.status === 'inactive' ? 'line-through text-slate-400' : ''}>{staff.name}</span>
                        {staff.status === 'inactive' && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            Left / Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    {daysArray.map(day => {
                      const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                      const record = attendanceMap[staff.id]?.[dateStr];
                      const holiday = holidayMap[dateStr];
                      const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
                      const isSunday = dayOfWeek === 0;
                      const hasPhoto = record?.check_in_photo || record?.check_out_photo;
                      const isUnapproved = record && !record.approved_by;
                      const isHolidayCell = !record && !!holiday;
                      const isSundayCell = !record && isSunday;

                      const isLateRecord = record && (record.status === 'late' || (record.late_mark_minutes && record.late_mark_minutes > 0) || (record.notes && record.notes.toLowerCase().includes('late entry')));
                      const isHalfDay = record && record.status === 'half_day';
                      const isPresent = record && record.status === 'present' && !isLateRecord;
                      const isAbsent = record && record.status === 'absent';
                      const isLeave = record && record.status === 'leave';
                      const isWeekOff = (record && record.status === 'week_off') || (!isInactiveStaff && isSundayCell);
                      const isHoliday = (record && record.status === 'holiday') || (!isInactiveStaff && isHolidayCell);

                      let cellClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
                      let cellTitle = 'No record';
                      let cellBadge = '';

                      if (isHoliday) {
                        cellClass = 'bg-purple-500 text-white shadow-xs';
                        cellTitle = holiday ? `Holiday: ${holiday.name} (${holiday.type || 'Custom'})` : 'Holiday';
                        cellBadge = 'H';
                      } else if (isWeekOff) {
                        cellClass = 'bg-rose-400 text-white shadow-xs';
                        cellTitle = 'Sunday (Weekly Off)';
                        cellBadge = 'WO';
                      } else if (isLateRecord) {
                        cellClass = 'bg-orange-500 text-white shadow-xs';
                        const lateMins = record?.late_mark_minutes ? `${record.late_mark_minutes}m late` : 'Late Entry';
                        cellTitle = `Late Entry (${lateMins}) ${isUnapproved ? '(Pending Approval)' : ''} ${record?.check_in_time ? `(In: ${record.check_in_time})` : ''}`;
                        cellBadge = 'LE';
                      } else if (isHalfDay) {
                        cellClass = 'bg-amber-500 text-white shadow-xs';
                        const halfHours = (record?.actual_hours !== null && record?.actual_hours !== undefined) ? record.actual_hours : 4.5;
                        cellTitle = `Half Day (0.5 Day) ${isUnapproved ? '(Pending Approval)' : ''} (${halfHours}h)`;
                        cellBadge = 'HD';
                      } else if (isPresent) {
                        cellClass = 'bg-emerald-500 text-white shadow-xs';
                        cellTitle = `Present ${isUnapproved ? '(Pending Approval)' : ''} ${record?.check_in_time ? `(In: ${record.check_in_time})` : ''} ${record?.actual_hours ? `(${record.actual_hours}h)` : ''}`;
                        cellBadge = 'P';
                      } else if (isAbsent) {
                        cellClass = 'bg-rose-500 text-white shadow-xs';
                        cellTitle = `Absent ${record?.notes ? `(${record.notes})` : ''}`;
                        cellBadge = 'A';
                      } else if (isLeave) {
                        cellClass = 'bg-blue-500 text-white shadow-xs';
                        cellTitle = `Leave ${record?.notes ? `(${record.notes})` : ''}`;
                        cellBadge = 'L';
                      }
                      
                      const hasOvertime = record && Number(record.overtime_hours) > 0;
                      const isOtApproved = record && record.overtime_approved;

                      return (
                        <td key={day} className={`px-1 py-2 ${isSunday ? 'bg-rose-500/[0.03] dark:bg-rose-950/[0.08]' : ''}`}>
                          <div 
                            onClick={() => handleCellClick(staff.id, day)}
                            className={`relative mx-auto w-7 h-7 rounded-md cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${cellClass} ${isUnapproved ? 'ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-[#111115] shadow-sm' : ''}`}
                            title={`${cellTitle}${hasOvertime ? ` [OT: ${record.overtime_hours}h ${isOtApproved ? 'Approved' : 'Pending'}]` : ''}`}
                          >
                            {cellBadge ? (
                              <span className={`text-white font-black leading-none ${cellBadge.length > 1 ? 'text-[8.5px] tracking-tighter' : 'text-[10px]'}`}>
                                {cellBadge}
                              </span>
                            ) : null}

                            {hasOvertime && (
                              <span 
                                className={`absolute -top-1.5 -right-1 px-1 rounded-full font-black text-[7px] leading-tight shadow-xs ${
                                  isOtApproved 
                                    ? 'bg-indigo-600 text-white ring-1 ring-white dark:ring-zinc-900' 
                                    : 'bg-amber-400 text-amber-950 ring-1 ring-white dark:ring-zinc-900'
                                }`}
                                title={`Overtime: ${record.overtime_hours}h ${isOtApproved ? '(Approved)' : '(Pending Verification)'}`}
                              >
                                +{record.overtime_hours}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    
                    {/* Total Summary Columns */}
                    {(() => {
                      let present = 0;
                      let lateCount = 0;
                      let halfDay = 0;
                      let absent = 0;
                      let leave = 0;
                      let holidayCount = 0;
                      let weekOffCount = 0;
                      let approvedOtHours = 0;

                      daysArray.forEach(day => {
                        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                        const record = attendanceMap[staff.id]?.[dateStr];
                        const holiday = holidayMap[dateStr];
                        const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
                        const isSunday = dayOfWeek === 0;

                        if (record) {
                          if (Number(record.overtime_hours) > 0 && record.overtime_approved) {
                            approvedOtHours += Number(record.overtime_hours);
                          }
                          const isLate = record.status === 'late' || (record.late_mark_minutes && record.late_mark_minutes > 0) || (record.notes && record.notes.toLowerCase().includes('late entry'));
                          if (isLate) {
                            lateCount++;
                          }
                          if (record.status === 'present') {
                            present++;
                          } else if (record.status === 'absent') {
                            absent++;
                          } else if (record.status === 'half_day') {
                            halfDay++;
                          } else if (record.status === 'leave') {
                            leave++;
                          } else if (record.status === 'holiday') {
                            holidayCount++;
                          } else if (record.status === 'week_off') {
                            weekOffCount++;
                          }
                        } else if (!isInactiveStaff && holiday) {
                          holidayCount++;
                        } else if (!isInactiveStaff && isSunday) {
                          weekOffCount++;
                        }
                      });

                      return (
                        <td className="px-3 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-center">
                          <div className="flex gap-1 justify-center text-[10.5px] font-bold flex-wrap">
                            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Present">{present}P</span>
                            {lateCount > 0 && (
                              <span className="text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Late Entry">{lateCount}LE</span>
                            )}
                            {halfDay > 0 && (
                              <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Half Day">{halfDay}HD</span>
                            )}
                            <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Absent">{absent}A</span>
                            <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Leave">{leave}L</span>
                            {holidayCount > 0 && (
                              <span className="text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Holiday">{holidayCount}H</span>
                            )}
                            {weekOffCount > 0 && (
                              <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Sunday / Week Off">{weekOffCount}WO</span>
                            )}
                            {approvedOtHours > 0 && (
                              <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded shadow-xs" title="Approved Overtime Hours">
                                {approvedOtHours.toFixed(1)}h OT
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })()}

                    {/* Working Hours Column (Actual / Standard) */}
                    <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-center text-xs font-mono">
                      {actHours !== undefined && stdHours !== undefined ? (
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{actHours}h</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px]"> / {stdHours}h</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Efficiency % Column */}
                    <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-center">
                      {effPct !== undefined ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                          effPct >= 95
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : effPct >= 75
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {effPct}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Daily Attendance Footer Row (Calculated Per Day) */}
          <tfoot className="border-t-2 border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-[#141418] font-bold text-xs sticky bottom-0 z-10 shadow-inner">
            <tr>
              <td className="px-4 py-3 sticky left-0 bg-slate-100 dark:bg-[#141418] z-20 border-r border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                    Daily Attendance
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Per Day)
                  </span>
                </div>
              </td>

              {daysArray.map(day => {
                const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                const holiday = holidayMap[dateStr];
                const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
                const isSunday = dayOfWeek === 0;

                const today = new Date();
                const isFutureDay = parseInt(year) === today.getFullYear() && 
                  parseInt(monthStr) - 1 === today.getMonth() && 
                  day > today.getDate();

                if (holiday) {
                  return (
                    <td key={day} className="px-1 py-2.5 text-center bg-purple-500/5">
                      <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">H</span>
                    </td>
                  );
                }

                if (isSunday) {
                  return (
                    <td key={day} className="px-1 py-2.5 text-center bg-rose-500/5">
                      <span className="text-[9px] font-black text-rose-500 dark:text-rose-400">Sun</span>
                    </td>
                  );
                }

                if (isFutureDay) {
                  return (
                    <td key={day} className="px-1 py-2.5 text-center text-slate-300 dark:text-slate-600">
                      <span>—</span>
                    </td>
                  );
                }

                // Count staff present on this day
                let presentStaff = 0;
                visibleStaff.forEach(staff => {
                  const rec = attendanceMap[staff.id]?.[dateStr];
                  if (rec) {
                    if (rec.status === 'present' || rec.status === 'late') {
                      presentStaff += 1;
                    } else if (rec.status === 'half_day') {
                      presentStaff += 0.5;
                    }
                  }
                });

                const totalStaff = visibleStaff.length;
                const ratio = totalStaff > 0 ? (presentStaff / totalStaff) : 0;
                const badgeColor = ratio >= 0.9 
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : ratio >= 0.5
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                  : presentStaff > 0
                  ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30'
                  : 'bg-slate-200/50 dark:bg-zinc-800 text-slate-400 border-transparent';

                return (
                  <td key={day} className="px-1 py-2 text-center" title={`${presentStaff} of ${totalStaff} staff present on Day ${day}`}>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black border ${badgeColor}`}>
                      {presentStaff % 1 === 0 ? presentStaff : presentStaff.toFixed(1)}
                    </span>
                  </td>
                );
              })}

              {/* Total & Average Columns */}
              {(() => {
                // Calculate average daily attendance across elapsed working days
                const today = new Date();
                const isCurrentMonth = today.getFullYear() === parseInt(year) && today.getMonth() === parseInt(monthStr) - 1;
                const maxDay = isCurrentMonth ? Math.min(today.getDate(), daysInMonth) : daysInMonth;

                let workingDaysCount = 0;
                let sumDailyPresent = 0;

                for (let d = 1; d <= maxDay; d++) {
                  const dateStr = `${month}-${String(d).padStart(2, '0')}`;
                  const holiday = holidayMap[dateStr];
                  const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, d).getDay();
                  const isSunday = dayOfWeek === 0;

                  if (!holiday && !isSunday) {
                    workingDaysCount++;
                    visibleStaff.forEach(staff => {
                      const rec = attendanceMap[staff.id]?.[dateStr];
                      if (rec) {
                        if (rec.status === 'present' || rec.status === 'late') sumDailyPresent += 1;
                        else if (rec.status === 'half_day') sumDailyPresent += 0.5;
                      }
                    });
                  }
                }

                const totalStaff = visibleStaff.length;
                const avgDailyAttendance = workingDaysCount > 0 ? (sumDailyPresent / workingDaysCount) : 0;
                const avgDailyPct = (workingDaysCount > 0 && totalStaff > 0)
                  ? Math.round((avgDailyAttendance / totalStaff) * 100)
                  : 0;

                return (
                  <>
                    <td className="px-3 py-2.5 border-l border-slate-200 dark:border-white/10 text-center bg-slate-100 dark:bg-[#18181c]">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-black text-slate-900 dark:text-white">
                          Avg {avgDailyAttendance.toFixed(1)} / {totalStaff}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                          {avgDailyPct}% / day
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 border-l border-slate-200 dark:border-white/10 text-center text-xs font-mono font-bold bg-slate-100 dark:bg-[#18181c]">
                      Daily Avg
                    </td>
                    <td className="px-3 py-2.5 border-l border-slate-200 dark:border-white/10 text-center bg-slate-100 dark:bg-[#18181c]">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                        avgDailyPct >= 90
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : avgDailyPct >= 75
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}>
                        {avgDailyPct}%
                      </span>
                    </td>
                  </>
                );
              })()}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Detail & Edit Modal */}
      <Modal 
        isOpen={!!selectedCell} 
        onClose={() => setSelectedCell(null)} 
        title={`Attendance: ${visibleStaff.find(s => s.id === selectedCell?.userId)?.name} - ${selectedCell?.date}`}
      >
        <div className="p-4 pb-20 space-y-5">
          {selectedCell && holidayMap[selectedCell.date] && (
            <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                <Gift className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Designated Company Holiday:</span>
                <span className="font-extrabold underline">{holidayMap[selectedCell.date].name}</span>
              </div>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                {holidayMap[selectedCell.date].type}
              </span>
            </div>
          )}

          {selectedRecord ? (
            <div className="space-y-4 mb-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Check In Card */}
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">Check In Time</p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-200 mt-1">{selectedRecord.check_in_time || 'N/A'}</p>
                  {selectedRecord.late_mark_minutes ? (
                    <span className="text-[10px] text-rose-500 font-bold">Late by {selectedRecord.late_mark_minutes}m</span>
                  ) : null}
                </div>
                <div className="mt-3">
                  {selectedRecord.check_in_photo ? (
                    <img 
                      src={getPhotoUrl(selectedRecord.check_in_photo)!} 
                      alt="Check In" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-white/15 shadow-sm" 
                    />
                  ) : (
                    <div className="w-full h-24 rounded-xl bg-slate-100/50 dark:bg-white/[0.01] border border-dashed border-slate-200/80 dark:border-white/5 flex flex-col items-center justify-center text-slate-400 gap-1 p-2">
                      <Camera className="w-4 h-4 text-slate-350 dark:text-slate-650" />
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check Out Card */}
              <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">Check Out Time</p>
                  <p className="text-base font-black text-slate-800 dark:text-slate-200 mt-1">{selectedRecord.check_out_time || 'N/A'}</p>
                  {selectedRecord.actual_hours !== null && selectedRecord.actual_hours !== undefined ? (
                    <span className="text-[10px] text-emerald-500 font-bold">Hours: {selectedRecord.actual_hours}h</span>
                  ) : null}
                </div>
                <div className="mt-3">
                  {selectedRecord.check_out_photo ? (
                    <img 
                      src={getPhotoUrl(selectedRecord.check_out_photo)!} 
                      alt="Check Out" 
                      className="w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-white/15 shadow-sm" 
                    />
                  ) : (
                    <div className="w-full h-24 rounded-xl bg-slate-100/50 dark:bg-white/[0.01] border border-dashed border-slate-200/80 dark:border-white/5 flex flex-col items-center justify-center text-slate-400 gap-1 p-2">
                      <Camera className="w-4 h-4 text-slate-350 dark:text-slate-650" />
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No Photo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Approval Row */}
              <div className="col-span-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500 mb-1.5">Current Status</p>
                  <div className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusLabel(selectedRecord.status)}
                  </div>
                  {selectedRecord.work_type === 'wfh' && (
                    <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                      WFH (Photo Verified)
                    </span>
                  )}
                </div>
                {isManager && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500 mb-1.5 text-right">Approval</p>
                    {selectedRecord.approved_by ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-200/20 uppercase tracking-wider">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => approveMutation.mutate(selectedRecord.id)}
                        disabled={approveMutation.isPending}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Working Hours & Lunch Time Breakdown (Two Time Calculations) */}
              <div className="col-span-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hours & Lunch Breakdown</p>
                  </div>
                  {selectedRecord.is_on_lunch && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Currently On Lunch
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/80 dark:bg-zinc-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-slate-500 block">Office Present Time</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {selectedRecord.gross_presence_hours ?? selectedRecord.office_present_hours ?? (selectedRecord.actual_hours !== null ? `${selectedRecord.actual_hours}h` : '—')}
                      {(selectedRecord.gross_presence_hours ?? selectedRecord.office_present_hours) ? 'h' : ''}
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-zinc-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">Lunch Break</span>
                    <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                      {selectedRecord.lunch_minutes ? `-${selectedRecord.lunch_minutes}m` : '0m'}
                    </span>
                  </div>

                  <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Exact Working Hours</span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                      {selectedRecord.exact_working_hours ?? selectedRecord.actual_hours ?? (selectedRecord.status === 'half_day' ? '4.5' : '—')}
                      {(selectedRecord.exact_working_hours ?? selectedRecord.actual_hours ?? (selectedRecord.status === 'half_day' ? '4.5' : '')) ? 'h' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overtime Info & Verification Card */}
              <div className="col-span-2 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">Overtime Tracking</p>
                    {selectedRecord.overtime_hours && selectedRecord.overtime_hours > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                        +{selectedRecord.overtime_hours} Hours OT
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">No overtime recorded</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {selectedRecord.overtime_approved 
                      ? '✓ Approved by Manager (will be calculated in monthly salary slip)' 
                      : selectedRecord.overtime_hours && selectedRecord.overtime_hours > 0 
                      ? '⏳ Pending Manager Verification (will not be added to salary until approved)' 
                      : 'Shift completed within standard shift hours'}
                  </p>
                </div>

                {isManager && selectedRecord.overtime_hours && selectedRecord.overtime_hours > 0 && (
                  <div className="flex gap-2 shrink-0">
                    {!selectedRecord.overtime_approved ? (
                      <button
                        type="button"
                        onClick={() => approveOtMutation.mutate(selectedRecord.id)}
                        disabled={approveOtMutation.isPending}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Approve OT
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => rejectOtMutation.mutate(selectedRecord.id)}
                        disabled={rejectOtMutation.isPending}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                      >
                        <X className="h-3 w-3" /> Revoke OT
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Forgot Check-out Half Day Penalty Alert */}
            {selectedRecord.forgot_checkout_applied && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Cap at Half-Day Applied (Forgot Check-Out)</span>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-0.5">
                    Employee did not check out before shift ended. Hours were capped at 50% credit. Approving an Out-Punch Regularization request will restore full hours.
                  </p>
                </div>
              </div>
            )}

            {/* Pending Regularization / Departure Request */}
            {selectedRecord.regularization_status === 'pending' && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800/50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Pending Out-Punch / Regularization Request
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-200/70 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Review Required
                  </span>
                </div>
                <div className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  Requested Out-Punch Time: <strong>{selectedRecord.regularization_requested_checkout || selectedRecord.regularization_requested_checkin || 'Not specified'}</strong>
                  {selectedRecord.regularization_reason && (
                    <p className="mt-0.5 italic">"{selectedRecord.regularization_reason}"</p>
                  )}
                </div>
                {isManager && (
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => approveRegMutation.mutate(selectedRecord.id)}
                      disabled={approveRegMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-7 px-3 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Approve Departure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectRegMutation.mutate(selectedRecord.id)}
                      disabled={rejectRegMutation.isPending}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold h-7 px-3 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
            </div>
          ) : selectedCell && holidayMap[selectedCell.date] ? (
            <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 text-xs font-semibold mb-5 flex items-center gap-2">
              <Gift className="w-4 h-4 shrink-0 text-purple-500" />
              <span>This day is a designated company holiday ({holidayMap[selectedCell.date].name}). Status defaults to Holiday below.</span>
            </div>
          ) : selectedCell && new Date(parseInt(selectedCell.date.split('-')[0]), parseInt(selectedCell.date.split('-')[1]) - 1, parseInt(selectedCell.date.split('-')[2])).getDay() === 0 ? (
            <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-xs font-semibold mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0 text-rose-500" />
              <span>This day is Sunday (Weekly Off). Status defaults to Week Off below.</span>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-xs font-semibold mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No attendance record found for this date. You can mark it manually below.</span>
            </div>
          )}

          {/* Regularization Action for Staff */}
          {(selectedCell?.userId === loggedInUserId || !isManager) && (
            <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-violet-400">Forgot to Check In?</p>
                <p className="text-[11px] text-slate-400">Submit a time correction request for manager verification.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsRegularizeOpen(true)}
                className="border-violet-500/30 text-violet-300 hover:bg-violet-500/20 text-xs font-bold"
              >
                <Clock className="w-3.5 h-3.5 mr-1" />
                Request Correction
              </Button>
            </div>
          )}

          {isManager && (
            <div className="border-t border-slate-200 dark:border-white/10 pt-5 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Edit Attendance & Times (Admin)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <FilterSelect
                    value={editStatus}
                    onChange={(val) => setEditStatus(val)}
                    placeholder="Select Status"
                    options={[
                      { value: 'present', label: '🟢 Present (Full Day)' },
                      { value: 'late', label: '🟠 Late Entry (Present with Late Mark)' },
                      { value: 'half_day', label: '🟡 Half Day (0.5 Working Day)' },
                      { value: 'absent', label: '🔴 Absent' },
                      { value: 'leave', label: '🔵 Leave' },
                      { value: 'week_off', label: '🌸 Sunday / Week Off' },
                      { value: 'holiday', label: '🟣 Company Holiday' },
                      { value: 'clear', label: '⚪ Clear / Reset (Normal Working Day)' }
                    ]}
                    wrapperClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <Input 
                    value={editNotes} 
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Reason for manual entry..."
                    className="h-10 text-sm bg-white dark:bg-[#0c0c0f] border-slate-200/80 dark:border-white/10"
                  />
                </div>

                {editStatus === 'late' && (
                  <div className="col-span-full bg-orange-50 dark:bg-orange-950/30 p-3.5 rounded-2xl border border-orange-200 dark:border-orange-900/50 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300">
                      <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Late Entry Settings</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Late Minutes
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="480"
                          value={editLateMinutes || ''}
                          onChange={(e) => setEditLateMinutes(Number(e.target.value) || 0)}
                          placeholder="e.g. 30"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Quick Presets
                        </label>
                        <div className="flex gap-1.5 pt-0.5">
                          {[15, 30, 45, 60].map(mins => (
                            <button
                              key={mins}
                              type="button"
                              onClick={() => {
                                setEditLateMinutes(mins);
                                setEditNotes(`Late Entry (${mins} mins late)`);
                              }}
                              className={`px-2 py-1 text-xs font-bold rounded-lg border transition-all ${
                                editLateMinutes === mins
                                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                  : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-orange-500'
                              }`}
                            >
                              +{mins}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {editStatus === 'half_day' && (
                  <div className="col-span-full bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>⚡ Half Day Attendance: Staff is counted as 0.5 working day for payroll calculation.</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Check-In Time
                  </label>
                  <Input 
                    type="time"
                    value={editCheckIn} 
                    onChange={(e) => setEditCheckIn(e.target.value)}
                    className="h-10 text-sm bg-white dark:bg-[#0c0c0f] border-slate-200/80 dark:border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Check-Out Time
                  </label>
                  <Input 
                    type="time"
                    value={editCheckOut} 
                    onChange={(e) => setEditCheckOut(e.target.value)}
                    className="h-10 text-sm bg-white dark:bg-[#0c0c0f] border-slate-200/80 dark:border-white/10"
                  />
                </div>

                {/* Overtime Manual Adjust Inputs */}
                <div className="col-span-full p-3.5 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-200/60 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Overtime Hours
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={editOvertimeApproved}
                        onChange={(e) => setEditOvertimeApproved(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Approved by Manager</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={editOvertimeHours || ''}
                    onChange={(e) => setEditOvertimeHours(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 2.0"
                    className="h-9 text-xs font-bold bg-white dark:bg-[#0c0c0f]"
                  />
                  <p className="text-[10px] text-slate-400">
                    Auto-calculated on check-out. You can manually adjust or approve extra hours here.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSaveEdit} 
                  disabled={markMutation.isPending || adminEditMutation.isPending}
                  className="h-10 px-5 text-xs font-black uppercase tracking-widest bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {markMutation.isPending || adminEditMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Staff Regularization Modal */}
      <RegularizationModal
        isOpen={isRegularizeOpen}
        onClose={() => setIsRegularizeOpen(false)}
        defaultDate={selectedCell?.date}
      />
    </div>
  );
}

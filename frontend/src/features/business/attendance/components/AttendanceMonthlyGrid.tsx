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
  type AttendanceRecord,
  type BusinessHoliday,
} from '../api/useAttendance';
import { Check, Camera, Clock, AlertCircle, Gift } from 'lucide-react';
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

  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editCheckIn, setEditCheckIn] = useState<string>('');
  const [editCheckOut, setEditCheckOut] = useState<string>('');

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'present': return 'bg-emerald-500';
      case 'absent': return 'bg-rose-500';
      case 'half_day': return 'bg-amber-500';
      case 'leave': return 'bg-blue-500';
      case 'holiday': return 'bg-purple-500';
      case 'week_off': return 'bg-slate-400';
      default: return 'bg-slate-200 dark:bg-slate-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleCellClick = (userId: number, day: number) => {
    const dateStr = `${month}-${String(day).padStart(2, '0')}`;
    setSelectedCell({ userId, date: dateStr });
    
    const record = attendanceMap[userId]?.[dateStr];
    const holiday = holidayMap[dateStr];
    if (record) {
      setEditStatus(record.status);
      setEditNotes(record.notes || '');
      setEditCheckIn(record.check_in_time ? record.check_in_time.slice(0, 5) : '');
      setEditCheckOut(record.check_out_time ? record.check_out_time.slice(0, 5) : '');
    } else if (holiday) {
      setEditStatus('holiday');
      setEditNotes(holiday.name);
      setEditCheckIn('');
      setEditCheckOut('');
    } else {
      setEditStatus('present');
      setEditNotes('');
      setEditCheckIn('');
      setEditCheckOut('');
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
      notes: editNotes,
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
      <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Present</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Absent</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Half Day</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Leave</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Week Off</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Holiday</div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-white dark:border-zinc-900 ring-2 ring-amber-500 ring-offset-0.5"></div>
          <span className="text-amber-600 dark:text-amber-500 font-bold">Pending Approval</span>
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
                    className={`px-1.5 py-3 text-center min-w-[38px] font-semibold transition-colors ${
                      holiday ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-black' : 
                      isSunday ? 'text-slate-400 bg-slate-100/50 dark:bg-white/[0.02]' : ''
                    }`}
                    title={holiday ? `Holiday: ${holiday.name}` : isSunday ? 'Sunday' : undefined}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <span>{day}</span>
                      {holiday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                      )}
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-3 font-black text-center min-w-[110px] border-l border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#18181c]">Total (P/A/L/H)</th>
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

                return (
                  <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium sticky left-0 bg-white dark:bg-[#111115] z-10 border-r border-slate-200 dark:border-white/5">
                      {staff.name}
                    </td>
                    {daysArray.map(day => {
                      const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                      const record = attendanceMap[staff.id]?.[dateStr];
                      const holiday = holidayMap[dateStr];
                      const hasPhoto = record?.check_in_photo || record?.check_out_photo;
                      const isUnapproved = record && !record.approved_by;
                      const isHolidayCell = !record && !!holiday;

                      let cellClass = 'bg-slate-100 dark:bg-slate-800';
                      let cellTitle = 'No record';

                      if (record) {
                        cellClass = getStatusColor(record.status);
                        cellTitle = `${getStatusLabel(record.status)} ${isUnapproved ? '(Pending Approval)' : ''} ${record.check_in_time ? `(In: ${record.check_in_time})` : ''} ${record.actual_hours ? `(${record.actual_hours}h)` : ''}`;
                      } else if (isHolidayCell) {
                        cellClass = 'bg-purple-500 text-white';
                        cellTitle = `Holiday: ${holiday.name} (${holiday.type || 'Custom'})`;
                      }
                      
                      return (
                        <td key={day} className="px-1 py-2">
                          <div 
                            onClick={() => handleCellClick(staff.id, day)}
                            className={`mx-auto w-7 h-7 rounded-md cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${cellClass} ${isUnapproved ? 'ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-[#111115] shadow-sm' : ''}`}
                            title={cellTitle}
                          >
                            {hasPhoto && <div className="w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>}
                            {isHolidayCell && <span className="text-[10px] text-white font-black leading-none">H</span>}
                          </div>
                        </td>
                      );
                    })}
                    
                    {/* Total Summary Columns */}
                    {(() => {
                      let present = 0;
                      let absent = 0;
                      let halfDay = 0;
                      let leave = 0;
                      let holidayCount = 0;
                      daysArray.forEach(day => {
                        const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                        const record = attendanceMap[staff.id]?.[dateStr];
                        if (record) {
                          if (record.status === 'present') present++;
                          else if (record.status === 'absent') absent++;
                          else if (record.status === 'half_day') halfDay++;
                          else if (record.status === 'leave') leave++;
                          else if (record.status === 'holiday') holidayCount++;
                        } else if (holidayMap[dateStr]) {
                          holidayCount++;
                        }
                      });
                      return (
                        <td className="px-4 py-2 border-l border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-center">
                          <div className="flex gap-1.5 justify-center text-xs font-semibold flex-wrap">
                            <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded shadow-sm" title="Present">{present}P</span>
                            <span className="text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded shadow-sm" title="Absent">{absent}A</span>
                            <span className="text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded shadow-sm" title="Leave/Half-Day">{leave + halfDay}L</span>
                            {holidayCount > 0 && (
                              <span className="text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded shadow-sm" title="Holiday">{holidayCount}H</span>
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
            <div className="grid grid-cols-2 gap-4 mb-5">
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
                      WFH
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
            </div>
          ) : selectedCell && holidayMap[selectedCell.date] ? (
            <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 text-xs font-semibold mb-5 flex items-center gap-2">
              <Gift className="w-4 h-4 shrink-0 text-purple-500" />
              <span>This day is a designated company holiday ({holidayMap[selectedCell.date].name}). Status defaults to Holiday below.</span>
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
                      { value: 'present', label: 'Present' },
                      { value: 'absent', label: 'Absent' },
                      { value: 'half_day', label: 'Half Day' },
                      { value: 'leave', label: 'Leave' },
                      { value: 'week_off', label: 'Week Off' },
                      { value: 'holiday', label: 'Holiday' }
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

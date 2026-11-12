import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance, useMarkAttendance } from '../api/useAttendance';
import { useStaff } from '../../staff/api/useStaff';
import { PageHeader } from '@/components/layout/PageHeader';
import { Calendar, UserCheck, Clock, Download, Upload, ShieldAlert, Award, FileSpreadsheet, Eye, UserCircle2, UserX, Utensils, Coffee, Bell, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Input } from '@/components/ui/input';
import { AttendanceCheckInModal } from '../components/AttendanceCheckInModal';
import { AttendanceMarkModal } from '../components/AttendanceMarkModal';
import { AttendanceDayStatusModal } from '../components/AttendanceDayStatusModal';
import { AttendanceImportModal } from '../components/AttendanceImportModal';
import { Modal } from '@/components/ui/modal';
import { exportToCsv } from '@/utils/exportToCsv';
import { useAuthStore } from '@/store/authStore';
import { AttendanceMonthlyGrid } from '../components/AttendanceMonthlyGrid';
import { getAttendanceColumns } from '../constants/attendanceColumns';
import {
  useApproveAttendance,
  useUnapproveAttendance,
  useTodayAttendance,
  useAttendanceReport,
  usePendingRegularizations,
  useHolidays,
  useTriggerAutoAbsent,
  useStartLunch,
  useEndLunch,
} from '../api/useAttendance';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { DatePicker } from '@/components/ui/DatePicker';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { RegularizationModal } from '../components/RegularizationModal';
import { RegularizationAdminModal } from '../components/RegularizationAdminModal';

export default function AttendancePage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isMarkOpen, setIsMarkOpen] = useState(false);
  const [isDayStatusOpen, setIsDayStatusOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isRegularizeOpen, setIsRegularizeOpen] = useState(false);
  const [isRegularizeAdminOpen, setIsRegularizeAdminOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const { data: staffList, isLoading: isStaffLoading } = useStaff();
  const approveMutation = useApproveAttendance();
  const unapproveMutation = useUnapproveAttendance();
  const triggerAutoAbsent = useTriggerAutoAbsent();
  const startLunchMutation = useStartLunch();
  const endLunchMutation = useEndLunch();
  const { data: todayStatus } = useTodayAttendance();
  const { data: monthlyReport } = useAttendanceReport(selectedMonth);
  const { data: pendingRegData } = usePendingRegularizations();
  const { data: holidays = [] } = useHolidays(selectedMonth);
  const user = useAuthStore(state => state.user);

  const pendingRegs = pendingRegData?.data || pendingRegData || [];

  const isCheckedIn = !!todayStatus?.check_in_time;
  const isCheckedOut = !!todayStatus?.check_out_time;

  const isManager = (() => {
    if (!user || !staffList) return false;
    
    const hasAdminRole = user.roles?.some((r: any) => r.name === 'Business Admin' || r.name === 'Superadmin');
    if (hasAdminRole) {
        return true;
    }

    const currentStaff = staffList.find((s: any) => s.id === user.id);
    return currentStaff?.role === 'manager' || currentStaff?.role === 'admin' || currentStaff?.role === 'Business Admin' || !currentStaff;
  })();

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleUnapprove = (id: number) => {
    unapproveMutation.mutate(id);
  };

  const handleViewPhoto = (row: any) => {
    const url = row.check_in_photo.startsWith('http') 
      ? row.check_in_photo 
      : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${row.check_in_photo}`;
    setPhotoUrl(url);
  };

  const columns = getAttendanceColumns({ handleApprove, handleUnapprove, handleViewPhoto, isManager });

  const effectiveStaffId = isManager ? selectedStaff : user?.id?.toString();

  const filters: any = {
    from_date: dateRange.from,
    to_date: dateRange.to,
  };
  
  if (effectiveStaffId !== '' && effectiveStaffId) {
    filters.user_id = effectiveStaffId;
  }

  const gridFilters: any = {
    month: selectedMonth,
    per_page: 1000,
  };
  if (effectiveStaffId !== '' && effectiveStaffId) {
    gridFilters.user_id = effectiveStaffId;
  }

  const { data: attendanceData, isLoading } = useAttendance(viewMode === 'grid' ? gridFilters : filters);

  // Separate active staff and ex-staff (inactive)
  const activeStaffList = useMemo(() => {
    return (staffList || []).filter((s: any) => 
      s.role !== 'Business Admin' && 
      s.role !== 'Superadmin' && 
      s.status !== 'inactive'
    );
  }, [staffList]);

  const inactiveStaffList = useMemo(() => {
    return (staffList || []).filter((s: any) => 
      s.role !== 'Business Admin' && 
      s.role !== 'Superadmin' && 
      s.status === 'inactive'
    );
  }, [staffList]);

  // If a specific staff is chosen in dropdown, show that staff (even if inactive).
  // Otherwise, default to ACTIVE staff only, unless admin toggles includeInactive.
  const staffToDisplay = useMemo(() => {
    if (effectiveStaffId) {
      const selected = (staffList || []).find((s: any) => s.id.toString() === effectiveStaffId);
      return selected ? [selected] : [];
    }
    return includeInactive
      ? (staffList || []).filter((s: any) => s.role !== 'Business Admin' && s.role !== 'Superadmin')
      : activeStaffList;
  }, [staffList, effectiveStaffId, includeInactive, activeStaffList]);

  const filteredStaffList = staffToDisplay;

  // Compute local attendance statistics
  const stats = useMemo(() => {
    const records = attendanceData?.data || [];
    const totalCount = records.length;
    const presentCount = records.filter((r: any) => r.status === 'present').length;
    const pendingCount = records.filter((r: any) => isManager && !r.approved_by).length;
    const geofenceOutCount = records.filter((r: any) => !r.is_within_geofence).length;
    const absentLeaveCount = records.filter((r: any) => r.status === 'absent' || r.status === 'leave').length;

    return {
      totalCount,
      presentCount,
      pendingCount,
      geofenceOutCount,
      absentLeaveCount
    };
  }, [attendanceData, isManager]);

  // Compute average daily attendance per day
  const dailyAttendanceStats = useMemo(() => {
    if (!filteredStaffList.length) {
      return { avgDailyAttendance: '0.0', avgDailyPct: 0, totalElapsedDays: 0, totalPresentStaffDays: 0 };
    }

    const [year, monthStr] = selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthStr), 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === parseInt(year) && today.getMonth() === parseInt(monthStr) - 1;
    const maxDay = isCurrentMonth ? Math.min(today.getDate(), daysInMonth) : daysInMonth;

    const records = attendanceData?.data || [];
    let elapsedWorkingDays = 0;
    let totalPresentStaffDays = 0;

    for (let day = 1; day <= maxDay; day++) {
      const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
      const isSunday = dayOfWeek === 0;
      const isHoliday = (holidays as any[])?.some((h: any) => (h.date?.includes('T') ? h.date.split('T')[0] : h.date) === dateStr);

      if (!isSunday && !isHoliday) {
        elapsedWorkingDays++;
        filteredStaffList.forEach((staff: any) => {
          const rec = records.find((r: any) => r.user_id === staff.id && r.date?.startsWith(dateStr));
          if (rec) {
            if (rec.status === 'present' || rec.status === 'late') {
              totalPresentStaffDays += 1;
            } else if (rec.status === 'half_day') {
              totalPresentStaffDays += 0.5;
            }
          }
        });
      }
    }

    const totalStaff = filteredStaffList.length;
    const avgDailyAttendance = elapsedWorkingDays > 0 ? (totalPresentStaffDays / elapsedWorkingDays) : 0;
    const avgDailyPct = (elapsedWorkingDays > 0 && totalStaff > 0)
      ? Math.round((avgDailyAttendance / totalStaff) * 100)
      : 0;

    return {
      avgDailyAttendance: avgDailyAttendance.toFixed(1),
      avgDailyPct,
      totalElapsedDays: elapsedWorkingDays,
      totalPresentStaffDays: Math.round(totalPresentStaffDays),
    };
  }, [selectedMonth, filteredStaffList, attendanceData, holidays]);

  const avgEfficiency = useMemo(() => {
    if (!monthlyReport || !Array.isArray(monthlyReport) || monthlyReport.length === 0) return null;
    const items = monthlyReport.filter((r: any) => r.efficiency_pct !== undefined && r.efficiency_pct !== null);
    if (items.length === 0) return null;
    const sum = items.reduce((acc: number, r: any) => acc + (r.efficiency_pct || 0), 0);
    return (sum / items.length).toFixed(1);
  }, [monthlyReport]);

  const handleExport = () => {
    if (!attendanceData || !attendanceData.data) return;
    
    const [year, monthStr] = selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthStr), 0).getDate();
    
    const exportData = filteredStaffList.map((staff: any) => {
      const row: any = {
        'Staff ID': staff.id,
        'Staff Name': staff.name,
      };
      
      let present = 0, lateCount = 0, halfDay = 0, absent = 0, leave = 0, holidayCount = 0, weekOff = 0, otHours = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
        const record = attendanceData.data.find((r: any) => r.user_id === staff.id && r.date.startsWith(dateStr));
        const holiday = (holidays as any[])?.find((h: any) => (h.date?.includes('T') ? h.date.split('T')[0] : h.date) === dateStr);
        const dayOfWeek = new Date(parseInt(year), parseInt(monthStr) - 1, day).getDay();
        const isSunday = dayOfWeek === 0;
        
        let statusStr = '';
        if (record) {
          if (record.overtime_hours && record.overtime_approved) {
            otHours += Number(record.overtime_hours);
          }
          const isLate = record.status === 'late' || (record.late_mark_minutes && record.late_mark_minutes > 0) || (record?.notes && record.notes.toLowerCase().includes('late entry'));
          if (isLate) {
            statusStr = 'LE';
            lateCount++;
            if (record.status === 'present') present++;
          } else if (record.status === 'present') {
            statusStr = 'P';
            present++;
          } else if (record.status === 'half_day') {
            statusStr = 'HD';
            halfDay++;
          } else if (record.status === 'absent') {
            statusStr = 'A';
            absent++;
          } else if (record.status === 'leave') {
            statusStr = 'L';
            leave++;
          } else if (record.status === 'holiday') {
            statusStr = 'H';
            holidayCount++;
          } else if (record.status === 'week_off') {
            statusStr = 'WO';
            weekOff++;
          }
        } else if (holiday) {
          statusStr = 'H';
          holidayCount++;
        } else if (isSunday) {
          statusStr = 'WO';
          weekOff++;
        }
        
        row[String(day)] = statusStr;
      }
      
      row['Total Present'] = present;
      row['Total Late Entry'] = lateCount;
      row['Total Half Day'] = halfDay;
      row['Total Absent'] = absent;
      row['Total Leave'] = leave;
      row['Total Holiday'] = holidayCount;
      row['Total Week Off'] = weekOff;
      row['Total Approved OT (Hours)'] = otHours.toFixed(1);
      
      return row;
    });

    const columns = [
      { header: 'Staff ID', accessorKey: 'Staff ID' },
      { header: 'Staff Name', accessorKey: 'Staff Name' },
      ...Array.from({ length: daysInMonth }, (_, i) => ({
        header: String(i + 1),
        accessorKey: String(i + 1),
      })),
      { header: 'Total Present', accessorKey: 'Total Present' },
      { header: 'Total Late Entry', accessorKey: 'Total Late Entry' },
      { header: 'Total Half Day', accessorKey: 'Total Half Day' },
      { header: 'Total Absent', accessorKey: 'Total Absent' },
      { header: 'Total Leave', accessorKey: 'Total Leave' },
      { header: 'Total Holiday', accessorKey: 'Total Holiday' },
      { header: 'Total Week Off', accessorKey: 'Total Week Off' },
      { header: 'Total Approved OT (Hrs)', accessorKey: 'Total Approved OT (Hours)' },
    ];

    exportToCsv(exportData, columns, `Attendance_Register_${selectedMonth}`);
  };

  const handleClearFilters = () => {
    setSelectedStaff('all');
    setSelectedMonth(format(new Date(), 'yyyy-MM'));
    setDateRange({
      from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      <PageHeader 
        icon={Calendar}
        title="Attendance Tracking" 
        subtitle="Manage employee daily check-ins, remote geofence verifications, and time tracking logs."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {isManager && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  Export
                </Button>

                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportOpen(true)}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                  Import
                </Button>
              </>
            )}

            {isManager && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDayStatusOpen(true)}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  Set Day Status
                </Button>

                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMarkOpen(true)}
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                  Mark Manual
                </Button>

                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegularizeAdminOpen(true)}
                  className={`bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10 ${
                    pendingRegs.length > 0 ? 'border-amber-500/60 text-amber-500 hover:bg-amber-500/10' : ''
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  Correction Requests
                  {pendingRegs.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                      {pendingRegs.length}
                    </span>
                  )}
                </Button>

                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => triggerAutoAbsent.mutate(undefined)}
                  disabled={triggerAutoAbsent.isPending}
                  title="Check staff who have not punched in by half-shift cutoff and mark absent"
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <UserX className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                  {triggerAutoAbsent.isPending ? 'Checking...' : 'Run Auto-Absent'}
                </Button>
              </>
            )}

            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsRegularizeOpen(true)}
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3.5 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Request Regularization
            </Button>

            {!isManager && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/hr/leave-requests')}
                className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3.5 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                Apply Leave / WFH
              </Button>
            )}

            {isCheckedIn && !isCheckedOut && (
              todayStatus?.is_on_lunch ? (
                <Button
                  size="sm"
                  onClick={() => endLunchMutation.mutate()}
                  disabled={endLunchMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 h-10 shadow-sm cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5 mr-1.5" />
                  {endLunchMutation.isPending ? 'Ending...' : 'End Lunch Break'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startLunchMutation.mutate()}
                  disabled={startLunchMutation.isPending}
                  className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs px-3.5 h-10 shadow-sm cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  {startLunchMutation.isPending ? 'Starting...' : 'Take Lunch Break'}
                </Button>
              )
            )}

            <Button 
              variant="brand"
              size="sm"
              onClick={() => setIsCheckInOpen(true)}
              className="text-xs font-bold px-4 h-10 cursor-pointer"
            >
              <Clock className="w-4 h-4 mr-1.5" />
              {isCheckedOut ? 'Done for Today' : isCheckedIn ? 'Self Check Out' : 'Self Check In'}
            </Button>
          </div>
        }
      />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-0 pb-8 space-y-6">
        
        {/* Past 7 PM Check-Out Alert Reminder Banner */}
        {isCheckedIn && !isCheckedOut && todayStatus?.should_alert_checkout && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100">
                    Evening Check-Out Reminder (Past 7:00 PM)
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                  {todayStatus?.alert_message || 'You have not checked out yet. If you are already out of the office geofence area, please submit an Out-of-Geofence request to avoid a half-day penalty.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                size="sm"
                onClick={() => setIsCheckInOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Punch Out / Request Admin
              </Button>
            </div>
          </div>
        )}

        {/* Monthly Late Arrivals & Grace Passes Tracker Banner */}
        {todayStatus && (todayStatus.enable_late_deduction ?? true) && (
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start md:items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                (todayStatus.free_lates_remaining ?? 0) > 0
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Monthly Late Arrivals & Grace Policy
                  </h4>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    (todayStatus.free_lates_remaining ?? 0) > 0
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                  }`}>
                    {todayStatus.free_lates_remaining ?? 0} of {todayStatus.late_free_waiver_count ?? 2} Free Passes Remaining
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  You have recorded <strong className="text-slate-800 dark:text-slate-200">{todayStatus.monthly_late_count ?? 0} late arrival(s)</strong> this month. Policy: First {todayStatus.late_free_waiver_count ?? 2} late punches are excused; then every {todayStatus.late_deduction_trigger_count ?? 4} lates deducts {todayStatus.late_deduction_amount_type ?? 1.0} day salary.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-slate-600 dark:text-slate-300 font-medium">
                Grace buffer: <strong className="text-slate-900 dark:text-white">15m</strong>
              </div>
            </div>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <CustomKpiCard
            title="Avg Daily Attendance"
            value={dailyAttendanceStats.totalElapsedDays > 0 ? `${dailyAttendanceStats.avgDailyPct}%` : '—'}
            icon={<UserCheck className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle={
              isManager && selectedStaff === ''
                ? `Avg ${dailyAttendanceStats.avgDailyAttendance} / ${filteredStaffList.length} staff per day`
                : `${dailyAttendanceStats.totalPresentStaffDays} of ${dailyAttendanceStats.totalElapsedDays} workdays present`
            }
          />
          <CustomKpiCard
            title="Avg Efficiency"
            value={avgEfficiency !== null ? `${avgEfficiency}%` : '—'}
            icon={<Award className="w-5 h-5 text-white" />}
            glowColor="purple"
            subtitle="Working hours efficiency (per day)"
          />
          <CustomKpiCard
            title="Pending Approval"
            value={stats.pendingCount}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Awaiting manager verification"
          />
          <CustomKpiCard
            title="Correction Requests"
            value={pendingRegs.length}
            icon={<ShieldAlert className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Arrival time requests"
          />
          <CustomKpiCard
            title="Absent / Leave"
            value={stats.absentLeaveCount}
            icon={<Calendar className="w-5 h-5 text-white" />}
            glowColor="indigo"
            subtitle="Time-off & missed days"
          />
        </div>

        {/* Unified Filter Controls */}
        <FilterContainer>
          {isManager && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-60 shrink-0">
                <FilterSelect
                  value={selectedStaff}
                  onChange={setSelectedStaff}
                  placeholder={`All Active Staff (${activeStaffList.length})`}
                  searchable={true}
                  options={[
                    { value: '', label: `All Active Staff (${activeStaffList.length})` },
                    ...activeStaffList.map((s: any) => ({ value: s.id.toString(), label: s.name })),
                    ...(inactiveStaffList.length > 0 ? [
                      { value: '', label: '── Ex-Employees / Inactive ──' },
                      ...inactiveStaffList.map((s: any) => ({ 
                        value: s.id.toString(), 
                        label: `${s.name} (Ex-Staff / Inactive)` 
                      }))
                    ] : [])
                  ]}
                  wrapperClassName="w-full"
                />
              </div>

              {inactiveStaffList.length > 0 && !selectedStaff && (
                <button
                  type="button"
                  onClick={() => setIncludeInactive(p => !p)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    includeInactive 
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-xs' 
                      : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                  title="Toggle visibility of inactive/left employees in attendance ledger"
                >
                  <span>{includeInactive ? 'Hide Ex-Staff' : 'Show Ex-Staff'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    includeInactive 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}>
                    {inactiveStaffList.length}
                  </span>
                </button>
              )}
            </div>
          )}

          {viewMode === 'list' ? (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-44 shrink-0">
                <DatePicker 
                  value={dateRange.from} 
                  onChange={(val) => setDateRange(prev => ({ ...prev, from: val }))}
                  className="w-full"
                />
              </div>
              <span className="text-slate-400 font-bold text-xs">to</span>
              <div className="w-44 shrink-0">
                <DatePicker 
                  value={dateRange.to} 
                  onChange={(val) => setDateRange(prev => ({ ...prev, to: val }))}
                  className="w-full"
                  align="right"
                />
              </div>
            </div>
          ) : (
            <div className="w-48 shrink-0">
              <MonthPicker 
                value={selectedMonth} 
                onChange={setSelectedMonth}
                className="w-full"
              />
            </div>
          )}

          {(selectedStaff !== '' || selectedMonth !== format(new Date(), 'yyyy-MM') || dateRange.from !== format(startOfMonth(new Date()), 'yyyy-MM-dd')) && (
            <FilterReset onClick={handleClearFilters} />
          )}

          <div className="ml-auto flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl shrink-0">
            <button 
              type="button"
              onClick={() => setViewMode('grid')}
              className={`h-8 px-4 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              Grid View
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className={`h-8 px-4 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              List View
            </button>
          </div>
        </FilterContainer>

        {/* Content View */}
        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
            <DataTable 
              columns={columns} 
              data={attendanceData?.data || []} 
              isLoading={isLoading}
            />
          </div>
        ) : (
          <AttendanceMonthlyGrid 
            month={selectedMonth}
            staffList={filteredStaffList}
            attendanceData={attendanceData?.data || []}
            isManager={isManager}
            loggedInUserId={user?.id || 0}
            isLoading={isLoading || isStaffLoading}
            monthlyReport={monthlyReport || []}
            holidays={holidays}
          />
        )}
      </div>

      {/* Modals */}
      <AttendanceCheckInModal 
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />

      <AttendanceDayStatusModal 
        isOpen={isDayStatusOpen}
        onClose={() => setIsDayStatusOpen(false)}
        staffList={staffToDisplay}
        holidays={holidays}
      />

      <AttendanceMarkModal
        isOpen={isMarkOpen}
        onClose={() => setIsMarkOpen(false)}
        staffList={staffToDisplay}
        holidays={holidays}
      />

      <AttendanceImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        staffList={staffToDisplay}
        month={selectedMonth}
      />

      <RegularizationModal
        isOpen={isRegularizeOpen}
        onClose={() => setIsRegularizeOpen(false)}
        staffList={isManager ? staffList : undefined}
        defaultUserId={selectedStaff ? parseInt(selectedStaff) : undefined}
      />

      <RegularizationAdminModal
        isOpen={isRegularizeAdminOpen}
        onClose={() => setIsRegularizeAdminOpen(false)}
      />

      <Modal isOpen={!!photoUrl} onClose={() => setPhotoUrl(null)} title="Attendance Photo">
        <div className="p-4 flex items-center justify-center">
          {photoUrl && <img src={photoUrl} alt="Attendance" className="max-w-full h-auto rounded-lg shadow-md" />}
        </div>
      </Modal>
    </div>
  );
}

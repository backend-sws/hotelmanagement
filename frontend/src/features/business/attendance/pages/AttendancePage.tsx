import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance, useMarkAttendance } from '../api/useAttendance';
import { useStaff } from '../../staff/api/useStaff';
import { PageHeader } from '@/components/layout/PageHeader';
import { Calendar, UserCheck, Clock, Download, Upload, ShieldAlert, Award, FileSpreadsheet, Eye, UserCircle2 } from 'lucide-react';
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

  const staffToDisplay = staffList?.filter((s: any) => s.role !== 'Business Admin' && s.role !== 'Superadmin') || [];

  const filteredStaffList = staffToDisplay.filter((s: any) => 
    effectiveStaffId === '' ? true : s.id.toString() === effectiveStaffId
  );

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
      
      let present = 0, absent = 0, halfDay = 0, leave = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
        const record = attendanceData.data.find((r: any) => r.user_id === staff.id && r.date.startsWith(dateStr));
        
        let statusStr = '';
        if (record) {
          if (record.status === 'present') { statusStr = 'P'; present++; }
          else if (record.status === 'absent') { statusStr = 'A'; absent++; }
          else if (record.status === 'half_day') { statusStr = 'H'; halfDay++; }
          else if (record.status === 'leave') { statusStr = 'L'; leave++; }
          else if (record.status === 'holiday') { statusStr = 'O'; }
          else if (record.status === 'week_off') { statusStr = 'W'; }
        }
        
        row[String(day)] = statusStr;
      }
      
      row['Total Present'] = present;
      row['Total Absent'] = absent;
      row['Total Leave/Half'] = leave + halfDay;
      
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
      { header: 'Total Absent', accessorKey: 'Total Absent' },
      { header: 'Total Leave/Half', accessorKey: 'Total Leave/Half' },
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
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <CustomKpiCard
            title="Present Days"
            value={stats.presentCount}
            icon={<UserCheck className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Active present records"
          />
          <CustomKpiCard
            title="Avg Efficiency"
            value={avgEfficiency !== null ? `${avgEfficiency}%` : '—'}
            icon={<Award className="w-5 h-5 text-white" />}
            glowColor="purple"
            subtitle="Working hours efficiency"
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
            <div className="w-56 shrink-0">
              <FilterSelect
                value={selectedStaff}
                onChange={setSelectedStaff}
                placeholder="All Staff Members"
                searchable={true}
                options={staffList?.map((s: any) => ({ value: s.id.toString(), label: s.name })) || []}
                wrapperClassName="w-full"
              />
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

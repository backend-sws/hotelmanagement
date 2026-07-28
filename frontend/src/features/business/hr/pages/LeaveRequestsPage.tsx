import React, { useState, useMemo } from 'react';
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveStatus } from '../api/useLeaveRequests';
import { Calendar, Plus, CheckCircle2, XCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useAuthStore } from '@/store/authStore';
import { LeaveRequestFormModal } from '../components/LeaveRequestFormModal';
import { getLeaveColumns } from '../constants/leaveColumns';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { useStaff } from '../../staff/api/useStaff';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';

export default function LeaveRequestsPage() {
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: requests, isLoading, refetch, isRefetching } = useLeaveRequests();
  const createMutation = useCreateLeaveRequest();
  const updateStatusMutation = useUpdateLeaveStatus();
  const user = useAuthStore(state => state.user);
  const { data: staffList, isLoading: isStaffLoading } = useStaff();

  const isManager = user?.roles?.some(r => 
    r.name === 'admin' || 
    r.name === 'manager' || 
    r.name === 'Business Admin' || 
    r.name === 'Superadmin'
  );

  const columns = getLeaveColumns({ isManager, updateStatusMutation });

  // Compute analytics
  const stats = useMemo(() => {
    if (!requests) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    return {
      total: requests.length,
      pending: requests.filter((r: any) => r.status === 'pending').length,
      approved: requests.filter((r: any) => r.status === 'approved').length,
      rejected: requests.filter((r: any) => r.status === 'rejected').length,
    };
  }, [requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    let filtered = requests;

    if (selectedStaff !== '') {
      filtered = filtered.filter((r: any) => r.user_id.toString() === selectedStaff);
    }
    
    if (selectedStatus !== '') {
      filtered = filtered.filter((r: any) => r.status === selectedStatus);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter((r: any) => 
        (r.user?.name && r.user.name.toLowerCase().includes(q)) ||
        (r.leave_type && r.leave_type.toLowerCase().includes(q)) ||
        (r.reason && r.reason.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [requests, selectedStaff, selectedStatus, debouncedSearch]);

  const handleResetFilters = () => {
    setSelectedStaff('');
    setSelectedStatus('');
    setSearch('');
  };

  const hasActiveFilters = selectedStaff !== '' || selectedStatus !== '' || search !== '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[45%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-[15%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6">
        {/* Glassmorphic Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Leave Requests
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  HR Management
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                Monitor staff time-off applications, review absence durations, and manage approval workflows.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-3.5 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefetching ? 'animate-spin text-indigo-500' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 px-4 h-10"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Request Leave
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Requests"
            value={stats.total}
            icon={<Calendar className="w-5 h-5 text-white" />}
            glowColor="indigo"
            subtitle="All leave applications"
          />
          <CustomKpiCard
            title="Pending Approval"
            value={stats.pending}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Awaiting manager action"
          />
          <CustomKpiCard
            title="Approved Leaves"
            value={stats.approved}
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Confirmed staff absence"
          />
          <CustomKpiCard
            title="Rejected Leaves"
            value={stats.rejected}
            icon={<XCircle className="w-5 h-5 text-white" />}
            glowColor="rose"
            subtitle="Declined applications"
          />
        </div>

        {/* Unified Filter Controls */}
        <FilterContainer>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Search employee name, leave type or reason…"
            wrapperClassName="w-72"
          />
          {isManager && (
            <div className="w-56">
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
          <div className="w-48">
            <FilterSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="All Status"
              options={[
                { value: 'pending', label: 'Pending Approval' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
              wrapperClassName="w-full"
            />
          </div>
          {hasActiveFilters && <FilterReset onClick={handleResetFilters} />}
        </FilterContainer>

        {/* Table Container */}
        <Card className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900 p-0">
          {filteredRequests.length === 0 && !isLoading && !isStaffLoading ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 animate-bounce">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No Leave Requests Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                {hasActiveFilters 
                  ? "No leave applications match your current filters. Try resetting your search." 
                  : "No staff time-off or leave applications have been submitted yet."}
              </p>
              {!hasActiveFilters && (
                <Button
                  size="sm"
                  className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 px-6 h-10"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Submit First Leave Request
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredRequests}
                searchable={false}
                isLoading={isLoading || (isManager && isStaffLoading)}
              />
            </div>
          )}
        </Card>
      </div>

      <LeaveRequestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          createMutation.mutate(data as any, {
            onSuccess: () => setIsModalOpen(false)
          });
        }}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}

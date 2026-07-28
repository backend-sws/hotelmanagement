import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useStaff, useUpdateStaff } from '../api/useStaff';
import { PageHeader } from '@/components/layout/PageHeader';
import { Users, Plus, TrendingUp, IndianRupee, Search, X, ShieldAlert, Download, HelpCircle, Sparkles, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { getStaffColumns } from '../constants/staffColumns';
import { StaffFormModal } from '@/features/business/staff/components/StaffFormModal';
import { PermissionsModal } from '@/features/business/staff/components/PermissionsModal';
import { useNavigate } from 'react-router-dom';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { formatCurrency } from '@/lib/formatters';
import { exportToCsv } from '@/utils/exportToCsv';

export default function StaffPage() {
  const { data: staff, isLoading } = useStaff();
  const updateMutation = useUpdateStaff();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleEdit = (e: React.MouseEvent, staffMember: any) => {
    e.stopPropagation();
    setSelectedStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (staffMember: any) => {
    const newStatus = staffMember.status === 'active' ? 'inactive' : 'active';
    updateMutation.mutate({ id: staffMember.id, status: newStatus });
  };

  const handlePermissions = (e: React.MouseEvent, staffMember: any) => {
    e.stopPropagation();
    setSelectedStaff(staffMember);
    setIsPermissionsOpen(true);
  };

  const columns = getStaffColumns({ 
    handleEdit, 
    handleToggleStatus, 
    handlePermissions, 
    handleViewDetails: (e, staffMember) => {
      e.stopPropagation();
      navigate(`/staff/${staffMember.id}`);
    },
    currentUser: user 
  });

  const activeStaffCount = (staff || []).filter(s => s.status === 'active').length;
  const totalSalary = (staff || []).filter(s => s.status === 'active').reduce((acc, s) => acc + (Number(s.monthly_salary) || 0), 0);

  // Filter staff locally based on search term, role, and status
  const filteredStaff = useMemo(() => {
    let result = staff || [];

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(term) ||
        (s.phone && s.phone.includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term))
      );
    }

    if (roleFilter) {
      result = result.filter(s => s.role === roleFilter);
    }

    if (statusFilter) {
      result = result.filter(s => s.status === statusFilter);
    }

    return result;
  }, [staff, search, roleFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const handleExport = () => {
    exportToCsv(filteredStaff, columns as any, 'staff_list');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#09090b]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-8 space-y-4">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-500/30 flex items-center justify-center">
                <UserCheck className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Staff & Workforce <span className="text-sky-600 dark:text-sky-400 text-base font-bold px-2 py-0.5 rounded-md bg-sky-500/10">Employees & Permissions</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage your team, assign customized role permissions, monitor active statuses, and organize monthly payroll profiles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-sky-200 dark:border-sky-900/30 text-sky-600 dark:text-sky-400 shadow-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Staff Management?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50 dark:from-sky-950/40 dark:via-slate-900 dark:to-blue-950/20 border-2 border-sky-200 dark:border-sky-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                <Sparkles className="w-5 h-5 fill-sky-500 text-sky-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Workforce Setup & Access Permission Control</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                As your business employs sales executives, cashiers, accountants, and field staff, organizing robust <strong>Staff Profiles & Role Permissions</strong> enables seamless team collaboration while keeping proprietary enterprise logs completely secure!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    <span>🔐</span> 1. Role-Based Access Control
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Precisely customize what each staff member can view or modify. Restrict invoice deletions, hide sensitive executive reports, or limit access to billing modules.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>🗃️</span> 2. Integrated Payroll Baseline
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    An employee&apos;s designated monthly salary and role profile provide the core baseline data required for automated monthly salary and commission calculations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>📋</span> 3. Instant Status Revocation
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Instantly toggle an ex-employee&apos;s account status to inactive to terminate system login privileges without losing historical sales or customer activity logs.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Compact Top Control Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            {/* Mini Card 1 - Active Staff */}
            <div className="relative overflow-hidden flex items-center gap-3.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl px-6 py-3.5 min-w-[200px] shadow-lg shadow-primary-500/20 shrink-0">
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-6 -mt-6 mix-blend-overlay" />
              <div className="absolute bottom-0 right-10 w-10 h-10 bg-black/10 rounded-full -mb-3 mix-blend-overlay" />
              
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white relative z-10 border border-white/20 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-primary-100 uppercase tracking-widest drop-shadow-sm">Active Staff</p>
                <p className="text-base font-black text-white leading-tight drop-shadow-sm">{activeStaffCount}</p>
              </div>
            </div>

            {/* Mini Card 2 - Payroll */}
            <div className="relative overflow-hidden flex items-center gap-3.5 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl px-6 py-3.5 min-w-[200px] shadow-lg shadow-primary-600/20 shrink-0">
              {/* Background Shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white/10 rotate-45 mix-blend-overlay" />
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/20 rounded-full mix-blend-overlay" />

              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white relative z-10 border border-white/20 shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-primary-100 uppercase tracking-widest drop-shadow-sm">Payroll</p>
                <p className="text-base font-black text-white leading-tight drop-shadow-sm">{formatCurrency(totalSalary)}</p>
              </div>
            </div>

            {/* Mini Card 3 - Total Staff */}
            <div className="relative overflow-hidden flex items-center gap-3.5 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl px-6 py-3.5 min-w-[200px] shadow-lg shadow-primary-400/20 shrink-0">
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[80px] border-l-transparent border-t-[80px] border-white/20 mix-blend-overlay" />
              <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-black/10 rounded-full -mb-5 mix-blend-overlay" />

              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white relative z-10 border border-white/20 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-primary-100 uppercase tracking-widest drop-shadow-sm">Total Staff</p>
                <p className="text-base font-black text-white leading-tight drop-shadow-sm">{staff?.length || 0}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setSelectedStaff(null); setIsFormOpen(true); }}
            className="shrink-0 flex items-center gap-2 h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-primary-500/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative z-30">
          <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3 flex-grow">
              {/* Row 1: Search + Export on mobile, or normal search on desktop */}
              <div className="flex items-center gap-2 w-full md:w-auto flex-grow">
                <FilterSearch
                  value={search}
                  onChange={(val) => setSearch(val)}
                  placeholder="Search staff by name or phone..."
                  wrapperClassName="flex-grow h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
                />
                <button
                  onClick={handleExport}
                  className="inline-flex md:hidden items-center justify-center gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary-500" />
                  <span>Export</span>
                </button>
              </div>

              {/* Row 2: both filter dropdowns side-by-side on mobile, or next to search on desktop */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <FilterSelect
                  value={roleFilter}
                  onChange={setRoleFilter}
                  placeholder="All Roles"
                  options={[
                    { value: 'staff', label: 'Staff (Sales)' },
                    { value: 'manager', label: 'Manager' }
                  ]}
                  wrapperClassName="flex-grow md:flex-none w-1/2 md:w-44 shrink-0"
                />

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All Statuses"
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                  wrapperClassName="flex-grow md:flex-none w-1/2 md:w-44 shrink-0"
                />

                <button
                  onClick={handleExport}
                  className="hidden md:inline-flex items-center gap-2 h-10 px-4 text-xs font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary-500" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {(search || roleFilter || statusFilter) && (
              <FilterReset
                onClick={handleClearFilters}
              />
            )}
          </FilterContainer>
        </div>

        {/* Data Table */}
        <div className="relative z-10 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
          <DataTable
            columns={columns}
            data={filteredStaff}
            searchable={false}
            isLoading={isLoading}
            exportable={false}
          />
        </div>
      </div>

      <StaffFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        staff={selectedStaff}
      />

      <PermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        staff={selectedStaff}
      />
    </div>
  );
}

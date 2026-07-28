import React, { useState, useMemo } from 'react';
import { usePayrolls, useConfirmPayroll, useMarkPayrollPaid } from '../api/usePayroll';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { IndianRupee, FileText, CheckCircle, Clock, Download, Plus, Search, HelpCircle, ShieldAlert, BadgeDollarSign, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { PayrollGenerateModal } from '../components/PayrollGenerateModal';
import { getPayrollColumns } from '../constants/payrollColumns';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { useStaff } from '../../staff/api/useStaff';
import { formatCurrency } from '@/lib/formatters';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/authStore';

export default function PayrollPage() {
  const navigate = useNavigate();
  const currentMonth = format(new Date(), 'yyyy-MM');
  const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const { data: staffList } = useStaff();

  const { hasPermission } = usePermissions();
  const user = useAuthStore(state => state.user);
  const isManager = useMemo(() => {
    return user?.roles?.some((r: any) => r.name === 'admin' || r.name === 'manager' || r.name === 'Business Admin' || r.name === 'Superadmin') || hasPermission('manage_payroll');
  }, [user, hasPermission]);

  const queryFilters: any = {};
  if (selectedMonth && selectedMonth !== 'all') {
    queryFilters.month = selectedMonth;
  }
  if (isManager) {
    if (selectedStaff !== 'all') {
      queryFilters.user_id = selectedStaff;
    }
  } else {
    queryFilters.user_id = user?.id?.toString();
  }
  const [viewMode, setViewMode] = useState<'earned' | 'projected'>('projected');

  if (selectedStatus !== 'all') {
    queryFilters.status = selectedStatus;
  }

  const { data: payrollsData, isLoading } = usePayrolls(queryFilters);
  const confirmMutation = useConfirmPayroll();
  const markPaidMutation = useMarkPayrollPaid();

  const columns = getPayrollColumns({ confirmMutation, markPaidMutation, navigate, isManager, viewMode });

  // Compute local KPI statistics based on current month's payrolls
  const stats = useMemo(() => {
    const list = payrollsData?.data || [];
    const totalExpense = list.reduce((sum: number, r: any) => sum + (parseFloat(r.final_salary) || 0), 0);
    const draftCount = list.filter((r: any) => r.status === 'draft').length;
    const confirmedCount = list.filter((r: any) => r.status === 'confirmed').length;
    const paidCount = list.filter((r: any) => r.status === 'paid').length;

    return {
      totalExpense,
      draftCount,
      confirmedCount,
      paidCount,
      totalCount: list.length
    };
  }, [payrollsData]);

  const handleClearFilters = () => {
    setSelectedMonth(currentMonth);
    setSelectedStaff('all');
    setSelectedStatus('all');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#09090b]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-8 space-y-6">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  {isManager ? "Payroll & Salaries" : "My Salary Slips"} <span className="text-emerald-600 dark:text-emerald-400 text-base font-bold px-2 py-0.5 rounded-md bg-emerald-500/10">Staff Wages & Payslips</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {isManager ? "Calculate monthly wages, track employee earnings & deductions, and disburse official salary slips." : "View your monthly salary slips, bonuses, deductions, and payment historical records."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start sm:self-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Payroll Processing?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-5 h-5 fill-emerald-500 text-emerald-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Transparent Payroll Processing & Wage Accounting</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                Automating your monthly <strong>Payroll & Salary Disbursal</strong> eliminates wage computation errors, ensures structured record-keeping, and fosters strong team morale through verifiable digital payslips!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span>💰</span> 1. Automated Wage Computation
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Instantly calculates payable salaries based on designated base wages, performance incentives, overtime earnings, and applicable deduction logs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    <span>📑</span> 2. Digital Salary Slips
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Generate formatted, official payslips that employees can easily access or download for their personal records, banking, and tax documentation needs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>⚖️</span> 3. Advance & Loan Reconciliation
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Effortlessly adjust short-term staff salary advances or loan installment repayments during monthly pay cycle closings with full audit transparency.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Analytics Section (Full Width Grid) */}
        {isManager && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="transition-transform hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Total Payroll Cost"
                value={formatCurrency(stats.totalExpense)}
                icon={<BadgeDollarSign size={18} />}
                glowColor="primary"
                subtitle="Sum of final salaries"
              />
            </div>

            <div className="transition-transform hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Paid Payrolls"
                value={stats.paidCount}
                icon={<CheckCircle size={18} />}
                glowColor="primary"
                subtitle="Successfully disbursed"
              />
            </div>

            <div className="transition-transform hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Awaiting Confirmation"
                value={stats.draftCount}
                icon={<Clock size={18} />}
                glowColor="primary"
                subtitle="Draft status records"
              />
            </div>

            <div className="transition-transform hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Pending Payment"
                value={stats.confirmedCount}
                icon={<ShieldAlert size={18} />}
                glowColor="primary"
                subtitle="Confirmed, unpaid records"
              />
            </div>
          </div>
        )}

        {/* Action Controls & Filters Bar */}
        <div className="w-full bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          {/* Row 1: Filters */}
          <div className="flex flex-wrap items-end gap-4 w-full">
            
            {/* Month Input */}
            <div className="w-full sm:w-52 shrink-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Select Month
              </label>
              <MonthPicker 
                value={selectedMonth} 
                onChange={setSelectedMonth}
                className="w-full"
              />
            </div>

            {/* Quick Month Shortcuts */}
            <div className="flex gap-1.5 shrink-0 h-10 items-center">
              <button 
                onClick={() => setSelectedMonth(currentMonth)}
                className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-widest border transition-all duration-250 cursor-pointer ${selectedMonth === currentMonth ? 'bg-primary-500/10 text-primary-500 border-primary-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                This Month
              </button>
              <button 
                onClick={() => setSelectedMonth(lastMonth)}
                className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-widest border transition-all duration-250 cursor-pointer ${selectedMonth === lastMonth ? 'bg-primary-500/10 text-primary-500 border-primary-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                Last Month
              </button>
              <button 
                onClick={() => setSelectedMonth('')}
                className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-widest border transition-all duration-250 cursor-pointer ${!selectedMonth || selectedMonth === 'all' ? 'bg-primary-500/10 text-primary-500 border-primary-500/30' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
              >
                All Time
              </button>
            </div>

            {/* Staff Selector */}
            {isManager && (
              <div className="w-full sm:w-56 shrink-0">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                  Staff Member
                </label>
                <FilterSelect
                  value={selectedStaff}
                  onChange={setSelectedStaff}
                  placeholder="All Staff"
                  options={[
                    { value: 'all', label: 'All Staff' },
                    ...(staffList?.map((s: any) => ({ value: s.id.toString(), label: s.name })) || [])
                  ]}
                  wrapperClassName="w-full"
                />
              </div>
            )}

            {/* Status Selector */}
            <div className="w-full sm:w-48 shrink-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Status
              </label>
              <FilterSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Statuses"
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'paid', label: 'Paid' }
                ]}
                wrapperClassName="w-full"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="w-full sm:w-48 shrink-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Draft Values Show
              </label>
              <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-lg border border-slate-200 dark:border-white/10 h-10 w-full">
                <button 
                  onClick={() => setViewMode('earned')}
                  className={`flex-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${viewMode === 'earned' ? 'bg-white dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
                >
                  Till Date
                </button>
                <button 
                  onClick={() => setViewMode('projected')}
                  className={`flex-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${viewMode === 'projected' ? 'bg-white dark:bg-zinc-800 text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
                >
                  Projected
                </button>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

          {/* Row 2: Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              {isManager && (
                <button 
                  onClick={() => setIsGenerateOpen(true)}
                  className="group relative flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Generate Payroll</span>
                </button>
              )}

              {/* Reset Button */}
              {(selectedStaff !== 'all' || selectedStatus !== 'all' || selectedMonth !== currentMonth) && (
                <FilterReset
                  onClick={handleClearFilters}
                  className="ml-0 h-10 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800"
                />
              )}
            </div>

            <div className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {isManager ? `${stats.totalCount} Payroll records retrieved` : ''}
            </div>
          </div>

        </div>

        {/* Important Note */}
        {isManager && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <strong className="font-bold">Important:</strong> It is highly recommended to generate payroll at the <strong>end of the month</strong> or the <strong>beginning of the next month</strong> to ensure all attendances and leaves are accurately recorded. Generating payroll in the middle of the month will create "Draft" slips that show projected salaries assuming the employee will be present for the rest of the month.
            </div>
          </div>
        )}

        {/* Payroll Table */}
        <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
          <DataTable 
            columns={columns} 
            data={payrollsData?.data || []} 
            isLoading={isLoading}
            onRowClick={(row: any) => navigate(`/payroll/${row.id}`)}
          />
        </div>

      </div>

      <PayrollGenerateModal 
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        defaultMonth={selectedMonth}
      />
    </div>
  );
}

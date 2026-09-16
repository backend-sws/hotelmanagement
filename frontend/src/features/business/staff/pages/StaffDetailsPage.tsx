import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffDetail, useStaffSales, useStaffEarningsById, useImpersonateStaff } from '../api/useStaff';
import { usePayrolls } from '../../payroll/api/usePayroll';
import { useLeaveBalances } from '../../hr/api/useLeavePolicies';
import { useAuthStore } from '@/store/authStore';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, User, Mail, Phone, Calendar, IndianRupee, TrendingUp, Percent, Award, ShieldAlert, LogIn, Clock, Wallet, Umbrella, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/formatters';

export default function StaffDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useStaffDetail(Number(id));
  const { data: salesData, isLoading: isSalesLoading } = useStaffSales(Number(id));
  const { data: payrollData, isLoading: isPayrollLoading } = usePayrolls({ user_id: Number(id) });
  const { data: staffEarnings } = useStaffEarningsById(Number(id));
  const { data: staffLeaveBalances } = useLeaveBalances(Number(id));
  const impersonateMutation = useImpersonateStaff();

  const rawSalaryComponents = data?.staff?.salary_components;
  const { parsedComponents, earningsList, deductionsList, totalEarnings, totalDeductions } = React.useMemo(() => {
    let comps: Array<{ name: string; type: 'earning' | 'deduction'; amount: number }> = [];
    if (rawSalaryComponents) {
      if (Array.isArray(rawSalaryComponents)) {
        comps = rawSalaryComponents;
      } else if (typeof rawSalaryComponents === 'string') {
        try {
          const parsed = JSON.parse(rawSalaryComponents);
          if (Array.isArray(parsed)) comps = parsed;
        } catch {}
      }
    }
    const earnings = comps.filter(c => c.type === 'earning');
    const deductions = comps.filter(c => c.type === 'deduction');
    const totE = earnings.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const totD = deductions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    return {
      parsedComponents: comps,
      earningsList: earnings,
      deductionsList: deductions,
      totalEarnings: totE,
      totalDeductions: totD,
    };
  }, [rawSalaryComponents]);

  const handleImpersonate = () => {
    impersonateMutation.mutate(Number(id), {
      onSuccess: (res: any) => {
        useAuthStore.getState().impersonate(res.user, res.token);
        window.location.href = '/dashboard';
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-[#09090b]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data?.staff) {
    return (
      <div className="p-6 min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center flex-col gap-4 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
          Staff Member Not Found
        </h3>
        <button
          onClick={() => navigate('/staff')}
          className="h-10 px-4 text-xs font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { staff, stats } = data;

  const salesColumns = [
    {
      header: 'Invoice',
      accessorKey: 'invoice_number',
      cell: (row: any) => (
        <span className="font-semibold text-primary-600 dark:text-primary-400">
          {row.invoice_number}
        </span>
      )
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: any) => format(new Date(row.date), 'dd MMM yyyy')
    },
    {
      header: 'Customer',
      accessorKey: 'customer.name',
      cell: (row: any) => row.customer?.name || 'Walk-in'
    },
    {
      header: 'Amount',
      accessorKey: 'final_amount',
      cell: (row: any) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {formatCurrency(row.final_amount)}
        </span>
      )
    },
    {
      header: 'Payment',
      accessorKey: 'payment_mode',
      cell: (row: any) => (
        <Badge variant="outline" className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md">
          {row.payment_mode}
        </Badge>
      )
    }
  ];

  const payrollColumns = [
    {
      header: 'Month',
      accessorKey: 'month',
      cell: (row: any) => <span className="font-semibold text-slate-900 dark:text-white capitalize">{row.month}</span>
    },
    {
      header: 'Attendance',
      cell: (row: any) => (
        <div className="text-xs font-semibold">
          <span className="text-emerald-600">{row.present_days}P</span> /
          <span className="text-rose-500 ml-1">{row.absent_days}A</span>
        </div>
      )
    },
    {
      header: 'Base Salary',
      accessorKey: 'base_salary',
      cell: (row: any) => formatCurrency(row.base_salary)
    },
    {
      header: 'Commission',
      accessorKey: 'total_commission',
      cell: (row: any) => {
        const val = Number(row.total_commission);
        return val > 0 ? <span className="text-emerald-600 font-bold">+{formatCurrency(val)}</span> : '-';
      }
    },
    {
      header: 'Deductions',
      accessorKey: 'deduction',
      cell: (row: any) => {
        const val = Number(row.deduction) + Number(row.advance_deduction);
        return val > 0 ? <span className="text-rose-500 font-bold">-{formatCurrency(val)}</span> : '-';
      }
    },
    {
      header: 'Final Salary',
      accessorKey: 'final_salary',
      cell: (row: any) => <span className="font-black text-slate-900 dark:text-white">{formatCurrency(row.final_salary)}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <Badge variant={row.status === 'paid' ? 'success' : row.status === 'confirmed' ? 'default' : 'outline'} className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-md">
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b] relative overflow-hidden animate-in fade-in duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />

      {/* Top Banner & Header Navigation */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-5 relative z-10 flex items-center justify-between mb-3">
        <button
          onClick={() => navigate('/staff')}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors w-fit"
        >
          <div className="w-7 h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ArrowLeft size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Staff</span>
        </button>

        {!useAuthStore.getState().user?.roles?.some(r => r.name === 'staff' || r.name === 'manager') && (
          <Button 
            variant="outline" 
            className="h-9 px-4 text-[10px] uppercase font-black tracking-widest gap-2 bg-white hover:bg-slate-50 dark:bg-[#111115] dark:hover:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm transition-all"
            onClick={handleImpersonate}
            disabled={impersonateMutation.isPending}
          >
            <LogIn size={14} className="text-primary-500" />
            {impersonateMutation.isPending ? 'Logging in...' : 'Login as Staff'}
          </Button>
        )}
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-8 space-y-5 relative z-10">
        
        {/* Earnings KPI Cards */}
        {staffEarnings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CustomKpiCard
              title="Today's Earnings"
              value={`₹${(staffEarnings?.today_earnings ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              subtitle="Earned today (Attendance + Commission)"
              icon={<IndianRupee />}
              glowColor="emerald"
            />
            <CustomKpiCard
              title="This Month's Earnings"
              value={`₹${(staffEarnings?.monthly_earnings ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              subtitle="Calculated till date"
              icon={<TrendingUp />}
              glowColor="indigo"
            />
            <CustomKpiCard
              title="Advance Taken"
              value={`₹${(staffEarnings?.advance_taken ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              subtitle="Approved advances this month"
              icon={<IndianRupee />}
              glowColor="rose"
            />
            <CustomKpiCard
              title="Total Dues (Unpaid)"
              value={`₹${(staffEarnings?.total_dues ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              subtitle="Total pending payment from owner"
              icon={<Wallet />}
              glowColor="amber"
            />
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-primary-500/20 to-primary-600/5" />
              
              <div className="relative flex flex-col items-center mt-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/30 transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500 ring-4 ring-white dark:ring-[#111115]">
                  {staff.name.charAt(0)}
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-4 text-center leading-tight">
                  {staff.name}
                </h2>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-600 dark:text-primary-400">
                  <User size={10} className="stroke-[3]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{staff.role}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone Contact</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{staff.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{staff.email || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Joined On</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{format(new Date(staff.join_date), 'dd MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compensation Mini-Card */}
            <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none group hover:-translate-y-0.5 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IndianRupee size={9} className="text-primary-500" />
                    {staff.salary_type === 'daily' ? 'Daily Rate' : 'Monthly Salary'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                      {formatCurrency(staff.salary_type === 'daily' ? staff.daily_salary : staff.monthly_salary)}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      staff.salary_type === 'daily'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    }`}>
                      {staff.salary_type === 'daily' ? 'Per Day' : 'Monthly'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Percent size={9} className="text-emerald-500" />
                    Commission
                  </span>
                  <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">
                    {staff.commission_rate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Salary Breakdown Card (if components defined) */}
            {parsedComponents.length > 0 && (
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    Salary Structure Breakdown
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">Fixed Monthly</span>
                </div>

                {/* Earnings List */}
                {earningsList.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <span>Earnings (Gross)</span>
                      <span>+{formatCurrency(totalEarnings)}</span>
                    </div>
                    <div className="space-y-1 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl p-2.5 border border-emerald-100/60 dark:border-emerald-900/20">
                      {earningsList.map((comp, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{comp.name}</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(comp.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deductions List */}
                {deductionsList.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      <span>Component Deductions</span>
                      <span>-{formatCurrency(totalDeductions)}</span>
                    </div>
                    <div className="space-y-1 bg-rose-50/40 dark:bg-rose-950/10 rounded-xl p-2.5 border border-rose-100/60 dark:border-rose-900/20">
                      {deductionsList.map((comp, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{comp.name}</span>
                          <span className="font-mono font-bold text-rose-500">-{formatCurrency(comp.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Net In-Hand Line */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <span className="text-xs font-black text-slate-800 dark:text-white">Net In-Hand Pay</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {formatCurrency(totalEarnings - totalDeductions)}
                  </span>
                </div>
              </div>
            )}

            {/* Leave Quotas & Balances Card */}
            {staffLeaveBalances && (
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-lg shadow-slate-200/50 dark:shadow-none space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Umbrella className="w-3.5 h-3.5 text-indigo-500" />
                    Annual Leave Quota ({staffLeaveBalances.year})
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {staffLeaveBalances.total_remaining_paid}d Remaining
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-zinc-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Allocated</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{staffLeaveBalances.total_allocated_paid}d</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Used</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">{staffLeaveBalances.total_used_paid}d</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">In-Hand</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{staffLeaveBalances.total_remaining_paid}d</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {staffLeaveBalances.balances?.map(b => (
                    <div key={b.id} className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-zinc-200 capitalize block">{b.leave_type.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-400">{b.used_days} used / {b.is_paid ? `${b.annual_quota}d quota` : 'unlimited'}</span>
                      </div>
                      <span className={`text-xs font-black ${b.is_paid ? (b.remaining_days > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500') : 'text-slate-400'}`}>
                        {b.is_paid ? `${b.remaining_days}d left` : 'Unpaid'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="xl:col-span-8 space-y-5 animate-in slide-in-from-right-8 duration-700">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metric 1 */}
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-sky-100/50 dark:border-sky-900/30 rounded-2xl p-4 shadow-md shadow-sky-100/50 dark:shadow-none relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-colors" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                      Sales Handled
                    </span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display">
                      {stats.this_month_sales}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-500 shadow-inner group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl p-4 shadow-md shadow-emerald-100/50 dark:shadow-none relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      Revenue Generated
                    </span>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-1.5 font-display">
                      {formatCurrency(stats.this_month_sales_amount)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-105 transition-transform">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 shadow-lg shadow-amber-500/30 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 text-white">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black text-amber-100 uppercase tracking-widest drop-shadow-sm">
                      Commission
                    </span>
                    <p className="text-xl font-black mt-1.5 font-display drop-shadow-sm">
                      {formatCurrency(stats.this_month_commission)}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="space-y-4">
              {/* Sales History Table */}
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-1 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">Recent Sales</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 5 transactions</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-none font-bold text-[10px]">
                    {salesData?.data?.length || 0} Total
                  </Badge>
                </div>
                <div className="p-1">
                  <DataTable
                    columns={salesColumns}
                    data={salesData?.data?.slice(0, 5) || []}
                    isLoading={isSalesLoading}
                  />
                </div>
              </div>

              {/* Payroll History Table */}
              <div className="bg-white/80 dark:bg-[#111115]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-1 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">Salary History</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 5 payouts</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-none font-bold text-[10px]">
                    {payrollData?.data?.length || 0} Total
                  </Badge>
                </div>
                <div className="p-1">
                  <DataTable
                    columns={payrollColumns}
                    data={payrollData?.data?.slice(0, 5) || []}
                    isLoading={isPayrollLoading}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

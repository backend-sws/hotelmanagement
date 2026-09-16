import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayrollDetail, useUpdatePayroll, useConfirmPayroll, useMarkPayrollPaid } from '../api/usePayroll';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  ArrowLeft, FileText, CheckCircle, Save, IndianRupee, Printer, 
  User, Briefcase, Mail, Calendar, CalendarDays, CheckCircle2, 
  TrendingUp, TrendingDown, Coins, MessageSquare, AlertCircle, 
  Check, X, Shield, Lock, CreditCard, Banknote, ShieldAlert, Clock,
  SlidersHorizontal, RotateCcw, CheckSquare, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Toggle } from '@/components/ui/toggle';
import { format, parse } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

export interface SlipPreferences {
  showLogo: boolean;
  showBusinessAddress: boolean;
  showGstin: boolean;
  showSlipMeta: boolean;
  showEmployeeId: boolean;
  showEmployeeName: boolean;
  showDesignation: boolean;
  showDepartment: boolean;
  showJoinDate: boolean;
  showPaymentMode: boolean;
  showAttendanceRecord: boolean;
  showTotalsRow: boolean;
  showNetBanner: boolean;
  showAmountInWords: boolean;
  showNotes: boolean;
  showDisclaimer: boolean;
  showSignatures: boolean;
  customFooterNote: string;
}

export const DEFAULT_SLIP_PREFERENCES: SlipPreferences = {
  showLogo: true,
  showBusinessAddress: true,
  showGstin: true,
  showSlipMeta: true,
  showEmployeeId: true,
  showEmployeeName: true,
  showDesignation: true,
  showDepartment: true,
  showJoinDate: true,
  showPaymentMode: true,
  showAttendanceRecord: true,
  showTotalsRow: true,
  showNetBanner: true,
  showAmountInWords: true,
  showNotes: true,
  showDisclaimer: true,
  showSignatures: true,
  customFooterNote: '',
};

const SLIP_PREFS_KEY = 'hotel_salary_slip_preferences';

function getStoredSlipPreferences(): SlipPreferences {
  try {
    const saved = localStorage.getItem(SLIP_PREFS_KEY);
    if (saved) {
      return { ...DEFAULT_SLIP_PREFERENCES, ...JSON.parse(saved) };
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SLIP_PREFERENCES;
}

const getImageUrl = (path: any) => {
  if (!path) return null;
  if (typeof path === 'string' && path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
};

function numberToWords(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'Zero Rupees Only';
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    let str = '';
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + 'Crore ';
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + 'Lakh ';
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + 'Thousand ';
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + 'Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
      }
    }
    return str;
  };

  const rupees = Math.floor(Math.abs(num));
  const paise = Math.round((Math.abs(num) - rupees) * 100);
  let result = 'Rupees ' + inWords(rupees);
  if (paise > 0) {
    result += 'and ' + inWords(paise) + 'Paise ';
  }
  return result.trim() + ' Only';
}

function CorporateSalarySlip({ 
  payroll, 
  preferences = DEFAULT_SLIP_PREFERENCES 
}: { 
  payroll: any; 
  preferences?: SlipPreferences; 
}) {
  const activeBusiness = useTenantStore(state => state.activeBusiness);
  const business = payroll?.business || activeBusiness;
  const businessName = business?.name || 'Hotel & Hospitality Services';
  const businessAddress = business?.address || '';
  const businessState = business?.state || '';
  const businessPincode = business?.pincode || '';
  const fullAddress = [businessAddress, businessState, businessPincode].filter(Boolean).join(', ');
  const businessPhone = business?.phone || business?.phone_2 || '';
  const businessEmail = business?.email || '';
  const businessGstin = business?.gst_number || business?.gstin || '';
  const logoUrl = getImageUrl(business?.logo_path) || getImageUrl(business?.settings?.whitelabel_logo) || null;

  // Earnings List
  const earningsList: { name: string; amount: number }[] = [];
  if (Array.isArray(payroll.salary_components) && payroll.salary_components.length > 0) {
    payroll.salary_components
      .filter((c: any) => c.type === 'earning' && Number(c.amount) > 0)
      .forEach((c: any) => earningsList.push({ name: c.name, amount: Number(c.amount) }));
  }
  if (earningsList.length === 0) {
    earningsList.push({ name: 'Basic Salary', amount: Number(payroll.base_salary) });
  }
  if (Number(payroll.total_commission) > 0) {
    earningsList.push({ name: 'Sales Commission / Incentive', amount: Number(payroll.total_commission) });
  }
  if (Number(payroll.bonus) > 0) {
    earningsList.push({ name: 'Performance / Special Bonus', amount: Number(payroll.bonus) });
  }

  const totalGrossEarnings = earningsList.reduce((acc, curr) => acc + curr.amount, 0);

  // Deductions List
  const deductionsList: { name: string; amount: number }[] = [];
  if (Array.isArray(payroll.salary_components) && payroll.salary_components.length > 0) {
    payroll.salary_components
      .filter((c: any) => c.type === 'deduction' && Number(c.amount) > 0)
      .forEach((c: any) => deductionsList.push({ name: c.name, amount: Number(c.amount) }));
  }
  if (Number(payroll.deduction) > 0) {
    deductionsList.push({ name: 'Absence Deductions (Loss of Pay)', amount: Number(payroll.deduction) });
  }
  if (Number(payroll.advance_deduction) > 0) {
    deductionsList.push({ name: 'Salary Advance Recovered', amount: Number(payroll.advance_deduction) });
  }

  const totalGrossDeductions = deductionsList.reduce((acc, curr) => acc + curr.amount, 0);
  const netPayable = Number(payroll.final_salary);

  // Symmetrical row padding
  const maxRows = Math.max(earningsList.length, deductionsList.length, 5);
  const paddedEarnings = [...earningsList];
  while (paddedEarnings.length < maxRows) {
    paddedEarnings.push({ name: '', amount: 0 });
  }
  const paddedDeductions = [...deductionsList];
  while (paddedDeductions.length < maxRows) {
    paddedDeductions.push({ name: '', amount: 0 });
  }

  const workingDays = (payroll.total_days - (payroll.week_offs || 0) - (payroll.holidays || 0)) > 0 
    ? (payroll.total_days - (payroll.week_offs || 0) - (payroll.holidays || 0)) 
    : payroll.total_days;

  // Real Department from Staff Profile or DB
  const departmentName = payroll.user?.department || 'Hotel Operations';

  return (
    <div className="w-full bg-white text-slate-900 leading-normal flex flex-col justify-between min-h-[96vh] space-y-6">
      {/* 1. Header: Brand & Slip Info */}
      <div className="flex justify-between items-start pb-5 border-b-2 border-slate-900 gap-4">
        {/* Company Branding */}
        <div className="flex items-start gap-4 max-w-[65%]">
          {preferences.showLogo && (
            logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-16 w-auto max-w-[150px] object-contain shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl tracking-wider shadow-xs border border-slate-800 shrink-0">
                {businessName.substring(0, 2).toUpperCase()}
              </div>
            )
          )}
          <div className="space-y-0.5">
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
              {businessName}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {business?.business_type || 'Hotel & Hospitality Services'}
            </p>
            {preferences.showBusinessAddress && fullAddress && (
              <p className="text-[11px] text-slate-600 leading-tight pt-0.5">
                {fullAddress}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 text-[10px] text-slate-600 font-medium pt-0.5">
              {preferences.showBusinessAddress && businessPhone && <span>Tel: {businessPhone}</span>}
              {preferences.showBusinessAddress && businessEmail && <span>Email: {businessEmail}</span>}
              {preferences.showGstin && businessGstin && <span className="font-bold text-slate-800">GSTIN: {businessGstin}</span>}
            </div>
          </div>
        </div>

        {/* Payslip Title & Meta Box */}
        {preferences.showSlipMeta && (
          <div className="text-right shrink-0">
            <div className="inline-block bg-slate-900 text-white px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm mb-1.5 shadow-xs">
              PAYSLIP
            </div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {format(parse(payroll.month, 'yyyy-MM', new Date()), 'MMMM yyyy')}
            </p>
            <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
              SLIP NO: SLIP-{payroll.id.toString().padStart(5, '0')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Issue Date: {payroll.created_at ? format(new Date(payroll.created_at), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy')}
            </p>
            <div className="mt-1.5">
              <span className={cn(
                "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border",
                payroll.status === 'paid' ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                payroll.status === 'confirmed' ? "bg-blue-50 text-blue-800 border-blue-300" :
                "bg-amber-50 text-amber-800 border-amber-300"
              )}>
                Status: {payroll.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Employee & Attendance Details Grid */}
      <div className={cn(
        "border border-slate-300 rounded-md overflow-hidden bg-slate-50/40 text-xs",
        preferences.showAttendanceRecord ? "grid grid-cols-2 gap-4" : "block"
      )}>
        {/* Left: Employee Particulars */}
        <div className={cn(
          "p-3 space-y-1.5",
          preferences.showAttendanceRecord && "border-r border-slate-300"
        )}>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
            Employee Particulars
          </div>
          {preferences.showEmployeeId && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Employee ID:</span>
              <span className="col-span-2 font-bold text-slate-900 font-mono">EMP-{payroll.user_id.toString().padStart(4, '0')}</span>
            </div>
          )}
          {preferences.showEmployeeName && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Employee Name:</span>
              <span className="col-span-2 font-bold text-slate-900 uppercase">{payroll.user?.name}</span>
            </div>
          )}
          {preferences.showDesignation && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Designation:</span>
              <span className="col-span-2 font-semibold text-slate-800">{payroll.user?.designation || payroll.user?.role || 'Staff Member'}</span>
            </div>
          )}
          {preferences.showDepartment && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="col-span-2 font-semibold text-slate-800">{departmentName}</span>
            </div>
          )}
          {preferences.showJoinDate && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Date of Joining:</span>
              <span className="col-span-2 text-slate-700">{payroll.user?.join_date ? format(new Date(payroll.user.join_date), 'dd MMM yyyy') : '—'}</span>
            </div>
          )}
          {preferences.showPaymentMode && (
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <span className="col-span-2 font-semibold text-slate-800">{(payroll as any).salary_type === 'daily' ? 'Daily Wage / Direct' : 'Bank Transfer (NEFT)'}</span>
            </div>
          )}
        </div>

        {/* Right: Attendance Summary */}
        {preferences.showAttendanceRecord && (
          <div className="p-3 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-1.5">
              Attendance & Leave Record
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Calendar Days:</span>
              <span className="col-span-2 font-bold text-slate-900">{payroll.total_days} Days</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Working Schedule:</span>
              <span className="col-span-2 font-bold text-slate-900">{workingDays} Days</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Days Present:</span>
              <span className="col-span-2 font-black text-emerald-800">{payroll.present_days} Days</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Half Days / Leaves:</span>
              <span className="col-span-2 text-slate-800">{payroll.half_days || 0} Half Days | {payroll.paid_leaves || 0} Paid Leaves</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Weekly Offs / Holidays:</span>
              <span className="col-span-2 text-slate-800">{payroll.week_offs || 0} Offs | {payroll.holidays || 0} Holidays</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-medium">Loss of Pay (LOP):</span>
              <span className="col-span-2 font-bold text-rose-700">{(payroll.absent_days || 0) + (payroll.unpaid_leaves || 0)} Days</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Earnings & Deductions Dual Table */}
      <div className="border border-slate-900 rounded-md overflow-hidden text-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2 px-3 text-left w-5/12 border-r border-slate-700">Earnings Heads</th>
              <th className="py-2 px-3 text-right w-2/12 border-r border-slate-900">Amount (₹)</th>
              <th className="py-2 px-3 text-left w-3/12 border-r border-slate-700">Deductions Heads</th>
              <th className="py-2 px-3 text-right w-2/12">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Array.from({ length: maxRows }).map((_, idx) => {
              const earning = paddedEarnings[idx];
              const deduction = paddedDeductions[idx];
              return (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  {/* Earning Name */}
                  <td className="py-1.5 px-3 text-slate-800 font-medium border-r border-slate-300">
                    {earning?.name || '—'}
                  </td>
                  {/* Earning Amount */}
                  <td className="py-1.5 px-3 text-right font-semibold text-slate-900 border-r border-slate-300">
                    {earning?.name ? `₹${earning.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </td>
                  {/* Deduction Name */}
                  <td className="py-1.5 px-3 text-slate-800 font-medium border-r border-slate-300">
                    {deduction?.name || '—'}
                  </td>
                  {/* Deduction Amount */}
                  <td className="py-1.5 px-3 text-right font-semibold text-rose-700">
                    {deduction?.name ? `₹${deduction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </td>
                </tr>
              );
            })}
            {/* Total Row */}
            {preferences.showTotalsRow && (
              <tr className="bg-slate-100 font-black text-xs border-t-2 border-slate-900">
                <td className="py-2 px-3 uppercase tracking-wider text-slate-900 border-r border-slate-300">
                  Total Gross Earnings (A)
                </td>
                <td className="py-2 px-3 text-right text-emerald-800 border-r border-slate-300 font-bold">
                  ₹{totalGrossEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-3 uppercase tracking-wider text-slate-900 border-r border-slate-300">
                  Total Deductions (B)
                </td>
                <td className="py-2 px-3 text-right text-rose-700 font-bold">
                  ₹{totalGrossDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Net Salary & Amount in Words Banner */}
      {preferences.showNetBanner && (
        <div className="border-2 border-slate-900 rounded-md p-3.5 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Net Payable In-Hand Salary (A − B)
              </span>
              {payroll.paid_date && (
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Paid on {format(new Date(payroll.paid_date), 'dd MMM yyyy')}
                </span>
              )}
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight font-display">
              ₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {preferences.showAmountInWords && (
              <p className="text-[11px] font-bold text-slate-700 italic">
                In Words: {numberToWords(netPayable)}
              </p>
            )}
          </div>
          {preferences.showPaymentMode && (
            <div className="text-right sm:border-l sm:border-slate-300 sm:pl-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                Payment Mode
              </span>
              <span className="text-xs font-bold text-slate-800 block">
                {(payroll as any).salary_type === 'daily' ? 'Daily Wage / Direct' : 'Direct Bank Transfer'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                ✓ Verified & Authorized
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. Notes */}
      {preferences.showNotes && payroll.notes && (
        <div className="text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="font-bold text-slate-700 mr-1">Remarks / HR Notes:</span>
          <span className="italic text-slate-600">{payroll.notes}</span>
        </div>
      )}

      {/* Custom Organization Footer Note */}
      {preferences.customFooterNote && (
        <div className="text-xs bg-indigo-50/70 text-indigo-900 p-2.5 rounded border border-indigo-200 font-medium">
          {preferences.customFooterNote}
        </div>
      )}

      {/* 6. Computer Generated Disclaimer */}
      {preferences.showDisclaimer && (
        <div className="text-[9px] text-center text-slate-400 border-t border-slate-200 pt-2">
          * This is an officially generated computer document and serves as proof of compensation from {businessName}. No physical signature is required.
        </div>
      )}

      {/* 7. Signatures Block */}
      {preferences.showSignatures && (
        <div className="grid grid-cols-2 gap-16 pt-10 mt-auto">
          <div className="text-center">
            <div className="h-12 border-b border-slate-400" />
            <p className="pt-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Employee Signature
            </p>
            <p className="text-[9px] text-slate-400 mt-0.5">Date: ____________________</p>
          </div>

          <div className="text-center">
            <div className="h-12 border-b border-slate-400" />
            <p className="pt-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              For {businessName}
            </p>
            <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Authorized Signatory / HR Department</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SalarySlipCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: SlipPreferences;
  onUpdate: (key: keyof SlipPreferences, value: any) => void;
  onReset: () => void;
  onSelectAll: () => void;
}

function SalarySlipCustomizerModal({
  isOpen,
  onClose,
  preferences,
  onUpdate,
  onReset,
  onSelectAll,
}: SalarySlipCustomizerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Customize Salary Slip Layout
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal">
              Select which fields and sections appear on the printable salary slip
            </p>
          </div>
        </div>
      }
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="text-xs"
            >
              <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Show All Fields
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs text-slate-500"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Defaults
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold"
          >
            Apply & Close
          </Button>
        </div>
      }
    >
      <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Section 1: Business Branding & Header */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-1.5">
            1. Hotel Branding & Header Info
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Business Logo</p>
                <p className="text-[11px] text-slate-500">Show logo or initial badge in header</p>
              </div>
              <Toggle checked={preferences.showLogo} onChange={(val) => onUpdate('showLogo', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Hotel Address & Phone</p>
                <p className="text-[11px] text-slate-500">Full address, contact numbers & email</p>
              </div>
              <Toggle checked={preferences.showBusinessAddress} onChange={(val) => onUpdate('showBusinessAddress', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">GSTIN / Tax ID</p>
                <p className="text-[11px] text-slate-500">Hotel GST registration number</p>
              </div>
              <Toggle checked={preferences.showGstin} onChange={(val) => onUpdate('showGstin', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Slip No & Month Meta</p>
                <p className="text-[11px] text-slate-500">Slip number, pay period & issue date</p>
              </div>
              <Toggle checked={preferences.showSlipMeta} onChange={(val) => onUpdate('showSlipMeta', val)} />
            </div>
          </div>
        </div>

        {/* Section 2: Employee Particulars */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-1.5">
            2. Employee Particulars
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Employee ID</p>
                <p className="text-[11px] text-slate-500">e.g. EMP-0050</p>
              </div>
              <Toggle checked={preferences.showEmployeeId} onChange={(val) => onUpdate('showEmployeeId', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Employee Name</p>
                <p className="text-[11px] text-slate-500">Full official staff name</p>
              </div>
              <Toggle checked={preferences.showEmployeeName} onChange={(val) => onUpdate('showEmployeeName', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Designation / Role</p>
                <p className="text-[11px] text-slate-500">Staff role or assigned designation</p>
              </div>
              <Toggle checked={preferences.showDesignation} onChange={(val) => onUpdate('showDesignation', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Department</p>
                <p className="text-[11px] text-slate-500">Front Office, Kitchen, Housekeeping, etc.</p>
              </div>
              <Toggle checked={preferences.showDepartment} onChange={(val) => onUpdate('showDepartment', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Date of Joining</p>
                <p className="text-[11px] text-slate-500">Staff joining date</p>
              </div>
              <Toggle checked={preferences.showJoinDate} onChange={(val) => onUpdate('showJoinDate', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Payment Mode</p>
                <p className="text-[11px] text-slate-500">Bank Transfer (NEFT) / Cash / Direct</p>
              </div>
              <Toggle checked={preferences.showPaymentMode} onChange={(val) => onUpdate('showPaymentMode', val)} />
            </div>
          </div>
        </div>

        {/* Section 3: Attendance & Calculations */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-1.5">
            3. Attendance & Calculation Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Attendance & Leave Record</p>
                <p className="text-[11px] text-slate-500">Schedule days, presents, offs, and LOP</p>
              </div>
              <Toggle checked={preferences.showAttendanceRecord} onChange={(val) => onUpdate('showAttendanceRecord', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Totals Summary Row</p>
                <p className="text-[11px] text-slate-500">Total Gross Earnings & Deductions</p>
              </div>
              <Toggle checked={preferences.showTotalsRow} onChange={(val) => onUpdate('showTotalsRow', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Net Payable Salary Banner</p>
                <p className="text-[11px] text-slate-500">Final in-hand salary highlight box</p>
              </div>
              <Toggle checked={preferences.showNetBanner} onChange={(val) => onUpdate('showNetBanner', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Amount in Words</p>
                <p className="text-[11px] text-slate-500">e.g. Rupees Twenty Thousand Only</p>
              </div>
              <Toggle checked={preferences.showAmountInWords} onChange={(val) => onUpdate('showAmountInWords', val)} />
            </div>
          </div>
        </div>

        {/* Section 4: Signatures & Remarks */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-1.5">
            4. Signatures, Remarks & Footers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Signatures Block</p>
                <p className="text-[11px] text-slate-500">Employee & Authorized Signatory lines</p>
              </div>
              <Toggle checked={preferences.showSignatures} onChange={(val) => onUpdate('showSignatures', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Computer Generated Disclaimer</p>
                <p className="text-[11px] text-slate-500">"Officially generated document" footer</p>
              </div>
              <Toggle checked={preferences.showDisclaimer} onChange={(val) => onUpdate('showDisclaimer', val)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 col-span-1 sm:col-span-2">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">HR Notes / Remarks</p>
                <p className="text-[11px] text-slate-500">Show notes added during payroll confirmation</p>
              </div>
              <Toggle checked={preferences.showNotes} onChange={(val) => onUpdate('showNotes', val)} />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Custom Footer Note / Message (Optional)
            </label>
            <Input
              value={preferences.customFooterNote}
              onChange={(e) => onUpdate('customFooterNote', e.target.value)}
              placeholder="e.g. Confidential document for internal employee use only."
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function PayrollDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: payroll, isLoading } = usePayrollDetail(Number(id));
  const updateMutation = useUpdatePayroll();
  const confirmMutation = useConfirmPayroll();
  const markPaidMutation = useMarkPayrollPaid();

  const { hasPermission } = usePermissions();
  const user = useAuthStore(state => state.user);
  const isManager = React.useMemo(() => {
    return user?.roles?.some((r: any) => r.name === 'admin' || r.name === 'manager' || r.name === 'Business Admin' || r.name === 'Superadmin') || hasPermission('manage_payroll');
  }, [user, hasPermission]);

  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'earned' | 'projected'>('earned');
  const [showSlipPreview, setShowSlipPreview] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [slipPreferences, setSlipPreferences] = useState<SlipPreferences>(getStoredSlipPreferences);

  const handleUpdatePref = (key: keyof SlipPreferences, value: any) => {
    setSlipPreferences(prev => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(SLIP_PREFS_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleResetPrefs = () => {
    setSlipPreferences(DEFAULT_SLIP_PREFERENCES);
    try {
      localStorage.setItem(SLIP_PREFS_KEY, JSON.stringify(DEFAULT_SLIP_PREFERENCES));
    } catch (e) {}
  };

  const handleSelectAllPrefs = () => {
    const allOn: SlipPreferences = {
      showLogo: true,
      showBusinessAddress: true,
      showGstin: true,
      showSlipMeta: true,
      showEmployeeId: true,
      showEmployeeName: true,
      showDesignation: true,
      showDepartment: true,
      showJoinDate: true,
      showPaymentMode: true,
      showAttendanceRecord: true,
      showTotalsRow: true,
      showNetBanner: true,
      showAmountInWords: true,
      showNotes: true,
      showDisclaimer: true,
      showSignatures: true,
      customFooterNote: slipPreferences.customFooterNote,
    };
    setSlipPreferences(allOn);
    try {
      localStorage.setItem(SLIP_PREFS_KEY, JSON.stringify(allOn));
    } catch (e) {}
  };

  const [formData, setFormData] = useState({
    bonus: 0,
    advance_deduction: 0,
    notes: ''
  });

  React.useEffect(() => {
    if (payroll) {
      setFormData({
        bonus: payroll.bonus,
        advance_deduction: payroll.advance_deduction,
        notes: payroll.notes || ''
      });
    }
  }, [payroll]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-[100px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!payroll) {
    return <div className="p-6">Payroll record not found.</div>;
  }

  const handleSave = () => {
    updateMutation.mutate(
      { 
        id: payroll.id, 
        ...formData 
      },
      { onSuccess: () => setEditMode(false) }
    );
  };

  const isDraft = payroll.status === 'draft';
  const isConfirmed = payroll.status === 'confirmed';
  const isMonthly = (payroll as any).salary_type !== 'daily';

  // Calculate Earned Till Date vs Projected
  const perDaySalary = Number(payroll.per_day_salary || 0);
  const totalDays = Number(payroll.total_days || 30);
  const currentDay = Math.min(new Date().getDate(), totalDays);
  
  const presentDays = Number(payroll.present_days || 0);
  const halfDays = Number(payroll.half_days || 0);
  const paidLeaves = Number(payroll.paid_leaves || 0);
  const effectivePresent = presentDays + (halfDays * 0.5) + paidLeaves;

  const earnedTillDateBase = (payroll as any).salary_type === 'daily' 
    ? effectivePresent * perDaySalary 
    : effectivePresent * perDaySalary;

  const earnedTillDateNet = earnedTillDateBase + Number(payroll.total_commission || 0) + Number(formData.bonus || 0) - Number(formData.advance_deduction || 0);
  const projectedNet = Number(payroll.base_salary) - Number(payroll.deduction) + Number(payroll.total_commission || 0) + Number(formData.bonus || 0) - Number(formData.advance_deduction || 0);

  const displayNet = (isDraft && isMonthly && viewMode === 'earned') ? earnedTillDateNet : projectedNet;
  const displayBase = (isDraft && isMonthly && viewMode === 'earned') ? earnedTillDateBase : Number(payroll.base_salary);
  const displayDeduction = (isDraft && isMonthly && viewMode === 'earned') ? 0 : Number(payroll.deduction);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#09090b]">
      {/* Actions & PageHeader */}
      <div className="print:hidden">
        <PageHeader 
          icon={FileText}
          title={`Salary Slip - ${format(parse(payroll.month, 'yyyy-MM', new Date()), 'MMMM yyyy')}`}
          subtitle={`For ${payroll.user?.name}`}
          actions={
            <div className="flex gap-2 flex-wrap items-center">
              <Button variant="outline" size="sm" onClick={() => navigate('/payroll')}>
                <ArrowLeft size={14} className="mr-2" /> Back
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsCustomizerOpen(true)}
                className="border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <SlidersHorizontal size={14} className="mr-2" /> Customize Slip
              </Button>
              <Button 
                variant={showSlipPreview ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowSlipPreview(prev => !prev)}
              >
                <FileText size={14} className="mr-2" /> {showSlipPreview ? 'Hide Paper Slip' : 'Preview Paper Slip'}
              </Button>
              <Button size="sm" onClick={() => window.print()} className="bg-primary-500 hover:bg-primary-600 text-white shadow-xs">
                <Printer size={14} className="mr-2" /> Print Salary Slip
              </Button>
              {isManager && isDraft && !editMode && (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  Edit Details
                </Button>
              )}
              {isManager && isDraft && editMode && (
                <Button size="sm" onClick={handleSave} isLoading={updateMutation.isPending}>
                  <Save size={14} className="mr-2" /> Save Changes
                </Button>
              )}
              {isManager && isDraft && !editMode && (
                <Button 
                  size="sm" 
                  onClick={() => confirmMutation.mutate(payroll.id)}
                  isLoading={confirmMutation.isPending}
                >
                  <CheckCircle size={14} className="mr-2" /> Confirm Payroll
                </Button>
              )}
              {isManager && isConfirmed && (
                <Button 
                  size="sm" 
                  onClick={() => markPaidMutation.mutate({ id: payroll.id })}
                  isLoading={markPaidMutation.isPending}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Screen Layout Container */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-8 space-y-6 print:hidden">
        
        {/* Hero split layout (Employee + Net Salary + Status widget) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Employee Card */}
          <div className="lg:col-span-2 relative bg-white dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between overflow-hidden group">
            {/* Ambient bg gradient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px] pointer-events-none transition-transform group-hover:scale-110 duration-500" />
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-orange-500 p-0.5 shadow-md shadow-primary-500/10 shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#09090b] rounded-[14px] flex items-center justify-center text-primary-500">
                  <User className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2.5 py-0.5 rounded-full">
                    Employee Info
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                    ID: EMP-{payroll.user_id.toString().padStart(4, '0')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  {payroll.user?.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {payroll.user?.role || 'Staff Member'}
                  </span>
                  {payroll.user?.department && (
                    <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      <Building2 className="w-3.5 h-3.5" />
                      {payroll.user.department}
                    </span>
                  )}
                  {payroll.user?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {payroll.user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-white/5 mt-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">Month</p>
                <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {format(parse(payroll.month, 'yyyy-MM', new Date()), 'MMMM yyyy')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">Slip No</p>
                <p className="text-sm font-bold text-slate-700 dark:text-zinc-200 font-mono">
                  SLIP-{payroll.id.toString().padStart(4, '0')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">Slip Date</p>
                <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {payroll.created_at ? format(new Date(payroll.created_at), 'dd MMM yyyy') : format(new Date(), 'dd MMM yyyy')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-0.5">Status</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    payroll.status === 'paid' ? "bg-emerald-500 animate-pulse" :
                    payroll.status === 'confirmed' ? "bg-blue-500 animate-pulse" : "bg-orange-500"
                  )} />
                  <span className={cn(
                    "text-xs font-extrabold uppercase tracking-wider",
                    payroll.status === 'paid' ? "text-emerald-600 dark:text-emerald-400" :
                    payroll.status === 'confirmed' ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
                  )}>
                    {payroll.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Hero Widget */}
          <div className="relative bg-gradient-to-br from-primary-500/10 to-orange-500/5 dark:from-primary-500/15 dark:to-orange-500/5 border border-primary-500/25 dark:border-primary-500/10 rounded-2xl p-6 shadow-lg shadow-primary-500/5 flex flex-col justify-between overflow-hidden group">
            {/* Glowing spot */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-1.5 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/15 px-2.5 py-0.5 rounded-full w-fit block">
                  Net Payable
                </span>
                <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-400 tracking-wider mt-1.5">
                  {(payroll as any).salary_type === 'daily' ? 'DAILY WAGE SALARY' : (viewMode === 'earned' ? 'EARNED TILL DATE' : 'PROJECTED FINAL SALARY')}
                </p>
              </div>
              
              {isDraft && isMonthly && (
                <div className="flex bg-white/50 dark:bg-black/20 p-1 rounded-lg border border-primary-500/10 backdrop-blur-sm relative z-10">
                  <button 
                    onClick={() => setViewMode('earned')}
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-all duration-300",
                      viewMode === 'earned' ? "bg-white dark:bg-zinc-800 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    )}
                  >
                    Earned
                  </button>
                  <button 
                    onClick={() => setViewMode('projected')}
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-all duration-300",
                      viewMode === 'projected' ? "bg-white dark:bg-zinc-800 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    )}
                  >
                    Projected
                  </button>
                </div>
              )}
            </div>

            <div className="my-6">
              <div className="flex items-baseline text-slate-900 dark:text-white">
                <span className="text-xl font-extrabold text-primary-500 mr-1 font-display">₹</span>
                <span className="text-4xl font-black font-display tracking-tight transition-transform group-hover:scale-105 duration-300 inline-block">
                  {displayNet.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                Inclusive of bonuses, commissions & {viewMode === 'earned' ? 'recoveries' : 'LOP deductions'}.
              </p>
            </div>

            <div className="border-t border-primary-500/10 dark:border-white/5 pt-4">
              {payroll.status === 'paid' && payroll.paid_date ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Disbursed on {format(new Date(payroll.paid_date), 'dd MMM yyyy')}</span>
                </div>
              ) : payroll.status === 'confirmed' ? (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-blue-500 animate-spin-slow" />
                  <span>Awaiting Disbursal</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Draft Reviewing</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Section 2: Attendance Metrics */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">
            Attendance Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Working Days */}
            <div className="bg-white/60 dark:bg-zinc-950/20 border border-slate-200/80 dark:border-white/5 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-450">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider">WORKING DAYS</p>
                <p className="text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5">{payroll.total_days}</p>
              </div>
            </div>

            {/* Present Days */}
            <div className="bg-white/60 dark:bg-zinc-950/20 border border-slate-200/80 dark:border-white/5 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider">DAYS PRESENT</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-tight mt-0.5">{payroll.present_days}</p>
              </div>
            </div>

            {/* Absent Days */}
            <div className="bg-white/60 dark:bg-zinc-950/20 border border-slate-200/80 dark:border-white/5 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider">LOP ABSENCES</p>
                <p className="text-lg font-black text-rose-500 dark:text-rose-400 leading-tight mt-0.5">
                  {payroll.absent_days + payroll.unpaid_leaves}
                </p>
              </div>
            </div>

            {/* Offs & Paid Leaves */}
            <div className="bg-white/60 dark:bg-zinc-950/20 border border-slate-200/80 dark:border-white/5 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider">PAID LEAVES / OFFS</p>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400 leading-tight mt-0.5">
                  {payroll.paid_leaves + payroll.holidays + payroll.week_offs}
                </p>
              </div>
            </div>

          </div>
        </div>

          {/* Section 3: Earnings & Deductions Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Earnings card */}
          <div className="bg-white/70 dark:bg-zinc-950/30 border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 font-display">
                  {(payroll as any).salary_type === 'daily' ? 'Daily Wage Earnings' : 'Monthly Earnings'}
                </h4>
                {(payroll as any).salary_type === 'daily' && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest ml-auto">
                    Per Day
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-4">
                {(payroll as any).salary_type === 'daily' ? (
                  /* Daily wage breakdown */
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-550 dark:text-zinc-400">Daily Rate</span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">
                        ₹{Number(payroll.per_day_salary).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-550 dark:text-zinc-400">Days Worked (Present)</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {payroll.present_days} days
                      </span>
                    </div>
                    {Number(payroll.half_days) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-550 dark:text-zinc-400">Half Days (×0.5)</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {payroll.half_days} days
                        </span>
                      </div>
                    )}
                    {Number(payroll.paid_leaves) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-550 dark:text-zinc-400">Paid Leaves</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {payroll.paid_leaves} days
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100 dark:border-white/5">
                      <span className="text-slate-550 dark:text-zinc-400 font-medium">Earned from Attendance</span>
                      <span className="font-bold text-slate-700 dark:text-zinc-200">
                        ₹{Number(payroll.base_salary).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Monthly salary breakdown */
                  <>
                    {Array.isArray(payroll.salary_components) && payroll.salary_components.filter((c: any) => c.type === 'earning').map((comp: any) => (
                      <div key={comp.id || comp.name} className="flex justify-between items-center text-sm">
                        <span className="text-slate-550 dark:text-zinc-400">{comp.name}</span>
                        <span className="font-semibold text-slate-700 dark:text-zinc-200">
                          ₹{Number(comp.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    
                    {(!payroll.salary_components || (Array.isArray(payroll.salary_components) && payroll.salary_components.length === 0)) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-555 dark:text-zinc-400">Basic Salary</span>
                        <span className="font-semibold text-slate-700 dark:text-zinc-200">
                          ₹{displayBase.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {Number(payroll.total_commission) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-555 dark:text-zinc-400">Sales Commissions</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +₹{Number(payroll.total_commission).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {editMode ? (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-slate-555 dark:text-zinc-400 font-medium">Extra Bonus</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        className="w-28 pl-6 pr-2.5 h-8 text-right bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary-500" 
                        value={formData.bonus}
                        onChange={(e) => setFormData(prev => ({ ...prev, bonus: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                ) : (
                  Number(payroll.bonus) > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 text-sm">
                      <span className="text-slate-555 dark:text-zinc-400">Performance Bonus</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +₹{Number(payroll.bonus).toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            
            {/* Total Gross Earnings */}
            <div className="border-t border-slate-100 dark:border-white/5 mt-6 pt-4 flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Gross Earnings</span>
              <span className="text-base font-black text-slate-800 dark:text-zinc-200 font-display">
                ₹{(displayBase
                  + Number(payroll.total_commission) 
                  + (editMode ? Number(formData.bonus) : Number(payroll.bonus))).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Deductions card */}
          <div className="bg-white/70 dark:bg-zinc-950/30 border border-slate-200/80 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-500 dark:text-rose-400">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 font-display">
                  Monthly Deductions
                </h4>
              </div>

              <div className="mt-4 space-y-4">
                {/* Check Salary components deductions */}
                {Array.isArray(payroll.salary_components) && payroll.salary_components.filter((c: any) => c.type === 'deduction').map((comp: any) => (
                  <div key={comp.id || comp.name} className="flex justify-between items-center text-sm">
                    <span className="text-slate-555 dark:text-zinc-400">{comp.name}</span>
                    <span className="font-semibold text-rose-500">
                      -₹{Number(comp.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
                
                {displayDeduction > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-555 dark:text-zinc-400">Absence Deductions (LOP)</span>
                    <span className="font-semibold text-rose-500">
                      -₹{displayDeduction.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {editMode ? (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-slate-555 dark:text-zinc-400 font-medium">Advance Deduct</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        className="w-28 pl-6 pr-2.5 h-8 text-right bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary-500" 
                        value={formData.advance_deduction}
                        onChange={(e) => setFormData(prev => ({ ...prev, advance_deduction: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                ) : (
                  Number(payroll.advance_deduction) > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 text-sm">
                      <span className="text-slate-555 dark:text-zinc-400">Salary Advance Recovered</span>
                      <span className="font-semibold text-rose-500">
                        -₹{Number(payroll.advance_deduction).toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            
            {/* Total Deductions */}
            <div className="border-t border-slate-100 dark:border-white/5 mt-6 pt-4 flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Deductions</span>
              <span className="text-base font-black text-rose-500 font-display">
                ₹{(
                  displayDeduction 
                  + (editMode ? Number(formData.advance_deduction) : Number(payroll.advance_deduction))
                  + (Array.isArray(payroll.salary_components) ? payroll.salary_components.filter((c: any) => c.type === 'deduction').reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) : 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Section 4: Notes and remarks */}
        {(editMode || payroll.notes) && (
          <div className="bg-white/60 dark:bg-zinc-950/20 border border-slate-200/80 dark:border-white/5 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-zinc-400">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-black uppercase tracking-widest">Notes & Remarks</label>
            </div>
            {editMode ? (
              <textarea 
                className="w-full min-h-[80px] p-3 text-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-slate-400 shadow-inner"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add extra remarks or adjustments reason..."
              />
            ) : (
              <p className="text-slate-655 dark:text-zinc-300 text-sm leading-relaxed pl-1">
                {payroll.notes}
              </p>
            )}
          </div>
        )}

        {/* On-screen Paper Preview when toggled */}
        {showSlipPreview && (
          <div className="w-full max-w-4xl mx-auto mt-6 mb-4 px-2 print:hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-100 dark:bg-zinc-900/90 p-4 sm:p-6 rounded-2xl border border-slate-300 dark:border-white/10 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    Executive Salary Slip (A4 Print Preview)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsCustomizerOpen(true)}
                    className="border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  >
                    <SlidersHorizontal size={14} className="mr-2" /> Customize Slip
                  </Button>
                  <Button size="sm" onClick={() => window.print()} className="bg-primary-500 hover:bg-primary-600 text-white shadow-xs">
                    <Printer size={14} className="mr-2" /> Print / Save PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSlipPreview(false)}>
                    <X size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="shadow-2xl rounded-lg border border-slate-200 bg-white p-8">
                <CorporateSalarySlip payroll={payroll} preferences={slipPreferences} />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Printable Paper A4 Layout (Dedicated for window.print() / Browser Print Dialog) */}
      <div className="hidden print:block bg-white text-slate-900 w-full max-w-none mx-auto font-sans leading-normal print:p-6 print:m-0">
        <CorporateSalarySlip payroll={payroll} preferences={slipPreferences} />
      </div>

      {/* Salary Slip Layout Customizer Modal */}
      <SalarySlipCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        preferences={slipPreferences}
        onUpdate={handleUpdatePref}
        onReset={handleResetPrefs}
        onSelectAll={handleSelectAllPrefs}
      />
    </div>
  );
}

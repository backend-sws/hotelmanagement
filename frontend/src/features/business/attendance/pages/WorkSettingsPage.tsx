import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useWorkSettings, useSaveWorkSettings, useHolidays } from '../api/useAttendance';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { BusinessLocationsSection } from '@/features/business/profile/components/BusinessLocationsSection';
import { LeavePoliciesModal } from '@/features/business/hr/components/LeavePoliciesModal';
import { useLeavePolicies } from '@/features/business/hr/api/useLeavePolicies';
import {
  Settings2, Clock, Save, RefreshCw, Building2, CheckCircle2,
  Calendar, ShieldCheck, Sparkles, AlertCircle, Info, Undo2,
  Zap, ArrowRight, Shield, Lock, Camera, Smartphone, MapPin,
  Sliders, Bell, Check, ExternalLink, HelpCircle, Briefcase,
  Home, HardDrive, Receipt, Database, Plus,
} from 'lucide-react';
import { toast } from 'sonner';

const ALL_DAYS = [
  { id: 'Mon', label: 'Monday', short: 'Mon' },
  { id: 'Tue', label: 'Tuesday', short: 'Tue' },
  { id: 'Wed', label: 'Wednesday', short: 'Wed' },
  { id: 'Thu', label: 'Thursday', short: 'Thu' },
  { id: 'Fri', label: 'Friday', short: 'Fri' },
  { id: 'Sat', label: 'Saturday', short: 'Sat' },
  { id: 'Sun', label: 'Sunday', short: 'Sun' },
];

export default function WorkSettingsPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useWorkSettings();
  const saveMutation = useSaveWorkSettings();

  const [activeTab, setActiveTab] = useState<
    'branches' | 'timings' | 'weekly_off' | 'leaves' | 'holidays' | 'punch_security' | 'cleanup' | 'salary_rules' | 'overtime' | 'all'
  >('punch_security');

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const currentMonthStr = useMemo(() => format(new Date(), 'yyyy-MM'), []);
  const { data: leavePolicies = [] } = useLeavePolicies();
  const { data: holidaysList = [] } = useHolidays(currentMonthStr);

  const [form, setForm] = useState({
    work_start_time: '09:00',
    work_end_time: '18:00',
    standard_hours_per_day: 9,
    work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    late_mark_grace_minutes: 15,
    default_lunch_minutes: 60,
    auto_apply_holidays: true,
    enable_auto_absent: true,
    enable_overtime: false,
    overtime_rate_type: 'fixed_rate' as 'fixed_rate' | 'multiplier',
    overtime_hourly_rate: 100,
    overtime_multiplier: 1.5,
    overtime_min_minutes: 30,
    overtime_require_approval: true,
    punch_mode_office: true,
    punch_mode_wfh: true,
    punch_mode_quick_gps: false,
    punch_mode_selfie_required: true,
    punch_mode_on_duty: false,
    forgot_checkout_policy: 'half_day' as 'half_day' | 'auto_full' | 'incomplete',
    forgot_checkout_alert_time: '19:00',
    enable_forgot_checkout_alert: true,
    enable_late_deduction: true,
    late_free_waiver_count: 2,
    late_deduction_trigger_count: 4,
    late_deduction_amount_type: 1.0,
    enable_absence_penalty: true,
    absence_penalty_multiplier: 2.0,
    enable_leave_notice_rule: true,
    leave_notice_days_required: 2,
  });

  const [initialForm, setInitialForm] = useState(form);

  useEffect(() => {
    if (settings) {
      const loaded = {
        work_start_time: settings.work_start_time?.slice(0, 5) || '09:00',
        work_end_time: settings.work_end_time?.slice(0, 5) || '18:00',
        standard_hours_per_day: settings.standard_hours_per_day || 9,
        work_days: settings.work_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        late_mark_grace_minutes: settings.late_mark_grace_minutes || 15,
        default_lunch_minutes: settings.default_lunch_minutes ?? 60,
        auto_apply_holidays: settings.auto_apply_holidays ?? true,
        enable_auto_absent: settings.enable_auto_absent ?? true,
        enable_overtime: settings.enable_overtime ?? false,
        overtime_rate_type: (settings.overtime_rate_type as any) || 'fixed_rate',
        overtime_hourly_rate: settings.overtime_hourly_rate ?? 100,
        overtime_multiplier: settings.overtime_multiplier ?? 1.5,
        overtime_min_minutes: settings.overtime_min_minutes ?? 30,
        overtime_require_approval: settings.overtime_require_approval ?? true,
        punch_mode_office: settings.punch_mode_office ?? true,
        punch_mode_wfh: settings.punch_mode_wfh ?? true,
        punch_mode_quick_gps: settings.punch_mode_quick_gps ?? false,
        punch_mode_selfie_required: settings.punch_mode_selfie_required ?? true,
        punch_mode_on_duty: settings.punch_mode_on_duty ?? false,
        forgot_checkout_policy: (settings.forgot_checkout_policy as any) || 'half_day',
        forgot_checkout_alert_time: settings.forgot_checkout_alert_time?.slice(0, 5) || '19:00',
        enable_forgot_checkout_alert: settings.enable_forgot_checkout_alert ?? true,
        enable_late_deduction: settings.enable_late_deduction ?? true,
        late_free_waiver_count: settings.late_free_waiver_count ?? 2,
        late_deduction_trigger_count: settings.late_deduction_trigger_count ?? 4,
        late_deduction_amount_type: Number(settings.late_deduction_amount_type ?? 1.0),
        enable_absence_penalty: settings.enable_absence_penalty ?? true,
        absence_penalty_multiplier: Number(settings.absence_penalty_multiplier ?? 2.0),
        enable_leave_notice_rule: settings.enable_leave_notice_rule ?? true,
        leave_notice_days_required: settings.leave_notice_days_required ?? 2,
      };
      setForm(loaded);
      setInitialForm(loaded);
    }
  }, [settings]);

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const toggleDay = (day: string) => {
    setForm(prev => {
      const exists = prev.work_days.includes(day);
      if (exists && prev.work_days.length === 1) {
        toast.warning('At least one working day must be selected');
        return prev;
      }
      return {
        ...prev,
        work_days: exists
          ? prev.work_days.filter(d => d !== day)
          : [...prev.work_days, day],
      };
    });
  };

  const applyPreset = (preset: '5-days' | '6-days' | '7-days') => {
    if (preset === '5-days') {
      setForm(p => ({ ...p, work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }));
    } else if (preset === '6-days') {
      setForm(p => ({ ...p, work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }));
    } else {
      setForm(p => ({ ...p, work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }));
    }
  };

  const applyPunchPreset = (preset: 'office_wfh' | 'all') => {
    if (preset === 'office_wfh') {
      setForm(p => ({
        ...p,
        punch_mode_office: true,
        punch_mode_wfh: true,
        punch_mode_quick_gps: false,
        punch_mode_selfie_required: true,
        punch_mode_on_duty: false,
      }));
      toast.success('Applied "Office & WFH Only (Camera Required)" preset');
    } else {
      setForm(p => ({
        ...p,
        punch_mode_office: true,
        punch_mode_wfh: true,
        punch_mode_quick_gps: true,
        punch_mode_selfie_required: true,
        punch_mode_on_duty: true,
      }));
      toast.success('Enabled all punch modes');
    }
  };

  const computedHours = () => {
    try {
      const [sh, sm] = form.work_start_time.split(':').map(Number);
      const [eh, em] = form.work_end_time.split(':').map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm);
      return mins > 0 ? (mins / 60).toFixed(1) : '—';
    } catch {
      return '—';
    }
  };

  const computedHalfTimeCutoff = () => {
    try {
      const [sh, sm] = form.work_start_time.split(':').map(Number);
      const [eh, em] = form.work_end_time.split(':').map(Number);
      let startMins = sh * 60 + sm;
      let endMins = eh * 60 + em;
      if (endMins <= startMins) endMins += 24 * 60;
      const midMins = Math.round(startMins + (endMins - startMins) / 2) % (24 * 60);
      const hh = Math.floor(midMins / 60);
      const mm = midMins % 60;
      const period = hh >= 12 ? 'PM' : 'AM';
      const displayH = hh % 12 || 12;
      return `${String(displayH).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${period}`;
    } catch {
      return '01:30 PM';
    }
  };

  const handleSave = () => {
    saveMutation.mutate(form, {
      onSuccess: () => {
        setInitialForm(form);
      },
    });
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
        <p className="text-xs font-medium text-slate-400">Loading work settings...</p>
      </div>
    );
  }

  const weeklyHours = (form.work_days.length * form.standard_hours_per_day).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[45%] bg-primary-500/5 dark:bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-[15%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <PageHeader
        title="Work Settings"
        subtitle="Configure standard operational hours, weekly active shifts, and automated attendance policies"
        icon={Settings2}
        actions={
          <div className="flex items-center gap-2.5">
            {isDirty && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-10 px-3.5 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5 mr-1.5" />
                Discard
              </Button>
            )}
            <Button
              variant="brand"
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              isLoading={saveMutation.isPending}
              className="h-10 px-5 text-xs font-bold cursor-pointer"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Settings
            </Button>
          </div>
        }
      />

      {/* Full-width container aligned with PageHeader (max-w-[1600px]) */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 space-y-6">
        {/* Dedicated Office & App Settings Hub Header & Navigation (Unified Admin Engine) */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Dedicated Office & App Settings Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Consolidated management for branches, shifts, week-offs, punch security & leave quotas
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 self-start sm:self-auto">
              Unified Admin Engine
            </span>
          </div>

          {/* Hub Tab Navigation Pills */}
          <div className="flex items-center gap-2 pt-2.5 pb-2 border-t border-slate-100 dark:border-zinc-800/80 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700">
            <button
              type="button"
              onClick={() => setActiveTab('branches')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'branches'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${activeTab === 'branches' ? 'text-white' : 'text-slate-500'}`} />
              Branches & Geofence
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'timings'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${activeTab === 'timings' ? 'text-white' : 'text-slate-500'}`} />
              Shift Timings & Grace
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weekly_off')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'weekly_off'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${activeTab === 'weekly_off' ? 'text-white' : 'text-slate-500'}`} />
              Weekly Off Rules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaves')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'leaves'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'leaves' ? 'text-white' : 'text-slate-500'}`} />
              Leave Policy Defaults
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('holidays')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'holidays'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${activeTab === 'holidays' ? 'text-white' : 'text-slate-500'}`} />
              Official Holidays
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('punch_security')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'punch_security'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Lock className={`w-3.5 h-3.5 ${activeTab === 'punch_security' ? 'text-amber-400' : 'text-slate-500'}`} />
              Punch Security & Rules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cleanup')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'cleanup'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <HardDrive className={`w-3.5 h-3.5 ${activeTab === 'cleanup' ? 'text-white' : 'text-slate-500'}`} />
              Storage & Selfie Cleanup
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('salary_rules')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'salary_rules'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Receipt className={`w-3.5 h-3.5 ${activeTab === 'salary_rules' ? 'text-white' : 'text-amber-500'}`} />
              Salary Deductions & Penalties
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overtime')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'overtime'
                  ? 'bg-[#0f4ca5] text-white border-transparent shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${activeTab === 'overtime' ? 'text-white' : 'text-amber-500'}`} />
              Overtime Policy & Charges
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60 hover:border-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              All Hub Sections
            </button>
          </div>
        </div>

        {/* KPI Policy Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Daily Target"
            value={`${form.standard_hours_per_day}h / day`}
            icon={<Clock className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="Standard shift requirement"
          />
          <CustomKpiCard
            title="Work Schedule"
            value={`${form.work_days.length} Days`}
            icon={<Building2 className="w-5 h-5 text-white" />}
            glowColor="blue"
            subtitle="Weekly active workdays"
          />
          <CustomKpiCard
            title="Weekly Capacity"
            value={`${weeklyHours}h / week`}
            icon={<Calendar className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Total expected hours"
          />
          <CustomKpiCard
            title="Grace Window"
            value={`${form.late_mark_grace_minutes} mins`}
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="Before late penalty mark"
          />
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Configuration Column (8 cols, or 12 cols when salary_rules tab is active) */}
          <div className={`${activeTab === 'salary_rules' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
            {/* TAB: Branches & Geofence */}
            {(activeTab === 'branches' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Branches & Office Geofence Radius
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Define hotel site GPS coordinates, operational boundaries, and punch verification fence
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/setup/profile')}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>Full Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Staff punching in with <strong>At Office Punch (Geofence + Camera)</strong> mode must be within the geofence radius configured below. Approved WFH staff automatically bypass this fence.
                  </p>
                </div>

                <BusinessLocationsSection />
              </div>
            )}

            {/* TAB: Punch Security & Rules */}
            {(activeTab === 'punch_security' || activeTab === 'all') && (
              <div className="space-y-6">
                {/* Card 1: Staff Punch Modes & Verification Rules */}
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Staff Punch Modes & Verification Rules
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Choose which punch options are available on the staff web portal and mobile app
                        </p>
                      </div>
                    </div>

                    {/* Preset action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applyPunchPreset('office_wfh')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:border-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        Office & WFH Only (Camera Required)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPunchPreset('all')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:border-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Enable All Modes
                      </button>
                    </div>
                  </div>

                  {/* 5 Punch Mode Toggles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. At Office Punch */}
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            At Office Punch (Geofence + Camera)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Staff must be within office GPS geofence radius to punch at office
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, punch_mode_office: !p.punch_mode_office }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.punch_mode_office ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.punch_mode_office ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 2. Work From Home (WFH) Punch */}
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Work From Home (WFH) Punch
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Permits remote and home staff to punch with GPS location geotag
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, punch_mode_wfh: !p.punch_mode_wfh }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.punch_mode_wfh ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.punch_mode_wfh ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 3. Quick GPS Punch */}
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Quick GPS Punch (No Camera / 1-Tap)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Allows staff to punch with GPS only without camera selfie. Toggle OFF to force selfie verification.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, punch_mode_quick_gps: !p.punch_mode_quick_gps }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.punch_mode_quick_gps ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.punch_mode_quick_gps ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 4. Camera Selfie Verification */}
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Camera Selfie Verification
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Requires front-facing photo verification on all clock in and clock out punches
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, punch_mode_selfie_required: !p.punch_mode_selfie_required }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.punch_mode_selfie_required ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.punch_mode_selfie_required ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* 5. On-Duty / Field Visit Punch */}
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-850/50 flex items-start justify-between gap-3 md:col-span-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            On-Duty / Field Visit Punch
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Permits field staff, client meetings, and vendor visits with short meeting note
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, punch_mode_on_duty: !p.punch_mode_on_duty }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.punch_mode_on_duty ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.punch_mode_on_duty ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card 2: FORGOT CHECK-OUT AUTOMATED FALLBACK POLICY */}
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>FORGOT CHECK-OUT AUTOMATED FALLBACK POLICY</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      When staff punch in but forget to punch out at the end of the day, how should the payroll engine calculate their hours?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {/* Option 1: Auto-Close Shift (Full Credit) */}
                    <div
                      onClick={() => setForm(p => ({ ...p, forgot_checkout_policy: 'auto_full' }))}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        form.forgot_checkout_policy === 'auto_full'
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            Auto-Close Shift (Full Credit)
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Assumes standard full shift hours (e.g. 8h). Friendly & friction-free.
                        </p>
                      </div>
                      {form.forgot_checkout_policy === 'auto_full' && (
                        <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          ✓ Currently Active
                        </span>
                      )}
                    </div>

                    {/* Option 2: Cap at Half-Day (4h Credit) */}
                    <div
                      onClick={() => setForm(p => ({ ...p, forgot_checkout_policy: 'half_day' }))}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        form.forgot_checkout_policy === 'half_day'
                          ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm ring-1 ring-blue-500/20'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            Cap at Half-Day (4h Credit)
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
                            STRICT
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Credits 50% of shift hours until regularized or corrected by HR.
                        </p>
                      </div>
                      {form.forgot_checkout_policy === 'half_day' && (
                        <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          ✓ Currently Active
                        </span>
                      )}
                    </div>

                    {/* Option 3: Flag Incomplete (0h Credit) */}
                    <div
                      onClick={() => setForm(p => ({ ...p, forgot_checkout_policy: 'incomplete' }))}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        form.forgot_checkout_policy === 'incomplete'
                          ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm ring-1 ring-rose-500/20'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 hover:border-slate-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            Flag Incomplete (0h Credit)
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shrink-0">
                            AUDIT ONLY
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Marks punch as Incomplete; requires manual HR regularization.
                        </p>
                      </div>
                      {form.forgot_checkout_policy === 'incomplete' && (
                        <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          ✓ Currently Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card 3: FORGOT CHECK-OUT 7 PM ALERT & OUT-OF-GEOFENCE REGULARIZATION */}
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Forgot Check-Out Alert & Out-of-Geofence Request
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Alert staff past 7:00 PM if they forgot to punch out, and provide an out-of-geofence request option
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {form.enable_forgot_checkout_alert ? 'Alert Active' : 'Alert Disabled'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, enable_forgot_checkout_alert: !p.enable_forgot_checkout_alert }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.enable_forgot_checkout_alert ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.enable_forgot_checkout_alert ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Evening Alert Time *
                      </label>
                      <Input
                        type="time"
                        value={form.forgot_checkout_alert_time}
                        onChange={e => setForm(p => ({ ...p, forgot_checkout_alert_time: e.target.value }))}
                        className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Default: 19:00 (7:00 PM). Triggers reminder prompt on staff portal.
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Out-of-Geofence Request Workflow
                      </span>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                        If an employee has already left the office radius when alerted, they can immediately submit an Out-of-Geofence punch-out request with their departure time. Admin approval restores full shift credit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Shift Timing & Grace */}
            {(activeTab === 'timings' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Shift Timing & Standard Duration
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Global operating hours applied across employee attendance and check-in verifications
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                    Shift Policy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Work Start Time *
                    </label>
                    <Input
                      type="time"
                      value={form.work_start_time}
                      onChange={e => setForm(p => ({ ...p, work_start_time: e.target.value }))}
                      className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Expected morning arrival time</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Work End Time *
                    </label>
                    <Input
                      type="time"
                      value={form.work_end_time}
                      onChange={e => setForm(p => ({ ...p, work_end_time: e.target.value }))}
                      className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Expected evening departure time</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Standard Hours / Day *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      step={0.5}
                      value={form.standard_hours_per_day}
                      onChange={e => setForm(p => ({ ...p, standard_hours_per_day: parseFloat(e.target.value) || 0 }))}
                      className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Target net working hours per day</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Lunch Break (Minutes) *
                      </label>
                      <div className="flex gap-1">
                        {[0, 30, 45, 60].map(mins => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, default_lunch_minutes: mins }))}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                              form.default_lunch_minutes === mins
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      max={180}
                      value={form.default_lunch_minutes}
                      onChange={e => setForm(p => ({ ...p, default_lunch_minutes: parseInt(e.target.value) || 0 }))}
                      className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Deducted from office presence for exact hours</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Late Mark Grace (Minutes) *
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={120}
                      value={form.late_mark_grace_minutes}
                      onChange={e => setForm(p => ({ ...p, late_mark_grace_minutes: parseInt(e.target.value) || 0 }))}
                      className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 h-10"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">Grace window before late mark triggers</span>
                  </div>
                </div>

                {/* Real-time hours calculation feedback banner */}
                <div className="p-3.5 rounded-xl bg-primary-500/[0.06] border border-primary-500/20 flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Gross Office Present Time between <strong>{form.work_start_time}</strong> and <strong>{form.work_end_time}</strong> is{' '}
                    <strong className="text-primary-600 dark:text-primary-400 font-black">{computedHours()} hours</strong>.
                    Minus standard lunch (<strong>{form.default_lunch_minutes}m</strong>) = <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                      {computedHours() !== '—' ? Math.max(0, parseFloat(computedHours()) - form.default_lunch_minutes / 60).toFixed(1) : '—'}h Exact Working Hours
                    </strong> (Target: {form.standard_hours_per_day}h).
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Weekly Schedule */}
            {(activeTab === 'weekly_off' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Weekly Working Days Schedule
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Select official days on which employee duty and attendance is tracked
                      </p>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700/60">
                    <button
                      type="button"
                      onClick={() => applyPreset('5-days')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      Mon - Fri (5D)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('6-days')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      Mon - Sat (6D)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('7-days')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      All 7 Days
                    </button>
                  </div>
                </div>

                {/* Interactive Day Selection Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {ALL_DAYS.map(day => {
                    const active = form.work_days.includes(day.id);
                    const isSun = day.id === 'Sun';

                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          active
                            ? isSun
                              ? 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 ring-1 ring-rose-500/20 shadow-xs'
                              : 'bg-primary-500/10 border-primary-500/40 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500/20 shadow-xs'
                            : 'bg-white dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-600'
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-wider">{day.short}</span>
                        <span className={`text-[10px] font-bold ${active ? 'opacity-90' : 'opacity-50'}`}>
                          {active ? 'Workday' : 'Day Off'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-1">
                  <span>
                    <strong className="text-slate-800 dark:text-slate-200">{form.work_days.length} working days</strong> selected per week.
                  </span>
                  <span>Unselected days and national holidays are automatically marked as off days.</span>
                </div>
              </div>
            )}

            {/* TAB: Overtime Policy & Charges */}
            {(activeTab === 'overtime' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Overtime Policy & Charges
                        <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                          Enterprise
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Configure calculation mode (fixed hourly rate or salary multiplier), minimum buffer, and manager verification
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {form.enable_overtime ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, enable_overtime: !p.enable_overtime }))}
                      className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                        form.enable_overtime ? 'bg-orange-500' : 'bg-slate-200 dark:bg-zinc-700'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        form.enable_overtime ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {form.enable_overtime ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Calculation Mode Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                        Overtime Charge Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setForm(p => ({ ...p, overtime_rate_type: 'fixed_rate' }))}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.overtime_rate_type === 'fixed_rate'
                              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200 shadow-xs'
                              : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">Option 1: Fixed Hourly Rate</span>
                            {form.overtime_rate_type === 'fixed_rate' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Pay staff a fixed hourly rate for each extra hour worked (e.g. ₹100/hr, ₹150/hr).
                          </p>
                        </div>

                        <div
                          onClick={() => setForm(p => ({ ...p, overtime_rate_type: 'multiplier' }))}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.overtime_rate_type === 'multiplier'
                              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200 shadow-xs'
                              : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/40 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">Option 2: Salary Multiplier</span>
                            {form.overtime_rate_type === 'multiplier' && (
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Calculate hourly wage dynamically from base salary with a multiplier (e.g. 1.5x of base hourly wage).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rate / Multiplier Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/50">
                      {form.overtime_rate_type === 'fixed_rate' ? (
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                            Company Overtime Rate (₹ / Hour)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <Input
                              type="number"
                              min="0"
                              step="10"
                              value={form.overtime_hourly_rate}
                              onChange={(e) => setForm(p => ({ ...p, overtime_hourly_rate: parseFloat(e.target.value) || 0 }))}
                              className="pl-8 font-bold text-slate-900 dark:text-white"
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Standard company hourly rate. Can be customized per staff member in Staff Profiles.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                            Overtime Multiplier Factor (e.g. 1.25x, 1.5x, 2.0x)
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0.5"
                              max="5"
                              step="0.25"
                              value={form.overtime_multiplier}
                              onChange={(e) => setForm(p => ({ ...p, overtime_multiplier: parseFloat(e.target.value) || 1.5 }))}
                              className="font-bold text-slate-900 dark:text-white pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">x</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Calculated as: (Daily Salary ÷ Standard Hours) × {form.overtime_multiplier}.
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                          Minimum OT Buffer / Grace (Minutes)
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="180"
                            step="15"
                            value={form.overtime_min_minutes}
                            onChange={(e) => setForm(p => ({ ...p, overtime_min_minutes: parseInt(e.target.value) || 0 }))}
                            className="font-bold text-slate-900 dark:text-white pr-14"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Mins</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Minimum extra minutes after shift end before overtime starts counting (prevents accidental overtime triggers).
                        </p>
                      </div>
                    </div>

                    {/* Manager Approval Rule */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/40 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-900/30">
                      <div className="space-y-0.5 pr-4">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          Require Manager Approval
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                          Overtime hours will be marked as <strong>Pending Verification</strong>. Only approved hours will be credited to monthly payroll.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, overtime_require_approval: !p.overtime_require_approval }))}
                        className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                          form.overtime_require_approval ? 'bg-orange-500' : 'bg-slate-200 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          form.overtime_require_approval ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/50 text-center py-6">
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Overtime calculation is currently turned off. Toggle switch to enable hourly charges or salary multipliers for your team.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Storage & Selfie Cleanup */}
            {(activeTab === 'cleanup' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Storage & Selfie Photo Cleanup Policy
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Manage attendance verification images retention and cloud storage quotas
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 text-xs text-purple-900 dark:text-purple-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Automatic 90-Day Media Retention</span>
                  </div>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                    Attendance selfies are automatically retained for 90 days for audit and dispute verification. Old facial punch photos are archived to optimize database size while maintaining complete punch timestamps and GPS coordinates.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Leave Policy Defaults */}
            {(activeTab === 'leaves' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Leave Policy Defaults & Entitlements
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Monthly employee leave quotas, WFH allowances, and calendar exclusion rules
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setIsLeaveModalOpen(true)}
                      className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Manage Quotas
                    </Button>
                    <button
                      type="button"
                      onClick={() => navigate('/hr/leave-requests')}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-bold ml-2 cursor-pointer"
                    >
                      <span>Staff Requests</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Automated Calendar Off-Day Exclusion Rule</span>
                    <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                      When staff submit leave requests, the attendance engine <strong>automatically excludes Sundays, weekly offs, and company holidays</strong>. Only actual scheduled working days are deducted from employee balances.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {leavePolicies.length > 0 ? (
                    leavePolicies.map((policy) => (
                      <div key={policy.id} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{policy.leave_type} Leave</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            policy.is_paid 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300'
                          }`}>
                            {policy.is_paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">
                          {policy.monthly_quota} <span className="text-xs font-normal text-slate-500">days / mo</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-6 text-center text-xs text-slate-500 dark:text-zinc-400 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                      No custom leave quotas created yet. Click &quot;Manage Quotas&quot; to configure Casual (CL), Sick (SL), and Earned (EL) allowances.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Official Holidays */}
            {(activeTab === 'holidays' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Official Company Holidays
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Designated business off-days and national holidays automatically credited
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/attendance/holidays')}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <span>Full Holiday Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Official holidays are automatically marked on the staff monthly attendance grid with a purple <strong>H</strong> badge and are excluded from required working day quotas.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Current Month Holidays ({currentMonthStr})
                    </h4>
                    <button
                      type="button"
                      onClick={() => navigate('/attendance/holidays')}
                      className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
                    >
                      + Add or Manage Holidays
                    </button>
                  </div>
                  {holidaysList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {holidaysList.map((h) => (
                        <div key={h.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">{h.name}</span>
                            <span className="text-[11px] text-slate-500">{h.date?.split('T')[0]}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            {h.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-xs text-slate-500 dark:text-zinc-400 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                      No holidays scheduled for this month. Use the Holiday Calendar to plan national or optional festival days.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Salary Deductions & Penalties */}
            {(activeTab === 'salary_rules' || activeTab === 'all') && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-black text-lg">
                      $
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        Dynamic Salary Deductions & Attendance Penalty Rules
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        Configure automated salary cut triggers for late punches, voluntary unapproved absences, and short-notice leaves. All rules calculate dynamically in monthly payroll.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      isLoading={saveMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save Penalty Policy
                    </Button>
                  </div>
                </div>

                {/* 3 Penalty Rules Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* RULE 1 • LATE ARRIVALS */}
                  <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-500/[0.02] dark:bg-amber-950/[0.06] flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      {/* Pill & Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                          RULE 1 • LATE ARRIVALS
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, enable_late_deduction: !p.enable_late_deduction }))}
                          className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                            form.enable_late_deduction ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-700'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                            form.enable_late_deduction ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Late Punch Cut Threshold
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Deduct salary when an employee accumulates late punch-ins beyond the shift grace period ({form.late_mark_grace_minutes}m).
                        </p>
                      </div>

                      {/* Field: Monthly Late Waiver */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-rose-500" />
                          <span>Monthly Late Waiver (Free Grace Passes):</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={30}
                            value={form.late_free_waiver_count}
                            onChange={(e) => setForm(p => ({ ...p, late_free_waiver_count: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-20 font-bold text-center bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 h-9"
                          />
                          <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Free Lates / Month</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          First {form.late_free_waiver_count} late punches are excused with zero penalty cut.
                        </p>
                      </div>

                      {/* Field: Every N Late Days Trigger Cut */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Every N Late Days Trigger Cut:
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={30}
                            value={form.late_deduction_trigger_count}
                            onChange={(e) => setForm(p => ({ ...p, late_deduction_trigger_count: Math.max(1, parseInt(e.target.value) || 1) }))}
                            className="w-20 font-bold text-center bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 h-9"
                          />
                          <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Late Punches (e.g. 4)</span>
                        </div>
                      </div>

                      {/* Field: Salary Cut per Threshold */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Salary Cut per Threshold:
                        </label>
                        <select
                          value={form.late_deduction_amount_type}
                          onChange={(e) => setForm(p => ({ ...p, late_deduction_amount_type: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 h-9"
                        >
                          <option value={0.5}>0.5 Day Salary (Half Day)</option>
                          <option value={1.0}>1.0 Day Salary (Full Day)</option>
                          <option value={1.5}>1.5 Days Salary</option>
                          <option value={2.0}>2.0 Days Salary (Two Days)</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Active Rule Box */}
                    <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <div className="leading-relaxed">
                        <strong>Active Rule:</strong> Every {form.late_deduction_trigger_count} late days = {form.late_deduction_amount_type} day salary cut. {form.late_deduction_trigger_count * 2} lates will cut {form.late_deduction_amount_type * 2} days.
                      </div>
                    </div>
                  </div>

                  {/* RULE 2 • UNAPPROVED ABSENCE */}
                  <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-500/[0.02] dark:bg-rose-950/[0.06] flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      {/* Pill & Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
                          RULE 2 • UNAPPROVED ABSENCE
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, enable_absence_penalty: !p.enable_absence_penalty }))}
                          className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                            form.enable_absence_penalty ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-700'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                            form.enable_absence_penalty ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Voluntary Absence Penalty
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Penalty multiplier applied when an employee takes voluntary leave without prior approved leave in the system.
                        </p>
                      </div>

                      {/* Field: Salary Cut Multiplier */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Salary Cut Multiplier per Absent Day:
                        </label>
                        <select
                          value={form.absence_penalty_multiplier}
                          onChange={(e) => setForm(p => ({ ...p, absence_penalty_multiplier: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 h-9"
                        >
                          <option value={1.0}>1.0 Day Salary (Standard 1:1 Cut)</option>
                          <option value={1.5}>1.5 Days Salary</option>
                          <option value={2.0}>2.0 Days Salary (Double Penalty)</option>
                          <option value={2.5}>2.5 Days Salary</option>
                          <option value={3.0}>3.0 Days Salary (Triple Penalty)</option>
                        </select>
                      </div>
                    </div>

                    {/* Bottom Active Rule Box */}
                    <div className="p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                      <span className="text-sm">🚨</span>
                      <div className="leading-relaxed">
                        <strong>Active Rule:</strong> Each unauthorized absent day deducts {form.absence_penalty_multiplier} days from final salary.
                      </div>
                    </div>
                  </div>

                  {/* RULE 3 • ADVANCE NOTICE */}
                  <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-500/[0.02] dark:bg-blue-950/[0.06] flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      {/* Pill & Toggle */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                          RULE 3 • ADVANCE NOTICE
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, enable_leave_notice_rule: !p.enable_leave_notice_rule }))}
                          className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                            form.enable_leave_notice_rule ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-700'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                            form.enable_leave_notice_rule ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Leave Notice Window
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Minimum advance notice required before taking leave. Applications submitted with less notice require Manager/HR discretion.
                        </p>
                      </div>

                      {/* Field: Advance Notice Required */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Advance Notice Required:
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={30}
                            value={form.leave_notice_days_required}
                            onChange={(e) => setForm(p => ({ ...p, leave_notice_days_required: Math.max(0, parseInt(e.target.value) || 0) }))}
                            className="w-20 font-bold text-center bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 h-9"
                          />
                          <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Days in Advance</span>
                        </div>
                      </div>

                      {/* Manager/HR Control callout box */}
                      <div className="p-3 rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                        <Shield className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <strong>Manager/HR Control:</strong> If staff apply &lt; {form.leave_notice_days_required} days in advance, request is flagged as ⚠️ <strong>Short Notice</strong>. Manager chooses to waive or deduct penalty at approval time.
                        </div>
                      </div>
                    </div>

                    {/* Bottom Active Rule Box */}
                    <div className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-sm">📝</span>
                      <div className="leading-relaxed">
                        <strong>Active Rule:</strong> Minimum {form.leave_notice_days_required} days advance notice required for standard paid leave.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Overview Column (4 cols) */}
          {activeTab !== 'salary_rules' && (
            <div className="lg:col-span-4 space-y-6">
            {/* Section 3: Automated Policies */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Automated Attendance Rules
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    System holiday records & auto-attendance
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/50">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Auto-Apply Holidays
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Auto-create holiday records for active staff on calendar holidays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, auto_apply_holidays: !p.auto_apply_holidays }))}
                  className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                    form.auto_apply_holidays ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    form.auto_apply_holidays ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Auto Absent at Half-Time Policy */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-700/50">
                <div className="space-y-0.5 pr-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Auto-Absent at Half-Time
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Auto-mark staff as Absent if they have not checked in by mid-shift (around <strong className="text-rose-600 dark:text-rose-400">{computedHalfTimeCutoff()}</strong>). Excludes Sundays and holidays.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, enable_auto_absent: !p.enable_auto_absent }))}
                  className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${
                    form.enable_auto_absent ? 'bg-rose-500' : 'bg-slate-200 dark:bg-zinc-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    form.enable_auto_absent ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Shift Summary Policy Card */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Policy Live Preview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Calculated schedule rules
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Daily Shift</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {form.work_start_time} — {form.work_end_time}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Daily Target</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {form.standard_hours_per_day} Hours / Day
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Active Workdays</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {form.work_days.length} Days / Week
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Weekly Total</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {weeklyHours} Hours Expected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Standard Lunch</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {form.default_lunch_minutes} Minutes
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Late Grace Window</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {form.late_mark_grace_minutes} Minutes
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Half-Time Cutoff</span>
                  <span className={`font-bold ${form.enable_auto_absent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                    {computedHalfTimeCutoff()} {form.enable_auto_absent ? '(Auto-Absent)' : '(Off)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">Forgot Check-Out</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {form.forgot_checkout_policy === 'half_day' ? 'Cap at Half-Day (4h)' : form.forgot_checkout_policy === 'auto_full' ? 'Auto-Close (Full)' : 'Flag Incomplete'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="text-slate-500 font-medium">7 PM Alert Status</span>
                  <span className={`font-bold ${form.enable_forgot_checkout_alert ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                    {form.enable_forgot_checkout_alert ? `Active (${form.forgot_checkout_alert_time})` : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Quick Save in Sidebar */}
              <Button
                variant="brand"
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                isLoading={saveMutation.isPending}
                className="w-full h-11 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Work Settings
              </Button>
            </div>
          </div>
          )}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>You have unsaved changes in your work configuration.</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All work settings are synchronized with the database.</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="cursor-pointer"
              >
                Reset
              </Button>
            )}
            <Button
              variant="brand"
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              isLoading={saveMutation.isPending}
              className="px-6 font-bold cursor-pointer"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Work Settings
            </Button>
          </div>
        </div>
      </div>

      <LeavePoliciesModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />
    </div>
  );
}

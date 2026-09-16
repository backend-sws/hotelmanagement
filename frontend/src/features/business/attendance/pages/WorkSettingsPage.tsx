import React, { useState, useEffect, useMemo } from 'react';
import { useWorkSettings, useSaveWorkSettings } from '../api/useAttendance';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import {
  Settings2, Clock, Save, RefreshCw, Building2, CheckCircle2,
  Calendar, ShieldCheck, Sparkles, AlertCircle, Info, Undo2,
  Zap, ArrowRight,
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
  const { data: settings, isLoading } = useWorkSettings();
  const saveMutation = useSaveWorkSettings();

  const [form, setForm] = useState({
    work_start_time: '09:00',
    work_end_time: '18:00',
    standard_hours_per_day: 9,
    work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    late_mark_grace_minutes: 15,
    auto_apply_holidays: true,
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
        auto_apply_holidays: settings.auto_apply_holidays ?? true,
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
          {/* Main Configuration Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Working Hours & Shift Timing */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
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
                  <span className="text-[11px] text-slate-500 mt-1 block">Net duty hours required per day (accounting for breaks)</span>
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
                  <span className="text-[11px] text-slate-500 mt-1 block">Check-ins within this window after start time will not trigger late mark</span>
                </div>
              </div>

              {/* Real-time hours calculation feedback banner */}
              <div className="p-3.5 rounded-xl bg-primary-500/[0.06] border border-primary-500/20 flex items-start gap-3">
                <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Calculated duration between <strong>{form.work_start_time}</strong> and <strong>{form.work_end_time}</strong> is{' '}
                  <strong className="text-primary-600 dark:text-primary-400 font-black">{computedHours()} hours</strong>.
                  Standard working target is configured to <strong className="text-primary-600 dark:text-primary-400 font-black">{form.standard_hours_per_day}h</strong>.
                </div>
              </div>
            </div>

            {/* Section 2: Weekly Schedule */}
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
          </div>

          {/* Sidebar / Overview Column (4 cols) */}
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
                  <span className="text-slate-500 font-medium">Late Grace Window</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {form.late_mark_grace_minutes} Minutes
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
    </div>
  );
}

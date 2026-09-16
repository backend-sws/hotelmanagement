import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateStaff, useUpdateStaff } from '../api/useStaff';
import { useGetPayrollComponents } from '../../payroll/api/usePayrollComponents';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { formatCurrency } from '@/lib/formatters';

import { staffSchema, type StaffFormData } from '../schemas/staffSchema';
import { ALL_STAFF_PERMISSIONS, ROLE_PRESETS } from './PermissionsModal';
import { ShieldCheck, ChevronDown, ChevronUp, CheckSquare, Plus, Trash2, Sparkles, Clock } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const DEFAULT_PAYROLL_COMPONENTS = [
  { id: 1, name: 'Basic Salary', type: 'earning' as const },
  { id: 2, name: 'House Rent Allowance (HRA)', type: 'earning' as const },
  { id: 3, name: 'Special Allowance', type: 'earning' as const },
  { id: 4, name: 'Provident Fund (PF)', type: 'deduction' as const },
  { id: 5, name: 'Employee State Insurance (ESI)', type: 'deduction' as const },
  { id: 6, name: 'Professional Tax (PT)', type: 'deduction' as const },
];

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: any;
}

export const StaffFormModal = ({ isOpen, onClose, staff }: StaffFormModalProps) => {
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const { data: availableComponents, isLoading: isComponentsLoading } = useGetPayrollComponents();

  const activeComponents = useMemo(() => {
    if (availableComponents && availableComponents.length > 0) {
      return availableComponents;
    }
    return DEFAULT_PAYROLL_COMPONENTS;
  }, [availableComponents]);

  const isEditing = !!staff;
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string>('front_desk');
  const [useCustomTimings, setUseCustomTimings] = useState<boolean>(false);

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: 'staff',
      department: '',
      salary_type: 'monthly',
      monthly_salary: 0,
      daily_salary: 0,
      commission_rate: 0,
      status: 'active',
      join_date: new Date().toISOString().split('T')[0],
      salary_components: [],
      permissions: [],
      custom_work_start_time: '',
      custom_work_end_time: '',
      custom_standard_hours: null,
    }
  });

  const watchedSalaryType = watch('salary_type');

  const { fields, append, remove } = useFieldArray({
    control,
    name: "salary_components",
  });

  const handleAddEarning = (customName = '') => {
    append({
      name: customName || '',
      type: 'earning',
      amount: 0,
    });
  };

  const handleAddDeduction = (customName = '') => {
    append({
      name: customName || '',
      type: 'deduction',
      amount: 0,
    });
  };

  const watchedComponents = useWatch({
    control,
    name: 'salary_components'
  }) || [];
  
  const { calculatedSalary, totalEarnings, totalDeductions } = useMemo(() => {
    let earnings = 0;
    let deductions = 0;
    
    if (Array.isArray(watchedComponents)) {
      watchedComponents.forEach((c: any) => {
         const amt = Number(c.amount) || 0;
         if (c.type === 'earning') earnings += amt;
         if (c.type === 'deduction') deductions += amt;
      });
    }
    return {
      calculatedSalary: Number((earnings - deductions).toFixed(2)),
      totalEarnings: earnings,
      totalDeductions: deductions,
    };
  }, [watchedComponents]);

  useEffect(() => {
    setValue('monthly_salary', calculatedSalary);
  }, [calculatedSalary, setValue]);

  useEffect(() => {
    if (isOpen) {
      let initialComponents: any[] = [];

      if (staff) {
        let staffComps = staff.salary_components;
        if (typeof staffComps === 'string') {
          try { staffComps = JSON.parse(staffComps); } catch(e) { staffComps = null; }
        }

        if (Array.isArray(staffComps) && staffComps.length > 0) {
          // Exactly the components configured for this staff member (can be fewer or more than 6)
          initialComponents = staffComps.map((c: any) => ({
            id: c.id,
            name: c.name || '',
            type: c.type || 'earning',
            amount: Number(c.amount) || 0
          }));
        } else if (staffComps && typeof staffComps === 'object' && !Array.isArray(staffComps)) {
          // legacy object fallback
          if (staffComps.basic) initialComponents.push({ name: 'Basic Salary', type: 'earning', amount: Number(staffComps.basic) || 0 });
          if (staffComps.hra) initialComponents.push({ name: 'House Rent Allowance (HRA)', type: 'earning', amount: Number(staffComps.hra) || 0 });
          if (staffComps.allowances) initialComponents.push({ name: 'Special Allowance', type: 'earning', amount: Number(staffComps.allowances) || 0 });
          if (staffComps.deductions) initialComponents.push({ name: 'Provident Fund (PF)', type: 'deduction', amount: Number(staffComps.deductions) || 0 });
        } else if (staff.monthly_salary) {
          const total = Number(staff.monthly_salary) || 0;
          initialComponents = [
            { name: 'Basic Salary', type: 'earning', amount: Math.round(total * 0.50) },
            { name: 'House Rent Allowance (HRA)', type: 'earning', amount: Math.round(total * 0.25) },
            { name: 'Special Allowance', type: 'earning', amount: Math.round(total * 0.25) },
          ];
        }
      }

      // If still empty (new staff), default to standard components template
      if (initialComponents.length === 0) {
        initialComponents = (activeComponents || DEFAULT_PAYROLL_COMPONENTS).map(comp => ({
          id: comp.id,
          name: comp.name,
          type: comp.type,
          amount: 0
        }));
      }

      const initialPermissions = staff?.permissions && Array.isArray(staff.permissions)
        ? staff.permissions
        : (staff?.role === 'manager' ? ROLE_PRESETS.all.perms : ROLE_PRESETS.front_desk.perms);
      setSelectedPermissions(initialPermissions);

      const hasCustom = !!(staff?.custom_work_start_time || staff?.custom_standard_hours);
      setUseCustomTimings(hasCustom);

      reset({
        name: staff?.name || '',
        phone: staff?.phone || '',
        email: staff?.email || '',
        role: staff?.role || 'staff',
        department: staff?.department || '',
        salary_type: staff?.salary_type || 'monthly',
        monthly_salary: staff ? (Number(staff.monthly_salary) || 0) : 0,
        daily_salary: staff ? (Number(staff.daily_salary) || 0) : 0,
        commission_rate: staff ? (Number(staff.commission_rate) || 0) : 0,
        status: staff?.status || 'active',
        join_date: staff?.join_date || new Date().toISOString().split('T')[0],
        salary_components: initialComponents,
        permissions: initialPermissions,
        custom_work_start_time: staff?.custom_work_start_time || '',
        custom_work_end_time: staff?.custom_work_end_time || '',
        custom_standard_hours: staff?.custom_standard_hours ? Number(staff.custom_standard_hours) : null,
      });
    }
  }, [staff, isOpen, activeComponents, reset]);

  const onSubmit = (data: StaffFormData) => {
    if (data.salary_components) {
      // Clean up empty component rows if any
      data.salary_components = data.salary_components.filter(c => c.name && c.name.trim().length > 0);
    }
    if (data.salary_type === 'monthly') {
      data.monthly_salary = calculatedSalary;
    }
    data.permissions = selectedPermissions;

    if (!useCustomTimings) {
      data.custom_work_start_time = null;
      data.custom_work_end_time = null;
      data.custom_standard_hours = null;
    } else {
      if (data.custom_standard_hours) {
        data.custom_standard_hours = Number(data.custom_standard_hours);
      }
    }
    
    if (isEditing) {
      updateMutation.mutate(
        { id: staff.id, ...data },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(
        data,
        { onSuccess: () => onClose() }
      );
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isComponentsLoading;

  const earnings = fields.map((f, i) => ({...f, index: i})).filter(f => f.type === 'earning');
  const deductions = fields.map((f, i) => ({...f, index: i})).filter(f => f.type === 'deduction');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Staff Member' : 'Add New Staff'}
      maxWidth="5xl"
    >
      {isComponentsLoading ? (
        <div className="py-8 text-center text-slate-500">Loading components...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Full Name</label>
                <InfoTooltip text="Enter the full name of the staff member." />
              </div>
              <Input {...register('name')} placeholder="John Doe" error={errors.name?.message} />
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Phone Number</label>
                <InfoTooltip text="10-digit mobile number, used for login credentials." />
              </div>
              <Input {...register('phone')} placeholder="10 digit number" error={errors.phone?.message} />
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Email (Optional)</label>
                <InfoTooltip text="Optional email address for employee communications." />
              </div>
              <Input {...register('email')} type="email" placeholder="john@example.com" error={errors.email?.message} />
            </div>

            {!isEditing && (
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium">Password</label>
                  <InfoTooltip text="Custom login password. Defaults to phone number if left empty." />
                </div>
                <Input {...register('password')} type="password" placeholder="Defaults to phone number" />
                <p className="text-xs text-slate-500 mt-1">Leave blank to use phone number as password</p>
              </div>
            )}

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Role</label>
                <InfoTooltip text="Choose Manager for full administrative rights, or Staff for POS/Sales only." />
              </div>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect 
                      value={field.value} 
                      onChange={field.onChange}
                      menuPosition="fixed"
                      options={[
                        { value: 'staff', label: 'Staff (Sales)' },
                        { value: 'manager', label: 'Manager' }
                      ]}
                    />
                  )}
                />
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Department</label>
                <InfoTooltip text="Assign employee to a hotel department (e.g. Front Office, Housekeeping, Kitchen)." />
              </div>
              <Input
                {...register('department')}
                list="hotel-departments-list"
                placeholder="e.g. Front Desk, Housekeeping, Kitchen"
                error={errors.department?.message}
              />
              <datalist id="hotel-departments-list">
                <option value="Front Office / Reception" />
                <option value="Housekeeping" />
                <option value="Food & Beverage (F&B)" />
                <option value="Kitchen / Culinary" />
                <option value="Hotel Operations" />
                <option value="Accounts & Finance" />
                <option value="Maintenance & Engineering" />
                <option value="Security" />
                <option value="Human Resources (HR)" />
                <option value="Sales & Marketing" />
                <option value="Management" />
              </datalist>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Sales Commission (%)</label>
                <InfoTooltip text="Commission rate percentage earned on successful billing transactions." />
              </div>
              <Input {...register('commission_rate', { valueAsNumber: true })} type="number" step="0.01" error={errors.commission_rate?.message} />
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Join Date</label>
                <InfoTooltip text="Official date the employee started working at this business." />
              </div>
              <Controller
                name="join_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value || ''}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
              {errors.join_date && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  {errors.join_date.message}
                </p>
              )}
            </div>


            {isEditing && (
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium">Status</label>
                  <InfoTooltip text="Toggle employee status. Inactive staff members cannot log in." />
                </div>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect 
                        value={field.value} 
                        onChange={field.onChange}
                        menuPosition="fixed"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' }
                        ]}
                      />
                    )}
                  />
              </div>
            )}
          </div>

          {/* Work Timings & Daily Hours Section */}
          <div className="border-t border-slate-200 dark:border-white/10 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-500" />
                  Work Timings & Target Hours (स्टाफ शिफ्ट व वर्किंग आवर्स)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure individual staff shift timings for accurate late-mark & efficiency tracking.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Custom Timings:</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !useCustomTimings;
                    setUseCustomTimings(next);
                    if (!next) {
                      setValue('custom_work_start_time', null);
                      setValue('custom_work_end_time', null);
                      setValue('custom_standard_hours', null);
                    } else {
                      setValue('custom_work_start_time', '09:30');
                      setValue('custom_work_end_time', '18:30');
                      setValue('custom_standard_hours', 8);
                    }
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    useCustomTimings ? 'bg-primary-600' : 'bg-slate-200 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      useCustomTimings ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {!useCustomTimings ? (
              <div className="p-3 bg-slate-50 dark:bg-zinc-900/40 rounded-xl border border-slate-200/80 dark:border-white/5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <InfoTooltip text="Using business default work settings" />
                <span>Using <strong>Company Default Work Settings</strong> (Standard 8.0 hrs/day, 09:00 AM - 06:00 PM).</span>
              </div>
            ) : (
              <div className="p-4 bg-primary-500/5 rounded-2xl border border-primary-500/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Work Start Time
                    </label>
                    <Input
                      type="time"
                      {...register('custom_work_start_time')}
                      placeholder="09:30"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Arrival time (for late marks)</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Work End Time
                    </label>
                    <Input
                      type="time"
                      {...register('custom_work_end_time')}
                      placeholder="18:30"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Departure time</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Standard Daily Hours
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      max="24"
                      {...register('custom_standard_hours', { valueAsNumber: true })}
                      placeholder="e.g. 8 or 4 or 12"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Target hrs/day (e.g. 4h, 8h, 12h)</p>
                  </div>
                </div>
                <div className="text-[11px] text-primary-700 dark:text-primary-300 font-medium bg-primary-500/10 p-2.5 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Monthly Target = <code>(Working Days × {watch('custom_standard_hours') || 8}h)</code>. Monthly Efficiency % = <code>(Actual Hours Worked / Target Hours) × 100</code>.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Access Permissions & Role Presets */}
          <div className="border-t border-slate-200 dark:border-white/10 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Module Access & Permissions ({selectedPermissions.length} selected)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Select a pre-configured role template or customize module permissions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showPermissions ? 'Hide List' : 'Customize All'}
                {showPermissions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActivePreset(key);
                    setSelectedPermissions(preset.perms);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    activePreset === key
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Expandable detailed permissions */}
            {showPermissions && (
              <div className="mt-2 p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2 max-h-56 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ALL_STAFF_PERMISSIONS.map(perm => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <div 
                        key={perm.id} 
                        onClick={() => {
                          setActivePreset('custom');
                          if (isChecked) {
                            setSelectedPermissions((prev: string[]) => prev.filter((p: string) => p !== perm.id));
                          } else {
                            setSelectedPermissions((prev: string[]) => [...prev, perm.id]);
                          }
                        }}
                        className={`p-2 border rounded-xl cursor-pointer flex items-center justify-between select-none transition-all ${
                          isChecked
                            ? 'border-indigo-500/80 bg-indigo-50/40 dark:bg-indigo-950/20'
                            : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0f]'
                        }`}
                      >
                        <div className="pr-2 space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{perm.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{perm.description}</span>
                        </div>
                        <div className="shrink-0" onClick={e => e.stopPropagation()}>
                          <Toggle
                            checked={isChecked}
                            onChange={checked => {
                              setActivePreset('custom');
                              if (checked) {
                                setSelectedPermissions((prev: string[]) => [...prev, perm.id]);
                              } else {
                                setSelectedPermissions((prev: string[]) => prev.filter((p: string) => p !== perm.id));
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Salary Type Toggle + Salary Input */}
          <div className="border-t border-slate-200 dark:border-white/10 pt-5 space-y-4">
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium">Salary Type</label>
                <InfoTooltip text="Monthly: Fixed monthly salary. Per Day: Staff gets paid per working day." />
              </div>
              <Controller
                name="salary_type"
                control={control}
                render={({ field }) => (
                  <div className="flex rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden w-fit">
                    <button
                      type="button"
                      onClick={() => field.onChange('monthly')}
                      className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        field.value === 'monthly'
                          ? 'bg-primary-500 text-white shadow-inner'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      Monthly Salary
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('daily')}
                      className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        field.value === 'daily'
                          ? 'bg-primary-500 text-white shadow-inner'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      Per Day
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Daily Salary Input — directly below toggle */}
            {watchedSalaryType === 'daily' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <label className="block text-sm font-medium">Daily Rate (₹)</label>
                    <InfoTooltip text="Per day salary amount. Staff will be paid this rate for each day they are present." />
                  </div>
                  <Input {...register('daily_salary', { valueAsNumber: true })} type="number" step="0.01" placeholder="e.g. 500" error={errors.daily_salary?.message} />
                  <p className="text-xs text-slate-500 mt-1">Staff will only be paid for days marked as Present or Half Day</p>
                </div>
              </div>
            )}
          </div>

          {watchedSalaryType === 'monthly' && (
          <div className="border-t border-slate-200 dark:border-white/10 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Salary Breakdown & Compensation Structure
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Add, remove, or customize component names and amounts according to employee terms
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings Column */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/80 dark:border-emerald-900/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/50 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h4 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
                        Earnings (Gross)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(totalEarnings)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddEarning('')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-lg bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                        title="Add a new earning component"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {earnings.length > 0 ? (
                    <div className="space-y-2">
                      {earnings.map((field) => (
                        <div 
                          key={field.id} 
                          className="group p-2 bg-white dark:bg-[#0c0c0f] rounded-xl border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all shadow-xs flex items-center gap-2"
                        >
                          {/* Component Name Input */}
                          <div className="flex-1 min-w-0">
                            <input
                              {...register(`salary_components.${field.index}.name`)}
                              list="earning-suggestions"
                              placeholder="Earning Name (e.g. Basic Salary)"
                              className="w-full h-8 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-zinc-900 border border-transparent focus:border-slate-300 dark:focus:border-white/20 focus:outline-hidden placeholder:text-slate-400 transition-colors"
                            />
                          </div>

                          {/* Amount Input */}
                          <div className="w-24 sm:w-28 shrink-0 relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input
                              {...register(`salary_components.${field.index}.amount`, { valueAsNumber: true })}
                              type="number"
                              step="0.01"
                              placeholder="0"
                              className="w-full h-8 pl-6 pr-2 text-xs font-black text-right text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 rounded-lg focus:border-emerald-500 focus:outline-hidden"
                            />
                          </div>

                          {/* Delete Component Button */}
                          <button
                            type="button"
                            onClick={() => remove(field.index)}
                            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Remove this component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-emerald-200/80 dark:border-emerald-900/40 rounded-xl bg-white/40 dark:bg-transparent">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                        No earnings components defined.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddEarning('Basic Salary')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 hover:bg-emerald-200/60 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Basic Salary
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Add Suggestions footer */}
                <div className="mt-3 pt-2 border-t border-emerald-200/40 dark:border-emerald-900/30 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Suggestions:</span>
                  {['Basic Salary', 'HRA', 'Conveyance', 'Medical', 'Bonus'].map(sugg => {
                    const label = sugg === 'HRA' ? 'House Rent Allowance (HRA)' : sugg;
                    const exists = earnings.some(e => e.name?.toLowerCase().includes(sugg.toLowerCase()));
                    if (exists) return null;
                    return (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleAddEarning(label)}
                        className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white dark:bg-zinc-900 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 cursor-pointer"
                      >
                        +{sugg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deductions Column */}
              <div className="bg-rose-50/50 dark:bg-rose-950/10 p-4 rounded-2xl border border-rose-100/80 dark:border-rose-900/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200/50 dark:border-rose-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <h4 className="text-[11px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest whitespace-nowrap">
                        Statutory & Other Deductions
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                        -{formatCurrency(totalDeductions)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddDeduction('')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-lg bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
                        title="Add a new deduction component"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {deductions.length > 0 ? (
                    <div className="space-y-2">
                      {deductions.map((field) => (
                        <div 
                          key={field.id} 
                          className="group p-2 bg-white dark:bg-[#0c0c0f] rounded-xl border border-slate-200/80 dark:border-white/10 hover:border-rose-500/50 dark:hover:border-rose-500/40 transition-all shadow-xs flex items-center gap-2"
                        >
                          {/* Component Name Input */}
                          <div className="flex-1 min-w-0">
                            <input
                              {...register(`salary_components.${field.index}.name`)}
                              list="deduction-suggestions"
                              placeholder="Deduction Name (e.g. PF, TDS)"
                              className="w-full h-8 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-zinc-900 border border-transparent focus:border-slate-300 dark:focus:border-white/20 focus:outline-hidden placeholder:text-slate-400 transition-colors"
                            />
                          </div>

                          {/* Amount Input */}
                          <div className="w-24 sm:w-28 shrink-0 relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                            <input
                              {...register(`salary_components.${field.index}.amount`, { valueAsNumber: true })}
                              type="number"
                              step="0.01"
                              placeholder="0"
                              className="w-full h-8 pl-6 pr-2 text-xs font-black text-right text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 rounded-lg focus:border-rose-500 focus:outline-hidden"
                            />
                          </div>

                          {/* Delete Component Button */}
                          <button
                            type="button"
                            onClick={() => remove(field.index)}
                            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Remove this component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-rose-200/80 dark:border-rose-900/40 rounded-xl bg-white/40 dark:bg-transparent">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                        No deductions applicable (100% In-Hand Salary).
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddDeduction('Provident Fund (PF)')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/40 hover:bg-rose-200/60 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Deduction Component
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Add Suggestions footer */}
                <div className="mt-3 pt-2 border-t border-rose-200/40 dark:border-rose-900/30 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Suggestions:</span>
                  {['PF', 'ESI', 'PT', 'TDS', 'Loan / Advance'].map(sugg => {
                    const label = sugg === 'PF' ? 'Provident Fund (PF)' : sugg === 'ESI' ? 'Employee State Insurance (ESI)' : sugg === 'PT' ? 'Professional Tax (PT)' : sugg;
                    const exists = deductions.some(d => d.name?.toLowerCase().includes(sugg.toLowerCase()));
                    if (exists) return null;
                    return (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleAddDeduction(label)}
                        className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white dark:bg-zinc-900 border border-rose-200/80 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100/50 cursor-pointer"
                      >
                        +{sugg}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Datalists for native browser autocomplete suggestions */}
            <datalist id="earning-suggestions">
              <option value="Basic Salary" />
              <option value="House Rent Allowance (HRA)" />
              <option value="Special Allowance" />
              <option value="Conveyance Allowance" />
              <option value="Medical Allowance" />
              <option value="Food / Meal Allowance" />
              <option value="Performance Bonus" />
              <option value="Overtime Allowance" />
              <option value="Telephone & Internet Allowance" />
              <option value="Travel / DA Allowance" />
            </datalist>

            <datalist id="deduction-suggestions">
              <option value="Provident Fund (PF)" />
              <option value="Employee State Insurance (ESI)" />
              <option value="Professional Tax (PT)" />
              <option value="Tax Deducted at Source (TDS)" />
              <option value="Loan / Advance EMI" />
              <option value="Security Deposit" />
              <option value="Late Mark / Attendance Penalty" />
              <option value="Uniform / Equipment Deduction" />
            </datalist>

            {/* Premium Salary Total Card */}
            <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all">
              <div className="flex items-center gap-4 divide-x divide-slate-200 dark:divide-zinc-800">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Gross Earnings</span>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalEarnings)}</p>
                </div>
                <div className="pl-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Deductions</span>
                  <p className="text-sm font-black text-rose-500">{formatCurrency(totalDeductions)}</p>
                </div>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-zinc-800">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center sm:justify-end gap-1">
                  Net In-Hand Monthly Salary
                  <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                    AUTO
                  </span>
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  {formatCurrency(calculatedSalary || 0)}
                </span>
              </div>
            </div>
          </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 text-xs font-black uppercase tracking-widest bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-350 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 text-xs font-black uppercase tracking-widest bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};


import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema } from '../schemas/planSchema';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCreatePlan, useUpdatePlan } from '../api/usePlans';
import type { Plan, PlanFormValues } from '../api/usePlans';
import { DynamicForm } from '@/components/ui/dynamic-form';
import { getPlanFormConfig } from '../constants/planForm';

export const PREMIUM_FEATURES = [
  { id: 'has_billing', label: 'Core Billing & Sales', description: 'Enable core invoicing, documents, and customer management.' },
  { id: 'has_inventory', label: 'Inventory & Stock', description: 'Enable core items, categories, brands, and stock tracking.' },
  { id: 'has_pos', label: 'Point of Sale (Retail)', description: 'Enable retail POS billing system.' },
  { id: 'has_expenses', label: 'Expenses', description: 'Track business expenses and analytics.' },
  { id: 'has_purchase_bills', label: 'Purchase Bills & ITC', description: 'Manage supplier purchase bills and GST Input Tax Credit.' },
  { id: 'has_khata_ledger', label: 'Khata / Ledger', description: 'Customer/Supplier Khata books and outstanding tracking.' },
  { id: 'has_cashbook', label: 'Cash & Bank Book', description: 'Cash/Bank entries, Day Book, and bank account management.' },
  { id: 'has_cheques', label: 'Cheque Register', description: 'Track issued/received cheques with status management.' },
  { id: 'has_stock_transfer', label: 'Multi-Godown Stock', description: 'Inter-godown stock transfers and location-wise stock.' },
  { id: 'has_projects', label: 'Projects, BOQ & Labour', description: 'Site projects, BOQ estimates, material consumption, and labour payments.' },
  { id: 'has_gst_reports', label: 'GST Reports', description: 'GSTR-1, GSTR-3B, and HSN summary reports.' },
  { id: 'has_financial_reports', label: 'Financial Reports', description: 'Profit & Loss, Balance Sheet, and Sales Analysis reports.' },
  { id: 'has_payroll', label: 'HR & Payroll', description: 'Enable staff attendance, advance salary, and commission tracking.' },
  { id: 'has_finance', label: 'EMI & Finance', description: 'Enable EMI tracking and finance ledgers.' },
  { id: 'can_whitelabel_invoice', label: 'Invoice Customization', description: 'Allow custom letterheads and remove CRM watermark.' },
  { id: 'has_activity_logs', label: 'Activity Logs', description: 'Detailed audit logs for staff actions.' },
];

export const HOTEL_FEATURES = [
  { id: 'has_hotel_dashboard', label: '🏨 Hotel Dashboard', description: 'Live room grid, occupancy %, today\'s arrivals & departures.' },
  { id: 'has_hotel_rooms', label: '🛏️ Room Management', description: 'Room types, pricing, rate plans, seasonal tariffs.' },
  { id: 'has_hotel_reservations', label: '🛎️ Front Desk & Reservations', description: 'Guest check-in/out, booking calendar, guest folio & invoice.' },
  { id: 'has_hotel_pos', label: '🍽️ Hotel POS & Restaurant', description: 'Restaurant billing, room service, KOT, post-to-room charges.' },
  { id: 'has_hotel_housekeeping', label: '🧹 Housekeeping', description: 'Room cleaning status tracker, task assignment, issue reporting.' },
  { id: 'has_hotel_shift_roster', label: '👷 Staff Shift Roster', description: 'Weekly/monthly drag-drop roster, shift swap workflow.' },
  { id: 'has_hotel_night_audit', label: '🌙 Night Audit', description: 'Daily EOD process, auto room charge posting, day summary report.' },
  { id: 'has_hotel_ota', label: '📡 OTA Integration', description: 'MakeMyTrip, Booking.com, Goibibo webhook booking sync & rate push.' },
  { id: 'has_hotel_gst_compliance', label: '🧾 Hotel GST Compliance', description: 'Auto GST slab (0/12/18%), SAC codes, GSTR-1 for hotels.' },
  { id: 'has_hotel_reports', label: '📊 Revenue Reports', description: 'Occupancy %, RevPAR, ARR/ADR, channel-wise revenue analytics.' },
  { id: 'has_hotel_corporate', label: '🏢 Corporate & City Ledger', description: 'Corporate account billing, monthly consolidated invoices.' },
];




interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToEdit?: Plan | null;
}

export function PlanFormModal({ isOpen, onClose, planToEdit }: PlanFormModalProps) {

  const form = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      price_monthly: 0,
      price_yearly: 0,
      features: {
        max_locations: 1,
        max_staff: 1,
        attendance_photo_retention_days: 0,
        has_expenses: false,
        has_purchase_bills: false,
        has_khata_ledger: false,
        has_cashbook: false,
        has_cheques: false,
        has_stock_transfer: false,
        has_projects: false,
        has_gst_reports: false,
        has_financial_reports: false,
        has_payroll: false,
        has_finance: false,
        can_whitelabel_invoice: false,
        has_activity_logs: false,
        // Hotel modules
        has_hotel_dashboard: false,
        has_hotel_rooms: false,
        has_hotel_reservations: false,
        has_hotel_pos: false,
        has_hotel_housekeeping: false,
        has_hotel_shift_roster: false,
        has_hotel_night_audit: false,
        has_hotel_ota: false,
        has_hotel_gst_compliance: false,
        has_hotel_reports: false,
        has_hotel_corporate: false,
      } as any,
      is_active: true
    }
  });

  const { reset, formState: { isSubmitting } } = form;

  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();

  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        description: planToEdit.description || '',
        price_monthly: planToEdit.price_monthly,
        price_yearly: planToEdit.price_yearly,
        is_active: planToEdit.is_active,
        features: {
          max_locations: planToEdit.features?.max_locations || 1,
          max_staff: planToEdit.features?.max_staff || 1,
          attendance_photo_retention_days: planToEdit.features?.attendance_photo_retention_days || 0,
          has_billing: planToEdit.features?.has_billing ?? true,
          has_inventory: planToEdit.features?.has_inventory ?? true,
          has_pos: planToEdit.features?.has_pos ?? true,
          has_expenses: !!planToEdit.features?.has_expenses,
          has_purchase_bills: !!planToEdit.features?.has_purchase_bills,
          has_khata_ledger: !!planToEdit.features?.has_khata_ledger,
          has_cashbook: !!planToEdit.features?.has_cashbook,
          has_cheques: !!planToEdit.features?.has_cheques,
          has_stock_transfer: !!planToEdit.features?.has_stock_transfer,
          has_projects: !!planToEdit.features?.has_projects,
          has_gst_reports: !!planToEdit.features?.has_gst_reports,
          has_financial_reports: !!planToEdit.features?.has_financial_reports,
          has_payroll: !!planToEdit.features?.has_payroll,
          has_finance: !!planToEdit.features?.has_finance,
          can_whitelabel_invoice: !!planToEdit.features?.can_whitelabel_invoice,
          has_activity_logs: !!planToEdit.features?.has_activity_logs,
          // Hotel modules
          has_hotel_dashboard: !!planToEdit.features?.has_hotel_dashboard,
          has_hotel_rooms: !!planToEdit.features?.has_hotel_rooms,
          has_hotel_reservations: !!planToEdit.features?.has_hotel_reservations,
          has_hotel_pos: !!planToEdit.features?.has_hotel_pos,
          has_hotel_housekeeping: !!planToEdit.features?.has_hotel_housekeeping,
          has_hotel_shift_roster: !!planToEdit.features?.has_hotel_shift_roster,
          has_hotel_night_audit: !!planToEdit.features?.has_hotel_night_audit,
          has_hotel_ota: !!planToEdit.features?.has_hotel_ota,
          has_hotel_gst_compliance: !!planToEdit.features?.has_hotel_gst_compliance,
          has_hotel_reports: !!planToEdit.features?.has_hotel_reports,
          has_hotel_corporate: !!planToEdit.features?.has_hotel_corporate,
        } as any
      });
    } else {
      reset({
        name: '',
        description: '',
        price_monthly: 0,
        price_yearly: 0,
        features: {
          max_locations: 1,
          max_staff: 1,
          attendance_photo_retention_days: 0,
          has_billing: true,
          has_inventory: true,
          has_pos: true,
          has_expenses: false,
          has_purchase_bills: false,
          has_khata_ledger: false,
          has_cashbook: false,
          has_cheques: false,
          has_stock_transfer: false,
          has_projects: false,
          has_gst_reports: false,
          has_financial_reports: false,
          has_payroll: false,
          has_finance: false,
          can_whitelabel_invoice: false,
          has_activity_logs: false,
        },
        is_active: true
      });
    }
  }, [planToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<PlanFormValues> = async (data) => {
    try {
      if (planToEdit) {
        await updateMutation.mutateAsync({ id: planToEdit.id, data });
        toast.success('Plan updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Plan created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={planToEdit ? 'Edit Plan' : 'Create New Plan'}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" type="submit" form="plan-form" disabled={isSubmitting} className="bg-primary-500 hover:bg-primary-600 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {planToEdit ? 'Save Changes' : 'Create Plan'}
          </Button>
        </>
      }
    >
      <DynamicForm 
        id="plan-form"
        form={form}
        onSubmit={onSubmit}
        sections={getPlanFormConfig(() => (
          <div className="space-y-6 w-full pt-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 border-b pb-2">Usage Limits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Max Branches/Locations</label>
                <input 
                  type="number" 
                  className="w-full h-10 px-3 rounded-lg border bg-slate-50 dark:bg-black/20" 
                  {...form.register('features.max_locations', { valueAsNumber: true })} 
                  min={1} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Max Staff Users</label>
                <input 
                  type="number" 
                  className="w-full h-10 px-3 rounded-lg border bg-slate-50 dark:bg-black/20" 
                  {...form.register('features.max_staff', { valueAsNumber: true })} 
                  min={1} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium mb-1">Attendance Photo Retention (Days)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-full h-10 px-3 rounded-lg border bg-slate-50 dark:bg-black/20" 
                    {...form.register('features.attendance_photo_retention_days', { valueAsNumber: true })} 
                    min={0}
                    placeholder="0 = No Retention"
                  />
                  <span className="text-[10px] text-slate-500 w-full">Set 0 to disable storage. (e.g. 60 or 180 days)</span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 border-b pb-2 mt-6">Premium Modules — Billing & CRM</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREMIUM_FEATURES.map(feature => {
                const isSelected = form.watch(`features.${feature.id}` as any);
                return (
                  <div 
                    key={feature.id} 
                    onClick={() => form.setValue(`features.${feature.id}` as any, !isSelected, { shouldDirty: true })}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary-500/10 border-primary-500/50' 
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-400 dark:border-slate-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-200'}`}>
                          {feature.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 border-b border-amber-200 dark:border-amber-800/50 pb-2 mt-8">🏨 Hotel Management Modules</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HOTEL_FEATURES.map(feature => {
                const isSelected = form.watch(`features.${feature.id}` as any);
                return (
                  <div 
                    key={feature.id} 
                    onClick={() => form.setValue(`features.${feature.id}` as any, !isSelected, { shouldDirty: true })}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500/50' 
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-amber-200 dark:hover:border-amber-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-500 border-amber-500' : 'border-slate-400 dark:border-slate-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-bold ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                          {feature.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      />
    </Modal>
  );
}

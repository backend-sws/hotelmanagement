import React, { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { 
  Loader2, 
  UserPlus, 
  Building2, 
  ShieldCheck, 
  Landmark, 
  MapPin, 
  Wallet, 
  Sparkles, 
  CreditCard,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useCreateSupplier } from '../api/useSuppliers';
import { supplierSchema, type SupplierFormValues } from '../schemas/supplierSchema';
import { GST_STATES } from '../../customers/constants/gstStates';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (supplier: any) => void;
}

const TABS = [
  { id: 'basic' as const, label: 'Basic Info', icon: Building2 },
  { id: 'tax' as const, label: 'GST & Tax', icon: ShieldCheck },
  { id: 'bank' as const, label: 'Bank & UPI', icon: Landmark },
  { id: 'other' as const, label: 'Address & Khata', icon: Wallet },
];

export function AddSupplierModal({ isOpen, onClose, onSuccess }: AddSupplierModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'tax' | 'bank' | 'other'>('basic');

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      items_supplied: '',
      address: '',
      gstin: '',
      pan: '',
      state_code: null,
      state_name: null,
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      branch_name: '',
      upi_id: '',
      opening_balance: 0,
      balance_type: 'credit',
    },
  });

  const createSupplier = useCreateSupplier();

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === TABS.length - 1;

  const handleNextTab = async () => {
    if (activeTab === 'basic') {
      const isValid = await trigger('name');
      if (!isValid) return;
    }
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        phone: '',
        email: '',
        items_supplied: '',
        address: '',
        gstin: '',
        pan: '',
        state_code: null,
        state_name: null,
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        branch_name: '',
        upi_id: '',
        opening_balance: 0,
        balance_type: 'credit',
      });
      setActiveTab('basic');
    }
  }, [isOpen, reset]);

  // Handle GSTIN changes with auto-extract for PAN and State
  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setValue('gstin', val);

    // Auto detect State from first 2 digits
    if (val.length >= 2) {
      const code = val.substring(0, 2);
      const foundState = GST_STATES.find((s) => s.code === code);
      if (foundState) {
        setValue('state_code', foundState.code);
        setValue('state_name', foundState.name);
      }
    }

    // Auto extract PAN (characters 3 to 12 in 15-char GSTIN)
    if (val.length >= 12) {
      const extractedPan = val.substring(2, 12);
      setValue('pan', extractedPan);
    }
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('pan', e.target.value.toUpperCase());
  };

  const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('ifsc_code', e.target.value.toUpperCase());
  };

  const onSubmit = async (data: any) => {
    try {
      const newSupplier = await createSupplier.mutateAsync(data);
      toast.success('Supplier added successfully');
      reset();
      onClose();
      if (onSuccess) onSuccess(newSupplier);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add supplier');
    }
  };

  // Keyboard shortcut Ctrl + Enter to submit
  useEffect(() => {
    const handleFormKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleFormKeyDown);
    return () => window.removeEventListener('keydown', handleFormKeyDown);
  }, [isOpen, handleSubmit, onSubmit]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Add New Supplier</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                Vendor Profile, GST, PAN & Bank Khata
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 hidden sm:inline-block">
            Ctrl + Enter to Save
          </span>
        </div>
      }
      maxWidth="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between w-full gap-3">
          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Step {currentTabIndex + 1} of {TABS.length}: {TABS[currentTabIndex].label}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isFirstTab ? (
              <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" onClick={handlePrevTab} type="button" disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
            )}

            {!isLastTab ? (
              <>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Save Now
                </Button>
                <Button
                  type="button"
                  onClick={handleNextTab}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  <span>Next: {TABS[currentTabIndex + 1].label}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Supplier
              </Button>
            )}
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Supplier / Vendor Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder="e.g. Samsung Distributors / Krishna Traders"
                  error={errors.name?.message}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <Input
                  {...register('phone')}
                  placeholder="e.g. +91 9876543210"
                  error={errors.phone?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="vendor@company.com"
                  error={errors.email?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Items / Categories Supplied
                </label>
                <Input
                  {...register('items_supplied')}
                  placeholder="e.g. Beverages, Toiletries, Linen, Food Provisions"
                  error={errors.items_supplied?.message}
                />
                <p className="text-[11px] text-slate-400 mt-1">Short note on items or goods purchased from this vendor.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GST & Tax Details */}
        {activeTab === 'tax' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <p className="text-xs text-violet-700 dark:text-violet-300">
                Entering <strong>GSTIN</strong> automatically identifies the <strong>State (Place of Supply)</strong> and extracts the <strong>PAN Number</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  GSTIN / Tax ID
                </label>
                <Input
                  {...register('gstin')}
                  onChange={handleGstinChange}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  maxLength={15}
                  className="font-mono uppercase"
                  error={errors.gstin?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  PAN Number
                </label>
                <Input
                  {...register('pan')}
                  onChange={handlePanChange}
                  placeholder="e.g. AAAAA0000A"
                  maxLength={10}
                  className="font-mono uppercase"
                  error={errors.pan?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  State / POS (Place of Supply)
                </label>
                <Controller
                  control={control}
                  name="state_code"
                  render={({ field: { value, onChange } }) => (
                    <SearchableSelect
                      options={GST_STATES.map((s) => ({
                        value: s.code,
                        label: `${s.code} - ${s.name}`,
                      }))}
                      value={value || ''}
                      onChange={(val) => {
                        onChange(val === '' ? null : val);
                        const st = GST_STATES.find((s) => s.code === val);
                        setValue('state_name', st ? st.name : null);
                      }}
                      placeholder="Select State / Jurisdiction"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bank & Account Details */}
        {activeTab === 'bank' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5">
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Store bank details & UPI ID for quick vendor NEFT/RTGS transfers and cheque issuing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Bank Name
                </label>
                <Input
                  {...register('bank_name')}
                  placeholder="e.g. HDFC Bank / State Bank of India"
                  error={errors.bank_name?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Number
                </label>
                <Input
                  {...register('account_number')}
                  placeholder="e.g. 50100012345678"
                  className="font-mono"
                  error={errors.account_number?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  IFSC Code
                </label>
                <Input
                  {...register('ifsc_code')}
                  onChange={handleIfscChange}
                  placeholder="e.g. HDFC0001234"
                  maxLength={11}
                  className="font-mono uppercase"
                  error={errors.ifsc_code?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Branch Name / City
                </label>
                <Input
                  {...register('branch_name')}
                  placeholder="e.g. Connaught Place, New Delhi"
                  error={errors.branch_name?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  UPI ID / VPA
                </label>
                <Input
                  {...register('upi_id')}
                  placeholder="e.g. vendorbusiness@okaxis / 9876543210@paytm"
                  error={errors.upi_id?.message}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Address & Khata Opening Balance */}
        {activeTab === 'other' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Complete Address
              </label>
              <Textarea
                {...register('address')}
                placeholder="Shop/Office No., Street, Area, City, Pincode"
                rows={3}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary-500" />
                Opening Balance & Ledger Setup
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Opening Balance (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('opening_balance')}
                    placeholder="0.00"
                    error={errors.opening_balance?.message}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Previous unpaid / advance balance if migrating records.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Balance Type
                  </label>
                  <Controller
                    control={control}
                    name="balance_type"
                    render={({ field: { value, onChange } }) => (
                      <select
                        value={value || 'credit'}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="credit">Credit (Payable / Hame Dena Hai)</option>
                        <option value="debit">Debit (Advance / Supplier Se Lena Hai)</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}


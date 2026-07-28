import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormValues, type Customer } from '../schemas/customerSchema';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCustomer } from '../api/useCustomers';
import { usePriceLists } from '../../inventory/api/usePriceLists';
import { Edit2, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { GST_STATES } from '../constants/gstStates';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function EditCustomerModal({ isOpen, onClose, customer }: EditCustomerModalProps) {
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    values: (customer && isOpen) ? {
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      gstin: customer.gstin || '',
      state_code: customer.state_code || null,
      state_name: customer.state_name || null,
      credit_limit: customer.credit_limit ? Number(customer.credit_limit) : null,
      price_list_id: customer.price_list_id ? Number(customer.price_list_id) : null,
    } : {
      name: '',
      phone: '',
      email: '',
      address: '',
      gstin: '',
      state_code: null,
      state_name: null,
      credit_limit: null,
      price_list_id: null,
    },
    resetOptions: {
      keepDirtyValues: false,
      keepErrors: false,
    },
  });

  const updateCustomer = useUpdateCustomer();
  const { data: priceListsData } = usePriceLists();
  const priceLists = priceListsData || [];

  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setValue('gstin', val);
    if (val.length >= 2) {
      const code = val.substring(0, 2);
      const foundState = GST_STATES.find(s => s.code === code);
      if (foundState) {
        setValue('state_code', foundState.code);
        setValue('state_name', foundState.name);
      }
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    if (!customer) return;
    try {
      await updateCustomer.mutateAsync({ id: customer.id, data });
      toast.success('Customer updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center">
            <Edit2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          Edit Customer
        </div>
      }
      maxWidth="lg"
      overflowVisible={true}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Basic Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <Input 
                {...register('name')} 
                placeholder="E.g., Rahul Sharma"
                error={errors.name?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <Input 
                {...register('phone')} 
                placeholder="E.g., +91 9876543210" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address (Optional)
            </label>
            <Input 
              {...register('email')} 
              placeholder="customer@example.com"
              error={errors.email?.message}
            />
          </div>
        </div>

        {/* GST & State Info */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            GST & Billing Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                GSTIN / Tax ID
              </label>
              <Input 
                {...register('gstin')} 
                onChange={handleGstinChange}
                placeholder="E.g., 27AAAAA0000A1Z5" 
                maxLength={15}
                className="font-mono uppercase"
              />
              <p className="text-[11px] text-slate-500 mt-1">State auto-detects from first 2 digits of GSTIN.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                      const st = GST_STATES.find(s => s.code === val);
                      setValue('state_name', st ? st.name : null);
                    }}
                    placeholder="Select State Code"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-blue-500" />
            Address
          </div>
          <div>
            <Textarea 
              {...register('address')} 
              placeholder="Complete customer address (street, area, city, pincode)"
              rows={2}
            />
          </div>
        </div>

        {/* Pricing & Credit */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Tag className="w-4 h-4 text-amber-500" />
            Pricing & Credit Settings
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Price List (Optional)
              </label>
              <Controller
                control={control}
                name="price_list_id"
                render={({ field: { value, onChange } }) => (
                  <SearchableSelect
                    options={priceLists.map((pl: any) => ({
                      value: pl.id,
                      label: pl.name,
                      description: pl.type === 'discount' ? `-${pl.discount_percentage}%` : 'Custom Rates'
                    }))}
                    value={value || ''}
                    onChange={(val) => onChange(val === '' ? null : val)}
                    placeholder="Select a price list"
                  />
                )}
              />
              <p className="text-[11px] text-slate-500 mt-1">Default rate used in POS / Invoices.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Credit Limit (₹) (Optional)
              </label>
              <Input 
                type="number"
                min="0"
                {...register('credit_limit')} 
                placeholder="E.g., 50000" 
              />
              <p className="text-[11px] text-slate-500 mt-1">Maximum udhar allowed for this customer.</p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

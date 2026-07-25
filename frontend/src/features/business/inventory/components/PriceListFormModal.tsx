import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Loader2, List } from 'lucide-react';
import { useCreatePriceList, useUpdatePriceList, type PriceList } from '../api/usePriceLists';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { priceListSchema, type PriceListFormValues } from '../schemas/priceListSchema';

interface PriceListFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceListToEdit?: PriceList | null;
}

export function PriceListFormModal({ isOpen, onClose, priceListToEdit }: PriceListFormModalProps) {
  const form = useForm<PriceListFormValues>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      name: '',
      description: '',
      is_default: false,
      is_active: true,
    }
  });

  const { register, reset, handleSubmit, formState: { isSubmitting, errors } } = form;
  const createMutation = useCreatePriceList();
  const updateMutation = useUpdatePriceList();

  useEffect(() => {
    if (priceListToEdit) {
      reset({
        name: priceListToEdit.name,
        description: priceListToEdit.description || '',
        is_default: priceListToEdit.is_default,
        is_active: priceListToEdit.is_active,
      });
    } else {
      reset({
        name: '',
        description: '',
        is_default: false,
        is_active: true,
      });
    }
  }, [priceListToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<PriceListFormValues> = async (data) => {
    try {
      if (priceListToEdit) {
        await updateMutation.mutateAsync({ id: priceListToEdit.id, data });
        toast.success('Price list updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Price list created successfully');
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
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 flex items-center justify-center">
            <List className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          {priceListToEdit ? 'Edit Price List' : 'Create Price List'}
        </div>
      }
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" type="submit" form="price-list-form" disabled={isSubmitting} className="bg-primary-500 hover:bg-primary-600 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {priceListToEdit ? 'Save Changes' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="price-list-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input id="name" {...register('name')} placeholder="e.g. Wholesale Price List" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} placeholder="Optional description..." rows={3} />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <input 
            type="checkbox" 
            id="is_default" 
            {...register('is_default')} 
            className="rounded border-slate-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
          />
          <Label htmlFor="is_default" className="font-normal">Set as default price list for new customers</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="is_active" 
            {...register('is_active')} 
            className="rounded border-slate-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
          />
          <Label htmlFor="is_active" className="font-normal">Active</Label>
        </div>
      </form>
    </Modal>
  );
}

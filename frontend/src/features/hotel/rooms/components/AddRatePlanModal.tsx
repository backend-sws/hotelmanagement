import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  useHotelRoomTypes,
  useCreateHotelRatePlan,
  useUpdateHotelRatePlan,
} from '../api/useHotelRooms';
import type { HotelRatePlan, HotelRatePlanFormValues } from '../schemas/roomSchema';

interface AddRatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan?: HotelRatePlan | null;
}

export function AddRatePlanModal({ isOpen, onClose, editingPlan }: AddRatePlanModalProps) {
  const { data: roomTypes = [] } = useHotelRoomTypes();
  const createPlan = useCreateHotelRatePlan();
  const updatePlan = useUpdateHotelRatePlan();
  const isEdit = !!editingPlan;

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<HotelRatePlanFormValues>({
    defaultValues: {
      name: editingPlan?.name || '',
      start_date: editingPlan?.start_date || '',
      end_date: editingPlan?.end_date || '',
      room_type_id: editingPlan?.room_type_id || undefined,
      modifier_type: editingPlan?.modifier_type || 'percentage',
      modifier_value: editingPlan?.modifier_value || 0,
      min_stay_nights: editingPlan?.min_stay_nights || 1,
      is_active: editingPlan?.is_active ?? true,
      description: editingPlan?.description || '',
    },
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        name: editingPlan.name || '',
        start_date: editingPlan.start_date || '',
        end_date: editingPlan.end_date || '',
        room_type_id: editingPlan.room_type_id || undefined,
        modifier_type: editingPlan.modifier_type || 'percentage',
        modifier_value: editingPlan.modifier_value || 0,
        min_stay_nights: editingPlan.min_stay_nights || 1,
        is_active: editingPlan.is_active ?? true,
        description: editingPlan.description || '',
      });
    } else {
      reset({
        name: '',
        start_date: '',
        end_date: '',
        room_type_id: undefined,
        modifier_type: 'percentage',
        modifier_value: 0,
        min_stay_nights: 1,
        is_active: true,
        description: '',
      });
    }
  }, [editingPlan, reset]);

  const onSubmit = async (data: HotelRatePlanFormValues) => {
    try {
      const payload: any = {
        ...data,
        room_type_id: data.room_type_id ? Number(data.room_type_id) : null,
        modifier_value: Number(data.modifier_value),
        min_stay_nights: Number(data.min_stay_nights),
      };

      if (isEdit && editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, data: payload });
        toast.success('Rate plan updated');
      } else {
        await createPlan.mutateAsync(payload);
        toast.success('Rate plan created');
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Rate Plan' : 'Create Rate Plan'}
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button size="sm" form="rate-plan-form" type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      }
    >
      <form id="rate-plan-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Plan Name *</label>
          <Input {...register('name', { required: 'Required' })} placeholder="Summer Sale" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Start Date *</label>
            <Input type="date" {...register('start_date', { required: 'Required' })} />
            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">End Date *</label>
            <Input type="date" {...register('end_date', { required: 'Required' })} />
            {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Applies To (Room Type)</label>
          <Select {...register('room_type_id')}>
            <option value="">All Room Types</option>
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>{rt.name}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Modifier Type</label>
            <Select {...register('modifier_type')}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Value (e.g. 10 or -500)</label>
            <Input type="number" step="0.01" {...register('modifier_value', { required: 'Required' })} />
            {errors.modifier_value && <p className="text-red-500 text-xs mt-1">{errors.modifier_value.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Min Stay (Nights)</label>
            <Input type="number" {...register('min_stay_nights')} min={1} />
          </div>
          <div className="flex items-center pt-6">
            <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 text-indigo-600 rounded border-gray-300 mr-2" />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Description (Optional)</label>
          <textarea
            {...register('description')}
            className="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-indigo-500"
            rows={2}
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}


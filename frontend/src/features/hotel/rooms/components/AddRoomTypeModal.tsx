import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useCreateHotelRoomType,
  useUpdateHotelRoomType,
} from '../api/useHotelRooms';
import type { HotelRoomType, HotelRoomTypeFormValues } from '../schemas/roomSchema';
import { AMENITY_OPTIONS } from '../constants/roomConstants';

interface AddRoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRoomType?: HotelRoomType | null;
  editingType?: HotelRoomType | null;
}

export function AddRoomTypeModal({ isOpen, onClose, editingType }: AddRoomTypeModalProps) {
  const createType = useCreateHotelRoomType();
  const updateType = useUpdateHotelRoomType();
  const isEdit = !!editingType;

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(editingType?.amenities || []);

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<HotelRoomTypeFormValues>({
    defaultValues: {
      name: editingType?.name || '',
      short_code: editingType?.short_code || '',
      base_price_weekday: editingType?.base_price_weekday ?? ('' as any),
      base_price_weekend: editingType?.base_price_weekend ?? ('' as any),
      base_price_peak: editingType?.base_price_peak ?? ('' as any),
      extra_person_charge: editingType?.extra_person_charge ?? ('' as any),
      max_occupancy: editingType?.max_occupancy ?? ('' as any),
      description: editingType?.description || '',
      is_active: editingType?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (editingType) {
      reset({
        name: editingType.name || '',
        short_code: editingType.short_code || '',
        base_price_weekday: editingType.base_price_weekday || 0,
        base_price_weekend: editingType.base_price_weekend || 0,
        base_price_peak: editingType.base_price_peak || 0,
        extra_person_charge: editingType.extra_person_charge || 0,
        max_occupancy: editingType.max_occupancy || 2,
        description: editingType.description || '',
        is_active: editingType.is_active ?? true,
      });
      setSelectedAmenities(editingType.amenities || []);
    } else {
      reset({
        name: '',
        short_code: '',
        base_price_weekday: '' as any,
        base_price_weekend: '' as any,
        base_price_peak: '' as any,
        extra_person_charge: '' as any,
        max_occupancy: '' as any,
        description: '',
        is_active: true,
      });
      setSelectedAmenities([]);
    }
  }, [editingType, reset]);

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const onSubmit = async (data: HotelRoomTypeFormValues) => {
    try {
      const payload: any = { ...data, amenities: selectedAmenities };
      
      // Clean up empty numbers that get converted to NaN
      if (isNaN(payload.base_price_weekend)) payload.base_price_weekend = null;
      if (isNaN(payload.base_price_peak)) payload.base_price_peak = null;
      if (isNaN(payload.extra_person_charge)) payload.extra_person_charge = null;
      if (isNaN(payload.max_occupancy)) payload.max_occupancy = null;
      
      if (isEdit && editingType) {
        await updateType.mutateAsync({ id: editingType.id, data: payload });
        toast.success('Room type updated');
      } else {
        await createType.mutateAsync(payload);
        toast.success('Room type created');
      }
      reset();
      setSelectedAmenities([]);
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
      title={isEdit ? `Edit: ${editingType?.name}` : 'Add Room Type'}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button size="sm" form="room-type-form" type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Room Type'}
          </Button>
        </>
      }
    >
      <form id="room-type-form" onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Name & Code */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Room Type Name *</label>
            <Input {...register('name', { required: 'Required' })} placeholder="e.g. Deluxe AC Room" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Short Code</label>
            <Input {...register('short_code')} placeholder="DLX" maxLength={10} />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Pricing (per night ₹)</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Weekday *</label>
              <Input type="number" {...register('base_price_weekday', { valueAsNumber: true, min: 0 })} placeholder="2000" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Weekend</label>
              <Input type="number" {...register('base_price_weekend', { valueAsNumber: true, min: 0 })} placeholder="2500" />
            </div>
            <div>
              <label className="block text-[11px] text-amber-600 dark:text-amber-400 mb-1">Peak Season</label>
              <Input type="number" {...register('base_price_peak', { valueAsNumber: true, min: 0 })} placeholder="3500" />
            </div>
          </div>
        </div>

        {/* Occupancy + Extra Person */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Max Occupancy *</label>
            <Input type="number" {...register('max_occupancy', { valueAsNumber: true, min: 1 })} min={1} placeholder="2" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Extra Person Charge ₹</label>
            <Input type="number" {...register('extra_person_charge', { valueAsNumber: true, min: 0 })} placeholder="500" />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map(a => {
              const selected = selectedAmenities.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-amber-400 hover:text-amber-600'
                  }`}
                >
                  {selected && <X className="w-3 h-3" />}
                  {a}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Description</label>
          <textarea
            {...register('description')}
            rows={2}
            placeholder="Spacious room with city view, king bed..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-sm text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 accent-amber-500" />
          <label htmlFor="is_active" className="text-sm text-slate-600 dark:text-slate-400">Active (visible for bookings)</label>
        </div>
      </form>
    </Modal>
  );
}

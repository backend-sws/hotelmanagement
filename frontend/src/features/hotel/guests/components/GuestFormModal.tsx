import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useCreateHotelGuest, useUpdateHotelGuest, useDeleteHotelGuest } from '../api/useGuests';
import type { HotelGuest, GuestFormValues } from '../schemas/guestSchema';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGuest?: HotelGuest | null;
}

export function GuestFormModal({ isOpen, onClose, editingGuest }: GuestFormModalProps) {
  const createGuest = useCreateHotelGuest();
  const updateGuest = useUpdateHotelGuest();
  const deleteGuest = useDeleteHotelGuest();
  const isEdit = !!editingGuest;

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<GuestFormValues>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      nationality: 'Indian',
      id_proof_type: '',
      id_proof_number: '',
      date_of_birth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      company_name: '',
      gst_number: '',
      notes: '',
      is_blacklisted: false,
      blacklist_reason: '',
    },
  });

  useEffect(() => {
    if (editingGuest) {
      reset({
        name: editingGuest.name || '',
        phone: editingGuest.phone || '',
        email: editingGuest.email || '',
        nationality: editingGuest.nationality || 'Indian',
        id_proof_type: editingGuest.id_proof_type || '',
        id_proof_number: editingGuest.id_proof_number || '',
        date_of_birth: editingGuest.date_of_birth ? editingGuest.date_of_birth.substring(0, 10) : '',
        gender: editingGuest.gender || '',
        address: editingGuest.address || '',
        city: editingGuest.city || '',
        state: editingGuest.state || '',
        pincode: editingGuest.pincode || '',
        country: editingGuest.country || '',
        company_name: editingGuest.company_name || '',
        gst_number: editingGuest.gst_number || '',
        notes: editingGuest.notes || '',
        is_blacklisted: editingGuest.is_blacklisted || false,
        blacklist_reason: editingGuest.blacklist_reason || '',
      });
    } else {
      reset({
        name: '',
        phone: '',
        email: '',
        nationality: 'Indian',
        id_proof_type: '',
        id_proof_number: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        company_name: '',
        gst_number: '',
        notes: '',
        is_blacklisted: false,
        blacklist_reason: '',
      });
    }
  }, [editingGuest, reset]);

  const onSubmit = async (data: GuestFormValues) => {
    try {
      if (isEdit && editingGuest) {
        await updateGuest.mutateAsync({ id: editingGuest.id!, data });
        toast.success('Guest updated successfully');
      } else {
        await createGuest.mutateAsync(data);
        toast.success('Guest added successfully');
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save guest');
    }
  };

  const handleDelete = async () => {
    if (!editingGuest || !confirm(`Delete guest ${editingGuest.name}?`)) return;
    try {
      await deleteGuest.mutateAsync(editingGuest.id!);
      toast.success('Guest deleted');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Guest Profile' : 'New Guest'}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full">
          <div>
            {isEdit && (
              <Button variant="destructive" size="sm" type="button" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button size="sm" form="guest-form" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Guest'}
            </Button>
          </div>
        </div>
      }
    >
      <form id="guest-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
            <Input {...register('name', { required: 'Required' })} placeholder="John Doe" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone Number (10 Digits)</label>
            <Input 
              {...register('phone')} 
              type="tel"
              maxLength={10}
              placeholder="9876543210" 
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
              }}
              className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <Input type="email" {...register('email')} placeholder="john@example.com" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
            <Input type="date" {...register('date_of_birth')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
            <Select {...register('gender')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl">
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nationality</label>
            <Input {...register('nationality')} placeholder="Indian" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

        {/* Identity & Corporate */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">ID Proof Type</label>
            <Select {...register('id_proof_type')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl">
              <option value="">Select ID Type...</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="voter_id">Voter ID</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">ID Proof Number</label>
            <Input {...register('id_proof_number')} placeholder="Document Number" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
            <Input {...register('company_name')} placeholder="For corporate bookings" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">GST Number</label>
            <Input {...register('gst_number')} placeholder="22AAAAA0000A1Z5" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Address</label>
          <Input {...register('address')} placeholder="123 Street Name, Area..." className="mb-3" />
          
          <div className="grid grid-cols-3 gap-3">
            <Input {...register('city')} placeholder="City" />
            <Input {...register('state')} placeholder="State" />
            <Input {...register('pincode')} placeholder="Pincode" />
          </div>
        </div>

        {/* Notes & Blacklist */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">General Notes</label>
            <textarea
              {...register('notes')}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="is_blacklisted" {...register('is_blacklisted')} className="w-4 h-4 accent-red-600" />
              <label htmlFor="is_blacklisted" className="text-sm font-semibold text-red-700 dark:text-red-400">Blacklist Guest</label>
            </div>
            <textarea
              {...register('blacklist_reason')}
              rows={1}
              placeholder="Reason for blacklisting..."
              className="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-white dark:bg-black/40 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

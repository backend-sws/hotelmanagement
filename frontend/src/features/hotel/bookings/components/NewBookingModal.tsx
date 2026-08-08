import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, UserPlus, Search } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useHotelRooms } from '../../rooms/api/useHotelRooms';
import { useHotelGuests } from '../../guests/api/useGuests';
import { useCreateHotelBooking } from '../api/useBookings';
import type { NewBookingFormValues } from '../schemas/bookingSchema';
import { useDebounce } from '@/hooks/useDebounce';
import { differenceInDays, parseISO } from 'date-fns';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomId?: number;
}

export function NewBookingModal({ isOpen, onClose, preselectedRoomId }: NewBookingModalProps) {
  const createBooking = useCreateHotelBooking();
  const { data: rooms = [] } = useHotelRooms();
  
  const [guestSearch, setGuestSearch] = useState('');
  const debouncedSearch = useDebounce(guestSearch, 400);
  const { data: guestsResponse } = useHotelGuests(debouncedSearch);
  const guests = guestsResponse?.data || [];

  const [isNewGuest, setIsNewGuest] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [splitBank, setSplitBank] = useState<number>(0);

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset, watch, setValue, control } = useForm<NewBookingFormValues>({
    defaultValues: {
      guest_id: null,
      room_id: preselectedRoomId || undefined,
      adults: 1,
      children: 0,
      booking_source: 'direct',
      status: 'confirmed',
      advance_payment: 0,
      payment_mode: 'cash',
      check_in_date: new Date().toISOString().substring(0, 10),
      check_out_date: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
    },
  });

  const watchRoomId = watch('room_id');
  const watchCheckIn = watch('check_in_date');
  const watchCheckOut = watch('check_out_date');

  // Auto-fill room rate when room changes
  useEffect(() => {
    if (watchRoomId) {
      const room = rooms.find((r: any) => r.id === Number(watchRoomId));
      if (room?.room_type) {
        setValue('room_rate_per_night', room.room_type.base_price_weekday);
      }
    }
  }, [watchRoomId, rooms, setValue]);

  const watchRate = watch('room_rate_per_night');
  const nights = (watchCheckIn && watchCheckOut) ? Math.max(1, differenceInDays(parseISO(watchCheckOut), parseISO(watchCheckIn))) : 1;
  const totalRoomCharge = nights * (Number(watchRate) || 0);

  useEffect(() => {
    if (isOpen) {
      reset({
        guest_id: null,
        room_id: preselectedRoomId || undefined,
        adults: 1,
        children: 0,
        booking_source: 'direct',
        status: 'confirmed',
        advance_payment: 0,
        payment_mode: 'cash',
        check_in_date: new Date().toISOString().substring(0, 10),
        check_out_date: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
      });
      setIsNewGuest(false);
      setSelectedGuestId(null);
      setGuestSearch('');
      setIsSplitPayment(false);
      setSplitCash(0);
      setSplitUpi(0);
      setSplitCard(0);
      setSplitBank(0);
    }
  }, [isOpen, preselectedRoomId, reset]);

  const onSubmit = async (data: NewBookingFormValues) => {
    try {
      const payload: any = { ...data };
      if (!isNewGuest) {
        if (!selectedGuestId) {
          toast.error('Please select a guest or add a new one');
          return;
        }
        payload.guest_id = selectedGuestId;
        delete payload.guest;
      } else {
        payload.guest_id = null;
        if (!payload.guest?.name || !payload.guest?.phone) {
          toast.error('Name and Phone are required for a new guest');
          return;
        }
        const cleanPhone = payload.guest.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
          toast.error('Phone number must be exactly 10 digits');
          return;
        }
        payload.guest.phone = cleanPhone;
      }

      if (isSplitPayment) {
        const splits = [];
        if (splitCash > 0) splits.push({ payment_mode: 'cash', amount: Number(splitCash) });
        if (splitUpi > 0) splits.push({ payment_mode: 'upi', amount: Number(splitUpi) });
        if (splitCard > 0) splits.push({ payment_mode: 'card', amount: Number(splitCard) });
        if (splitBank > 0) splits.push({ payment_mode: 'bank_transfer', amount: Number(splitBank) });
        
        payload.advance_payment = splits.reduce((sum, s) => sum + s.amount, 0);
        payload.split_payments = splits;
        payload.payment_mode = 'split';
      }

      await createBooking.mutateAsync(payload);
      toast.success('Reservation created successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation / Check-in"
      maxWidth="3xl"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button size="sm" form="booking-form" type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Reservation
          </Button>
        </div>
      }
    >
      <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Guest Selection Area */}
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-500/20 p-1.5 rounded-lg">
                <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Guest Information
            </h3>
            <div className="flex items-center gap-4 bg-white dark:bg-[#111118] p-1.5 rounded-xl border border-slate-200/50 dark:border-white/5">
              <label className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${!isNewGuest ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <input type="radio" checked={!isNewGuest} onChange={() => setIsNewGuest(false)} className="hidden" />
                Existing Guest
              </label>
              <label className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${isNewGuest ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <input type="radio" checked={isNewGuest} onChange={() => setIsNewGuest(true)} className="hidden" />
                New Guest
              </label>
            </div>
          </div>

          {!isNewGuest ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search existing guest by name or phone..." 
                  value={guestSearch}
                  onChange={e => setGuestSearch(e.target.value)}
                  className="pl-9 h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl focus-visible:ring-blue-500/30 transition-shadow"
                />
              </div>
              
              {guests.length > 0 && guestSearch && (
                <div className="border border-slate-200 dark:border-white/10 rounded-lg max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {guests.map((g: any) => (
                    <div 
                      key={g.id} 
                      onClick={() => { setSelectedGuestId(g.id); setGuestSearch(g.name); }}
                      className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer flex justify-between items-center ${selectedGuestId === g.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                    >
                      <div>
                        <div className="font-semibold text-sm">{g.name}</div>
                        <div className="text-xs text-slate-500">{g.phone}</div>
                      </div>
                      {g.is_blacklisted && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">BLACKLISTED</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <Input {...register('guest.name')} placeholder="John Doe" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone Number * (10 Digits)</label>
                <Input 
                  {...register('guest.phone')} 
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210" 
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                  }}
                  className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <Input type="email" {...register('guest.email')} placeholder="john@example.com" className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">ID Proof Type</label>
                <Select {...register('guest.id_proof_type')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl">
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
                <Input {...register('guest.id_proof_number')} placeholder="Enter Document / ID Number..." className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Stay Details */}
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 rounded-2xl p-5">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-1.5 rounded-lg">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Stay Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Room Selection *</label>
              <Select {...register('room_id', { valueAsNumber: true })} className="w-full h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium">
              <option value="">Select Room...</option>
              {rooms.map((room: any) => (
                <option key={room.id} value={room.id} disabled={room.status === 'occupied'}>
                  Room {room.room_number} - {room.roomType?.name} 
                  {room.status === 'occupied' ? ' (Occupied)' : room.status === 'dirty' ? ' (Dirty)' : ''}
                </option>
              ))}
            </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Check In *</label>
              <Input type="date" {...register('check_in_date')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Check Out *</label>
              <Input type="date" {...register('check_out_date')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Adults *</label>
              <Input type="number" min="1" {...register('adults', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Children</label>
              <Input type="number" min="0" {...register('children', { valueAsNumber: true })} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Source</label>
              <Select {...register('booking_source')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium">
              <option value="direct">Direct Walk-in</option>
              <option value="phone">Phone Booking</option>
              <option value="website">Website</option>
              <option value="ota">OTA (MMT, Agoda etc.)</option>
              <option value="corporate">Corporate</option>
            </Select>
          </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Action</label>
              <Select {...register('status')} className="h-11 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-xl font-medium">
                <option value="confirmed">Reserve Only</option>
                <option value="checked_in">Check-In Now</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing & Advance */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100/50 dark:border-blue-500/20 rounded-2xl p-5 relative overflow-hidden space-y-4">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-500/20 p-1.5 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">₹</span>
              </div>
              Pricing & Payment
            </h3>

            <button
              type="button"
              onClick={() => setIsSplitPayment(!isSplitPayment)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              {isSplitPayment ? 'Single Payment Mode' : 'Split Advance Payment (Cash + UPI etc.)'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-blue-900/70 dark:text-blue-300/70 uppercase tracking-wider mb-1.5">Room Rate / Night (₹)</label>
              <Input type="number" {...register('room_rate_per_night', { valueAsNumber: true })} className="h-11 bg-white/80 dark:bg-black/40 border-blue-200/50 dark:border-blue-500/30 rounded-xl font-bold text-blue-900 dark:text-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-900/70 dark:text-blue-300/70 uppercase tracking-wider mb-1.5">Total Room Charge</label>
              <div className="flex items-center h-11 px-4 bg-white/50 dark:bg-black/20 border border-blue-100 dark:border-blue-500/20 rounded-xl font-black text-blue-900 dark:text-blue-100">
                ₹{totalRoomCharge.toLocaleString()} <span className="text-[10px] font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-wider ml-1">({nights}n)</span>
              </div>
            </div>

            {!isSplitPayment ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-blue-900/70 dark:text-blue-300/70 uppercase tracking-wider mb-1.5">Advance Amount (₹)</label>
                  <Input type="number" min="0" {...register('advance_payment', { valueAsNumber: true })} className="h-11 bg-white/80 dark:bg-black/40 border-blue-200/50 dark:border-blue-500/30 rounded-xl font-bold text-blue-900 dark:text-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900/70 dark:text-blue-300/70 uppercase tracking-wider mb-1.5">Payment Mode</label>
                  <Select {...register('payment_mode')} className="h-11 bg-white/80 dark:bg-black/40 border-blue-200/50 dark:border-blue-500/30 rounded-xl font-bold text-blue-900 dark:text-blue-100">
                    <option value="cash">Cash</option>
                    <option value="upi">UPI / PhonePe / GPay</option>
                    <option value="card">Card (Credit/Debit)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </Select>
                </div>
              </>
            ) : (
              <div className="col-span-2 bg-white/60 dark:bg-black/20 border border-blue-200/50 dark:border-blue-500/30 p-3 rounded-xl space-y-2">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-1">Split Payment Breakdown</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Cash (₹)</label>
                    <Input type="number" min="0" value={splitCash} onChange={e => setSplitCash(Number(e.target.value))} className="h-9 font-bold bg-white dark:bg-[#111118] text-xs rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">UPI (₹)</label>
                    <Input type="number" min="0" value={splitUpi} onChange={e => setSplitUpi(Number(e.target.value))} className="h-9 font-bold bg-white dark:bg-[#111118] text-xs rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Card (₹)</label>
                    <Input type="number" min="0" value={splitCard} onChange={e => setSplitCard(Number(e.target.value))} className="h-9 font-bold bg-white dark:bg-[#111118] text-xs rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Bank (₹)</label>
                    <Input type="number" min="0" value={splitBank} onChange={e => setSplitBank(Number(e.target.value))} className="h-9 font-bold bg-white dark:bg-[#111118] text-xs rounded-lg" />
                  </div>
                </div>
                <div className="text-right text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  Total Advance: ₹{((Number(splitCash)||0) + (Number(splitUpi)||0) + (Number(splitCard)||0) + (Number(splitBank)||0)).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

      </form>
    </Modal>
  );
}

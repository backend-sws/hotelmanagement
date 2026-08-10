import { useState, useMemo } from 'react';
import { useOutlets, useTables, useReservations, useCreateReservation, useUpdateReservation, useDeleteReservation } from '../api/useHotelPOS';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Phone, Users, User, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { HotelTableReservation } from '../schemas/tableSchema';

export default function ReservationsPage() {
  const { data: outlets = [], isLoading: outletsLoading } = useOutlets();
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);

  // Auto-select first outlet if none selected
  if (!selectedOutlet && outlets.length > 0) {
    setSelectedOutlet(outlets[0].id);
  }

  const { data: tables = [] } = useTables({ outlet_id: selectedOutlet ?? undefined });
  const { data: reservations = [], isLoading: resLoading } = useReservations({ outlet_id: selectedOutlet ?? undefined });
  
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [tableId, setTableId] = useState<number | ''>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [resTime, setResTime] = useState('');
  const [gracePeriod, setGracePeriod] = useState(15);
  const [deposit, setDeposit] = useState(0);
  const [specialReq, setSpecialReq] = useState('');
  const [status, setStatus] = useState<HotelTableReservation['status']>('pending');

  const handleSave = async () => {
    if (!selectedOutlet || !tableId || !guestName || !resTime) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      outlet_id: selectedOutlet,
      table_id: Number(tableId),
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_count: guestCount,
      reservation_time: resTime,
      grace_period_minutes: gracePeriod,
      deposit_amount: deposit,
      special_requests: specialReq,
      status
    };

    if (editingId) {
      await updateReservation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createReservation.mutateAsync(payload as any);
    }
    setShowModal(false);
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setTableId(r.table_id);
    setGuestName(r.guest_name);
    setGuestPhone(r.guest_phone || '');
    setGuestCount(r.guest_count);
    // Format datetime-local string (YYYY-MM-DDThh:mm)
    const dt = new Date(r.reservation_time);
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dt.getTime() - tzOffset)).toISOString().slice(0, 16);
    setResTime(localISOTime);
    setGracePeriod(r.grace_period_minutes);
    setDeposit(r.deposit_amount);
    setSpecialReq(r.special_requests || '');
    setStatus(r.status);
    setShowModal(true);
  };

  const openNew = () => {
    setEditingId(null);
    setTableId('');
    setGuestName('');
    setGuestPhone('');
    setGuestCount(2);
    setResTime('');
    setGracePeriod(15);
    setDeposit(0);
    setSpecialReq('');
    setStatus('pending');
    setShowModal(true);
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200';
      case 'seated': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200';
      case 'no_show': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200';
      case 'cancelled': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <CalendarClock className="w-8 h-8 text-indigo-500" />
            Table Reservations
          </h1>
          <p className="text-slate-500 mt-1">Manage pre-bookings, deposits, and table capacities</p>
        </div>
        <div className="flex items-center gap-3">
          {outletsLoading ? <Skeleton className="w-48 h-10" /> : (
            <Select 
              value={String(selectedOutlet ?? '')} 
              onChange={e => setSelectedOutlet(Number(e.target.value))}
              className="w-48 rounded-xl"
            >
              {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </Select>
          )}
          <Button onClick={openNew} className="rounded-xl flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <CalendarClock className="w-4 h-4" /> New Booking
          </Button>
        </div>
      </div>

      {resLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map(r => {
            const resDate = new Date(r.reservation_time);
            const isLate = r.status === 'pending' && new Date() > new Date(resDate.getTime() + r.grace_period_minutes * 60000);
            
            return (
              <Card key={r.id} className={`overflow-hidden transition-shadow relative border-l-4 ${isLate ? 'border-l-rose-500' : 'border-l-indigo-500'}`}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> {r.guest_name}
                      </h3>
                      {r.guest_phone && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5" /> {r.guest_phone}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${getStatusColor(r.status)}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">Time</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {resDate.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">Table</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {r.table?.name || `Table ${r.table_id}`}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">Guests</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {r.guest_count}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold">Deposit</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{r.deposit_amount}
                      </span>
                    </div>
                  </div>

                  {isLate && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-lg font-medium">
                      <AlertCircle className="w-4 h-4" /> Guest is late (grace period: {r.grace_period_minutes}m)
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2">
                    {r.status === 'pending' && (
                      <Button size="sm" onClick={() => updateReservation.mutate({ id: r.id, status: 'seated' })} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs">
                        Mark Seated
                      </Button>
                    )}
                    {r.status === 'pending' && isLate && (
                      <Button size="sm" variant="outline" onClick={() => updateReservation.mutate({ id: r.id, status: 'no_show' })} className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 h-8 text-xs">
                        No Show
                      </Button>
                    )}
                    <div className="flex ml-auto gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(r)} className="h-8 px-2">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { if(confirm('Delete reservation?')) deleteReservation.mutate(r.id); }} className="h-8 px-2 text-rose-500 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {reservations.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 bg-white dark:bg-[#111115] rounded-2xl border border-dashed">
              <CalendarClock className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-medium">No reservations found.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Reservation' : 'New Reservation'}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Guest Name <span className="text-red-500">*</span></label>
                <Input value={guestName} onChange={e => setGuestName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                <Input value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Guests <span className="text-red-500">*</span></label>
                <Input type="number" min={1} value={guestCount} onChange={e => setGuestCount(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Table <span className="text-red-500">*</span></label>
                <Select value={tableId} onChange={e => setTableId(Number(e.target.value))} className="mt-1 w-full">
                  <option value="">Select Table</option>
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (Cap: {t.capacity}) - {t.status}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Date & Time <span className="text-red-500">*</span></label>
                <Input type="datetime-local" value={resTime} onChange={e => setResTime(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Deposit Amount (₹)</label>
                <Input type="number" min={0} value={deposit} onChange={e => setDeposit(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Grace Period (Mins)</label>
                <Input type="number" min={0} value={gracePeriod} onChange={e => setGracePeriod(Number(e.target.value))} className="mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Special Requests</label>
                <Input value={specialReq} onChange={e => setSpecialReq(e.target.value)} placeholder="e.g. Window seat, Birthday setup" className="mt-1" />
              </div>
              {editingId && (
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <Select value={status} onChange={e => setStatus(e.target.value as HotelTableReservation['status'])} className="mt-1 w-full">
                    <option value="pending">Pending</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Reservation</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

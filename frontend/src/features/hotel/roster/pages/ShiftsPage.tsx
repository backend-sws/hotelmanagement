import { useState } from 'react';
import { useShifts, useCreateShift, useUpdateShift, useDeleteShift } from '../api/useHotelRoster';
import { Plus, Clock, Pencil, Trash2, MoonStar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { HotelShift } from '../schemas/rosterSchema';

export function ShiftsPage() {
  const { data: shifts, isLoading } = useShifts();
  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const deleteShift = useDeleteShift();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<HotelShift | null>(null);

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isOvernight, setIsOvernight] = useState(false);
  const [color, setColor] = useState('#3b82f6');

  const openModal = (shift?: HotelShift) => {
    if (shift) {
      setEditingShift(shift);
      setName(shift.name);
      setStartTime(shift.start_time.substring(0, 5));
      setEndTime(shift.end_time.substring(0, 5));
      setIsOvernight(shift.is_overnight);
      setColor(shift.color);
    } else {
      setEditingShift(null);
      setName('');
      setStartTime('09:00');
      setEndTime('17:00');
      setIsOvernight(false);
      setColor('#3b82f6');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        start_time: startTime,
        end_time: endTime,
        is_overnight: isOvernight,
        color,
        is_active: true
      };

      if (editingShift) {
        await updateShift.mutateAsync({ id: editingShift.id, ...payload });
        toast.success('Shift updated');
      } else {
        await createShift.mutateAsync(payload);
        toast.success('Shift created');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      try {
        await deleteShift.mutateAsync(id);
        toast.success('Shift deleted');
      } catch (error: any) {
        toast.error('Failed to delete shift');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <Clock className="w-7 h-7 text-indigo-500" />
            Hotel Shifts Setup
          </h1>
          <p className="text-slate-500 mt-1">Define shift timings and color codes for the roster.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 rounded-xl px-5 h-10">
          <Plus className="w-4 h-4 mr-2" />
          Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shifts?.map((shift: HotelShift) => (
          <Card key={shift.id} className="group overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col p-0 border-slate-200/60 dark:border-white/10 rounded-2xl">
            <div className="h-2 w-full transition-all duration-300 group-hover:h-3" style={{ backgroundColor: shift.color }} />
            <CardContent className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{shift.name}</h3>
                  {shift.is_overnight && (
                    <span className="inline-flex items-center gap-1.5 mt-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-100 dark:border-indigo-800">
                      <MoonStar className="w-3.5 h-3.5" /> Overnight
                    </span>
                  )}
                </div>
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: shift.color }} />
              </div>
              
              <div className="flex items-center justify-center gap-3 text-slate-700 dark:text-slate-300 font-semibold font-mono text-xl py-4 bg-white dark:bg-[#111115] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-5 relative overflow-hidden group-hover:border-slate-200 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10">{shift.start_time.substring(0, 5)}</span>
                <span className="text-slate-300 dark:text-slate-600 relative z-10">→</span>
                <span className="relative z-10">{shift.end_time.substring(0, 5)}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {shift.duration_hours} hrs
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openModal(shift)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(shift.id)} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {shifts?.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-slate-50 rounded-xl border border-dashed">
            <p className="text-slate-500">No shifts configured yet.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShift ? 'Edit Shift' : 'New Shift'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Shift Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning Shift" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox"
              id="overnight" 
              checked={isOvernight} 
              onChange={(e) => setIsOvernight(e.target.checked)} 
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="overnight" className="font-normal cursor-pointer">
              This shift crosses midnight (overnight)
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Color Code (for Roster Grid)</Label>
            <div className="flex gap-3">
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 p-1" />
              <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createShift.isPending || updateShift.isPending}>Save Shift</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


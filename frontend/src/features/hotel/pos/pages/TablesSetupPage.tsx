import { useState } from 'react';
import { useOutlets, useTables, useCreateTable, useUpdateTable, useDeleteTable } from '../api/useHotelPOS';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Armchair, Plus, Trash2, Edit2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import type { HotelPosTable } from '../schemas/tableSchema';

export default function TablesSetupPage() {
  const { data: outlets = [], isLoading: outletsLoading } = useOutlets();
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);

  const { data: tables = [], isLoading: tablesLoading } = useTables({ outlet_id: selectedOutlet ?? undefined });
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{name: string, capacity: number, status: HotelPosTable['status']}>({ name: '', capacity: 4, status: 'available' });

  // Auto-select first outlet if none selected
  if (!selectedOutlet && outlets.length > 0) {
    setSelectedOutlet(outlets[0].id);
  }

  const handleSave = async () => {
    if (!selectedOutlet) return;
    if (editingId) {
      await updateTable.mutateAsync({ id: editingId, ...formData });
    } else {
      await createTable.mutateAsync({ ...formData, outlet_id: selectedOutlet });
    }
    setShowModal(false);
    setFormData({ name: '', capacity: 4, status: 'available' });
    setEditingId(null);
  };

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setFormData({ name: t.name, capacity: t.capacity, status: t.status });
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-500 text-white';
      case 'occupied': return 'bg-rose-500 text-white';
      case 'reserved': return 'bg-amber-500 text-white';
      case 'out_of_service': return 'bg-slate-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <Armchair className="w-8 h-8 text-indigo-500" />
            Table Management
          </h1>
          <p className="text-slate-500 mt-1">Configure physical tables and capacities for your outlets</p>
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
          <Button onClick={() => { setEditingId(null); setFormData({ name: '', capacity: 4, status: 'available' }); setShowModal(true); }} className="rounded-xl flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Table
          </Button>
        </div>
      </div>

      {tablesLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables.map(t => (
            <Card key={t.id} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative">
              <div className={`h-2 ${getStatusColor(t.status)}`} />
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Armchair className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{t.name}</h3>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <Users className="w-3.5 h-3.5" /> {t.capacity} seats
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(t.status)}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                  <button onClick={() => handleEdit(t)} className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if(confirm('Delete table?')) deleteTable.mutate(t.id); }} className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow hover:bg-red-50 text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          {tables.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No tables configured for this outlet yet.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Table' : 'New Table'}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Table Name</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. T1 or Balcony-1"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Capacity (Persons)</label>
              <Input 
                type="number"
                value={formData.capacity} 
                onChange={e => setFormData(f => ({ ...f, capacity: parseInt(e.target.value) || 2 }))}
                min={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
              <Select 
                value={formData.status} 
                onChange={e => setFormData(f => ({ ...f, status: e.target.value as HotelPosTable['status'] }))}
                className="mt-1 w-full"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="out_of_service">Out of Service</option>
              </Select>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!formData.name.trim()}>Save Table</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

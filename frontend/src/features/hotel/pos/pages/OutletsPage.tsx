import { useState, useMemo } from 'react';
import { UtensilsCrossed, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { useOutlets, useCreateOutlet, useUpdateOutlet, useDeleteOutlet } from '../api/useHotelPOS';
import type { HotelOutlet } from '../schemas/posSchema';
import { OUTLET_ICONS, OUTLET_COLORS, OUTLET_TYPES } from '../constants/posConstants';
import { toast } from 'sonner';

const emptyForm = { name: '', outlet_type: 'restaurant' as HotelOutlet['outlet_type'], description: '', is_active: true };

export function OutletsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HotelOutlet | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: outlets = [], isLoading } = useOutlets();
  const createOutlet = useCreateOutlet();
  const updateOutlet = useUpdateOutlet();
  const deleteOutlet = useDeleteOutlet();

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (o: HotelOutlet) => {
    setEditing(o);
    setForm({ name: o.name, outlet_type: o.outlet_type, description: o.description || '', is_active: o.is_active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Outlet name is required'); return; }
    if (editing) {
      await updateOutlet.mutateAsync({ id: editing.id, ...form });
    } else {
      await createOutlet.mutateAsync(form);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this outlet? All its services will also be deleted.')) return;
    await deleteOutlet.mutateAsync(id);
  };

  const filteredOutlets = useMemo(() => {
    return outlets.filter(o => {
      const matchSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filterType === 'all' || (filterType === 'active' && o.is_active) || (filterType === 'inactive' && !o.is_active);
      return matchSearch && matchFilter;
    });
  }, [outlets, searchQuery, filterType]);

  const activeCount = outlets.filter(o => o.is_active).length;
  const inactiveCount = outlets.length - activeCount;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hotel Outlets</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage restaurants, bars, spas & service outlets</p>
          </div>
          <Button onClick={openCreate} className="rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Outlet
          </Button>
        </div>

        {/* Analytics / KPI Filters */}
        <div className="grid grid-cols-3 gap-4">
          <CustomKpiCard 
            title="Total Outlets" 
            value={outlets.length} 
            icon={<Building />} 
            glowColor={filterType === 'all' ? 'primary' : 'blue'}
            onClick={() => setFilterType('all')}
          />
          <CustomKpiCard 
            title="Active" 
            value={activeCount} 
            icon={<ToggleRight />} 
            glowColor={filterType === 'active' ? 'emerald' : 'blue'}
            onClick={() => setFilterType('active')}
          />
          <CustomKpiCard 
            title="Inactive" 
            value={inactiveCount} 
            icon={<ToggleLeft />} 
            glowColor={filterType === 'inactive' ? 'rose' : 'blue'}
            onClick={() => setFilterType('inactive')}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 pointer-events-none" />
          <Input 
            placeholder="Search outlets by name..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-white dark:bg-[#111118] border-slate-200/80 dark:border-white/10 shadow-sm"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-white/10" />)}
          </div>
        ) : outlets.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10">
            <UtensilsCrossed className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400">No outlets created yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Add your restaurant, bar, or room service outlet</p>
            <Button onClick={openCreate} className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" />Add First Outlet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOutlets.map(outlet => {
              const Icon = OUTLET_ICONS[outlet.outlet_type] ?? UtensilsCrossed;
              const colorCls = OUTLET_COLORS[outlet.outlet_type] ?? OUTLET_COLORS.other;
              return (
                <div key={outlet.id} className="group relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300 overflow-hidden">
                  
                  {/* Subtle Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-[0.15] -mr-10 -mt-10 ${colorCls.split(' ')[0]}`} />

                  <div className="flex justify-between items-start relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorCls} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Action buttons (appear on hover) */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-md border-slate-200/50 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => openEdit(outlet)}>
                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-md border-rose-200/50 dark:border-rose-500/10 hover:bg-rose-50 dark:hover:bg-rose-500/20" onClick={() => handleDelete(outlet.id)}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 relative z-10">
                    <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{outlet.name}</h3>
                    
                    <div className="flex items-center gap-2.5 mt-3">
                      <Badge className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg border-0 ${colorCls.split(' ')[0]} ${colorCls.split(' ')[2]}`}>
                        {outlet.outlet_type.replace('_', ' ')}
                      </Badge>
                      
                      {outlet.is_active ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <ToggleRight className="w-3.5 h-3.5" />Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          <ToggleLeft className="w-3.5 h-3.5" />Inactive
                        </div>
                      )}
                    </div>
                    
                    {outlet.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                        {outlet.description}
                      </p>
                    )}
                    
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Linked Services</span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg">
                        {outlet.services_count ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Outlet' : 'New Outlet'} maxWidth="md">
        <div className="space-y-5 px-1 py-2">
          <div className="space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Outlet Name *</Label>
            <Input 
              placeholder="e.g. Main Restaurant" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              className="rounded-xl h-11 bg-slate-50 dark:bg-white/[0.02]" 
            />
          </div>
          <div className="space-y-1.5">
            <CustomSelect
              label="Outlet Type *"
              value={form.outlet_type}
              onChange={v => setForm(f => ({ ...f, outlet_type: v as HotelOutlet['outlet_type'] }))}
              options={OUTLET_TYPES.map(t => ({
                value: t,
                label: t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
              }))}
              className="w-full"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Description</Label>
            <Textarea 
              placeholder="Optional description" 
              value={form.description} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
              className="rounded-xl min-h-[100px] bg-slate-50 dark:bg-white/[0.02]" 
            />
          </div>
          
          <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/5">
            <Toggle 
              checked={form.is_active} 
              onChange={checked => setForm(f => ({ ...f, is_active: checked }))} 
              label="Active Outlet"
              description="Visible and usable in POS"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl h-11 bg-orange-600 hover:bg-orange-700 text-white font-black tracking-wide shadow-lg shadow-orange-500/25" onClick={handleSave}
              disabled={createOutlet.isPending || updateOutlet.isPending}>
              {editing ? 'Update Outlet' : 'Create Outlet'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

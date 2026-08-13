import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Package, UtensilsCrossed, ToggleRight, ToggleLeft, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';
import { useOutlets, useServices, useCreateService, useUpdateService, useDeleteService } from '../api/useHotelPOS';
import type { HotelService } from '../schemas/posSchema';
import { SERVICE_CATEGORIES, CATEGORY_COLORS } from '../constants/posConstants';
import { toast } from 'sonner';
import { uploadToR2 } from '@/lib/r2';

const emptyForm = {
  outlet_id: '' as any,
  name: '',
  category: 'food' as HotelService['category'],
  description: '',
  price: '',
  tax_type: 'exclusive' as HotelService['tax_type'],
  tax_percent: '5',
  is_available: true,
  sort_order: '0',
  image: null as File | null,
  image_url: '',
};

export function ServicesPage() {
  const [filterOutlet, setFilterOutlet] = useState<string>('');
  const [filterCat, setFilterCat] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HotelService | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isUploading, setIsUploading] = useState(false);

  const { data: outlets = [] } = useOutlets();
  const { data: services = [], isLoading } = useServices({
    outlet_id: filterOutlet ? Number(filterOutlet) : undefined,
    category: filterCat || undefined,
  });
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, outlet_id: filterOutlet || '' });
    setShowModal(true);
  };
  const openEdit = (s: HotelService) => {
    setEditing(s);
    setForm({
      outlet_id: s.outlet_id,
      name: s.name,
      category: s.category,
      description: s.description || '',
      price: String(s.price),
      tax_type: s.tax_type,
      tax_percent: String(s.tax_percent),
      is_available: s.is_available,
      sort_order: String(s.sort_order),
      image: null,
      image_url: s.image_url || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Service name required'); return; }
    if (!form.outlet_id) { toast.error('Select an outlet'); return; }
    
    let imageUrl = form.image_url;
    if (form.image) {
      try {
        setIsUploading(true);
        const { public_url } = await uploadToR2(form.image, 'hotel/services');
        imageUrl = public_url;
      } catch (err: any) {
        toast.error('Failed to upload image');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const { image: _image, ...payload } = {
      ...form,
      outlet_id: Number(form.outlet_id),
      price: Number(form.price),
      tax_percent: Number(form.tax_percent),
      sort_order: Number(form.sort_order),
      image_url: imageUrl,
    };

    if (editing) {
      await updateService.mutateAsync({ id: editing.id, ...payload });
    } else {
      await createService.mutateAsync(payload);
    }
    setShowModal(false);
  };

  const filtered = services.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  const grouped = filtered.reduce((acc: Record<string, HotelService[]>, s) => {
    const key = s.outlet?.name ?? 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Services & Menu</h1>
            <p className="text-slate-500 text-sm mt-1">Manage menus, service items, and pricing for your POS outlets.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Catalog of all billable services across outlets</p>
          </div>
          <Button onClick={openCreate} className="rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />Add Service
          </Button>
        </div>

        {/* Analytics / KPI Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CustomKpiCard 
            title="Total Services" 
            value={services.length} 
            icon={<Package />} 
            glowColor={!filterCat && !filterOutlet ? 'primary' : 'blue'}
            onClick={() => { setFilterCat(''); setFilterOutlet(''); }}
          />
          <CustomKpiCard 
            title="Food & Beverage" 
            value={services.filter(s => s.category === 'food' || s.category === 'beverage').length} 
            icon={<UtensilsCrossed />} 
            glowColor={filterCat === 'food' ? 'amber' : 'amber'}
            onClick={() => setFilterCat('food')}
          />
          <CustomKpiCard 
            title="Available" 
            value={services.filter(s => s.is_available).length} 
            icon={<ToggleRight />} 
            glowColor="emerald"
          />
          <CustomKpiCard 
            title="Unavailable" 
            value={services.filter(s => !s.is_available).length} 
            icon={<ToggleLeft />} 
            glowColor="rose"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute z-10 pointer-events-none left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search services by name..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-11 h-12 rounded-2xl bg-white dark:bg-[#111118] border-slate-200/80 dark:border-white/10 shadow-sm" 
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterOutlet} onChange={e => setFilterOutlet(e.target.value)} className="w-full h-12 rounded-2xl bg-white dark:bg-[#111118] border-slate-200/80 dark:border-white/10 shadow-sm">
              <option value="">All Outlets</option>
              {outlets.map(o => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full h-12 rounded-2xl bg-white dark:bg-[#111118] border-slate-200/80 dark:border-white/10 shadow-sm">
              <option value="">All Categories</option>
              {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </Select>
          </div>
        </div>

        {/* Services grouped by outlet */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2].map(i => <div key={i} className="h-48 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-white/10" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10">
            <Package className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="font-bold text-slate-500 dark:text-slate-400">No services found</p>
            <Button onClick={openCreate} className="mt-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">
              <Plus className="w-4 h-4 mr-2" />Add First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([outletName, items]) => (
              <div key={outletName} className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                  <h3 className="font-black text-sm text-slate-700 dark:text-slate-300">{outletName}</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {items.map(s => (
                    <div key={s.id} className="flex items-center px-5 py-3 gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="w-10 h-10 shrink-0 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                        {s.image_url ? (
                          <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <UtensilsCrossed className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{s.name}</span>
                          {!s.is_available && <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-300">Unavailable</Badge>}
                        </div>
                        {s.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{s.description}</p>}
                      </div>
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 ${CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.misc}`}>
                        {s.category}
                      </Badge>
                      <div className="text-right">
                        <div className="font-black text-slate-900 dark:text-white">₹{s.price.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{s.tax_percent}% {s.tax_type}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => openEdit(s)}>
                          <Pencil className="w-3.5 h-3.5 text-slate-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => {
                          if (confirm('Delete this service?')) deleteService.mutate(s.id);
                        }}>
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Service' : 'New Service'} maxWidth="md">
        <div className="grid grid-cols-2 gap-4 px-1 py-2">
          <div className="col-span-2 space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Service Name *</Label>
            <Input placeholder="e.g. Masala Dosa" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl h-11 bg-slate-50 dark:bg-white/[0.02]" />
          </div>
          <div className="space-y-1.5">
            <CustomSelect 
              label="Outlet *"
              value={String(form.outlet_id)} 
              onChange={v => setForm(f => ({ ...f, outlet_id: v }))}
              options={outlets.map(o => ({ value: String(o.id), label: o.name }))}
            />
          </div>
          <div className="space-y-1.5">
            <CustomSelect 
              label="Category *"
              value={form.category} 
              onChange={v => setForm(f => ({ ...f, category: v as HotelService['category'] }))}
              options={SERVICE_CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Price (₹) *</Label>
            <Input type="number" min="0" placeholder="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="rounded-xl h-11 bg-slate-50 dark:bg-white/[0.02]" />
          </div>
          <div className="space-y-1.5">
            <CustomSelect 
              label="Tax Type *"
              value={form.tax_type} 
              onChange={v => setForm(f => ({ ...f, tax_type: v as HotelService['tax_type'] }))}
              options={[
                { value: 'exclusive', label: 'Exclusive (+ GST)' },
                { value: 'inclusive', label: 'Inclusive (with GST)' },
                { value: 'nil', label: 'Nil (No GST)' },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Tax %</Label>
            <Input type="number" min="0" max="100" value={form.tax_percent} onChange={e => setForm(f => ({ ...f, tax_percent: e.target.value }))} className="rounded-xl h-11 bg-slate-50 dark:bg-white/[0.02]" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Sort Order</Label>
            <Input type="number" min="0" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="rounded-xl h-11 bg-slate-50 dark:bg-white/[0.02]" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Description</Label>
            <Textarea placeholder="Optional" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl min-h-[80px] bg-slate-50 dark:bg-white/[0.02]" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="font-bold text-sm text-slate-700 dark:text-slate-300">Image (Optional)</Label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-500/5">
              {(form.image || form.image_url) ? (
                <>
                  <img src={form.image ? URL.createObjectURL(form.image) : form.image_url} alt="Preview" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => setForm(f => ({ ...f, image: null, image_url: '' }))} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="w-full h-32 flex flex-col items-center justify-center cursor-pointer text-slate-500">
                  <Image className="w-8 h-8 mb-2 text-slate-400" />
                  <span className="text-sm font-semibold">Click to upload image</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</span>
                  <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={e => {
                    if (e.target.files?.[0]) setForm(f => ({ ...f, image: e.target.files![0] }));
                  }} />
                </label>
              )}
            </div>
          </div>
          <div className="col-span-2 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/5">
            <Toggle 
              checked={form.is_available} 
              onChange={c => setForm(f => ({ ...f, is_available: c }))}
              label="Available in POS"
              description="Is this item currently available to order?"
            />
          </div>
          <div className="col-span-2 flex gap-3 pt-3">
            <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl h-11 bg-orange-600 hover:bg-orange-700 text-white font-black tracking-wide shadow-lg shadow-orange-500/25" onClick={handleSave}
              disabled={isUploading || createService.isPending || updateService.isPending}>
              {isUploading ? 'Uploading...' : (editing ? 'Update' : 'Create Service')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

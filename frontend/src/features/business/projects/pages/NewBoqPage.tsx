import React, { useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PieChart, ArrowLeft, Plus, Trash2, Layers, DollarSign, 
  Building2, User, Calendar, CheckCircle2, Copy, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { boqService, type CreateBoqPayload } from '../api/boqService';
import { projectService } from '../api/projectService';
import { useInventory } from '@/features/business/inventory/api/useInventory';
import { useCategories } from '@/features/business/inventory/api/useCategories';
import { useUnits, useCreateUnit } from '@/features/business/inventory/api/useUnits';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

interface BoqFormItem {
  item_name: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  product_id?: number;
}

interface BoqFormSection {
  section_name: string;
  items: BoqFormItem[];
}

export default function NewBoqPage() {
  const { data: categoriesData } = useCategories();
  const { data: unitsData } = useUnits();
  const createUnitMutation = useCreateUnit();
  const categories = categoriesData?.data || [];
  const units = unitsData || [];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { id: editId } = useParams<{ id: string }>();
  const defaultProjectId = searchParams.get('project_id');

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectId, setProjectId] = useState<number | undefined>(defaultProjectId ? Number(defaultProjectId) : undefined);
  const [validityDate, setValidityDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('draft');

  const [sections, setSections] = useState<BoqFormSection[]>([
    {
      section_name: 'Section 1',
      items: [
        { item_name: '', description: '', unit: 'Sq.ft', quantity: 1, rate: 0 },
      ]
    }
  ]);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects({ status: 'active' }),
  });

  useQuery({
    queryKey: ['boq', editId],
    queryFn: async () => {
      if (!editId) return null;
      const data = await boqService.getBoq(editId);
      setName(data.name);
      setClientName(data.client_name || '');
      setProjectId(data.project_id || undefined);
      if (data.validity_date) setValidityDate(data.validity_date.split('T')[0]);
      setNotes(data.notes || '');
      setStatus(data.status);
      
      if (data.sections && data.sections.length > 0) {
        setSections(data.sections.map((s: any) => ({
          section_name: s.section_name,
          items: s.items.map((i: any) => ({
            item_name: i.item_name,
            description: i.description || '',
            unit: i.unit,
            quantity: i.quantity,
            rate: i.rate,
            product_id: i.product_id
          }))
        })));
      }
      return data;
    },
    enabled: !!editId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBoqPayload) => editId ? boqService.updateBoq(editId, data) : boqService.createBoq(data),
    onSuccess: (newBoq) => {
      toast.success(editId ? `BOQ "${newBoq.name}" updated successfully!` : `BOQ "${newBoq.name}" saved successfully!`);
      queryClient.invalidateQueries({ queryKey: ['boqs'] });
      navigate('/boq');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save BOQ');
    },
  });

  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      { section_name: `Section ${prev.length + 1}`, items: [{ item_name: '', description: '', unit: 'Sq.ft', quantity: 1, rate: 0 }] }
    ]);
  };

  const handleRemoveSection = (sectionIdx: number) => {
    if (sections.length <= 1) {
      toast.error('At least one section/room is required');
      return;
    }
    setSections(prev => prev.filter((_, idx) => idx !== sectionIdx));
  };

  const handleSectionNameChange = (sectionIdx: number, val: string) => {
    setSections(prev => prev.map((sec, idx) => idx === sectionIdx ? { ...sec, section_name: val } : sec));
  };

  const handleAddItem = (sectionIdx: number) => {
    setSections(prev => prev.map((sec, idx) => {
      if (idx === sectionIdx) {
        return {
          ...sec,
          items: [...sec.items, { item_name: '', description: '', unit: 'Sq.ft', quantity: 1, rate: 0 }]
        };
      }
      return sec;
    }));
  };

  const handleRemoveItem = (sectionIdx: number, itemIdx: number) => {
    setSections(prev => prev.map((sec, idx) => {
      if (idx === sectionIdx) {
        return { ...sec, items: sec.items.filter((_, i) => i !== itemIdx) };
      }
      return sec;
    }));
  };

  const handleItemChange = (sectionIdx: number, itemIdx: number, field: keyof BoqFormItem, value: any) => {
    setSections(prev => prev.map((sec, idx) => {
      if (idx === sectionIdx) {
        const newItems = sec.items.map((item, i) => {
          if (i === itemIdx) {
            let val = value;
            if (field === 'quantity' || field === 'rate') {
              val = parseFloat(value) || 0;
            }
            return { ...item, [field]: val };
          }
          return item;
        });
        return { ...sec, items: newItems };
      }
      return sec;
    }));
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    setProjectId(val);
    if (val) {
      const proj = projects.find(p => p.id === val);
      if (proj && !clientName) {
        setClientName(proj.client_name || '');
      }
    }
  };

  const grandTotal = sections.reduce((sum, sec) => {
    return sum + sec.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a BOQ title/name');
      return;
    }

    const proj = projects.find(p => p.id === projectId);

    const payload: CreateBoqPayload = {
      name,
      client_name: clientName || proj?.client_name || 'General Client',
      project_name: proj?.name || undefined,
      project_id: projectId,
      validity_date: validityDate,
      notes,
      status,
      sections: sections.map((sec, sIdx) => ({
        section_name: sec.section_name,
        sort_order: sIdx,
        items: sec.items.map((item) => ({
          item_name: item.item_name || 'Unnamed Item',
          description: item.description || undefined,
          unit: item.unit || 'Sq.ft',
          quantity: item.quantity,
          rate: item.rate,
        }))
      })),
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-24 relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm sticky top-4 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/boq')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-indigo-600 dark:from-white dark:to-purple-300">
                Room-Wise BOQ / Quotation Builder
              </h1>
              <p className="text-xs text-slate-500 font-medium">Build itemized sections for residential & commercial sites</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block uppercase font-bold">Estimated Grand Total</span>
              <span className="text-xl font-black text-purple-600">{formatCurrency(grandTotal)}</span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-8 font-bold shadow-md shadow-purple-500/20 h-11"
            >
              {createMutation.isPending ? 'Saving BOQ...' : 'Save BOQ Template'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Meta Info */}
          <div className="bg-white dark:bg-[#111118] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-600 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <PieChart className="w-4 h-4" />
              1. Quotation Header & Project Link
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">BOQ / Quotation Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., 3BHK Interior Turnkey Quotation - Phase 1"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Link to Construction Site / Project</label>
                <select
                  value={projectId || ''}
                  onChange={handleProjectSelect}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium"
                >
                  <option value="">-- No Project (Standalone Quote) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.project_code || 'PROJ'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g., Mr. Amit Verma"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Validity Until Date</label>
                <input
                  type="date"
                  value={validityDate}
                  onChange={e => setValidityDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-bold text-purple-600"
                >
                  <option value="draft">📝 Draft Estimate</option>
                  <option value="sent">📤 Sent to Client</option>
                  <option value="approved">✅ Approved</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Terms & Quotation Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Terms of payment, taxes, installation exclusions..."
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Room / Section Builder */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                2. Room / Section Breakdown ({sections.length} Rooms/Sections)
              </h2>
              <Button
                type="button"
                onClick={handleAddSection}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 rounded-xl text-xs font-bold h-9"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Room / Section
              </Button>
            </div>

            {sections.map((section, sIdx) => {
              const sectionTotal = section.items.reduce((s, i) => s + (i.quantity * i.rate), 0);
              return (
                <div
                  key={sIdx}
                  className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                >
                  {/* Section Header */}
                  <div className="p-6 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {sIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={section.section_name}
                        onChange={e => handleSectionNameChange(sIdx, e.target.value)}
                        placeholder="e.g., Living Room, Modular Kitchen, Electrical Fittings"
                        className="w-full sm:w-96 px-4 py-2 text-base font-black bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block uppercase font-bold">Section Total</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{formatCurrency(sectionTotal)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete this Section"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Section Items Table */}
                  <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                          <th className="pb-3 w-8">#</th>
                          <th className="pb-3 min-w-[200px]">Item Specification / Work</th>
                          <th className="pb-3 min-w-[150px]">Description / Specs</th>
                          <th className="pb-3 w-24 text-center">Unit</th>
                          <th className="pb-3 w-28 text-center">Qty / Area</th>
                          <th className="pb-3 w-32 text-right">Rate (₹)</th>
                          <th className="pb-3 w-36 text-right">Amount (₹)</th>
                          <th className="pb-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {section.items.map((item, iIdx) => {
                          const amount = item.quantity * item.rate;
                          return (
                            <tr key={iIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="py-3 text-xs font-bold text-slate-400">{iIdx + 1}</td>
                              <td className="py-3 pr-2">
                                <input
                                  type="text"
                                  value={item.item_name}
                                  onChange={e => handleItemChange(sIdx, iIdx, 'item_name', e.target.value)}
                                  placeholder="e.g., Gypsum False Ceiling, Acrylic Paint"
                                  className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                />
                              </td>
                              <td className="py-3 pr-2">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={e => handleItemChange(sIdx, iIdx, 'description', e.target.value)}
                                  placeholder="e.g., Including channel and putty coat"
                                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-600 dark:text-slate-400"
                                />
                              </td>
                              <td className="py-3 px-1">
                                <SearchableSelect
                                  value={item.unit}
                                  onChange={val => handleItemChange(sIdx, iIdx, 'unit', String(val))}
                                  options={units.map(u => ({ value: u.name, label: u.name }))}
                                  creatable={true}
                                  onCreate={async (val) => {
                                    try {
                                      await createUnitMutation.mutateAsync({ name: val });
                                      handleItemChange(sIdx, iIdx, 'unit', val);
                                    } catch (e) {
                                      toast.error('Failed to create unit');
                                    }
                                  }}
                                  controlSize="sm"
                                  dropdownPlacement="top"
                                  menuPosition="fixed"
                                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                />
                              </td>
                              <td className="py-3 px-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.quantity}
                                  onChange={e => handleItemChange(sIdx, iIdx, 'quantity', e.target.value)}
                                  className="w-full px-2 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-bold"
                                />
                              </td>
                              <td className="py-3 px-1">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.rate}
                                  onChange={e => handleItemChange(sIdx, iIdx, 'rate', e.target.value)}
                                  className="w-full px-2 py-1.5 text-sm text-right bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="py-3 pl-2 text-right font-bold text-purple-600">
                                {formatCurrency(amount)}
                              </td>
                              <td className="py-3 text-center">
                                {section.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(sIdx, iIdx)}
                                    className="p-1 rounded text-slate-300 hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddItem(sIdx)}
                        className="rounded-xl text-xs font-bold border-dashed border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/40"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Item to "{section.section_name}"
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Total Bar */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-purple-200 font-bold block mb-1">
                Total Quotation Value
              </span>
              <span className="text-3xl font-black">{formatCurrency(grandTotal)}</span>
              <span className="text-xs text-purple-300 block mt-1">
                Across {sections.length} Rooms/Sections ({sections.reduce((s, sec) => s + sec.items.length, 0)} Total Items)
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/boq')}
                className="rounded-xl px-6 bg-white/10 hover:bg-white/20 border-white/20 text-white w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-white text-purple-900 hover:bg-purple-50 font-black px-8 rounded-xl h-12 shadow-lg w-full sm:w-auto text-sm"
              >
                {createMutation.isPending ? 'Saving BOQ...' : (editId ? 'Update BOQ Estimate' : 'Submit & Save BOQ')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, ArrowLeft, Plus, Trash2, CheckCircle2, AlertTriangle, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projectService } from '../api/projectService';
import { consumptionService, type CreateConsumptionPayload } from '../api/consumptionService';
import { useInventory } from '@/features/business/inventory/api/useInventory';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

interface ConsumptionFormItem {
  product_id: number;
  product_name: string;
  item_code: string;
  available_qty: number;
  quantity: number;
  unit: string;
  rate: number;
  notes: string;
}

export default function NewConsumptionPage() {
  const { id: projectIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ConsumptionFormItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectIdParam],
    queryFn: () => projectService.getProject(projectIdParam!),
    enabled: !!projectIdParam,
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useInventory({ search: searchTerm });
  const products = inventoryData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: CreateConsumptionPayload) => consumptionService.createConsumption(data),
    onSuccess: () => {
      toast.success('Material consumption recorded and inventory stock deducted successfully!');
      queryClient.invalidateQueries({ queryKey: ['project-consumptions'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      navigate(`/business/projects/${projectIdParam}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to record material consumption');
    },
  });

  const handleAddProduct = (product: any) => {
    if (items.some(i => i.product_id === product.id)) {
      toast.info('Product is already added in the table below');
      return;
    }

    const newItem: ConsumptionFormItem = {
      product_id: product.id,
      product_name: product.model_name || product.name || 'Item',
      item_code: product.item_code || 'N/A',
      available_qty: product.quantity || 0,
      quantity: 1,
      unit: product.unit || 'Pcs',
      rate: product.purchase_rate || (product.sale_rate ? product.sale_rate * 0.7 : 0),
      notes: '',
    };

    setItems(prev => [...prev, newItem]);
    setSearchTerm('');
    toast.success(`Added "${newItem.product_name}" to consumption list`);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ConsumptionFormItem, value: any) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        let val = value;
        if (field === 'quantity' || field === 'rate') {
          val = parseFloat(value) || 0;
        }
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdParam) {
      toast.error('Project ID missing');
      return;
    }
    if (items.length === 0) {
      toast.error('Please add at least one material/product item');
      return;
    }

    // Check if any item exceeds available stock
    for (const item of items) {
      if (item.quantity <= 0) {
        toast.error(`Quantity for "${item.product_name}" must be greater than 0`);
        return;
      }
      if (item.quantity > item.available_qty) {
        toast.warning(`Warning: "${item.product_name}" requested quantity (${item.quantity}) exceeds available stock (${item.available_qty})`);
      }
    }

    const payload: CreateConsumptionPayload = {
      project_id: Number(projectIdParam),
      date,
      notes,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        notes: item.notes || undefined,
      })),
    };

    createMutation.mutate(payload);
  };

  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-20 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/business/projects/${projectIdParam}`)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Record Material Consumption (Stock Out)
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {project ? `Site: ${project.name} (${project.project_code || 'PROJ'})` : 'Select materials used on site'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Slip Details */}
          <div className="bg-white dark:bg-[#111118] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Layers className="w-4 h-4" />
              1. Issue Slip Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Consumption / Issue Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supervisor / Site Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g., Issued for 2nd floor roof slab casting"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product Search & Add */}
          <div className="bg-white dark:bg-[#111118] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Package className="w-4 h-4" />
              2. Search & Select Inventory Materials
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cement, steel pipes, bricks, tiles by name or item code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium shadow-inner"
              />
            </div>

            {searchTerm.trim().length > 0 && (
              <div className="max-h-60 overflow-y-auto bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-lg">
                {inventoryLoading ? (
                  <div className="p-4 text-center text-xs text-slate-500">Searching inventory...</div>
                ) : products.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">No matching materials found in inventory.</div>
                ) : (
                  products.map((product: any) => (
                    <div
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="p-3.5 flex items-center justify-between hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
                          {product.model_name || product.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          Code: {product.item_code || 'N/A'} • Unit: {product.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          product.quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Stock: {product.quantity} {product.unit}
                        </span>
                        <span className="block text-xs text-slate-400 mt-0.5">
                          Rate: {formatCurrency(product.purchase_rate || product.sale_rate || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section 3: Selected Items Table */}
          <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Selected Materials ({items.length})
              </h3>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Total Estimated Cost: <strong className="text-rose-600 text-lg">{formatCurrency(totalCost)}</strong>
              </span>
            </div>

            {items.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No items added yet</p>
                <p className="text-xs text-slate-400">Use the search box above to add materials consumed on site.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-4">Material / Item</th>
                      <th className="p-4 text-center">Available Stock</th>
                      <th className="p-4 w-32">Qty Consumed</th>
                      <th className="p-4 w-24">Unit</th>
                      <th className="p-4 w-36 text-right">Rate (₹)</th>
                      <th className="p-4 text-right">Amount (₹)</th>
                      <th className="p-4 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {items.map((item, index) => {
                      const amount = item.quantity * item.rate;
                      const isOverStock = item.quantity > item.available_qty;
                      return (
                        <tr key={item.product_id} className={isOverStock ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                          <td className="p-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.product_name}</span>
                            <span className="text-xs text-slate-400 font-mono">Code: {item.item_code}</span>
                            {isOverStock && (
                              <span className="block text-[11px] font-bold text-amber-600 flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Exceeds current stock!
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.available_qty > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.available_qty} {item.unit}
                            </span>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.quantity}
                              onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                            />
                          </td>
                          <td className="p-4 text-slate-600">{item.unit}</td>
                          <td className="p-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={e => handleItemChange(index, 'rate', e.target.value)}
                              className="w-full px-3 py-1.5 text-sm text-right bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="p-4 text-right font-bold text-rose-600">{formatCurrency(amount)}</td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/business/projects/${projectIdParam}`)}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || items.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-8 font-bold shadow-md shadow-emerald-500/20"
            >
              {createMutation.isPending ? 'Recording Consumption...' : 'Submit & Deduct Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

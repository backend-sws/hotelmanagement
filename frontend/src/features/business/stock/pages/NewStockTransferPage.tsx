import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, ArrowRight, Truck, Search, AlertTriangle, 
  MapPin, Package, CheckCircle2, FileText, ArrowLeftRight, Calendar, 
  Building2, Sparkles, ShieldAlert, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createStockTransfer, getLocationWiseStock } from '../api/stockService';
import { toast } from 'sonner';
import api from '@/lib/api';

interface TransferItem {
  product_id: number;
  product_name: string;
  item_code?: string;
  quantity: number;
  unit: string;
  available: number;
}

export default function NewStockTransferPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [fromLocationId, setFromLocationId] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TransferItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Load locations
  const { data: locationData } = useQuery({
    queryKey: ['stock-location-wise'],
    queryFn: getLocationWiseStock,
  });

  // Business locations list
  const { data: locationsData } = useQuery({
    queryKey: ['business-locations'],
    queryFn: () => api.get('/business/locations').then(r => r.data?.data ?? r.data ?? []),
  });

  const locations: any[] = Array.isArray(locationsData)
    ? locationsData
    : (locationsData?.data ?? []);

  // Product search
  useEffect(() => {
    if (!productSearch || productSearch.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get('/business/stock/summary', {
          params: { search: productSearch, per_page: 15, location_id: fromLocationId ? Number(fromLocationId) : undefined },
        });
        setSearchResults(res.data?.data ?? []);
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [productSearch, fromLocationId]);

  const addItem = (product: any) => {
    if (items.find(i => i.product_id === product.id)) {
      toast.info('Item already added to manifest');
      return;
    }
    setItems(prev => [...prev, {
      product_id: product.id,
      product_name: product.name,
      item_code: product.item_code,
      quantity: 1,
      unit: product.unit ?? 'pcs',
      available: product.current_qty ?? 0,
    }]);
    setProductSearch('');
    setSearchResults([]);
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) => setItems(prev =>
    prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(0.001, qty) } : item)
  );

  const mutation = useMutation({
    mutationFn: createStockTransfer,
    onSuccess: (data) => {
      toast.success(data.message ?? 'Stock transfer completed successfully!');
      qc.invalidateQueries({ queryKey: ['stock-transfers'] });
      qc.invalidateQueries({ queryKey: ['stock-summary'] });
      qc.invalidateQueries({ queryKey: ['location-wise-stock'] });
      navigate('/stock/transfer');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Transfer failed'),
  });

  const handleSubmit = () => {
    if (!fromLocationId || !toLocationId) { toast.error('Please select both source and destination locations'); return; }
    if (fromLocationId === toLocationId) { toast.error('Source and destination locations cannot be identical'); return; }
    if (items.length === 0) { toast.error('Add at least one product item to transfer'); return; }
    const hasError = items.find(i => i.quantity > i.available);
    if (hasError) { toast.error(`Insufficient stock in source godown for "${hasError.product_name}"`); return; }

    mutation.mutate({
      from_location_id: Number(fromLocationId),
      to_location_id: Number(toLocationId),
      transfer_date: transferDate,
      notes: notes || undefined,
      items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, unit: i.unit })),
    });
  };

  const fromLocName = locations.find(l => String(l.id) === fromLocationId)?.name;
  const toLocName = locations.find(l => String(l.id) === toLocationId)?.name;
  const hasExceedingStock = items.some(i => i.quantity > i.available);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Glowing Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[40%] h-[40%] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  New Stock Transfer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Manifest Creation
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                Move inventory between warehouses with real-time stock validation and instant balance updates.
              </p>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/stock/transfer')}
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold px-4 h-10 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Transfers List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Form Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Location & Schedule */}
            <Card className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden relative">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs">
                  01
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    Route & Transfer Schedule
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Select origin and destination warehouses for this stock movement.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* From Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    Source Godown (From) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={fromLocationId}
                      onChange={e => {
                        setFromLocationId(e.target.value);
                        if (e.target.value === toLocationId) setToLocationId('');
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all h-11 appearance-none"
                    >
                      <option value="">-- Select Source Warehouse --</option>
                      {locations.map((loc: any) => (
                        <option key={loc.id} value={loc.id}>{loc.name} {loc.is_default ? '(Default)' : ''}</option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* To Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    Destination Godown (To) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={toLocationId}
                      onChange={e => setToLocationId(e.target.value)}
                      disabled={!fromLocationId}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all h-11 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Select Destination Warehouse --</option>
                      {locations
                        .filter((l: any) => String(l.id) !== fromLocationId)
                        .map((loc: any) => (
                          <option key={loc.id} value={loc.id}>{loc.name} {loc.is_default ? '(Default)' : ''}</option>
                        ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 pt-5 border-t border-slate-100 dark:border-zinc-800/80">
                {/* Transfer Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    Transfer Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={transferDate}
                      onChange={e => setTransferDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all h-11"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    Transfer Notes / Reference
                  </label>
                  <input
                    placeholder="e.g., Vehicle No, Gate Pass reference…"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all h-11"
                  />
                </div>
              </div>
            </Card>

            {/* Step 2: Item Search & Manifest Table */}
            <Card className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden relative">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                    02
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                      Manifest Products
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {fromLocationId ? `Searching inventory available at "${fromLocName}"` : 'Select source godown above before adding items.'}
                    </p>
                  </div>
                </div>
                {items.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {items.length} Product{items.length !== 1 ? 's' : ''} in Manifest
                  </span>
                )}
              </div>

              {/* Product Search Box */}
              <div className="relative mb-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    placeholder={fromLocationId ? "Type at least 2 characters to search product name or item code…" : "Please select Source Godown first to search inventory…"}
                    value={productSearch}
                    disabled={!fromLocationId}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs font-bold rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {searching && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Live Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="absolute z-30 top-full mt-2 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-900 max-h-72 overflow-y-auto">
                    <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      Available Products in {fromLocName}
                    </div>
                    {searchResults.map(p => {
                      const alreadyAdded = items.some(i => i.product_id === p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addItem(p)}
                          disabled={alreadyAdded}
                          className="w-full text-left px-4 py-3 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 flex items-center justify-between transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-600 dark:text-zinc-400 font-bold text-xs group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                  {p.name}
                                </p>
                                {p.item_code && (
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                                    {p.item_code}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Category: {p.category ?? 'General'} • Brand: {p.brand ?? 'Standard'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                              (p.current_qty ?? 0) <= 0
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {p.current_qty ?? 0} {p.unit ?? 'pcs'}
                            </span>
                            {alreadyAdded && (
                              <p className="text-[10px] font-bold text-blue-500 mt-0.5">Already in list</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800">
                          <th className="py-3 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-12">#</th>
                          <th className="py-3 px-4 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Product Details</th>
                          <th className="py-3 px-4 text-right text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Source Stock</th>
                          <th className="py-3 px-4 text-center text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-36">Transfer Qty</th>
                          <th className="py-3 px-4 text-center text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest w-12">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-xs font-medium">
                        {items.map((item, idx) => {
                          const exceeds = item.quantity > item.available;
                          return (
                            <tr key={item.product_id} className={`hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors ${exceeds ? 'bg-rose-50/60 dark:bg-rose-950/20' : ''}`}>
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900 dark:text-white text-sm">
                                  {item.product_name}
                                </div>
                                {item.item_code && (
                                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                                    Code: {item.item_code}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-extrabold text-slate-700 dark:text-zinc-300">
                                  {item.available}
                                </span> <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min="0.001"
                                      step="0.001"
                                      value={item.quantity}
                                      onChange={e => updateQty(idx, Number(e.target.value))}
                                      className={`w-24 px-2.5 py-1.5 text-center font-black text-sm rounded-lg border shadow-inner transition-all ${
                                        exceeds 
                                          ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 focus:ring-2 focus:ring-rose-500/30' 
                                          : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                                      } focus:outline-none`}
                                    />
                                    <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                                  </div>
                                  {exceeds && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                                      <AlertTriangle className="w-3 h-3" /> Exceeds stock
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeItem(idx)}
                                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-all mx-auto"
                                  title="Remove item"
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
                </div>
              ) : (
                <div className="py-12 px-6 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/40 dark:bg-zinc-950/30">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-3 animate-pulse">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                    No Items in Manifest Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    Select your source godown above, then search and select inventory items to build your transfer order.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Executive Summary Card (1 col) */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <Card className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-md bg-gradient-to-b from-white to-slate-50/80 dark:from-zinc-900 dark:to-zinc-950/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="font-black text-slate-900 dark:text-white text-base tracking-tight">
                    Transfer Summary
                  </h2>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500">
                  Draft
                </span>
              </div>

              {/* Route Indicator Box */}
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block">
                      From Source
                    </span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                      {fromLocName ?? <span className="text-slate-400 italic font-normal">Not selected</span>}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 block">
                      To Destination
                    </span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                      {toLocName ?? <span className="text-slate-400 italic font-normal">Not selected</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Numerical Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                  <span>Unique Products:</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{items.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                  <span>Total Transfer Qty:</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    {items.reduce((s, i) => s + i.quantity, 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-zinc-400">
                  <span>Transfer Date:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{transferDate}</span>
                </div>
              </div>

              {/* Validation Status Banner */}
              {items.length > 0 && (
                <div className="pt-2">
                  {hasExceedingStock ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <p className="text-xs font-bold leading-tight">
                        Cannot complete transfer: one or more item quantities exceed source godown stock.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <p className="text-xs font-bold leading-tight">
                        Manifest is validated. Stock balances will update immediately upon completion.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm tracking-wide rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  onClick={handleSubmit}
                  disabled={mutation.isPending || items.length === 0 || !fromLocationId || !toLocationId || hasExceedingStock}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Transfer…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Complete Stock Transfer
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-11 border-slate-200 dark:border-zinc-800 font-bold text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => navigate('/stock/transfer')}
                >
                  Cancel & Return
                </Button>
              </div>
            </Card>

            {/* Quick Tips Box */}
            <Card className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-blue-800 dark:text-blue-300 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Pro Tip
              </div>
              <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                Once completed, inventory will be deducted from the source warehouse and credited to the destination warehouse instantly.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

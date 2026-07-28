import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/formatters';
import { 
  RotateCcw, 
  Search, 
  Trash2, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Minus, 
  Receipt, 
  User, 
  Calendar,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface CreditItem {
  id: string;
  product_id: number;
  name: string;
  quantity: number;
  maxQuantity: number;
  rate: number;
  gst_rate: number;
  hsn_code?: string;
  unit?: string;
  amount: number;
}

export default function NewCreditNotePage() {
  const navigate = useNavigate();
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [originalInvoice, setOriginalInvoice] = useState<any>(null);
  const [items, setItems] = useState<CreditItem[]>([]);
  const [reason, setReason] = useState('partial_return');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchInvoice = async () => {
    if (!invoiceSearch.trim()) {
      toast.error('Please enter an invoice number to search');
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.get('/business/invoices', { params: { search: invoiceSearch } });
      const invoices = res.data.data?.data || res.data?.data || [];
      const found = (Array.isArray(invoices) ? invoices : []).find((i: any) => 
        i.invoice_number?.toLowerCase().includes(invoiceSearch.trim().toLowerCase()) && 
        in_array_safe(i.invoice_type, ['sales_invoice', 'delivery_challan', 'credit_note', 'proforma'])
      ) || (Array.isArray(invoices) && invoices.length > 0 ? invoices[0] : null);

      if (found) {
        const detail = await api.get(`/business/invoices/${found.id}`);
        const invData = detail.data?.data || detail.data;
        setOriginalInvoice(invData);
        if (invData.items && Array.isArray(invData.items)) {
          setItems(invData.items.map((item: any) => {
            const qty = Number(item.quantity) || 1;
            const rate = Number(item.rate || item.unit_price || 0);
            return {
              id: Math.random().toString(36).substring(2, 9),
              product_id: item.product_id,
              name: item.product?.model_name || item.product?.name || item.name || 'Unnamed Product',
              quantity: qty,
              maxQuantity: qty,
              rate: rate,
              gst_rate: Number(item.gst_rate || 0),
              hsn_code: item.hsn_code || item.product?.hsn_code || '',
              unit: item.unit || item.product?.unit || 'pcs',
              amount: Number((qty * rate).toFixed(2))
            };
          }));
        }
        toast.success(`Linked invoice #${invData.invoice_number} successfully!`);
      } else {
        toast.error('No matching sales invoice found');
      }
    } catch {
      toast.error('Failed to search invoice. Please verify invoice number.');
    }
    setIsSearching(false);
  };

  const in_array_safe = (val: string, arr: string[]) => arr.includes(val);

  const updateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0.1, Math.min(qty, i.maxQuantity));
        return { ...i, quantity: newQty, amount: Number((newQty * i.rate).toFixed(2)) };
      }
      return i;
    }));
  };

  const updateRate = (id: string, rate: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newRate = Math.max(0, rate);
        return { ...i, rate: newRate, amount: Number((i.quantity * newRate).toFixed(2)) };
      }
      return i;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totals = useMemo(() => {
    let taxableTotal = 0;
    let taxTotal = 0;
    
    items.forEach(item => {
      const baseAmt = item.rate * item.quantity;
      const taxAmt = baseAmt * (item.gst_rate / 100);
      taxableTotal += baseAmt;
      taxTotal += taxAmt;
    });

    const grandTotal = taxableTotal + taxTotal;
    return {
      taxableTotal: Number(taxableTotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2))
    };
  }, [items]);

  const handleSubmit = async () => {
    if (!originalInvoice || items.length === 0) {
      toast.error('Please search and link an invoice, and retain at least one credit item');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/business/credit-notes', {
        parent_id: originalInvoice.id,
        reason,
        notes: notes.trim() ? notes : `Credit note against #${originalInvoice.invoice_number} (${getReasonTitle(reason)})`,
        items: items.map(i => ({
          product_id: i.product_id,
          quantity: Number(i.quantity),
          rate: Number(i.rate),
          gst_rate: Number(i.gst_rate || 0),
          hsn_code: i.hsn_code,
          unit: i.unit,
        })),
      });
      toast.success('🎉 Credit Note created successfully!');
      navigate('/credit-notes');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create credit note');
    }
    setIsSubmitting(false);
  };

  const getReasonTitle = (r: string) => {
    switch(r) {
      case 'damaged': return 'Damaged / Defective Goods';
      case 'wrong_item': return 'Wrong Item Delivered';
      case 'rate_correction': return 'Rate Correction / Discount Adjustment';
      case 'partial_return': return 'Partial Sales Return';
      default: return 'Commercial Adjustment';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto space-y-6 pb-32">
      {/* Top Bar with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/credit-notes')}
            className="h-10 w-10 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <RotateCcw className="w-6 h-6 text-rose-500 stroke-[2.5]" /> Create Credit Note
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Adjust billing value, record customer goods returns, and keep warehouse inventory & customer ledgers synced.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step 1: Search & Link Invoice Card */}
        <Card className="lg:col-span-6 xl:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 shadow-md space-y-5 h-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white font-black text-xs shadow-sm">1</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Link Original Invoice</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 1 of 3</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <Input
                  placeholder="Type invoice # (e.g., INV-0001)..."
                  value={invoiceSearch}
                  onChange={e => setInvoiceSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchInvoice()}
                  className="h-11 pl-10 rounded-xl font-bold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-sm"
                />
              </div>
              <Button 
                onClick={searchInvoice} 
                disabled={isSearching}
                className="h-11 px-6 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20"
              >
                <Search className="w-4 h-4 mr-2" /> {isSearching ? 'Searching...' : 'Find Invoice'}
              </Button>
            </div>

            {/* Linked Invoice Preview Card */}
            {originalInvoice ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/30 dark:border-emerald-500/20 space-y-3 transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-black text-sm text-emerald-800 dark:text-emerald-300">
                      Linked #{originalInvoice.invoice_number}
                    </span>
                  </div>
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Ready for Credit Adjustment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-500/15 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Customer: <strong className="text-slate-900 dark:text-white font-bold">{originalInvoice.customer?.name || 'Walk-in'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Date: <strong className="text-slate-900 dark:text-white font-bold">{new Date(originalInvoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Total: <strong className="text-rose-600 dark:text-rose-400 font-black">{formatCurrency(Number(originalInvoice.final_amount || 0))}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-300 dark:border-white/15 flex items-center gap-3 text-slate-500 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Enter an existing invoice number above and click <strong>Find Invoice</strong> to automatically load the sold products and customer ledger account.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Step 2: Reason & Remarks */}
        <Card className="lg:col-span-6 xl:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 shadow-md space-y-5 h-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white font-black text-xs shadow-sm">2</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Reason for Credit Note</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 2 of 3</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Adjustment Type</Label>
              <Select 
                value={reason} 
                onChange={e => setReason(e.target.value)}
                className="h-11 text-xs font-bold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10"
              >
                <option value="partial_return">🔄 Partial Sales Return (Maal Wapsi)</option>
                <option value="damaged">📦 Damaged or Defective Goods</option>
                <option value="rate_correction">💰 Rate Correction / Overcharging</option>
                <option value="wrong_item">❌ Wrong Item Delivered</option>
                <option value="other">📝 Other Commercial Discount / Credit</option>
              </Select>
              <p className="text-[11px] text-slate-500 font-medium pt-0.5 leading-relaxed">
                {reason === 'rate_correction' 
                  ? 'Tip: You can reduce the rate or amount below without returning physical items to stock.'
                  : 'Selected items will be automatically returned to your available warehouse inventory.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Internal Remarks / Notes (Optional)</Label>
              <Textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="E.g., Customer returned 2 defective battery units; replacement approved..." 
                className="h-[84px] rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 p-3"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Step 3: Return Items Table */}
      {originalInvoice && (
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500 text-white font-black text-xs shadow-sm">3</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Adjust Items & Return Quantity</h3>
            </div>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full">
              {items.length} {items.length === 1 ? 'Item' : 'Items'} Loaded
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Item Name & Details</th>
                  <th className="py-3.5 px-3 w-40 text-center">Return Qty</th>
                  <th className="py-3.5 px-3 w-32 text-right">Rate (₹)</th>
                  <th className="py-3.5 px-3 w-24 text-right">GST %</th>
                  <th className="py-3.5 px-4 w-36 text-right">Credit Amount</th>
                  <th className="py-3.5 px-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold text-xs">
                      No items retained for credit. Click search above again to reload original invoice items.
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="hover:bg-rose-50/20 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded mt-0.5 inline-block">
                          Max sold: {item.maxQuantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 0.1}
                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 shrink-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            max={item.maxQuantity}
                            step="0.1"
                            value={item.quantity || ''}
                            onChange={e => updateQty(item.id, Number(e.target.value))}
                            className="h-8 w-16 text-center font-black text-xs bg-slate-50 dark:bg-slate-900"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="h-8 w-8 rounded-lg border-slate-200 dark:border-white/10 shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-xs font-bold text-slate-400">₹</span>
                          <Input
                            type="number"
                            min="0"
                            value={item.rate || ''}
                            onChange={e => updateRate(item.id, Number(e.target.value))}
                            className="h-8 pl-6 pr-2 text-right font-bold text-xs bg-slate-50 dark:bg-slate-900"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-600 dark:text-slate-300">
                        {item.gst_rate}%
                      </td>
                      <td className="py-3 px-4 text-right font-display font-black text-sm text-rose-600 dark:text-rose-400">
                        -{formatCurrency(item.rate * item.quantity * (1 + item.gst_rate / 100))}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg" 
                          onClick={() => removeItem(item.id)}
                          title="Remove item from credit calculation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary Panel */}
          <div className="flex flex-col items-end gap-3 pt-2">
            <div className="w-full sm:w-80 rounded-2xl bg-gradient-to-br from-rose-50 via-slate-50 to-pink-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 p-5 border-2 border-rose-200 dark:border-rose-900/40 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Taxable Return Value:</span>
                <span className="font-bold font-mono">-{formatCurrency(totals.taxableTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 border-b border-rose-200/60 dark:border-rose-900/40 pb-2.5">
                <span>Total GST Adjustment:</span>
                <span className="font-bold font-mono">-{formatCurrency(totals.taxTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-black text-rose-600 dark:text-rose-400 pt-0.5">
                <span>Total Credit Value:</span>
                <span className="font-display text-xl tracking-tight">-{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Issuing this credit note will reduce {originalInvoice.customer?.name || "the customer's"} outstanding ledger dues by ₹{totals.grandTotal}.
            </p>
          </div>
        </Card>
      )}

      {/* Sticky Action Footer Bar */}
      <div className="sticky bottom-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Credit Note Value</span>
            <span className="text-xl font-display font-black text-rose-600 dark:text-rose-400">
              -{formatCurrency(totals.grandTotal)}
            </span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'} Selected
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/credit-notes')}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none h-11 px-5 rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !originalInvoice || items.length === 0}
            className="flex-1 sm:flex-none h-11 px-8 rounded-xl font-black bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/25 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Generating Note...' : 'Save & Generate Credit Note'}
          </Button>
        </div>
      </div>
    </div>
  );
}

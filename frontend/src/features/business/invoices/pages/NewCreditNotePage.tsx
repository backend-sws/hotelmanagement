import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RotateCcw, Search, Trash2, Save } from 'lucide-react';
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
    if (!invoiceSearch.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.get('/business/invoices', { params: { search: invoiceSearch } });
      const invoices = res.data.data?.data || [];
      const found = invoices.find((i: any) => 
        i.invoice_number?.toLowerCase().includes(invoiceSearch.toLowerCase()) && 
        i.invoice_type === 'sales_invoice'
      );
      if (found) {
        const detail = await api.get(`/business/invoices/${found.id}`);
        setOriginalInvoice(detail.data.data);
        setItems(detail.data.data.items.map((item: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          product_id: item.product_id,
          name: item.product?.model_name || 'Item',
          quantity: item.quantity,
          maxQuantity: item.quantity,
          rate: Number(item.rate),
          gst_rate: Number(item.gst_rate),
          hsn_code: item.hsn_code,
          unit: item.unit,
        })));
      } else {
        toast.error('Invoice not found');
      }
    } catch {
      toast.error('Search failed');
    }
    setIsSearching(false);
  };

  const updateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.maxQuantity) } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const totalAmount = items.reduce((sum, i) => sum + (i.rate * i.quantity), 0);

  const handleSubmit = async () => {
    if (!originalInvoice || items.length === 0) {
      toast.error('Select an invoice and at least one return item');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/business/credit-notes', {
        parent_id: originalInvoice.id,
        reason,
        notes,
        items: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          rate: i.rate,
          gst_rate: i.gst_rate,
          hsn_code: i.hsn_code,
          unit: i.unit,
        })),
      });
      toast.success('Credit Note created!');
      navigate('/credit-notes');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create credit note');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-14">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-rose-500" /> New Credit Note
        </h1>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Saving...' : 'Save Credit Note'}
        </Button>
      </div>

      {/* Search Invoice */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Link to Original Invoice</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search invoice number..."
            value={invoiceSearch}
            onChange={e => setInvoiceSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchInvoice()}
          />
          <Button variant="outline" onClick={searchInvoice} disabled={isSearching}>
            <Search className="w-4 h-4 mr-2" /> {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {originalInvoice && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              Linked: {originalInvoice.invoice_number} — {originalInvoice.customer?.name || 'Walk-in'}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              Date: {new Date(originalInvoice.date).toLocaleDateString('en-IN')} | Total: ₹{Number(originalInvoice.final_amount).toLocaleString()}
            </p>
          </div>
        )}
      </Card>

      {/* Reason */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onChange={e => setReason(e.target.value)}>
              <option value="damaged">Damaged Goods</option>
              <option value="wrong_item">Wrong Item Delivered</option>
              <option value="rate_correction">Rate Correction</option>
              <option value="partial_return">Partial Return</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
          </div>
        </div>
      </Card>

      {/* Items */}
      {items.length > 0 && (
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Return Items</h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-white/[0.03]">
                <tr>
                  <th className="p-3 text-left text-xs uppercase font-semibold text-slate-500">Item</th>
                  <th className="p-3 text-left text-xs uppercase font-semibold text-slate-500 w-32">Return Qty</th>
                  <th className="p-3 text-left text-xs uppercase font-semibold text-slate-500 w-24">Rate</th>
                  <th className="p-3 text-left text-xs uppercase font-semibold text-slate-500 w-20">GST %</th>
                  <th className="p-3 text-right text-xs uppercase font-semibold text-slate-500 w-28">Amount</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {items.map(item => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">Max: {item.maxQuantity} {item.unit}</p>
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        max={item.maxQuantity}
                        value={item.quantity}
                        onChange={e => updateQty(item.id, Number(e.target.value))}
                        className="h-8 w-20"
                      />
                    </td>
                    <td className="p-3">₹{item.rate}</td>
                    <td className="p-3">{item.gst_rate}%</td>
                    <td className="p-3 text-right font-bold">₹{(item.rate * item.quantity).toFixed(2)}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 w-64">
              <div className="flex justify-between font-bold text-lg text-rose-600 dark:text-rose-400">
                <span>Credit Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

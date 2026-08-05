import { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Trash2, ArrowLeft, ShoppingBag, ShieldCheck, 
  MapPin, Calendar, FileText, CheckCircle, AlertCircle, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useSuppliers } from '@/features/business/suppliers/api/useSuppliers';
import { useInventory } from '@/features/business/inventory/api/useInventory';
import { useLocations } from '@/features/business/profile/api/useLocations';
import { purchaseService, type PurchaseItemPayload } from '../api/purchaseService';
import { useUnits, useCreateUnit } from '@/features/business/inventory/api/useUnits';
import { toast } from 'sonner';

interface FormItem {
  id: string;
  product_id: number;
  name: string;
  hsn_code: string;
  unit: string;
  quantity: number;
  purchase_price: number;
  gst_rate: number;
}

export default function NewPurchasePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: suppliersData, isLoading: loadingSuppliers } = useSuppliers(1);
  const { data: inventoryData, isLoading: loadingInventory } = useInventory({ per_page: 100 } as any);
  const { data: locations, isLoading: loadingLocations } = useLocations();

  const suppliers = suppliersData?.data || [];
  const products = inventoryData?.data || [];
  const { data: unitsData } = useUnits();
  const createUnitMutation = useCreateUnit();
  const units = unitsData || [];

  // Basic Details State
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const initialSupplierId = id || searchParams.get('supplier_id');
  const [supplierId, setSupplierId] = useState<number>(initialSupplierId ? parseInt(initialSupplierId, 10) : 0);
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [locationId, setLocationId] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [isItcEligible, setIsItcEligible] = useState<boolean>(true);

  // Items state
  const [items, setItems] = useState<FormItem[]>([
    {
      id: '1',
      product_id: 0,
      name: '',
      hsn_code: '',
      unit: 'Pcs',
      quantity: 1,
      purchase_price: 0,
      gst_rate: 18
    }
  ]);

  // Payment Settlement State
  const [payments, setPayments] = useState<{ amount: number; mode: string }[]>([
    { amount: 0, mode: 'Bank Transfer' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paidAmount = useMemo(() => payments.reduce((sum, p) => sum + (parseFloat(p.amount.toString()) || 0), 0), [payments]);

  // Calculation logic
  const totals = useMemo(() => {
    let taxable = 0;
    let totalTax = 0;
    let cgst = 0;
    let sgst = 0;

    items.forEach((item) => {
      const lineTaxable = item.quantity * item.purchase_price;
      const lineTax = (lineTaxable * item.gst_rate) / 100;
      taxable += lineTaxable;
      totalTax += lineTax;
    });

    cgst = Math.round((totalTax / 2) * 100) / 100;
    sgst = Math.round((totalTax / 2) * 100) / 100;
    const finalAmount = Math.round((taxable + totalTax) * 100) / 100;
    const balanceDue = Math.max(0, finalAmount - paidAmount);

    return {
      taxable: Math.round(taxable * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      cgst,
      sgst,
      finalAmount,
      balanceDue
    };
  }, [items, paidAmount]);

  const handleProductSelect = (index: number, prodId: number) => {
    const selectedProd = products.find((p: any) => p.id === prodId);
    if (!selectedProd) return;

    const p = selectedProd as any;
    const displayName = p.model_name || p.name || p.item_code || 'Unnamed Product';
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      product_id: p.id,
      name: displayName,
      hsn_code: p.hsn_code || '9983',
      unit: p.unit || 'Pcs',
      purchase_price: Number(p.purchase_price || p.selling_price * 0.7 || p.sale_rate || p.mrp || 100),
      gst_rate: Number(p.gst_rate || 18),
    };
    setItems(updated);
  };

  const updateItemField = (index: number, field: keyof FormItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        product_id: 0,
        name: '',
        hsn_code: '',
        unit: 'Pcs',
        quantity: 1,
        purchase_price: 0,
        gst_rate: 18
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      toast.error('At least one item line is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      toast.error('Please select a Supplier / Vendor');
      return;
    }

    const validItems = items.filter(i => i.product_id > 0 && i.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please select valid products with quantities > 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        supplier_id: supplierId,
        bill_number: billNumber || undefined,
        bill_date: billDate || undefined,
        purchase_date: purchaseDate,
        due_date: dueDate || undefined,
        location_id: locationId ? Number(locationId) : undefined,
        notes: notes || undefined,
        is_itc_eligible: isItcEligible,
        payments: payments.filter(p => p.amount > 0).map(p => ({
          amount: parseFloat(p.amount.toString()) || 0,
          mode: p.mode
        })),
        items: validItems.map((it): PurchaseItemPayload => ({
          product_id: it.product_id,
          hsn_code: it.hsn_code,
          unit: it.unit,
          quantity: Number(it.quantity),
          purchase_price: Number(it.purchase_price),
          gst_rate: Number(it.gst_rate)
        })),
      };

      await purchaseService.create(payload);
      toast.success('Purchase Bill recorded! Stock replenished & Ledger updated.');
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      navigate('/business/purchases');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error creating purchase bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-600" /> Record New Purchase Bill
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Supplier & Bill Dates */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
              <span>1. Supplier & Invoice Metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isItcEligible}
                  onChange={(e) => setIsItcEligible(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Claim GST Input Tax Credit (ITC Eligible)
              </label>
            </div>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Vendor / Supplier <span className="text-rose-500">*</span>
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                required
                className="w-full h-10 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>-- Choose Supplier --</option>
                {suppliers.map((sup: any) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name} ({sup.phone ? sup.phone : 'No Phone'}) {sup.gstin ? `[GSTIN: ${sup.gstin}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Supplier Bill / Invoice Number
              </label>
              <Input
                placeholder="e.g. INV-2026/089"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Godown / Business Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Default Central Godown</option>
                {locations?.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>{loc.name} {loc.city ? `(${loc.city})` : '(Primary)'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bill Date
              </label>
              <Input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Purchase / Stock Receive Date <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-800/50 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Due Date (Optional)
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Items Table */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">2. Purchased Items & Stock Allocation</span>
            <Button type="button" size="sm" onClick={addItemRow} className="bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold px-3">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Product Row
            </Button>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 w-[32%]">Product / Item</th>
                  <th className="py-3 px-3 w-[14%]">HSN / Unit</th>
                  <th className="py-3 px-3 w-[12%] text-right">Qty</th>
                  <th className="py-3 px-3 w-[16%] text-right">Purchase Rate (₹)</th>
                  <th className="py-3 px-3 w-[12%] text-right">GST %</th>
                  <th className="py-3 px-4 w-[14%] text-right">Total (₹)</th>
                  <th className="py-3 px-3 w-[4%] text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {items.map((it, index) => {
                  const lineTaxable = it.quantity * it.purchase_price;
                  const lineTotal = lineTaxable + (lineTaxable * it.gst_rate) / 100;
                  return (
                    <tr key={it.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                      <td className="p-3">
                        <select
                          value={it.product_id}
                          onChange={(e) => handleProductSelect(index, Number(e.target.value))}
                          className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value={0}>-- Select Inventory Product --</option>
                          {products.map((prod: any) => {
                            const displayName = prod.model_name || prod.name || prod.item_code || 'Unnamed Product';
                            const brand = prod.brand?.name || prod.brand_name || (typeof prod.brand === 'string' ? prod.brand : '') || '';
                            const price = prod.purchase_price || prod.selling_price || prod.mrp || 0;
                            const stock = prod.quantity ?? prod.stock ?? 0;
                            const unit = prod.unit || 'pcs';
                            return (
                              <option key={prod.id} value={prod.id}>
                                {displayName} {brand ? `[${brand}]` : ''} | Rate: ₹{price} | Stock: {stock} {unit}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                      <td className="p-3 flex gap-1">
                        <Input
                          value={it.hsn_code}
                          onChange={(e) => updateItemField(index, 'hsn_code', e.target.value)}
                          placeholder="HSN"
                          className="h-9 text-xs w-[45%] bg-transparent"
                        />
                        <div className="w-[55%]">
                          <SearchableSelect
                            value={it.unit}
                            onChange={(val) => updateItemField(index, 'unit', String(val))}
                            options={units.map(u => ({ value: u.name, label: u.name }))}
                            creatable={true}
                            onCreate={async (val) => {
                              try {
                                await createUnitMutation.mutateAsync({ name: val });
                                updateItemField(index, 'unit', val);
                              } catch (e) {
                                toast.error('Failed to create unit');
                              }
                            }}
                            dropdownPlacement="top"
                            menuPosition="fixed"
                            controlSize="sm"
                            placeholder="Unit"
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => updateItemField(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="h-9 text-xs text-right font-semibold"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={it.purchase_price}
                          onChange={(e) => updateItemField(index, 'purchase_price', parseFloat(e.target.value) || 0)}
                          className="h-9 text-xs text-right font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={it.gst_rate}
                          onChange={(e) => updateItemField(index, 'gst_rate', parseFloat(e.target.value) || 0)}
                          className="w-full h-9 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-right font-semibold"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </td>
                      <td className="p-3 text-right font-black text-slate-800 dark:text-white">
                        ₹ {lineTotal.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Step 3: Payment & Summary Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-purple-600 dark:text-purple-400">
              3. Payment Settlement & Notes
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Upfront Split Payments (Optional)</label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setPayments([...payments, { amount: 0, mode: 'Bank Transfer' }])} className="h-7 text-xs px-2">
                    <Plus className="w-3 h-3 mr-1" /> Add Split
                  </Button>
                </div>
                {payments.map((p, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={p.amount || ''}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[index].amount = parseFloat(e.target.value) || 0;
                        setPayments(newP);
                      }}
                      placeholder="0.00"
                      className="h-10 w-1/2 text-sm font-bold text-emerald-700 dark:text-emerald-400"
                    />
                    <select
                      value={p.mode}
                      onChange={(e) => {
                        const newP = [...payments];
                        newP[index].mode = e.target.value;
                        setPayments(newP);
                      }}
                      className="w-1/2 h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-medium"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="UPI">UPI Payment</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                    {payments.length > 1 && (
                      <button type="button" onClick={() => setPayments(payments.filter((_, i) => i !== index))} className="text-rose-500 hover:bg-rose-50 p-2 rounded shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Internal Notes / Narration
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record vehicle number, courier receipt, or quality verification notes..."
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-6 shadow-md border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/40 to-indigo-50/20 dark:from-slate-900 dark:to-slate-800/90 flex flex-col justify-between">
            <CardContent className="p-6 space-y-3.5">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                Invoice Financial Breakdown
              </h3>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Taxable Items Value:</span>
                <span className="font-semibold">₹ {totals.taxable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>CGST Amount:</span>
                <span className="font-semibold">₹ {totals.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>SGST Amount:</span>
                <span className="font-semibold">₹ {totals.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-3">
                <span>Gross Purchase Bill Amount:</span>
                <span className="text-purple-700 dark:text-purple-300 text-xl">₹ {totals.finalAmount.toFixed(2)}</span>
              </div>
              {paidAmount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                  <span>Less: Initial Payment Cleared:</span>
                  <span>- ₹ {paidAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40">
                <span>Net Balance Due (Added to Supplier Ledger):</span>
                <span>₹ {totals.balanceDue.toFixed(2)}</span>
              </div>
            </CardContent>

            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="font-semibold">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !supplierId}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-3 shadow-lg shadow-purple-500/30"
              >
                {isSubmitting ? 'Saving & Updating Inventory...' : 'Confirm & Save Purchase Bill'}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

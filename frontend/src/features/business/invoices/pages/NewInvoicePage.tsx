import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useInvoiceStore } from '../store/invoiceStore';
import { useGstCalculation } from '../hooks/useGstCalculation';
import { invoiceService } from '../api/invoiceService';
import { CustomerSearchInput } from '../components/CustomerSearchInput';
import { ItemSearchInput } from '../components/ItemSearchInput';
import { InvoiceItemsTable } from '../components/InvoiceItemsTable';
import { InvoiceSummaryPanel } from '../components/InvoiceSummaryPanel';
import { PaymentSection } from '../components/PaymentSection';
import { Save, Printer, Send, FileText, Calendar, Users, Package, FileSpreadsheet, Sparkles, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { GST_STATES } from '@/features/business/customers/constants/gstStates';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../projects/api/projectService';
import { useInvoiceSettings } from '../../settings/api/useInvoiceSettings';

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = useInvoiceStore();
  const { 
    calculatedItems, taxType, taxableTotal, cgstTotal, sgstTotal, igstTotal, customTaxTotal, cessTotal,
    grandTotal, roundOff, calculatedCharges
  } = useGstCalculation(store.items, store.placeOfSupply, store.discount, store.isTaxInclusive, store.taxMode, store.additionalCharges);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'active'],
    queryFn: () => projectService.getProjects({ status: 'active' }),
  });

  const { data: settings } = useInvoiceSettings();

  const editId = searchParams.get('edit') || searchParams.get('id');

  useEffect(() => {
    if (editId) {
      invoiceService.get(Number(editId)).then((data: any) => {
        if (data) {
          if (data.customer) store.setCustomer(data.customer);
          if (data.project_id) store.setProjectId(data.project_id);
          if (data.invoice_type) store.setInvoiceType(data.invoice_type);
          if (data.date) store.setDate(data.date.split('T')[0]);
          if (data.due_date) store.setDueDate(data.due_date.split('T')[0]);
          if (data.place_of_supply) store.setPlaceOfSupply(data.place_of_supply);
          store.setDiscount(Number(data.discount || 0));
          store.setPaidAmount(Number(data.paid_amount || 0));
          if (data.payment_mode) store.setPaymentMode(data.payment_mode);
          if (data.payments && Array.isArray(data.payments) && data.payments.length > 0) {
            store.setSplitPayments(data.payments.map((p: any) => ({ mode: p.payment_mode || 'Cash', amount: Number(p.amount || 0) })));
          }
          if (data.notes) store.setNotes(data.notes);
          if (data.terms_conditions) store.setTermsConditions(data.terms_conditions);
          if (data.reference_number) store.setReferenceNumber(data.reference_number);
          if (data.vehicle_number) store.setVehicleNumber(data.vehicle_number);
          if (data.driver_name) store.setDriverName(data.driver_name);
          if (data.tax_type) store.setTaxMode(data.tax_type === 'igst' ? 'gst' : data.tax_type);
          if (data.items && Array.isArray(data.items)) {
            store.setItems(data.items.map((i: any) => ({
              id: String(i.id || Math.random()),
              product_id: i.product_id,
              name: i.product?.model_name || i.product?.name || i.product?.item_code || i.model_name || i.name || 'Unnamed Item',
              quantity: Number(i.quantity),
              rate: Number(i.rate),
              gst_rate: Number(i.gst_rate || 0),
              cess_rate: Number(i.cess_rate || 0),
              hsn_code: i.hsn_code || i.product?.hsn_code || '',
              unit: i.unit || i.product?.unit || 'pcs',
              amount: Number(i.amount || 0),
              brand: i.product?.brand || i.brand,
              brand_name: i.product?.brand?.name || i.product?.brand_name || i.brand_name || (typeof i.product?.brand === 'string' ? i.product.brand : undefined)
            })));
          }
        }
      }).catch(() => {
        toast.error('Failed to load document for editing');
      });
    } else {
      const typeParam = searchParams.get('type');
      if (typeParam && ['sales_invoice', 'proforma', 'delivery_challan', 'quotation'].includes(typeParam)) {
        store.setInvoiceType(typeParam);
      }
      const projParam = searchParams.get('project_id');
      if (projParam) {
        store.setProjectId(Number(projParam));
      }
      if (settings?.default_terms) {
        store.setTermsConditions(settings.default_terms);
      }
      if (settings?.default_bank_details) {
        store.setBankDetails(settings.default_bank_details);
      }
    }
    return () => store.reset(); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const handleSave = async (action: 'draft' | 'pdf' | 'whatsapp') => {
    if (store.items.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    try {
      const payload = {
        customer_id: store.customer?.id || null,
        project_id: store.projectId || undefined,
        invoice_type: store.invoiceType as any,
        date: store.date,
        due_date: store.dueDate || undefined,
        place_of_supply: store.placeOfSupply ? String(store.placeOfSupply).split(' - ')[0].trim().slice(0, 2) : undefined,
        tax_type: store.taxMode,
        reference_number: store.referenceNumber || undefined,
        vehicle_number: store.vehicleNumber || undefined,
        driver_name: store.driverName || undefined,
        discount: store.discount,
        paid_amount: store.paidAmount,
        payment_mode: store.paymentMode,
        payments: store.paymentMode === 'Split'
          ? store.splitPayments.filter(p => Number(p.amount) > 0).map(p => ({ payment_mode: p.mode, amount: Number(p.amount) }))
          : (store.paidAmount > 0 ? [{ payment_mode: store.paymentMode, amount: Number(store.paidAmount) }] : []),
        notes: store.notes,
        terms_conditions: store.termsConditions,
        bank_details: store.bankDetails,
        items: calculatedItems.map(i => ({
          product_id: i.product_id,
          quantity: Number(i.quantity),
          rate: Number(i.rate),
          gst_rate: Number(i.gst_rate || 0),
          cess_rate: Number(i.cess_rate || 0),
          hsn_code: i.hsn_code,
          unit: i.unit,
        }))
      };

      let res: any;
      if (editId) {
        res = await invoiceService.update(Number(editId), payload);
        toast.success('Document updated successfully!');
      } else {
        res = await invoiceService.create(payload);
        toast.success('Document created successfully!');
      }

      if (action === 'pdf') {
        const docUuid = res?.data?.uuid || res?.uuid;
        const docId = res?.data?.id || res?.id || Number(editId);
        
        if (docUuid) {
          window.open(`/invoice/${docUuid}?print=true`, '_blank');
        } else if (docId) {
          window.open(`/invoices/${docId}`, '_blank');
        }
      } else if (action === 'whatsapp') {
        toast.info('Opening WhatsApp share...');
        const docId = res?.data?.id || res?.id || Number(editId);
        if (docId) {
          try {
            const url = await invoiceService.getWhatsappUrl(docId);
            if (url && url.whatsapp_url) {
              window.open(url.whatsapp_url, '_blank');
            } else {
              toast.error('Could not generate WhatsApp link');
            }
          } catch (e) {
            toast.error('Failed to prepare WhatsApp link');
          }
        }
      }

      navigate('/invoices');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save document');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {editId ? 'Edit Document' : 'Create New Document'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {editId ? 'Modify and update your existing document.' : 'Create invoices, quotations, proforma or delivery challans instantly.'}
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
            className="h-9 px-4 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" /> {editId ? 'Update Document' : 'Save as Draft'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave('pdf')}
            className="h-9 px-4 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          >
            <Printer className="w-3.5 h-3.5" /> {editId ? 'Update & Print PDF' : 'Print / Save PDF'}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSave('whatsapp')}
            className="h-9 px-4 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> {editId ? 'Update & WhatsApp' : 'Save & WhatsApp'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 Cols on lg, 3 on xl): Doc Setup, Customer, Dates */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <Card className="p-5 space-y-4 rounded-2xl border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#09090b]">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
              <FileText className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Document Type</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Document</Label>
              <Select 
                value={store.invoiceType} 
                onChange={e => store.setInvoiceType(e.target.value)}
                className="w-full h-10 text-xs font-semibold bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-xl"
              >
                <option value="sales_invoice">🧾 Sales Invoice (Taxable GST Bill)</option>
                <option value="proforma">📋 Proforma Invoice (Advance Estimate)</option>
                <option value="delivery_challan">🚚 Delivery Challan (Goods Transport)</option>
                <option value="quotation">📗 Quotation / Estimate</option>
              </Select>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tax Scheme / Mode</Label>
              <Select 
                value={store.taxMode} 
                onChange={e => store.setTaxMode(e.target.value as any)}
                className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-xl text-primary-600 dark:text-primary-400 font-bold"
              >
                <option value="gst">🇮🇳 Regular GST Mode (CGST / SGST / IGST)</option>
                <option value="custom_vat">🌍 Custom Tax / VAT Mode (Single Tax %)</option>
                <option value="exempt">🚫 Tax Exempt Mode (No Tax - 0%)</option>
              </Select>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-500" /> Link to Site / Project (Optional)
              </Label>
              <Select
                value={store.projectId ? String(store.projectId) : ''}
                onChange={e => store.setProjectId(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-9 text-xs font-semibold bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
              >
                <option value="">-- Standalone (No Specific Site) --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.project_code || 'PROJ'})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Date
                </Label>
                <Input 
                  type="date" 
                  value={store.date} 
                  onChange={e => store.setDate(e.target.value)} 
                  className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Due / Validity Date
                </Label>
                <Input 
                  type="date" 
                  value={store.dueDate} 
                  onChange={e => store.setDueDate(e.target.value)} 
                  className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">PO / Reference No.</Label>
                <Input 
                  value={store.referenceNumber} 
                  onChange={e => store.setReferenceNumber(e.target.value)} 
                  placeholder="e.g. PO-2023-45"
                  className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vehicle No.</Label>
                  <Input 
                    value={store.vehicleNumber} 
                    onChange={e => store.setVehicleNumber(e.target.value)} 
                    placeholder="e.g. MH 01 AB 1234"
                    className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Driver Name</Label>
                  <Input 
                    value={store.driverName} 
                    onChange={e => store.setDriverName(e.target.value)} 
                    placeholder="e.g. John Doe"
                    className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4 rounded-2xl border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#09090b]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Billed To (Customer)</h3>
              </div>
            </div>
            
            <CustomerSearchInput 
              selectedCustomer={store.customer} 
              onSelect={store.setCustomer} 
              onClear={() => store.setCustomer(null)}
            />

            {store.customer && (
              <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5 font-bold"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Place of Supply</span>
                <Select
                  value={store.placeOfSupply}
                  onChange={e => store.setPlaceOfSupply(e.target.value)}
                  className="h-8 text-xs font-bold font-mono px-2.5 py-0 bg-white dark:bg-[#111118] border-slate-200 dark:border-white/10 rounded-lg max-w-[180px]"
                >
                  <option value="">Select State</option>
                  {GST_STATES.map(s => (
                    <option key={s.code} value={`${s.code} - ${s.name}`}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (8 Cols on lg, 9 on xl): Items Table & Bottom Panels */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <Card className="p-5 flex flex-col gap-4 rounded-2xl border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#09090b]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Line Items</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  title="Click to set all items to With Tax or Without Tax"
                  onClick={() => store.setIsTaxInclusive(!store.isTaxInclusive)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                    store.isTaxInclusive 
                      ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' 
                      : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${store.isTaxInclusive ? 'bg-white' : 'bg-slate-500 dark:bg-slate-400'}`} />
                  <span>{store.isTaxInclusive ? 'Set All: With Tax (Inclusive)' : 'Set All: Without Tax (Exclusive)'}</span>
                </button>
                <span className="text-xs text-slate-400 font-medium">{calculatedItems.length} items added</span>
              </div>
            </div>
            
            <ItemSearchInput 
              priceListId={store.customer?.price_list_id} 
              onSelect={(item) => store.addItem({
                id: Math.random().toString(36).substr(2, 9),
                product_id: item.id,
                name: item.name,
                hsn_code: item.hsn_code,
                quantity: 1,
                unit: item.unit || 'PCS',
                rate: item.rate,
                gst_rate: item.gst_rate || 18,
                cess_rate: 0,
                amount: item.rate,
                brand: item.brand,
                brand_name: item.brand_name
              } as any)} 
            />

            <InvoiceItemsTable calculatedItems={calculatedItems} store={store} />
          </Card>

          {/* Bottom Summary & Notes Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <Card className="md:col-span-5 xl:col-span-5 p-5 space-y-4 rounded-2xl border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#09090b]">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                <FileText className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Notes & Terms</h3>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Customer Notes</Label>
                <Input 
                  value={store.notes} 
                  onChange={e => store.setNotes(e.target.value)} 
                  placeholder="e.g. Thanks for your business!" 
                  className="h-9 text-xs bg-slate-50 dark:bg-white/[0.02]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Terms & Conditions</Label>
                <textarea 
                  value={store.termsConditions} 
                  onChange={e => store.setTermsConditions(e.target.value)} 
                  className="w-full text-xs bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 dark:text-slate-300"
                  rows={3} 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Details</Label>
                <textarea 
                  value={store.bankDetails} 
                  onChange={e => store.setBankDetails(e.target.value)} 
                  className="w-full text-xs bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700 dark:text-slate-300"
                  rows={2} 
                  placeholder="A/c No, IFSC, etc."
                />
              </div>
            </Card>

            <Card className="md:col-span-7 xl:col-span-7 p-5 space-y-4 rounded-2xl border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#09090b]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Bill Summary</h3>
                <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                  {store.taxMode === 'exempt' ? 'EXEMPT' : store.taxMode === 'custom_vat' ? 'CUSTOM VAT' : taxType.toUpperCase()} CALCULATION
                </span>
              </div>
              
              <InvoiceSummaryPanel
                taxType={taxType as any}
                taxableTotal={taxableTotal}
                cgstTotal={cgstTotal}
                sgstTotal={sgstTotal}
                igstTotal={igstTotal}
                customTaxTotal={customTaxTotal}
                cessTotal={cessTotal}
                grandTotal={grandTotal}
                roundOff={roundOff}
                discount={store.discount}
                onDiscountChange={store.setDiscount}
                taxMode={store.taxMode}
                customTaxLabel={store.customTaxLabel}
                additionalCharges={store.additionalCharges}
                calculatedCharges={calculatedCharges}
                onAddCharge={store.addAdditionalCharge}
                onRemoveCharge={store.removeAdditionalCharge}
                onUpdateCharge={store.updateAdditionalCharge}
              />

              <PaymentSection
                grandTotal={grandTotal}
                paidAmount={store.paidAmount}
                paymentMode={store.paymentMode}
                splitPayments={store.splitPayments}
                onPaidAmountChange={store.setPaidAmount}
                onPaymentModeChange={store.setPaymentMode}
                onSplitPaymentsChange={store.setSplitPayments}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile & Desktop */}
      <div className="sticky bottom-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 -mb-4 sm:-mb-6 lg:-mb-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Grand Total</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right sm:text-left">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {calculatedItems.length} {calculatedItems.length === 1 ? 'item' : 'items'}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Mode: {store.paymentMode}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave('draft')}
            className="h-11 sm:h-10 px-2 sm:px-4 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{editId ? 'Update' : 'Save Draft'}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave('pdf')}
            className="h-11 sm:h-10 px-2 sm:px-4 text-xs font-bold rounded-xl border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 shadow-sm flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{editId ? 'Update & PDF' : 'Save & PDF'}</span>
          </Button>
          <Button
            type="button"
            onClick={() => handleSave('whatsapp')}
            className="h-11 sm:h-10 px-2 sm:px-5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{editId ? 'Update & WA' : 'Save & WA'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

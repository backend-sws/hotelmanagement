import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplier } from '../api/useSuppliers';
import { PageHeader } from '../../../../components/layout/PageHeader';
import { Button } from '../../../../components/ui/button';
import { 
  Plus, 
  Phone, 
  MapPin, 
  Package, 
  Download, 
  Edit2, 
  IndianRupee, 
  Mail, 
  ShieldCheck, 
  Landmark, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode
} from 'lucide-react';
import { formatCurrency } from '../../../../lib/formatters';
import { AddPaymentModal } from '../components/AddPaymentModal';
import { EditSupplierModal } from '../components/EditSupplierModal';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-loaders';
import { toast } from 'sonner';

function SupplierDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b]">
      <PageHeader 
        icon={Package}
        title="Loading Supplier..." 
        subtitle="Please wait"
        breadcrumbs={[{ label: 'Suppliers', onClick: () => {} }, { label: 'Loading', active: true }]} 
      />
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl p-6">
            <CardSkeleton count={1} />
          </div>
          <div className="md:col-span-1 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl p-6">
            <CardSkeleton count={1} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-xl p-4 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <TableSkeleton cols={6} rows={5} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: supplier, isLoading } = useSupplier(Number(id));
  const [activeTab, setActiveTab] = useState<'purchases' | 'payments'>('purchases');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) return <SupplierDetailsSkeleton />;
  if (!supplier) return <div className="p-8 text-center text-rose-500 min-h-screen bg-slate-50 dark:bg-[#09090b]">Supplier not found</div>;

  const totalBilled = supplier.purchases?.reduce((sum: number, p: any) => sum + Number(p.bill_amount), 0) || 0;
  const purchasesPaid = supplier.purchases?.reduce((sum: number, p: any) => sum + Number(p.paid_amount), 0) || 0;
  const unlinkedPayments = supplier.payments?.filter((p: any) => !p.supplier_purchase_id).reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  const totalPaid = purchasesPaid + unlinkedPayments;
  const outstanding = totalBilled - totalPaid;

  const purchasesColumns: ColumnDef<any>[] = [
    {
      header: 'Date',
      cell: (purchase) => (
        <div className="whitespace-nowrap">
          <p className="font-medium">{new Date(purchase.purchase_date).toLocaleDateString()}</p>
          {purchase.due_date && <p className="text-xs text-rose-500">Due: {new Date(purchase.due_date).toLocaleDateString()}</p>}
        </div>
      )
    },
    {
      header: 'Items',
      cell: (purchase) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300">
          {purchase.items?.length || 0} Products
        </span>
      )
    },
    {
      header: 'Bill Amount',
      className: 'text-right font-medium',
      cell: (purchase) => formatCurrency(purchase.bill_amount)
    },
    {
      header: 'Paid',
      className: 'text-right font-medium text-emerald-600',
      cell: (purchase) => formatCurrency(purchase.paid_amount)
    },
    {
      header: 'Balance',
      className: 'text-right font-bold text-rose-600',
      cell: (purchase) => formatCurrency(purchase.bill_amount - purchase.paid_amount)
    },
    {
      header: '',
      className: 'text-right',
      cell: (purchase) => (
        <div className="flex justify-end gap-2">
          {purchase.bill_amount - purchase.paid_amount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
              onClick={() => {
                setSelectedPurchaseId(purchase.id);
                setIsPaymentModalOpen(true);
              }}
            >
              <IndianRupee className="w-4 h-4 mr-1" /> Pay
            </Button>
          )}
          {purchase.invoice_file && (
            <Button variant="ghost" size="sm" onClick={() => window.open(purchase.invoice_file, '_blank')}>
              <Download className="w-4 h-4 mr-2" /> Invoice
            </Button>
          )}
        </div>
      )
    }
  ];

  const paymentsColumns: ColumnDef<any>[] = [
    {
      header: 'Date',
      cell: (payment) => <span className="font-medium">{new Date(payment.date).toLocaleDateString()}</span>
    },
    {
      header: 'Mode',
      cell: (payment) => <span className="uppercase text-xs font-semibold">{payment.payment_mode}</span>
    },
    {
      header: 'Amount',
      className: 'text-right font-bold text-emerald-600',
      cell: (payment) => formatCurrency(payment.amount)
    },
    {
      header: 'Notes',
      cell: (payment) => <span className="text-slate-500">{payment.notes || '-'}</span>
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 z-10">
        
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => navigate('/suppliers')} className="hover:text-primary-500 transition-colors">Suppliers</button>
              <span>/</span>
              <span className="text-primary-500">{supplier.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{supplier.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20">
                {supplier.custom_id || `ID: ${supplier.id}`}
              </span>
              {supplier.gstin && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> GST: {supplier.gstin}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 shrink-0">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Supplier
            </button>
            <Button variant="brand" onClick={() => navigate(`/suppliers/${id}/purchases/new`)} className="h-10 px-4 py-2 text-xs rounded-xl font-bold uppercase tracking-widest">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Purchase Bill
            </Button>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Contact & Address */}
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">Contact & Address</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="hover:text-primary-500 transition-colors">
                      {supplier.phone}
                    </a>
                  ) : 'Not Provided'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                  {supplier.email ? (
                    <a href={`mailto:${supplier.email}`} className="hover:text-primary-500 transition-colors">
                      {supplier.email}
                    </a>
                  ) : 'Not Provided'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Supplied Items</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {supplier.items_supplied || 'General Supplies'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Address</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {supplier.address || 'No address registered'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: GST & Tax Compliance */}
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">Tax & Legal (GST / PAN)</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">GSTIN / Tax ID</p>
                {supplier.gstin ? (
                  <div className="flex items-center justify-between mt-0.5 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                      {supplier.gstin}
                    </span>
                    <button
                      onClick={() => copyToClipboard(supplier.gstin, 'GSTIN')}
                      className="p-1 text-slate-400 hover:text-primary-500 transition-colors"
                      title="Copy GSTIN"
                    >
                      {copiedField === 'GSTIN' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Unregistered / No GSTIN</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">PAN Number</p>
                {supplier.pan ? (
                  <div className="flex items-center justify-between mt-0.5 bg-slate-50 dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                      {supplier.pan}
                    </span>
                    <button
                      onClick={() => copyToClipboard(supplier.pan, 'PAN')}
                      className="p-1 text-slate-400 hover:text-primary-500 transition-colors"
                      title="Copy PAN"
                    >
                      {copiedField === 'PAN' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">No PAN recorded</p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Place of Supply (State)</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {supplier.state_name ? `${supplier.state_code ? `[${supplier.state_code}] ` : ''}${supplier.state_name}` : 'Not Specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Bank & Payout Details */}
          <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">Bank & Payout Details</h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bank Name</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {supplier.bank_name || 'Not Provided'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account Number</p>
                {supplier.account_number ? (
                  <div className="flex items-center justify-between mt-0.5 bg-slate-50 dark:bg-zinc-900 px-2 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {supplier.account_number}
                    </span>
                    <button
                      onClick={() => copyToClipboard(supplier.account_number, 'Account Number')}
                      className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'Account Number' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">Not Provided</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">IFSC Code</p>
                  {supplier.ifsc_code ? (
                    <div className="flex items-center justify-between mt-0.5 bg-slate-50 dark:bg-zinc-900 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-white/5">
                      <span className="font-mono text-[11px] font-bold uppercase text-slate-800 dark:text-slate-200">
                        {supplier.ifsc_code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(supplier.ifsc_code, 'IFSC')}
                        className="p-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Copy IFSC"
                      >
                        {copiedField === 'IFSC' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5">N/A</p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Branch</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {supplier.branch_name || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">UPI ID / VPA</p>
                {supplier.upi_id ? (
                  <div className="flex items-center justify-between mt-0.5 bg-slate-50 dark:bg-zinc-900 px-2 py-1.5 rounded-lg border border-slate-200/60 dark:border-white/5">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">
                      {supplier.upi_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(supplier.upi_id, 'UPI ID')}
                      className="p-1 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'UPI ID' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">Not Provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Total Outstanding / Financials */}
          <div className={`border rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all duration-300 ${
            outstanding > 0 
              ? 'bg-gradient-to-br from-white to-rose-50/15 dark:from-[#09090b] dark:to-rose-950/5 border-rose-100 dark:border-rose-900/20' 
              : 'bg-gradient-to-br from-white to-slate-50/20 dark:from-[#09090b] dark:to-white/[0.01] border-slate-200 dark:border-white/5'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">Khata Balance</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400">
                  {supplier.balance_type === 'debit' ? 'Advance Paid' : 'Payable Udhar'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Outstanding Vendor Balance</p>
            </div>
            
            <div className="my-4">
              <p className={`text-3xl font-display font-black tracking-tight ${
                outstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
              }`}>
                {formatCurrency(outstanding)}
              </p>
              
              <div className="space-y-1.5 mt-3 pt-3 border-t border-dashed border-slate-100 dark:border-white/5 text-xs text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Opening Balance:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(Number(supplier.opening_balance || 0))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Purchases:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(totalBilled)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Payments:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="brand"
              className="w-full h-10 text-xs font-bold uppercase tracking-widest rounded-xl" 
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <IndianRupee className="w-4 h-4 mr-1.5" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Transactions Tabs (Purchases & Payments) */}
        <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-6 py-4 text-sm font-bold tracking-wide uppercase transition-colors flex items-center gap-2 relative ${activeTab === 'purchases' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Purchases Bills
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${activeTab === 'purchases' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>
                {supplier.purchases?.length || 0}
              </span>
              {activeTab === 'purchases' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-4 text-sm font-bold tracking-wide uppercase transition-colors flex items-center gap-2 relative ${activeTab === 'payments' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Payments & Vouchers
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${activeTab === 'payments' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>
                {supplier.payments?.length || 0}
              </span>
              {activeTab === 'payments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
              )}
            </button>
          </div>

          <div className="p-0">
            {activeTab === 'purchases' && (
              <DataTable 
                columns={purchasesColumns} 
                data={supplier.purchases || []} 
                emptyMessage="No purchases found for this supplier."
              />
            )}

            {activeTab === 'payments' && (
              <DataTable 
                columns={paymentsColumns} 
                data={supplier.payments || []} 
                emptyMessage="No payments recorded for this supplier."
              />
            )}
          </div>
        </div>
      </div>

      <AddPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPurchaseId(undefined);
        }} 
        supplierId={supplier.id} 
        supplierPurchaseId={selectedPurchaseId}
      />
      <EditSupplierModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} supplier={supplier} />
    </div>
  );
}


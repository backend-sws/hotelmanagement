import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../api/invoiceService';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle2, AlertCircle, Eye, Download, MessageSquare, ChevronLeft, ChevronRight, FileSpreadsheet, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

export default function InvoicesListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data: stats } = useQuery({
    queryKey: ['invoices-stats'],
    queryFn: () => invoiceService.stats()
  });

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', page, type, status, debouncedSearch],
    queryFn: async () => {
      const params: any = { page, per_page: 15 };
      if (type !== 'all') params.invoice_type = type;
      if (status !== 'all') params.status = status;
      if (debouncedSearch) params.search = debouncedSearch;
      return await invoiceService.list(params);
    }
  });

  const formatTypeBadge = (t: string) => {
    switch (t) {
      case 'sales_invoice':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Sales Invoice</span>;
      case 'proforma':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">Proforma</span>;
      case 'delivery_challan':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Challan</span>;
      case 'quotation':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Quotation</span>;
      case 'credit_note':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Credit Note</span>;
      case 'debit_note':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Debit Note</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">{t}</span>;
    }
  };
  
  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Paid
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Partial
          </span>
        );
      case 'pending':
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Unpaid
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            {st}
          </span>
        );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.split('T')[0];
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr.split('T')[0];
    }
  };

  const handleDownloadPdf = async (e: React.MouseEvent, id: number, invoiceNum: string) => {
    e.stopPropagation();
    try {
      toast.info('Generating PDF...');
      const blob = await invoiceService.getPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      toast.error('Failed to download PDF');
    }
  };

  const handleWhatsapp = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      toast.info('Opening WhatsApp...');
      const url = await invoiceService.getWhatsappUrl(id);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast.error('Could not generate WhatsApp link');
      }
    } catch (err) {
      toast.error('Failed to open WhatsApp');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Control Panel (KPI Cards) */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-5 shadow-2xl shadow-slate-200/30 dark:shadow-black/50">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="transition-transform hover:-translate-y-1 duration-300">
                <CustomKpiCard
                  title="Total Invoiced (GST)"
                  value={formatCurrency(stats?.total_invoiced || 0)}
                  icon={<FileText className="w-5 h-5 text-white" />}
                  glowColor="primary"
                  subtitle="Total sales & proforma billed"
                />
              </div>
              <div className="transition-transform hover:-translate-y-1 duration-300">
                <CustomKpiCard
                  title="Total Collected"
                  value={formatCurrency(stats?.total_collected || 0)}
                  icon={<CheckCircle2 className="w-5 h-5 text-white" />}
                  glowColor="emerald"
                  subtitle="Actual cash/online received"
                />
              </div>
              <div className="transition-transform hover:-translate-y-1 duration-300">
                <CustomKpiCard
                  title="Outstanding Balance"
                  value={formatCurrency(stats?.total_outstanding || 0)}
                  icon={<AlertCircle className="w-5 h-5 text-white" />}
                  glowColor="rose"
                  subtitle="Pending customer receivables"
                />
              </div>
            </div>
            
            <div className="flex-shrink-0 flex items-center justify-end px-2 sm:px-4">
              <button 
                onClick={() => navigate('/invoices/new')}
                className="group relative flex items-center justify-center gap-2 px-6 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg hover:shadow-primary-500/25 active:scale-95 transition-all duration-200"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                <span className="font-bold text-sm tracking-wide">New Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <FilterSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="SEARCH BY INVOICE #, CUSTOMER NAME, OR PHONE..."
              wrapperClassName="flex-1 min-w-[240px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />
            
            <FilterSelect
              value={type}
              onChange={(val) => {
                setType(val || 'all');
                setPage(1);
              }}
              placeholder="All Document Types"
              options={[
                { value: 'all', label: 'All Document Types' },
                { value: 'sales_invoice', label: 'Sales Invoice' },
                { value: 'proforma', label: 'Proforma Invoice' },
                { value: 'delivery_challan', label: 'Delivery Challan' },
                { value: 'quotation', label: 'Quotation' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />

            <FilterSelect
              value={status}
              onChange={(val) => {
                setStatus(val || 'all');
                setPage(1);
              }}
              placeholder="All Statuses"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'completed', label: 'Paid' },
                { value: 'partially_paid', label: 'Partially Paid' },
                { value: 'pending', label: 'Unpaid' },
                { value: 'draft', label: 'Draft' },
              ]}
              wrapperClassName="w-full sm:w-44 shrink-0"
            />
          </div>

          {(search || type !== 'all' || status !== 'all') && (
            <FilterReset
              onClick={() => {
                setSearch('');
                setType('all');
                setStatus('all');
                setPage(1);
              }}
            />
          )}
        </FilterContainer>

        {/* Documents Table Card */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden relative z-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] text-[11px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase">
                  <th className="py-4 px-6">Document #</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-24 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : !data || data.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No documents found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || type !== 'all' || status !== 'all' 
                            ? "Try adjusting your search query or filter criteria."
                            : "You haven't created any sales invoices, proformas, or challans yet."}
                        </p>
                        <Button
                          onClick={() => navigate('/invoices/new')}
                          size="sm"
                          className="mt-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create First Document
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.data.map((invoice: any) => (
                    <tr 
                      key={invoice.id} 
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <span className="font-bold text-primary-600 dark:text-primary-400 group-hover:underline flex items-center gap-1.5">
                          {invoice.invoice_number}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {formatTypeBadge(invoice.invoice_type)}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-semibold">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {invoice.customer?.name || 'Walk-in Customer'}
                        </div>
                        {invoice.customer?.phone && (
                          <div className="text-xs text-slate-400 font-normal">
                            {invoice.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">
                        ₹{Number(invoice.final_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/invoices/${invoice.id}`)}
                            title="View Document"
                            className="h-8 w-8 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-500/10 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/invoices/new?edit=${invoice.id}`); }}
                            title="Edit Document"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDownloadPdf(e, invoice.id, invoice.invoice_number)}
                            title="Download PDF"
                            className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleWhatsapp(e, invoice.id)}
                            title="Share via WhatsApp"
                            className="h-8 w-8 text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="px-6 py-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of <span className="font-bold text-slate-900 dark:text-white">{data.last_page}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === data.last_page} 
                  onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                  className="h-8 px-3 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

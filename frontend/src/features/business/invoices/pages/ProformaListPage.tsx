import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../api/invoiceService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, ArrowRightLeft, Eye, Download, MessageSquare, Pencil, ChevronLeft, ChevronRight, FileSpreadsheet, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { formatCurrency } from '@/lib/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ProformaListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['proforma', page, status, debouncedSearch],
    queryFn: async () => {
      const params: any = { page, per_page: 15, invoice_type: 'proforma' };
      if (status !== 'all') params.status = status;
      if (debouncedSearch) params.search = debouncedSearch;
      return await invoiceService.list(params);
    }
  });

  const proformas = data?.data || [];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Converted
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

  const handleConvert = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      toast.info('Converting to Sales Invoice...');
      await invoiceService.convert(id);
      toast.success('Proforma converted to Sales Invoice!');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Conversion failed');
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
      if (url && url.whatsapp_url) {
        window.open(url.whatsapp_url, '_blank');
      } else {
        toast.error('Could not generate WhatsApp link');
      }
    } catch (err) {
      toast.error('Failed to open WhatsApp');
    }
  };

  const totalAmount = proformas.reduce((sum: number, p: any) => sum + Number(p.final_amount || 0), 0);
  const convertedCount = proformas.filter((p: any) => p.status === 'converted' || p.converted_at).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center">
                <FileText className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Proforma Invoices <span className="text-purple-600 dark:text-purple-400 text-base font-bold px-2 py-0.5 rounded-md bg-purple-500/10">Kachha Bill & Advance Offer</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Issue preliminary invoices for advance payments, order commitments & goods valuation without generating an immediate GST liability.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => navigate('/invoices/new?type=proforma')}
              className="rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Proforma
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-purple-200 dark:border-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is a Proforma?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-5 h-5 fill-purple-500 text-purple-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Why & How to Use Proforma Invoices</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                A <strong>Proforma Invoice (Preliminary / Kachha Bill)</strong> is an estimated billing document sent to a buyer prior to shipment or delivery. It outlines exact item costs and banking details so the buyer can arrange advance payments or purchase approvals without creating an immediate tax obligation for your business!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    <span>💰</span> 1. Advance Payment & Booking
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Issue proformas for corporate purchase orders, tender approvals, or 50% advance deposits before manufacturing or dispatching expensive stock.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>🛡️</span> 2. Zero Accounting Liability
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Unlike Tax Invoices, a Proforma does not trigger GST tax liabilities or alter inventory quantities until it is converted into a final bill.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>📦</span> 3. Seamless Final Conversion
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Once payment is received or goods are ready for delivery, convert the Proforma into a complete GST Tax Invoice instantly to deduct stock and finalize ledger entries.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-1 lg:col-span-2">
            <CustomKpiCard
              title="Total Proforma Value"
              value={formatCurrency(totalAmount)}
              icon={<FileText className="w-5 h-5 text-white" />}
              glowColor="primary"
              subtitle="Estimated billing value on page"
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <CustomKpiCard
              title="Converted to Invoice"
              value={`${convertedCount} Documents`}
              icon={<ArrowRightLeft className="w-5 h-5 text-white" />}
              glowColor="emerald"
              subtitle="Successfully closed deals"
            />
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
              placeholder="SEARCH BY PROFORMA #, CUSTOMER NAME, OR PHONE..."
              wrapperClassName="flex-1 min-w-[240px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
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
                { value: 'draft', label: 'Draft / Unconverted' },
                { value: 'converted', label: 'Converted to Invoice' },
              ]}
              wrapperClassName="w-full sm:w-52 shrink-0"
            />
          </div>

          {(search || status !== 'all') && (
            <FilterReset
              onClick={() => {
                setSearch('');
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
                  <th className="py-4 px-6">Proforma #</th>
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
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 rounded" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto rounded" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-28 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : !data || proformas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No proforma invoices found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || status !== 'all'
                            ? "Try adjusting your search query or filter criteria."
                            : "You haven't created any proforma invoices yet."}
                        </p>
                        <Button
                          onClick={() => navigate('/invoices/new?type=proforma')}
                          size="sm"
                          className="mt-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create First Proforma
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  proformas.map((p: any) => (
                    <tr 
                      key={p.id} 
                      onClick={() => navigate(`/invoices/${p.id}`)}
                      className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:underline flex items-center gap-1.5">
                          {p.invoice_number}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-semibold">
                        {formatDate(p.date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {p.customer?.name || 'Walk-in Customer'}
                        </div>
                        {p.customer?.phone && (
                          <div className="text-xs text-slate-400 font-normal">
                            {p.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white">
                        ₹{Number(p.final_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/invoices/${p.id}`)}
                            title="View Proforma"
                            className="h-8 w-8 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/invoices/new?edit=${p.id}`); }}
                            title="Edit Proforma"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {p.status !== 'converted' && !p.converted_at && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => handleConvert(e, p.id)}
                              title="Convert to Sales Invoice"
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDownloadPdf(e, p.id, p.invoice_number)}
                            title="Download PDF"
                            className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleWhatsapp(e, p.id)}
                            title="Share via WhatsApp"
                            className="h-8 w-8 text-slate-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                          >
                            <WhatsappIcon className="h-4 w-4 text-green-500" />
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

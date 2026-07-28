import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { challanService } from '../api/challanService';
import { invoiceService } from '@/features/business/invoices/api/invoiceService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Truck, ArrowRightLeft, Eye, Printer, Download, MessageSquare, Pencil, ChevronLeft, ChevronRight, FileSpreadsheet, CheckCircle2, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

export default function ChallanListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['challans', page, status, debouncedSearch],
    queryFn: async () => {
      const params: any = { page, per_page: 15 };
      if (status !== 'all') params.status = status;
      if (debouncedSearch) params.search = debouncedSearch;
      return await challanService.list(params);
    }
  });

  const challans = data?.data || [];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Delivered
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Converted
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Cancelled
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

  const handleTruckSlip = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      toast.info('Generating Truck Slip...');
      const blob = await challanService.getTruckSlip(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('Truck slip generated');
    } catch {
      toast.error('Failed to generate truck slip');
    }
  };

  const handleConvert = async () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one challan to convert');
      return;
    }
    try {
      const invoice = await challanService.convertToInvoice(selectedIds);
      toast.success('Challans converted to invoice!');
      setSelectedIds([]);
      refetch();
      navigate(`/invoices/${invoice.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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

  const pendingCount = challans.filter((c: any) => c.status === 'pending').length;
  const deliveredCount = challans.filter((c: any) => c.status === 'completed' || c.status === 'converted').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-500/10 dark:bg-amber-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <Truck className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Delivery Challans & Dispatch <span className="text-amber-600 dark:text-amber-400 text-base font-bold px-2 py-0.5 rounded-md bg-amber-500/10">Maal Bhejne ki Parchi</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Legally transport goods for job work, approval, or consignment without raising an immediate tax invoice or billing impact.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            {selectedIds.length > 0 && (
              <Button 
                onClick={handleConvert}
                className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 px-4 h-10 text-xs"
              >
                <ArrowRightLeft className="w-4 h-4 mr-1.5" />
                Convert {selectedIds.length} to Invoice
              </Button>
            )}
            <Button 
              onClick={() => navigate('/invoices/new?type=delivery_challan')}
              className="rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Challan
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is a Challan?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-5 h-5 fill-amber-500 text-amber-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Why & How to Use Delivery Challans</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                A <strong>Delivery Challan (Dispatch Slip / Maal Bhejne ki Parchi)</strong> is a formal document created during the transportation of goods from one place to another without raising a sale invoice at that instant. Under GST rules, a Delivery Challan is legally required when goods leave your godown or shop before actual billing!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <span>🚚</span> 1. Lawful Goods Transit (E-Way Bill)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Mandatory under GST laws for transporting goods for Job Work (Karigar / Processing), supply on approval, or movement between branches without immediate taxation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    <span>✍️</span> 2. Proof of Delivery & Acknowledgment
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Acts as an official receiving receipt. When the delivery driver drops off items, the buyer signs the challan as indisputable physical proof of receiving intact goods.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>📑</span> 3. Bulk Conversion to Invoice
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Send items in daily or weekly deliveries using challans, and later select multiple completed challans to merge and convert them into a single consolidated Tax Invoice!
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
              title="Pending Delivery Challans"
              value={`${pendingCount} Active`}
              icon={<Truck className="w-5 h-5 text-white" />}
              glowColor="primary"
              subtitle="In-transit or unconverted slips"
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <CustomKpiCard
              title="Delivered / Converted"
              value={`${deliveredCount} Completed`}
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              glowColor="emerald"
              subtitle="Successfully billed or delivered"
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
              placeholder="SEARCH BY CHALLAN #, CUSTOMER NAME, OR VEHICLE #..."
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
                { value: 'pending', label: 'Pending Delivery' },
                { value: 'completed', label: 'Delivered' },
                { value: 'converted', label: 'Converted to Invoice' },
                { value: 'cancelled', label: 'Cancelled' },
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
                  <th className="py-4 px-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(challans.filter((c: any) => !['converted','cancelled'].includes(c.status)).map((c: any) => c.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }} 
                    />
                  </th>
                  <th className="py-4 px-6">DC #</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-sm font-medium">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4"><Skeleton className="h-4 w-4 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 rounded" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-4 px-6 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-28 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : !data || challans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No delivery challans found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {search || status !== 'all'
                            ? "Try adjusting your search query or filter criteria."
                            : "You haven't created any delivery challans yet."}
                        </p>
                        <Button
                          onClick={() => navigate('/invoices/new?type=delivery_challan')}
                          size="sm"
                          className="mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create First Challan
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  challans.map((c: any) => (
                    <tr 
                      key={c.id} 
                      onClick={() => navigate(`/invoices/${c.id}`)}
                      className="group hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        {!['converted','cancelled'].includes(c.status) && (
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                            checked={selectedIds.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                          />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1.5">
                          {c.invoice_number}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-semibold">
                        {formatDate(c.date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {c.customer?.name || 'Walk-in Customer'}
                        </div>
                        {c.customer?.phone && (
                          <div className="text-xs text-slate-400 font-normal">
                            {c.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                        {c.vehicle_number || '—'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/invoices/${c.id}`)}
                            title="View Challan"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/invoices/new?edit=${c.id}`); }}
                            title="Edit Challan"
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-lg"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleTruckSlip(e, c.id)}
                            title="Print Truck Slip"
                            className="h-8 w-8 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDownloadPdf(e, c.id, c.invoice_number)}
                            title="Download PDF"
                            className="h-8 w-8 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleWhatsapp(e, c.id)}
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

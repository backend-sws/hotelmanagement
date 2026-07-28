import { useState, useMemo, useEffect } from 'react';
import { useSales } from '../api/useSales';
import { Button } from '@/components/ui/button';
import { FileText, Plus, TrendingUp, DollarSign, ArrowRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { getInvoiceColumns } from '../constants/invoiceColumns';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { formatCurrency } from '@/lib/formatters';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { DatePicker } from '@/components/ui/DatePicker';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useTenantStore } from '@/store/tenantStore';

export default function InvoicesPage() {
  const { activeBusiness } = useTenantStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasUdhar, setHasUdhar] = useState('');

  // Debounced search to prevent duplicate network calls
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset pagination when filter selections change
  useEffect(() => {
    setPage(1);
  }, [paymentMode, startDate, endDate, hasUdhar]);

  const filters = useMemo(() => ({
    search: debouncedSearch,
    payment_mode: paymentMode || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    has_udhar: hasUdhar || undefined,
  }), [debouncedSearch, paymentMode, startDate, endDate, hasUdhar]);

  const { data: response, isLoading } = useSales(page, 15, filters);
  const navigate = useNavigate();

  const sales = response?.data || [];
  const meta = response?.meta;

  const totalInvoices = meta?.total || 0;
  const totalRevenue = meta?.total_revenue || 0;
  const totalUdhar = meta?.total_udhar || 0;

  const handleDownloadPdf = async (sale: any, withLetterhead: boolean) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-download' });
      const response = await api.get(`/business/sales/${sale.id}/invoice-pdf?header=${withLetterhead}&footer=${withLetterhead}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${sale.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully', { id: 'pdf-download' });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-download' });
    }
  };

  const handleWhatsAppShare = (sale: any) => {
    try {
      if (!sale?.customer?.phone) {
        toast.error("Customer does not have a phone number saved.");
        return;
      }

      let template = activeBusiness?.settings?.whatsapp_invoice_template || 
        "Hello *[Customer Name]*,\n\nThank you for shopping with us! Your invoice *[Invoice Number]* for Rs.*[Amount]* has been generated.\n\nView or download your invoice here:\n[Invoice Link]\n\nRegards,\n*[Business Name]*";
      
      const invoiceLink = sale.public_url || `${window.location.origin}/invoices/${sale.id}`; 
      
      const message = template
        .replace(/\[Customer Name\]/g, sale.customer?.name || 'Customer')
        .replace(/\[Invoice Number\]/g, sale.invoice_number)
        .replace(/\[Amount\]/g, sale.final_amount?.toString() || '0')
        .replace(/\[Invoice Link\]/g, invoiceLink)
        .replace(/\[Business Name\]/g, activeBusiness?.name || 'Our Store');
        
      const text = encodeURIComponent(message);
      
      let phone = sale.customer.phone.replace(/\D/g, ''); 
      if (phone.length === 10) phone = '91' + phone;
      
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } catch (error) {
      console.error('Failed to share:', error);
      toast.error('Failed to share invoice');
    }
  };

  const columns = useMemo(() => getInvoiceColumns({
    onView: (sale) => navigate(`/invoices/${sale.id}`),
    onCustomerView: (customerId) => navigate(`/customers/${customerId}`),
    onResumeDraft: (saleId) => navigate(`/pos?draft_id=${saleId}`),
    onDownloadPdf: handleDownloadPdf,
    onWhatsAppShare: handleWhatsAppShare
  }), [navigate]);

  const handleClearFilters = () => {
    setSearch('');
    setPaymentMode('');
    setStartDate('');
    setEndDate('');
    setHasUdhar('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-200">
      
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-float2" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6 z-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Sales History & POS Bills</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">View, share, and manage retail & POS invoices</p>
            </div>
          </div>
          <Button onClick={() => navigate('/pos')} className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/20 rounded-xl font-bold h-10 px-4 text-xs">
            <Plus className="w-4 h-4 mr-1.5" />
            New Sale (POS)
          </Button>
        </div>
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CustomKpiCard
            title="Total Invoices"
            value={totalInvoices}
            icon={<FileText className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="All time sales matching filter"
          />
          <CustomKpiCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            glowColor="emerald"
            subtitle="Total of filtered sales"
          />
          <CustomKpiCard
            title="Total Udhar"
            value={formatCurrency(totalUdhar)}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            glowColor={hasUdhar === 'yes' ? 'rose' : 'primary'}
            subtitle={hasUdhar === 'yes' ? 'Filter Active (Click to clear)' : 'Guarantor downpayments'}
            onClick={() => setHasUdhar(prev => prev === 'yes' ? '' : 'yes')}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-start md:gap-8 lg:gap-12 items-stretch md:items-center bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 md:flex-initial md:items-center">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice number or customer name/phone..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Payment Mode */}
            <div className="w-full sm:w-44">
              <CustomSelect
                value={paymentMode}
                onChange={(val) => setPaymentMode(val)}
                placeholder="All Payment Modes"
                options={[
                  { value: '', label: 'All Payment Modes' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Split', label: 'Split' },
                  { value: 'EMI', label: 'EMI / Finance' },
                  { value: 'Udhar', label: 'Udhar (Credit)' },
                ]}
              />
            </div>

            {/* Udhar Filter */}
            <div className="w-full sm:w-48">
              <CustomSelect
                value={hasUdhar}
                onChange={(val) => setHasUdhar(val)}
                placeholder="All Invoices"
                options={[
                  { value: '', label: 'All Invoices' },
                  { value: 'yes', label: 'With Guarantor Udhar' },
                  { value: 'no', label: 'No Guarantor Udhar' },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center md:flex-initial">
            {/* Date Range */}
            <div className="flex items-center gap-1.5 justify-start">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
                className="w-[155px]"
                align="left-0 md:right-0 md:left-auto"
                controlSize="sm"
              />
              <span className="text-slate-500 dark:text-zinc-400 text-xs font-semibold shrink-0 select-none px-0.5">to</span>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
                className="w-[155px]"
                align="right"
                controlSize="sm"
              />
            </div>

            {/* Clear Filters */}
            {(search || paymentMode || startDate || endDate || hasUdhar) && (
              <button
                onClick={handleClearFilters}
                className="h-10 px-4 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all border border-rose-100 dark:border-rose-900/30 flex items-center justify-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
          {(!isLoading && sales.length === 0) ? (
            <div className="py-24">
              <EmptyState
                icon={<FileText className="w-8 h-8 opacity-50" />}
                title="No invoices found"
                description={
                  (search || paymentMode || startDate || endDate)
                    ? "No invoices match your active filters. Try refining your criteria."
                    : "You haven't made any sales yet. Go to POS to create your first bill."
                }
                action={
                  !(search || paymentMode || startDate || endDate) && (
                    <button 
                      onClick={() => navigate('/pos')}
                      className="mt-4 flex items-center justify-center gap-2 h-10 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-500/30 transition-all"
                    >
                      Go to POS
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                }
              />
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={sales} 
              isLoading={isLoading}
              loadingSkeleton={<TableSkeleton cols={7} rows={8} />}
              pagination={{
                currentPage: meta?.current_page || 1,
                totalPages: meta?.last_page || 1,
                onPageChange: setPage
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

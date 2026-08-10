import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../api/useCustomers';
import { getCustomerColumns } from '../constants/customerColumns';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { EditCustomerModal } from '../components/EditCustomerModal';
import { CollectPaymentModal } from '../components/CollectPaymentModal';
import type { Customer } from '../schemas/customerSchema';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { Plus, UserPlus, Users, Search, X, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { CustomSelect } from '@/components/ui/CustomSelect';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [collectPaymentCustomer, setCollectPaymentCustomer] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  // Filters state
  const [search, setSearch] = useState('');
  const [hasUdhar, setHasUdhar] = useState('');

  // Debounced search to prevent duplicate requests
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset pagination on filter selections
  useEffect(() => {
    setPage(1);
  }, [hasUdhar]);

  const filters = useMemo(() => ({
    search: debouncedSearch || undefined,
    has_udhar: hasUdhar || undefined,
  }), [debouncedSearch, hasUdhar]);

  const { data: response, isLoading } = useCustomers(page, 15, filters);

  const customers = response?.data || [];
  const meta = response?.meta;

  const totalCustomers = meta?.total || 0;
  const totalUdhar = customers?.reduce((sum: number, c: any) => {
    const billed = c.sales_sum_final_amount || 0;
    const paid = c.sales_sum_paid_amount || 0;
    return sum + (billed - paid);
  }, 0) || 0;

  const columns = useMemo(() => getCustomerColumns({
    onEdit: (customer) => setEditingCustomer(customer),
    onView: (customer) => navigate(`/customers/${customer.id}`),
    onCollectPayment: (customer) => setCollectPaymentCustomer(customer),
  }), [navigate]);

  const handleClearFilters = () => {
    setSearch('');
    setHasUdhar('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-500/10 dark:bg-primary-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-2 pb-6 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center">
                <Users className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Customer Management <span className="text-primary-600 dark:text-primary-400 text-base font-bold px-2 py-0.5 rounded-md bg-primary-500/10">Parties & Udhar Khata</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage customer profiles, track outstanding credit balances (Udhar), and record incoming payments seamlessly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Customer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-primary-200 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Udhar Khata?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 via-slate-50 to-blue-50 dark:from-primary-950/40 dark:via-slate-900 dark:to-blue-950/20 border-2 border-primary-200 dark:border-primary-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                <Sparkles className="w-5 h-5 fill-primary-500 text-primary-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Customer Relationship & Credit (Udhar) Management</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                In retail and B2B trade, managing customer accounts (Parties / Buyers) requires tracking more than just contact info. Maintaining an organized <strong>Udhar Khata (Credit Ledger)</strong> protects your cash flow while allowing trusted buyers to purchase on credit!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                    <span>📘</span> 1. Automated Khata Maintenance
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Every invoice generated automatically increases a customer&apos;s debit balance, while recorded receipts and credit notes subtract from it. No paper registers needed!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>💬</span> 2. WhatsApp Payment Reminders
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Easily notify parties of overdue balances directly via WhatsApp with one click, drastically improving recovery speed and reducing bad debts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>⚡</span> 3. Instant Payment Collection
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Record lump-sum advances or partial bill receipts against a party account, automatically reconciling their total outstanding dues in real time.
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
              title="Total Customers"
              value={totalCustomers}
              icon={<Users className="w-5 h-5 text-white" />}
              glowColor="primary"
              subtitle="Total registered users"
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <CustomKpiCard
              title="Total Outstanding"
              value={formatCurrency(totalUdhar)}
              icon={<UserPlus className="w-5 h-5 text-white" />}
              glowColor="primary"
              subtitle="Outstanding customer balances"
            />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute z-10 pointer-events-none left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name or phone..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Outstanding Balance Filter */}
            <div className="w-full sm:w-48">
              <CustomSelect
                value={hasUdhar}
                onChange={(val) => setHasUdhar(val)}
                placeholder="All Balances"
                options={[
                  { value: '', label: 'All Balances' },
                  { value: 'yes', label: 'Has Outstanding Dues' },
                  { value: 'no', label: 'No Outstanding Balance' },
                ]}
              />
            </div>
          </div>

          {(search || hasUdhar) && (
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button
                onClick={handleClearFilters}
                className="h-10 px-4 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all border border-rose-100 dark:border-rose-900/30 flex items-center justify-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Customers List Table */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
          {(!isLoading && customers.length === 0) ? (
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="No customers found"
              description={
                (search || hasUdhar)
                  ? "No customers match your active filters. Try refining your criteria."
                  : "Get started by adding your first customer."
              }
              action={
                !(search || hasUdhar) && (
                  <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                    Add Customer
                  </Button>
                )
              }
            />
          ) : (
            <DataTable 
              columns={columns} 
              data={customers} 
              isLoading={isLoading}
              loadingSkeleton={<TableSkeleton cols={4} rows={5} />}
              pagination={{
                currentPage: meta?.current_page || 1,
                totalPages: meta?.last_page || 1,
                onPageChange: setPage
              }}
            />
          )}
        </div>
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <EditCustomerModal 
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        customer={editingCustomer}
      />

      <CollectPaymentModal
        isOpen={!!collectPaymentCustomer}
        onClose={() => setCollectPaymentCustomer(null)}
        customer={collectPaymentCustomer}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, Box, IndianRupee, Activity, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { format, startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { useStaffProductsSold } from '../api/useStaffProductsSold';
import { Input } from '@/components/ui/input';

export default function StaffProductsSoldPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('this_month');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const getDates = () => {
    const today = new Date();
    if (dateRange === 'this_week') {
      return {
        from_date: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        to_date: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      };
    }
    if (dateRange === 'last_month') {
      const lastMonth = subMonths(today, 1);
      return {
        from_date: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
        to_date: format(endOfMonth(lastMonth), 'yyyy-MM-dd')
      };
    }
    if (dateRange === 'this_year') {
      return {
        from_date: format(startOfYear(today), 'yyyy-MM-dd'),
        to_date: format(endOfYear(today), 'yyyy-MM-dd')
      };
    }
    return {
      from_date: format(startOfMonth(today), 'yyyy-MM-dd'),
      to_date: format(endOfMonth(today), 'yyyy-MM-dd')
    };
  };

  const { from_date, to_date } = getDates();
  
  // Create a debounced search term if needed, but for now we can just rely on user hitting enter or we can debounce it.
  const { data, isLoading } = useStaffProductsSold(id, { 
    from_date, 
    to_date, 
    search, 
    page,
    per_page: 15
  });

  const columns = [
    {
      header: 'Product Name',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-slate-100">{row.name}</span>
          {row.item_code && <span className="text-xs text-slate-500">{row.item_code}</span>}
        </div>
      )
    },
    {
      header: 'Qty Sold',
      accessorKey: 'quantity',
      cell: (row: any) => <span className="font-bold">{Number(row.quantity).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Total Sale',
      cell: (row: any) => `₹${Number(row.total_sale).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    },
    {
      header: 'Total Profit',
      cell: (row: any) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          ₹{Number(row.total_profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200 relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-violet-500/10 dark:bg-violet-500/25 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <PageHeader 
          title={data?.staff ? `Products Sold by ${data.staff.name}` : 'Staff Products Sold'}
          subtitle="View detailed breakdown of products sold by this staff member"
          breadcrumbs={[
            { label: 'Staff Performance', onClick: () => navigate('/reports/staff-performance') },
            { label: 'Products Sold', active: true }
          ]}
          icon={Box}
          actions={
            <div className="w-48 z-[60]">
              <CustomSelect
                value={dateRange}
                onChange={(val) => {
                  setDateRange(val);
                  setPage(1); // Reset page on filter change
                }}
                options={[
                  { value: 'this_week', label: 'This Week' },
                  { value: 'this_month', label: 'This Month' },
                  { value: 'last_month', label: 'Last Month' },
                  { value: 'this_year', label: 'This Year' },
                ]}
              />
            </div>
          }
        />

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-2 pb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CustomKpiCard
              title="Total Quantity Sold"
              value={data?.summary?.total_quantity ? Number(data.summary.total_quantity).toLocaleString('en-IN') : '0'}
              icon={<Box className="w-5 h-5" />}
              glowColor="blue"
            />
            <CustomKpiCard
              title="Total Sales Value"
              value={`₹${(Number(data?.summary?.total_sale || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              icon={<IndianRupee className="w-5 h-5" />}
              glowColor="indigo"
            />
            <CustomKpiCard
              title="Total Profit Generated"
              value={`₹${(Number(data?.summary?.total_profit || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              icon={<Activity className="w-5 h-5" />}
              glowColor="emerald"
            />
          </div>

          <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
            
            <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="relative w-64 z-[50]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset page on search
                  }}
                />
              </div>
            </div>

            <DataTable 
              columns={columns} 
              data={data?.products?.data || []} 
              isLoading={isLoading}
              pagination={{
                currentPage: data?.products?.current_page || 1,
                totalPages: data?.products?.last_page || 1,
                onPageChange: (newPage) => setPage(newPage)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

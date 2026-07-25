import React, { useState, useMemo, useEffect } from 'react';
import { List, Plus, Edit2, Trash2, Activity, Tag, ShieldCheck, Settings, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePriceLists, useDeletePriceList } from '../api/usePriceLists';
import { toast } from 'sonner';
import { PriceListFormModal } from '../components/PriceListFormModal';
import { PriceListDetailDrawer } from '../components/PriceListDetailDrawer';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

export default function PriceListsPage() {
  const { data: priceLists, isLoading } = usePriceLists();
  const deleteMutation = useDeletePriceList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceListToEdit, setPriceListToEdit] = useState<any>(null);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [priceListToDelete, setPriceListToDelete] = useState<any>(null);

  const handleDeleteClick = (list: any) => {
    setPriceListToDelete(list);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!priceListToDelete) return;
    try {
      await deleteMutation.mutateAsync(priceListToDelete.id);
      toast.success('Price list deleted');
      setIsDeleteModalOpen(false);
      setPriceListToDelete(null);
    } catch {
      toast.error('Failed to delete price list');
    }
  };

  const handleEdit = (list: any) => {
    setPriceListToEdit(list);
    setIsModalOpen(true);
  };
  
  const handleOpenItems = (list: any) => {
    setSelectedPriceListId(list.id);
    setIsDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
  };

  const stats = useMemo(() => {
    if (!priceLists) return { total: 0, active: 0, defaultName: 'None' };
    return {
      total: priceLists.length,
      active: priceLists.filter((p: any) => p.is_active).length,
      defaultName: priceLists.find((p: any) => p.is_default)?.name || 'None'
    };
  }, [priceLists]);

  const filteredData = useMemo(() => {
    if (!priceLists) return [];
    let filtered = priceLists;
    
    if (statusFilter === 'active') {
      filtered = filtered.filter((p: any) => p.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((p: any) => !p.is_active);
    }

    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((p: any) => 
        (p.name && p.name.toLowerCase().includes(lower)) ||
        (p.description && p.description.toLowerCase().includes(lower))
      );
    }
    
    return filtered;
  }, [priceLists, statusFilter, debouncedSearch]);

  const columns: ColumnDef<any>[] = [
    {
      header: 'Price List',
      accessorKey: 'name',
      cell: (item: any) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
            {item.is_default && (
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 flex items-center gap-1 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 border-primary-200 dark:border-primary-500/20">
                <ShieldCheck className="w-3 h-3" />
                Default
              </Badge>
            )}
          </div>
          {item.description && (
            <span className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'is_active',
      cell: (item: any) => (
         <StatusBadge 
           status={item.is_active ? 'active' : 'suspended'} 
           label={item.is_active ? 'Active' : 'Inactive'} 
         />
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (item: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white dark:bg-[#111115] hover:border-primary-500/50 hover:text-primary-600 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); handleOpenItems(item); }}>
            <Settings className="w-3 h-3 mr-1.5" />
            Manage Items
          </Button>
          <div className="flex gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-200 relative">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-float2" />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-2 pb-6 space-y-6 z-20">
        
        {/* Custom Header matching the aesthetic */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-4 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
               <List className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">Price Lists</h1>
               <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage and organize your pricing structures</p>
             </div>
          </div>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 rounded-xl" onClick={() => { setPriceListToEdit(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Price List
          </Button>
        </div>
        
        {/* KPI Analytics Cards */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-4 shadow-2xl shadow-slate-200/30 dark:shadow-black/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 transition-all hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Total Price Lists"
                value={stats.total}
                icon={<List />}
                glowColor="primary"
                subtitle="All pricing structures"
              />
            </div>
            <div className="flex-1 transition-all hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Active Lists"
                value={stats.active}
                icon={<Activity />}
                glowColor="emerald"
                subtitle="Currently in use"
              />
            </div>
            <div className="flex-1 transition-all hover:-translate-y-1 duration-300">
              <CustomKpiCard
                title="Default List"
                value={stats.defaultName}
                icon={<Tag />}
                glowColor="amber"
                subtitle="Base pricing applied"
              />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-start md:gap-8 lg:gap-12 items-stretch md:items-center bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 md:flex-initial md:items-center">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search price lists..."
                className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <CustomSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="All Statuses"
                options={statusOptions}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center md:flex-initial">
            {/* Clear Filters */}
            {(search || statusFilter !== 'all') && (
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
        <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden relative z-30">
          <div className="p-0">
            {(!isLoading && filteredData.length === 0) ? (
              <div className="p-12 text-center text-slate-500 font-medium">
                No price lists found matching your filters.
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={filteredData} 
                isLoading={isLoading}
                loadingSkeleton={<TableSkeleton cols={3} rows={5} />}
                searchable={false}
              />
            )}
          </div>
        </div>
      </div>
      
      <PriceListFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        priceListToEdit={priceListToEdit}
      />
      
      {selectedPriceListId && (
        <PriceListDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          priceListId={selectedPriceListId}
        />
      )}

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setPriceListToDelete(null); }}
        onConfirm={confirmDelete}
        title="Delete Price List"
        description="Are you sure you want to delete this price list? This action cannot be undone."
        itemName={priceListToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

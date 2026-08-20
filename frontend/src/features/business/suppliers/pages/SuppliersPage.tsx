import React, { useState } from 'react';
import { useSuppliers, useDeleteSupplier } from '../api/useSuppliers';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Building2, Phone, MapPin, Package, FileText, ChevronRight, UserPlus, Edit2, Trash2, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { AddSupplierModal } from '../components/AddSupplierModal';
import { EditSupplierModal } from '../components/EditSupplierModal';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { toast } from 'sonner';

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useSuppliers(page);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  const deleteSupplierMutation = useDeleteSupplier();

  const suppliers = response?.data || [];
  const meta = response?.meta;

  // Stats calculation
  const totalSuppliers = meta?.total || 0;
  const totalUdhar = suppliers?.reduce((sum: number, s: any) => {
    const billed = s.purchases_sum_bill_amount || 0;
    const paid = s.purchases_sum_paid_amount || 0;
    return sum + (billed - paid);
  }, 0) || 0;

  const handleDeleteSupplier = async () => {
    if (!deletingSupplier?.id) return;
    try {
      await deleteSupplierMutation.mutateAsync(deletingSupplier.id);
      toast.success('Supplier deleted successfully');
      setDeletingSupplier(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete supplier');
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: 'Supplier',
      accessorKey: 'name',
      cell: (supplier) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold font-display uppercase shrink-0">
            {supplier.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-slate-900 dark:text-white">{supplier.name}</p>
            <p className="text-xs text-slate-500">{supplier.custom_id || `ID: ${supplier.id}`}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      cell: (supplier) => (
        <div className="space-y-1">
          {supplier.phone && (
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-xs">
              <Phone className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              {supplier.phone}
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center text-slate-600 dark:text-slate-400 text-xs">
              <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span className="truncate max-w-[150px]">{supplier.address}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Items Supplied',
      cell: (supplier) => (
        <div className="flex items-center text-slate-600 dark:text-slate-400">
          <Package className="w-3.5 h-3.5 mr-1.5 shrink-0" />
          <span className="truncate max-w-[150px]">{supplier.items_supplied || '-'}</span>
        </div>
      )
    },
    {
      header: 'Outstanding (Udhar)',
      className: 'text-right',
      cell: (supplier) => {
        const billed = supplier.purchases_sum_bill_amount || 0;
        const paid = (supplier.purchases_sum_paid_amount || 0) + (supplier.general_payments_sum || 0);
        const udhar = billed - paid;
        return (
          <span className={cn(
            "font-semibold font-display",
            udhar > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
          )}>
            {formatCurrency(udhar)}
          </span>
        );
      }
    },
    {
      header: '',
      className: 'text-right',
      cell: (supplier) => (
        <div className="flex justify-end gap-1 items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Edit Supplier"
            onClick={(e) => {
              e.stopPropagation();
              setEditingSupplier(supplier);
            }}
          >
            <Edit2 className="w-4 h-4 text-slate-500 hover:text-slate-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            title="Delete Supplier"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingSupplier(supplier);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/suppliers/${supplier.id}`);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )
    }
  ];

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
              <div className="p-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Supplier Management <span className="text-violet-600 dark:text-violet-400 text-base font-bold px-2 py-0.5 rounded-md bg-violet-500/10">Vendors & Purchase Khata</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage vendor accounts, track pending purchase payables (Udhar), and record inventory supplies.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Supplier
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-violet-200 dark:border-violet-900/30 text-violet-600 dark:text-violet-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is a Supplier?'}
              {showGuide ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Educational Guide Card */}
        {showGuide && (
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50 dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/20 border-2 border-violet-200 dark:border-violet-800/40 shadow-xl transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Sparkles className="w-5 h-5 fill-violet-500 text-violet-600 animate-spin-slow" />
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Why & How to Manage Suppliers</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                A <strong>Supplier (Vendor / Vyapari)</strong> profile is essential for recording raw material purchases, tracking credit balances (Udhar / Payables), and maintaining an organized supply chain.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    <span>📑</span> 1. Centralized Khata Records
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Store vendor GSTIN, bank details, and contact numbers in one secure place. No more searching through paper dairies or WhatsApp messages for payment routing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    <span>📦</span> 2. Inventory Source Tracking
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Connect stock items to specific vendor profiles to effortlessly review supply pricing history, lead times, and reliability before reordering.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <span>💸</span> 3. Better Cash Flow Planning
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Balance incoming customer receipts against due vendor payables to schedule bank transfers or cheque deposits without facing cash crunches.
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
              title="Total Suppliers"
              value={totalSuppliers}
              icon={<Building2 className="w-5 h-5 text-white" />}
              glowColor="primary"
              subtitle="Total registered suppliers"
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <CustomKpiCard
              title="Total Udhar (Outstanding)"
              value={formatCurrency(totalUdhar)}
              icon={<FileText className="w-5 h-5 text-white" />}
              glowColor="rose"
              subtitle="Outstanding supplier balances"
            />
          </div>
        </div>

        {/* Suppliers List Table */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
          <DataTable 
            columns={columns} 
            data={suppliers || []} 
            isLoading={isLoading}
            loadingSkeleton={<TableSkeleton cols={5} rows={5} />}
            emptyIcon={<Building2 className="w-12 h-12" />}
            emptyMessage="No Suppliers Found. Add your first supplier to start creating purchase bills and tracking inventory."
            onRowClick={(supplier) => navigate(`/suppliers/${supplier.id}`)}
            serverSide={true}
            totalItems={meta?.total || 0}
            page={meta?.current_page || page}
            onPageChange={(newPage) => setPage(newPage)}
            itemsPerPage={meta?.per_page || 15}
          />
        </div>

        <AddSupplierModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        {editingSupplier && (
          <EditSupplierModal 
            isOpen={!!editingSupplier} 
            onClose={() => setEditingSupplier(null)} 
            supplier={editingSupplier} 
          />
        )}

        <DeleteConfirmModal
          isOpen={!!deletingSupplier}
          onClose={() => setDeletingSupplier(null)}
          onConfirm={handleDeleteSupplier}
          title="Delete Supplier"
          description={`Are you sure you want to delete supplier "${deletingSupplier?.name}"? All past purchase history and ledgers will be safely preserved in soft-delete.`}
          isLoading={deleteSupplierMutation.isPending}
        />
      </div>
    </div>
  );
}

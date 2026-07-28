import { useState, useEffect, useMemo } from 'react';
import { Package, Plus, DollarSign, AlertTriangle, Search, RotateCcw, Layers, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInventory, useDeleteProduct } from '../api/useInventory';
import type { Product } from '../schemas/productSchema';
import { useCategories } from '../api/useCategories';
import { useBrands } from '../api/useBrands';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { InventoryFormModal } from '../components/InventoryFormModal';
import { DirectAddModal } from '../components/DirectAddModal';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/skeleton-loaders';
import { getInventoryColumns } from '../constants/inventoryColumns';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch, FilterSelect, FilterReset } from '@/components/ui/filter-controls';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [brandId, setBrandId] = useState<number | undefined>();
  const [lowStockDays, setLowStockDays] = useState<string>('');
  const [showGuide, setShowGuide] = useState(false);
  const debouncedSearch = useDebounce(search, 400);
  const debouncedLowStockDays = useDebounce(lowStockDays, 600);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, brandId, debouncedLowStockDays]);

  const { data: inventoryData, isLoading } = useInventory({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    category_id: categoryId,
    brand_id: brandId,
    low_stock_days: debouncedLowStockDays || undefined,
  });

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const deleteMutation = useDeleteProduct();
  const products = inventoryData?.data ?? [];
  const totalItems = inventoryData?.meta?.total ?? 0;

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectAddModalOpen, setIsDirectAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToAddStock, setProductToAddStock] = useState<Product | null>(null);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleAddStock = (product: Product) => {
    setProductToAddStock(product);
    setIsDirectAddModalOpen(true);
  };

  const columns = useMemo(() => getInventoryColumns({
    onEdit: handleEdit,
    onDelete: (product) => setProductToDelete(product),
    onAddStock: handleAddStock
  }), []);

  // Calculate simple stats based on current page data (ideally this comes from backend metadata)
  const lowStockCount = products.filter(p => p.quantity <= 10).length;
  const totalValue = products.reduce((sum, p: any) => sum + (p.inventory_value || (p.quantity * p.purchase_price)), 0);

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
              <div className="p-3 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center">
                <Package className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Inventory & Products <span className="text-amber-600 dark:text-amber-400 text-base font-bold px-2 py-0.5 rounded-md bg-amber-500/10">Stock & Items Catalog</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Track available product quantities, maintain accurate purchase/selling rates, and manage low stock warnings.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button 
              onClick={handleCreate}
              className="rounded-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-md shadow-primary-500/20 px-4 h-10 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="rounded-xl font-bold bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm h-10 px-3 text-xs"
            >
              <HelpCircle className="w-4 h-4 mr-1.5" /> 
              {showGuide ? 'Hide Guide' : 'What is Inventory Management?'}
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
                <h3 className="text-base font-black uppercase tracking-wide">Business Guide: Stock Cataloging & Real-Time Inventory Control</h3>
              </div>
              
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                Effective <strong>Inventory Management (Stock Control)</strong> ensures your godown or showroom never misses a sale due to out-of-stock items while preventing precious working capital from being trapped in slow-moving stock!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <span>📦</span> 1. Real-Time Stock Tracking
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Every billing sale automatically reduces sold quantities from your live stock, while purchase arrivals replenish available counts without manual tallying.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    <span>⚠️</span> 2. Instant Reorder Warnings
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Set minimum safety thresholds for items. When inventory drops below the alert limit, get highlighted visual cues to place purchase orders with vendors in time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    <span>🏷️</span> 3. Accurate HSN & Pricing
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    Pre-define wholesale rates, MRPs, item tax slabs, and HSN/SAC codes in the catalog to guarantee instant, zero-error calculations during customer billing.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CustomKpiCard
            title="Total Products"
            value={totalItems}
            icon={<Package className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="Items in inventory"
          />
          <CustomKpiCard
            title="Low Stock"
            value={lowStockCount}
            icon={<AlertTriangle className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="Products with qty <= 10"
          />
          <CustomKpiCard
            title="Est. Inventory Value"
            value={`₹${totalValue.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="Based on purchase price"
          />
        </div>

        {/* Filters & Data Table */}
        <FilterContainer className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <FilterSearch
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="SEARCH PRODUCTS BY BRAND, MODEL..."
              wrapperClassName="flex-1 min-w-[200px] h-10 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
            />
            
            <FilterSelect
              value={categoryId ? String(categoryId) : ''}
              onChange={(val) => setCategoryId(val ? Number(val) : undefined)}
              placeholder="All Categories"
              options={categoriesData?.data?.map(cat => ({ value: String(cat.id), label: cat.name })) || []}
              searchable={true}
              wrapperClassName="w-full sm:w-44 shrink-0"
            />

            <FilterSelect
              value={brandId ? String(brandId) : ''}
              onChange={(val) => setBrandId(val ? Number(val) : undefined)}
              placeholder="All Brands"
              options={brandsData?.map((brand: any) => ({ value: String(brand.id), label: brand.name })) || []}
              searchable={true}
              wrapperClassName="w-full sm:w-44 shrink-0"
            />

            <div className="flex items-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden h-10 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all group hover:border-primary-500/50 w-full sm:w-56 shrink-0">
              <span className="h-full px-3 flex items-center bg-slate-100 dark:bg-white/5 border-r border-slate-200 dark:border-white/5 text-[9px] font-black tracking-wider text-slate-500 dark:text-zinc-400 uppercase select-none transition-colors group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 whitespace-nowrap">
                Low Stock Qty
              </span>
              <input
                type="number"
                placeholder="10"
                value={lowStockDays}
                onChange={(e) => setLowStockDays(e.target.value)}
                className="flex-1 bg-transparent border-0 pl-2.5 pr-1 py-1 focus:outline-none focus:ring-0 text-xs text-slate-700 dark:text-slate-200 font-bold"
              />
            </div>
          </div>

          {(search || categoryId || brandId || lowStockDays) && (
            <FilterReset
              onClick={() => {
                setSearch('');
                setCategoryId(undefined);
                setBrandId(undefined);
                setLowStockDays('');
                setPage(1);
              }}
            />
          )}
        </FilterContainer>

        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden relative z-20">
          <DataTable
          data={products}
          renderSubComponent={(product) => {
            const activeBatches = (product.batches || []).filter((b: any) => b.remaining_quantity > 0);
            if (activeBatches.length === 0) return (
              <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] text-xs text-slate-500 text-center font-medium italic">
                No active batches found for this product.
              </div>
            );
            return (
              <div className="p-3 sm:p-5 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 w-full">
                <div className="bg-white dark:bg-[#0c0c0f] border border-slate-200/60 dark:border-white/5 rounded-2xl p-4 shadow-sm w-full overflow-hidden">
                  {/* Card Title */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Active Inventory Batches
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-white/5">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                          <th className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Batch #</th>
                          <th className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remaining Stock</th>
                          <th className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Purchase Price</th>
                          <th className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">MRP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {activeBatches.map((batch: any) => (
                          <tr key={batch.id} className="hover:bg-slate-50/40 dark:hover:bg-white/[0.01] transition-colors">
                            <td className="px-4 py-3">
                              {batch.batch_number ? (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5">
                                  {batch.batch_number}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/[0.02] text-slate-400 dark:text-slate-500 italic text-[11px] font-medium border border-dashed border-slate-200 dark:border-white/5">
                                  Default Batch
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider",
                                batch.remaining_quantity <= 10
                                  ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                  : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                              )}>
                                {batch.remaining_quantity} Units
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(batch.purchase_price)}
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                              {formatCurrency(batch.mrp || product.mrp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }}
          columns={columns}
          isLoading={isLoading}
          loadingSkeleton={<TableSkeleton rows={8} cols={5} />}
          searchable={false}
          emptyIcon={<Package className="w-12 h-12" />}
          emptyMessage="No products found matching your criteria."
          serverSide={true}
          totalItems={totalItems}
          page={page}
          itemsPerPage={perPage}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPerPage(size); setPage(1); }}
        />
        </div>
      </div>

      <InventoryFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
      />

      <DirectAddModal
        isOpen={isDirectAddModalOpen}
        onClose={() => setIsDirectAddModalOpen(false)}
        product={productToAddStock}
      />

      <DeleteConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        itemName={[productToDelete?.brand?.name, productToDelete?.model_name].filter(Boolean).join(' ')}
        confirmText="DELETE"
      />
    </div>
  );
}

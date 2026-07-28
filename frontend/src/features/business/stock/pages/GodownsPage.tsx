import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Warehouse, MapPin, Package, DollarSign, Plus, ArrowLeftRight, 
  ChevronDown, ChevronUp, AlertTriangle, Building2, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { useLocations } from '@/features/business/profile/api/useLocations';
import { getLocationWiseStock, type LocationStockEntry } from '../api/stockService';
import { BusinessLocationsSection } from '@/features/business/profile/components/BusinessLocationsSection';

export default function GodownsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'setup'>('inventory');
  const [expandedLocations, setExpandedLocations] = useState<Record<number, boolean>>({});

  // Fetch Physical Godowns / Locations
  const { data: locations = [], isLoading: loadingLocations } = useLocations();

  // Fetch Location-Wise Stock Inventory
  const { data: stockData, isLoading: loadingStock } = useQuery({
    queryKey: ['location-wise-stock'],
    queryFn: getLocationWiseStock,
  });

  const locationStocks = stockData?.data ?? [];

  const toggleExpand = (locId: number) => {
    setExpandedLocations(prev => ({
      ...prev,
      [locId]: !prev[locId]
    }));
  };

  // Calculate KPI Stats
  const totalGodowns = locations.length;
  const totalValuation = locationStocks.reduce((sum, loc) => sum + (loc.total_value || 0), 0);
  const totalItemsCount = locationStocks.reduce((sum, loc) => sum + (loc.items_count || 0), 0);
  const defaultLocName = locations.find((l: any) => l.is_default)?.name || locations[0]?.name || 'Not set';

  const isLoading = loadingLocations || loadingStock;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-[30%] -right-[15%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Godowns & Warehouses
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5">
                  Manage inventory locations, warehouse branches, and monitor stock distribution.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/stock/transfer/new')}
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              Transfer Stock
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab('setup')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Godown / Location
            </Button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Godowns"
            value={totalGodowns.toString()}
            icon={<Warehouse className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            subtitle="Registered warehouse branches"
            glowColor="emerald"
          />
          <CustomKpiCard
            title="Total Stock Value"
            value={`₹${totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            subtitle="Valuation across all godowns"
            glowColor="blue"
          />
          <CustomKpiCard
            title="Total Items Stored"
            value={totalItemsCount.toString()}
            icon={<Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
            subtitle="Unique product entries"
            glowColor="amber"
          />
          <CustomKpiCard
            title="Default Godown"
            value={defaultLocName}
            icon={<Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            subtitle="Primary warehouse location"
            glowColor="purple"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'inventory'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Stock in Godowns ({locationStocks.length})
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'setup'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Godowns Setup & Geo-Fences ({totalGodowns})
          </button>
        </div>

        {/* Tab 1: Inventory Breakdown */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {isLoading ? (
              <CardSkeleton count={3} />
            ) : locationStocks.length === 0 ? (
              <Card className="p-12 text-center border border-dashed border-slate-200 dark:border-zinc-800">
                <Warehouse className="w-12 h-12 mx-auto text-slate-300 dark:text-zinc-600 mb-3 animate-bounce" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  No Inventory Assigned Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                  You haven't transferred or assigned any product inventory to specific godowns yet.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button size="sm" onClick={() => navigate('/stock/transfer/new')}>
                    <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" /> Start Stock Transfer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('setup')}>
                    Manage Godowns
                  </Button>
                </div>
              </Card>
            ) : (
              locationStocks.map((loc: LocationStockEntry) => {
                const isExpanded = expandedLocations[loc.location_id] ?? true; // Default open
                const isDefault = locations.find((l: any) => l.id === loc.location_id)?.is_default;

                return (
                  <Card key={loc.location_id} className="overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 shadow-sm transition-all">
                    {/* Location Accordion Header */}
                    <div 
                      onClick={() => toggleExpand(loc.location_id)}
                      className="p-5 bg-slate-50/80 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
                          <Warehouse className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                              {loc.location_name}
                            </h2>
                            {isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            {loc.items_count} unique items in stock
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-center">
                        <div className="text-right">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                            Valuation
                          </p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            ₹{(loc.total_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-zinc-800 flex items-center justify-center text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Product List */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950">
                        {loc.products.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 italic">
                            No products currently stored in this godown.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-zinc-800">
                                  <th className="py-2.5 px-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Code</th>
                                  <th className="py-2.5 px-3 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Product Name</th>
                                  <th className="py-2.5 px-3 text-right text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Available Qty</th>
                                  <th className="py-2.5 px-3 text-right text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Rate</th>
                                  <th className="py-2.5 px-3 text-right text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Total Value</th>
                                  <th className="py-2.5 px-3 text-center text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 text-xs font-medium">
                                {loc.products.map(item => (
                                  <tr key={item.product_id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <td className="py-3 px-3 font-mono font-bold text-slate-600 dark:text-zinc-400">
                                      {item.item_code || `#${item.product_id}`}
                                    </td>
                                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                                      {item.name}
                                    </td>
                                    <td className="py-3 px-3 text-right font-bold text-slate-800 dark:text-zinc-200">
                                      {item.quantity} <span className="text-[10px] font-normal text-slate-400">{item.unit || 'pcs'}</span>
                                    </td>
                                    <td className="py-3 px-3 text-right text-slate-600 dark:text-zinc-400">
                                      ₹{(item.purchase_rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                                      ₹{(item.stock_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      {item.is_low_stock ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                          <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                          <CheckCircle2 className="w-2.5 h-2.5" /> Normal
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Godown Setup & Map */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Godowns & Physical Locations Configuration
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                    Set up your physical godown addresses, warehouse coordinates (latitude/longitude), and check-in radius. 
                    These locations are used across stock transfers, inventory summaries, and staff geo-fenced attendance.
                  </p>
                </div>
              </div>
            </Card>

            {/* Reuse the comprehensive BusinessLocationsSection */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
              <BusinessLocationsSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

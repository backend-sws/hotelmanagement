import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { 
  BarChart3, TrendingDown, TrendingUp, AlertTriangle, 
  PackageX, Clock, CalendarDays, Activity
} from 'lucide-react';
import api from '@/lib/api';

export function ProductAnalysisReportPage() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ['product-analytics', days],
    queryFn: async () => {
      const res = await api.get(`/business/product-analytics?days=${days}`);
      return res.data;
    }
  });

  const products = data?.products || [];
  const timeAnalysis = data?.time_analysis || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'bg-rose-500 text-white';
      case 'critical': return 'bg-orange-500 text-white';
      case 'warning': return 'bg-amber-500 text-white';
      case 'healthy': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'Out of Stock';
      case 'critical': return 'Critical (Depleting Soon)';
      case 'warning': return 'Warning (Low Stock)';
      case 'healthy': return 'Healthy';
      default: return 'Unknown Demand';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            Stock Depletion & Demand Analytics
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Analyze which products are selling fast and when they might run out of stock.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Time Window:
          </label>
          <Select value={String(days)} onChange={e => setDays(Number(e.target.value))} className="w-40 rounded-xl font-bold bg-white dark:bg-black/20">
            <option value="7">Last 7 Days</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Time of Day Analysis */}
        <Card className="lg:col-span-1 p-5 rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-[#09090b]">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-purple-500" />
            Peak Demand Hours
          </h3>
          <p className="text-xs text-slate-500 mb-6">Sales volume across time of day</p>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-slate-100 dark:bg-white/5 rounded-lg w-full"></div>)}
              </div>
            ) : timeAnalysis.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm font-medium">No sales data for this period.</div>
            ) : (
              timeAnalysis.map((ta: any) => {
                const maxQty = Math.max(...timeAnalysis.map((t: any) => Number(t.total_quantity)));
                const pct = (Number(ta.total_quantity) / maxQty) * 100;
                
                return (
                  <div key={ta.hour} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{ta.formatted_time}</span>
                      <span>{ta.total_quantity} items sold</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right: Product Depletion Table */}
        <Card className="lg:col-span-2 p-0 rounded-2xl border-slate-200/80 shadow-sm bg-white dark:bg-[#09090b] overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              Expected Stock Ending Time
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-[#09090b] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-4 border-b border-slate-100 dark:border-white/5">Product Name</th>
                  <th className="px-5 py-4 border-b border-slate-100 dark:border-white/5 text-center">Avg Daily Sale</th>
                  <th className="px-5 py-4 border-b border-slate-100 dark:border-white/5 text-center">Current Stock</th>
                  <th className="px-5 py-4 border-b border-slate-100 dark:border-white/5 text-center">Days Left</th>
                  <th className="px-5 py-4 border-b border-slate-100 dark:border-white/5 text-right">Expected End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 animate-pulse font-medium">Loading analytics...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No product data available.</td>
                  </tr>
                ) : (
                  products.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(p.status).split(' ')[0]}`}></span>
                          {getStatusLabel(p.status)}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                        {p.avg_daily_sale > 0 ? `${p.avg_daily_sale}/day` : '-'}
                      </td>
                      <td className="px-5 py-3 text-center font-bold">
                        {p.current_stock}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {p.estimated_days_remaining >= 0 ? (
                          <Badge className={`${getStatusColor(p.status)} font-black px-2 py-0.5 text-xs border-0 shadow-sm`}>
                            {p.estimated_days_remaining} Days
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs font-bold">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        {p.expected_ending_date || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

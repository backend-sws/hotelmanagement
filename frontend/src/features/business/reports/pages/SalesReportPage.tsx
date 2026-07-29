import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Package, Award, 
  Calendar, RefreshCw, Download, 
  TrendingUp, ArrowUpRight, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { reportService } from '../api/reportService';
import type { SalesAnalysisResponse } from '../api/reportService';
import { toast } from 'sonner';

export default function SalesReportPage() {
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'customers' | 'products' | 'reps' | 'trends'>('customers');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SalesAnalysisResponse['data'] | null>(null);

  const fetchSalesAnalysis = async () => {
    setLoading(true);
    try {
      const res = await reportService.getSalesAnalysis({ from_date: fromDate, to_date: toDate });
      setData(res.data);
    } catch (err: any) {
      toast.error('Failed to load Sales Analysis report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesAnalysis();
  }, [fromDate, toDate]);

  const handleExport = () => {
    toast.success('Exporting sales analysis CSV...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-medium text-sm mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Multi-Dimensional Business Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Analysis Report</h1>
          <p className="text-slate-300 text-sm mt-1">
            Deep-dive volume breakdowns by top buying customers, highest revenue products, and sales rep leaderboards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-purple-300" />
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
          </div>

          <Button 
            onClick={fetchSalesAnalysis} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          Top Customers
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Package className="w-4 h-4" />
          Top Products & Items
        </button>
        <button
          onClick={() => setActiveTab('reps')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'reps'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Award className="w-4 h-4" />
          Sales Rep Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'trends'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Daily Volume Trends
        </button>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Period Revenue</span>
              <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
                ₹{data.summary.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </Card>

            <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Invoices Generated</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {data.summary.total_invoices} Invoices
              </div>
            </Card>

            <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">Average Invoice Value (Ticket Size)</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{data.summary.average_invoice_value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </Card>
          </div>

          {/* TAB 1: CUSTOMERS */}
          {activeTab === 'customers' && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Top 10 Customers by Revenue</h3>
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Ranked by Volume
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5 w-16">Rank</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Phone / Contact</th>
                      <th className="p-3.5 text-center">Invoices</th>
                      <th className="p-3.5 text-right">Total Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.by_customer.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">No customer sales recorded in this period.</td>
                      </tr>
                    ) : (
                      data.by_customer.map((item, idx) => (
                        <tr key={item.customer_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="p-3.5 font-medium text-slate-900 dark:text-white">{item.customer_name}</td>
                          <td className="p-3.5 text-slate-500 font-mono">{item.phone || 'N/A'}</td>
                          <td className="p-3.5 text-center">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                              {item.invoice_count} bills
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Top 10 Selling Products & Items</h3>
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Ranked by Revenue
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5 w-16">Rank</th>
                      <th className="p-3.5">Item Name</th>
                      <th className="p-3.5">UOM</th>
                      <th className="p-3.5 text-right">Total Qty Sold</th>
                      <th className="p-3.5 text-right">Revenue Generated (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.by_product.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">No items sold in this period.</td>
                      </tr>
                    ) : (
                      data.by_product.map((item, idx) => (
                        <tr key={item.product_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="p-3.5 font-medium text-slate-900 dark:text-white">{item.product_name}</td>
                          <td className="p-3.5 text-slate-500">{item.uom}</td>
                          <td className="p-3.5 text-right font-mono">{item.total_quantity}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 3: REPS */}
          {activeTab === 'reps' && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Sales Representative Leaderboard</h3>
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Revenue Contribution
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5 w-16">Rank</th>
                      <th className="p-3.5">Representative Name</th>
                      <th className="p-3.5 text-center">Invoices Closed</th>
                      <th className="p-3.5 text-right">Revenue Generated (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.by_sales_rep.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">No sales representative activity found.</td>
                      </tr>
                    ) : (
                      data.by_sales_rep.map((item, idx) => (
                        <tr key={item.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="p-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className={`w-4 h-4 ${idx === 0 ? 'text-amber-500' : 'text-slate-400'}`} />
                            {item.rep_name}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              {item.invoice_count} deals
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 4: TRENDS */}
          {activeTab === 'trends' && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">Daily Invoiced Volume Trends</h3>
                <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Chronological Breakdown
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-center">Invoices Count</th>
                      <th className="p-3.5 text-right">Daily Volume (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.trends.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-400">No trend data available for this period.</td>
                      </tr>
                    ) : (
                      data.trends.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-medium text-slate-900 dark:text-white">{item.date}</td>
                          <td className="p-3.5 text-center">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded text-xs font-medium">
                              {item.invoice_count} invoices
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                            {item.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

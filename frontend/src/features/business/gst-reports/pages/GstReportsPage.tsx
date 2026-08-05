import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, PieChart, 
  Download, Calendar, RefreshCw, CheckCircle, 
  AlertCircle, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { gstReportService } from '../api/gstReportService';
import type { Gstr1Response, Gstr3bResponse, HsnResponse } from '../api/gstReportService';
import { toast } from 'sonner';

export default function GstReportsPage() {
  const [activeTab, setActiveTab] = useState<'gstr1' | 'gstr3b' | 'hsn'>('gstr1');
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [gstr1Data, setGstr1Data] = useState<Gstr1Response['data'] | null>(null);
  const [gstr3bData, setGstr3bData] = useState<Gstr3bResponse['data'] | null>(null);
  const [hsnData, setHsnData] = useState<HsnResponse['data'] | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'gstr1') {
        const res = await gstReportService.getGstr1({ from_date: fromDate, to_date: toDate });
        setGstr1Data(res.data);
      } else if (activeTab === 'gstr3b') {
        const res = await gstReportService.getGstr3b({ from_date: fromDate, to_date: toDate });
        setGstr3bData(res.data);
      } else if (activeTab === 'hsn') {
        const res = await gstReportService.getHsnSummary({ from_date: fromDate, to_date: toDate });
        setHsnData(res.data);
      }
    } catch (err: any) {
      toast.error('Failed to load GST report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, fromDate, toDate]);

  const handleExport = () => {
    toast.success(`Exporting ${activeTab.toUpperCase()} report as CSV...`);
    // Basic CSV download trigger implementation
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === 'gstr1' && gstr1Data) {
      csvContent += "Invoice Number,Date,Customer Name,GSTIN,State,Taxable Amount,CGST,SGST,IGST,Total Tax,Total Value\n";
      gstr1Data.b2b.forEach(item => {
        csvContent += `${item.invoice_number},${item.date},"${item.customer_name}",${item.gstin},${item.state},${item.taxable_amount},${item.cgst_amount},${item.sgst_amount},${item.igst_amount},${item.total_tax},${item.total_amount}\n`;
      });
    } else if (activeTab === 'hsn' && hsnData) {
      csvContent += "HSN Code,Description,UOM,GST Rate (%),Qty,Taxable Value,Total Tax,Total Value\n";
      hsnData.items.forEach(item => {
        csvContent += `${item.hsn_code},"${item.description}",${item.uom},${item.gst_rate},${item.total_quantity},${item.taxable_value},${item.total_tax},${item.total_value}\n`;
      });
    } else if (activeTab === 'gstr3b' && gstr3bData) {
      csvContent += `GSTR-3B Summary Return\nPeriod: ${fromDate} to ${toDate}\n\n`;
      csvContent += "3.1 Outward Supplies (Output Tax)\n";
      csvContent += "Taxable Turnover,CGST,SGST,IGST,Total Tax\n";
      csvContent += `${gstr3bData.outward_supplies.taxable_amount},${gstr3bData.outward_supplies.cgst_amount},${gstr3bData.outward_supplies.sgst_amount},${gstr3bData.outward_supplies.igst_amount},${gstr3bData.outward_supplies.total_tax}\n\n`;
      
      csvContent += "4. Eligible Input Tax Credit (ITC)\n";
      csvContent += "Eligible Purchase Value,CGST,SGST,IGST,Total ITC\n";
      csvContent += `${gstr3bData.eligible_itc.taxable_amount},${gstr3bData.eligible_itc.cgst_amount},${gstr3bData.eligible_itc.sgst_amount},${gstr3bData.eligible_itc.igst_amount},${gstr3bData.eligible_itc.total_tax}\n\n`;

      csvContent += "GSTR-3B Net Settlement Summary\n";
      csvContent += "Net GST Payable (In Cash),ITC Carry-Forward\n";
      csvContent += `${gstr3bData.net_payable.total_tax},${gstr3bData.itc_carry_forward.total_tax}\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Government Compliance & Tax Returns</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">GST Reports Suite (GSTR-1, 3B, HSN)</h1>
          <p className="text-slate-300 text-sm mt-1">
            Generate automated tax filing summaries with ITC offsets and audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-indigo-300" />
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
            onClick={fetchData} 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('gstr1')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'gstr1'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          GSTR-1 Outward Supplies
        </button>
        <button
          onClick={() => setActiveTab('gstr3b')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'gstr3b'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <PieChart className="w-4 h-4" />
          GSTR-3B Summary Return
        </button>
        <button
          onClick={() => setActiveTab('hsn')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'hsn'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          HSN Wise Summary
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* TAB 1: GSTR-1 */}
          {activeTab === 'gstr1' && gstr1Data && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Taxable Value</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    ₹{gstr1Data.totals.taxable_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span>{gstr1Data.summary.total_invoices} Invoices Processed</span>
                  </div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total CGST + SGST</span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{(gstr1Data.totals.cgst_amount + gstr1Data.totals.sgst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Intra-State Supplies</div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total IGST</span>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    ₹{gstr1Data.totals.igst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Inter-State Supplies</div>
                </Card>

                <Card className="p-4 border-slate-200 dark:border-slate-800 bg-indigo-600 text-white">
                  <span className="text-xs font-semibold text-indigo-200 uppercase">Total Outward Tax</span>
                  <div className="text-xl font-bold mt-1">
                    ₹{gstr1Data.totals.total_tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-indigo-200 mt-1">Total Invoice Value: ₹{gstr1Data.totals.total_invoice_value.toLocaleString('en-IN')}</div>
                </Card>
              </div>

              {/* B2B Table */}
              <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">B2B Invoices (Registered Customers with GSTIN)</h3>
                    <p className="text-xs text-slate-500">All supplies made to registered taxable entities.</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {gstr1Data.b2b.length} Records
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3.5">Invoice #</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Customer & GSTIN</th>
                        <th className="p-3.5">State</th>
                        <th className="p-3.5 text-right">Taxable (₹)</th>
                        <th className="p-3.5 text-right">CGST (₹)</th>
                        <th className="p-3.5 text-right">SGST (₹)</th>
                        <th className="p-3.5 text-right">IGST (₹)</th>
                        <th className="p-3.5 text-right">Total Tax (₹)</th>
                        <th className="p-3.5 text-right">Total Val (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {gstr1Data.b2b.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-slate-400">No B2B invoices found in this period.</td>
                        </tr>
                      ) : (
                        gstr1Data.b2b.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5 font-medium text-indigo-600 dark:text-indigo-400">{item.invoice_number}</td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.date}</td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-900 dark:text-white">{item.customer_name}</div>
                              <div className="text-xs text-slate-500 font-mono">{item.gstin}</div>
                            </td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.state}</td>
                            <td className="p-3.5 text-right font-mono text-slate-900 dark:text-white">{item.taxable_amount.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.cgst_amount.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.sgst_amount.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.igst_amount.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">{item.total_tax.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">{item.total_amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* B2C Table */}
              <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">B2C Supplies (Unregistered Consumers)</h3>
                    <p className="text-xs text-slate-500">Small and Large inter-state / local supplies to end consumers without GSTIN.</p>
                  </div>
                  <span className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {gstr1Data.b2cs.length + gstr1Data.b2cl.length} Records
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Invoice #</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">State</th>
                        <th className="p-3.5 text-right">Taxable (₹)</th>
                        <th className="p-3.5 text-right">Total Tax (₹)</th>
                        <th className="p-3.5 text-right">Total Val (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {gstr1Data.b2cs.length === 0 && gstr1Data.b2cl.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">No B2C supplies found in this period.</td>
                        </tr>
                      ) : (
                        [...gstr1Data.b2cl, ...gstr1Data.b2cs].map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5">
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-0.5 rounded font-medium">
                                B2C
                              </span>
                            </td>
                            <td className="p-3.5 font-medium text-slate-900 dark:text-white">{item.invoice_number}</td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.date}</td>
                            <td className="p-3.5 text-slate-900 dark:text-white">{item.customer_name}</td>
                            <td className="p-3.5 text-slate-600 dark:text-slate-300">{item.state}</td>
                            <td className="p-3.5 text-right font-mono">{item.taxable_amount.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono text-emerald-600 font-semibold">{item.total_tax.toFixed(2)}</td>
                            <td className="p-3.5 text-right font-mono font-bold">{item.total_amount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: GSTR-3B */}
          {activeTab === 'gstr3b' && gstr3bData && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outward Tax Card */}
                <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-rose-500" />
                        3.1 Outward Supplies (Output Tax)
                      </h3>
                      <p className="text-xs text-slate-500">Tax liability on sales invoices & debit notes.</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taxable Turnover:</span>
                      <span className="font-mono font-semibold">₹{gstr3bData.outward_supplies.taxable_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">CGST Amount:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.outward_supplies.cgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">SGST Amount:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.outward_supplies.sgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">IGST Amount:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.outward_supplies.igst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-rose-600 dark:text-rose-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total Output GST Liability:</span>
                      <span className="font-mono">₹{gstr3bData.outward_supplies.total_tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </Card>

                {/* Eligible ITC Card */}
                <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                        4. Eligible Input Tax Credit (ITC)
                      </h3>
                      <p className="text-xs text-slate-500">Tax paid on supplier purchases where ITC is eligible.</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Eligible Purchase Value:</span>
                      <span className="font-mono font-semibold">₹{gstr3bData.eligible_itc.taxable_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">CGST ITC Available:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.eligible_itc.cgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">SGST ITC Available:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.eligible_itc.sgst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">IGST ITC Available:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">₹{gstr3bData.eligible_itc.igst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total ITC Offset Available:</span>
                      <span className="font-mono">₹{gstr3bData.eligible_itc.total_tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Net Payable / Carry Forward Banner */}
              <Card className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">GSTR-3B Net Settlement Summary</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Automatic offset calculation: (Total Output Tax Liability minus Eligible Input Tax Credit)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 bg-black/30 px-6 py-4 rounded-xl border border-white/10">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">Net GST Payable (In Cash)</div>
                      <div className="text-2xl font-bold font-mono text-rose-400 mt-0.5">
                        ₹{gstr3bData.net_payable.total_tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="h-10 w-px bg-white/10" />

                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">ITC Carry-Forward</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                        ₹{gstr3bData.itc_carry_forward.total_tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: HSN */}
          {activeTab === 'hsn' && hsnData && (
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">HSN Wise Summary of Outward Supplies</h3>
                  <p className="text-xs text-slate-500">Itemized tax classification mandated for table 12 of GSTR-1.</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {hsnData.items.length} HSN Codes
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5">HSN Code</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">UOM</th>
                      <th className="p-3.5 text-center">Rate (%)</th>
                      <th className="p-3.5 text-right">Total Qty</th>
                      <th className="p-3.5 text-right">Taxable Val (₹)</th>
                      <th className="p-3.5 text-right">CGST (₹)</th>
                      <th className="p-3.5 text-right">SGST (₹)</th>
                      <th className="p-3.5 text-right">IGST (₹)</th>
                      <th className="p-3.5 text-right">Total Tax (₹)</th>
                      <th className="p-3.5 text-right">Total Val (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {hsnData.items.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-400">No HSN items recorded in this period.</td>
                      </tr>
                    ) : (
                      hsnData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.hsn_code}</td>
                          <td className="p-3.5 font-medium text-slate-900 dark:text-white">{item.description}</td>
                          <td className="p-3.5 text-slate-500">{item.uom}</td>
                          <td className="p-3.5 text-center font-semibold bg-slate-50 dark:bg-slate-800/40">{item.gst_rate}%</td>
                          <td className="p-3.5 text-right font-mono">{item.total_quantity}</td>
                          <td className="p-3.5 text-right font-mono font-medium">{item.taxable_value.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.cgst_amount.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.sgst_amount.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-400">{item.igst_amount.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">{item.total_tax.toFixed(2)}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">{item.total_value.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

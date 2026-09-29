import React, { useState } from 'react';
import { 
    Users, 
    Shield, 
    Key, 
    ScanLine, 
    BarChart3, 
    TrendingUp, 
    FileText, 
    ShoppingBag, 
    Building, 
    Printer, 
    RefreshCw, 
    CheckCircle2, 
    Lock, 
    Smartphone, 
    Eye, 
    Clock, 
    DollarSign, 
    Layers, 
    Check, 
    Radio, 
    Zap,
    MapPin,
    AlertCircle
} from 'lucide-react';

export const OperationsSecurityAndGst: React.FC = () => {
    // S-27: Live Sales MIS Dashboard state
    const [misMetric, setMisMetric] = useState<'today' | 'weekly' | 'monthly'>('today');

    const misData = {
        today: { sales: '₹84,290', bills: 142, abv: '₹593', footfall: 215, shrinkage: '0.04%' },
        weekly: { sales: '₹5,62,400', bills: 980, abv: '₹574', footfall: 1420, shrinkage: '0.06%' },
        monthly: { sales: '₹24,80,000', bills: 4120, abv: '₹602', footfall: 5900, shrinkage: '0.05%' }
    };

    // S-31: Hardware tabs
    const [selectedHardware, setSelectedHardware] = useState<'printer' | 'scanner' | 'scale' | 'drawer'>('printer');

    return (
        <div className="bg-white">
            {/* S-24 & S-25: Staff Attendance & Anti-Theft RBAC Security */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 rounded-full border border-rose-200">
                            THEFT &amp; RBAC SECURITY
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Geofenced Staff Attendance &amp; Anti-Theft Cashier RBAC
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Retail profit margins live or die by shrinkage control. Lock down unauthorized discounts, enforce supervisor OTP for bill cancellations, and verify staff attendance with GPS geofencing.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Security Feature 1 */}
                        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 mb-6">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Supervisor OTP for Bill Voids</h3>
                            <p className="text-xs text-rose-600 font-semibold mt-1">Zero unauthorized invoice deletions</p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                Cashiers cannot delete an item or void a generated bill without an instant OTP pinged to the store manager's mobile app. Complete audit trail logged with timestamp.
                            </p>
                            <div className="mt-5 p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs font-mono text-rose-800">
                                Protected actions: Price Override, Bill Void, Item Return, Drawer Open without Sale.
                            </div>
                        </div>

                        {/* Security Feature 2 */}
                        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 mb-6">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Geofenced Selfie Attendance</h3>
                            <p className="text-xs text-blue-600 font-semibold mt-1">Eliminate proxy punching</p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                Store staff clock in on the Nexus Mobile app only when physically within 50 meters of the store premises. Facial recognition matches selfie against staff profile.
                            </p>
                            <div className="mt-5 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs font-mono text-blue-800">
                                Automatic integration with monthly payroll, shift OT calculations, and late-arrival deductions.
                            </div>
                        </div>

                        {/* Security Feature 3 */}
                        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 mb-6">
                                <Key className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Granular Role Permissions</h3>
                            <p className="text-xs text-amber-600 font-semibold mt-1">Role-Based Access Control (RBAC)</p>
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                                4 Pre-built retail roles: Cashier (billing only), Floor Assistant (stock enquiry), Store Manager (discounts &amp; GRN inward), and Owner (consolidated P&amp;L &amp; bank ledger).
                            </p>
                            <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs font-mono text-amber-800">
                                Block cashiers from seeing cost price, supplier margins, and daily store aggregate turnover.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-26: Loss Prevention & Stock Shrinkage Audit */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 rounded-full border border-amber-200">
                            STOCK AUDIT &amp; SHRINKAGE
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Barcode Cycle Count &amp; Loss Prevention Mode
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Don't wait for annual stock taking. Run blind cycle counts for high-theft categories (chocolates, cosmetics, perfumes, dry fruits) while keeping billing active.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                                        <ScanLine className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">Continuous Blind Cycle Counting</h3>
                                        <p className="text-xs text-slate-500">Auditors count without knowing system quantities</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Staff scan shelf barcodes using our Android handheld app. Nexus compares physical count with backend book stock in the background, preventing staff from fudging numbers to match system data.
                                </p>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Zero Store Shutdown: Audit Aisle 3 while Customers Shop in Aisle 1</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Auto-Adjustment Entry with Reason Codes (Theft, Broken in transit, Expired)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Shrinkage Value Booked Directly to P&amp;L as Stock Write-Off</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Average Shrinkage Reduction:</span>
                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                        Cut from 1.8% to 0.3% in 60 Days
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Discrepancy Table */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                    Live Cycle Count Reconciliation
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-950 text-amber-300 rounded border border-amber-800">
                                    Audit #AUD-2025-09
                                </span>
                            </div>

                            <div className="space-y-4 text-xs font-mono">
                                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold">Ferrero Rocher 16 pcs</div>
                                        <div className="text-[11px] text-slate-400">SKU: CHOC-FR-16</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-400">Sys: 40 | Physical: 36</div>
                                        <div className="text-rose-400 font-bold">-4 pcs Discrepancy (-₹1,996)</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold">Dove Moisturising Bar 100g</div>
                                        <div className="text-[11px] text-slate-400">SKU: SOAP-DV-100</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-400">Sys: 120 | Physical: 120</div>
                                        <div className="text-emerald-400 font-bold">0 Discrepancy (100% Match)</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold">Whisper Ultra Clean XL 30s</div>
                                        <div className="text-[11px] text-slate-400">SKU: PC-WHP-30</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-400">Sys: 65 | Physical: 63</div>
                                        <div className="text-rose-400 font-bold">-2 pcs Discrepancy (-₹680)</div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-sans font-bold text-xs rounded-xl transition">
                                        Approve Audit &amp; Write Off -₹2,676 Shrinkage
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-27: Executive MIS Dashboard */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                            EXECUTIVE MIS DASHBOARD
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Real-Time Store Performance &amp; Margin Analytics
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Monitor live revenue, average basket value (ABV), items per ticket (IPT), and category margins from anywhere via smartphone or laptop.
                        </p>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Live Store Telemetry</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mt-1">Supermarket Flagship (Indiranagar)</h3>
                            </div>

                            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                                {(['today', 'weekly', 'monthly'] as const).map((m) => (
                                    <button 
                                        key={m}
                                        onClick={() => setMisMetric(m)}
                                        className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition ${
                                            misMetric === m ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                                <div className="text-xs text-slate-400">Total Revenue</div>
                                <div className="text-2xl font-bold text-white font-mono mt-1">{misData[misMetric].sales}</div>
                                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3" /> +14.2% vs prev
                                </div>
                            </div>

                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                                <div className="text-xs text-slate-400">Bills Generated</div>
                                <div className="text-2xl font-bold text-white font-mono mt-1">{misData[misMetric].bills}</div>
                                <div className="text-[11px] text-slate-400 mt-1">Avg 18 sec / checkout</div>
                            </div>

                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                                <div className="text-xs text-slate-400">Avg Basket Value</div>
                                <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{misData[misMetric].abv}</div>
                                <div className="text-[11px] text-slate-400 mt-1">3.8 items per bill</div>
                            </div>

                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                                <div className="text-xs text-slate-400">Footfall Walk-ins</div>
                                <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{misData[misMetric].footfall}</div>
                                <div className="text-[11px] text-emerald-400 mt-1">66% conversion rate</div>
                            </div>

                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 col-span-2 md:col-span-1">
                                <div className="text-xs text-slate-400">Shrinkage Rate</div>
                                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{misData[misMetric].shrinkage}</div>
                                <div className="text-[11px] text-slate-400 mt-1">Well within 0.1% safe limit</div>
                            </div>
                        </div>

                        {/* Live Hourly Graph dummy visual */}
                        <div className="mt-8 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/70">
                            <div className="text-xs font-semibold text-slate-400 mb-4 flex justify-between items-center">
                                <span>Hourly Revenue Heatmap &amp; Rush Hours</span>
                                <span className="text-emerald-400 text-[11px]">Peak Hour: 06:00 PM - 09:00 PM</span>
                            </div>
                            <div className="h-28 flex items-end gap-2 sm:gap-4 pt-4 border-b border-slate-700">
                                {[20, 35, 25, 45, 60, 50, 40, 75, 95, 100, 85, 30].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                                        <div 
                                            className="w-full bg-emerald-500 group-hover:bg-emerald-400 rounded-t transition-all duration-300"
                                            style={{ height: `${h}%` }}
                                        />
                                        <span className="text-[10px] text-slate-500 font-mono">{i + 10}h</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-28 & S-29: GST Filing & Omnichannel Delivery */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 rounded-full border border-indigo-200">
                            GST &amp; COMPOSITION FILING
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Automated GSTR-1 B2CS &amp; Omnichannel Storefront
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Effortless tax compliance whether you are under regular GST (0%, 5%, 12%, 18%, 28%) or the 1% Composition Scheme. Plus, bridge your physical store with WhatsApp &amp; Shopify orders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* GST Retail Engine */}
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Retail GST &amp; Composition Scheme</h3>
                                    <p className="text-xs text-slate-500">GSTR-1 Table 7 B2C Small + HSN 4/6-Digit Summaries</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs text-slate-600">
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">GSTR-1 Table 7 (B2C Small) Aggregation</div>
                                    <p>
                                        Millions of small retail bills are automatically bundled state-wise and rate-wise (0%, 5%, 12%, 18%, 28%) for 1-click JSON upload to the GSTN portal.
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">1% Composition Scheme Support (CMP-08)</div>
                                    <p>
                                        Small retailers avoid line-by-line tax computation. System calculates exact quarterly turnover and 1% tax liability automatically.
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">MRP Tax-Inclusive Reverse Calculation</div>
                                    <p>
                                        Back-calculate base price and CGST/SGST split accurately when selling items at MRP (Maximum Retail Price) without charging customers extra.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Omnichannel Ecommerce */}
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Omnichannel &amp; Local Home Delivery</h3>
                                    <p className="text-xs text-slate-500">Live Inventory Sync with WhatsApp &amp; Shopify</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs text-slate-600">
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">Instant WhatsApp Store Catalog</div>
                                    <p>
                                        Customers browse your live store inventory on WhatsApp. Orders placed on WhatsApp flow straight to your billing counter for instant packing and dispatch.
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">2-Way Shopify &amp; WooCommerce Inventory Sync</div>
                                    <p>
                                        When an item sells in your physical store, online stock decreases in 2 seconds. Never face embarrassing out-of-stock cancellations.
                                    </p>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <div className="font-bold text-slate-900 mb-1">Local Delivery Boy Dispatch App</div>
                                    <p>
                                        Assign neighborhood delivery orders to your store boys with map navigation, COD cash collection verification, and customer delivery OTP sign-off.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-30: Multi-Store Retail Chain Management */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 rounded-full border border-teal-200">
                            MULTI-STORE RETAIL CHAIN
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Scale from 1 Store to 50+ Retail Branches
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Centralized catalog management, inter-branch stock transfers (IBT), central warehouse distribution, and consolidated owner P&amp;L across all cities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mb-4">
                                <Building className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Centralized Master Catalog</h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Add a new FMCG product once at headquarters, and it instantly syncs to all 50 store POS counters with respective regional tax codes and MRPs.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Inter-Branch Stock Transfer (IBT)</h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Move slow-moving sizes from Mall Road store to Station Road branch with digital transit delivery challans and destination receiving confirmation.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900">Consolidated Chain P&amp;L</h3>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                Compare top-performing vs lagging stores, cross-store cashier productivity, inventory turnover ratio (ITR), and gross margins on a single screen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-31 & S-32: Hardware Compatibility & Tally Sync */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 rounded-full border border-cyan-200">
                            PLUG &amp; PLAY HARDWARE &amp; TALLY
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Zero-Driver Hardware Setup &amp; Live Tally Cloud Sync
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Connect standard USB, Bluetooth, and LAN retail peripherals in seconds without complex driver installations. Sync books directly with your CA's Tally Prime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Hardware Matrix Tabs */}
                        <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Printer className="w-5 h-5 text-cyan-700" />
                                <span>Certified Hardware Ecosystem</span>
                            </h3>

                            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                                {[
                                    { id: 'printer', label: 'Thermal Printers' },
                                    { id: 'scanner', label: 'Barcode Scanners' },
                                    { id: 'scale', label: 'Weighing Scales' },
                                    { id: 'drawer', label: 'Cash Drawers' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedHardware(tab.id as any)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${
                                            selectedHardware === tab.id
                                                ? 'bg-cyan-700 text-white shadow'
                                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                                {selectedHardware === 'printer' && (
                                    <>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">TVS Electronics RP 3200 Plus</span>
                                            <span className="text-emerald-700 font-bold">Tested 100% Plug &amp; Play</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Epson TM-T82III (USB &amp; Ethernet)</span>
                                            <span className="text-emerald-700 font-bold">Tested 100% Plug &amp; Play</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">NGX Mobile Bluetooth Thermal (58mm)</span>
                                            <span className="text-emerald-700 font-bold">Tested 100% Plug &amp; Play</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-semibold text-slate-900">TSC TE244 / DA210 Barcode Sticker Printers</span>
                                            <span className="text-emerald-700 font-bold">Tested 100% Plug &amp; Play</span>
                                        </div>
                                    </>
                                )}

                                {selectedHardware === 'scanner' && (
                                    <>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Honeywell Voyager 1400g / 1472g</span>
                                            <span className="text-emerald-700 font-bold">Instant 2D QR &amp; GS1</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Zebra DS2208 Handheld Scanner</span>
                                            <span className="text-emerald-700 font-bold">Instant 2D QR &amp; GS1</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Datalogic Omnidirectional Tabletop</span>
                                            <span className="text-emerald-700 font-bold">Instant 2D QR &amp; GS1</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-semibold text-slate-900">Pegasus Wireless Bluetooth 1D Scanner</span>
                                            <span className="text-emerald-700 font-bold">Instant 2D QR &amp; GS1</span>
                                        </div>
                                    </>
                                )}

                                {selectedHardware === 'scale' && (
                                    <>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Essae Teraoka DS-215 / DS-852</span>
                                            <span className="text-emerald-700 font-bold">RS232 Auto-Sync 0.1g</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Phoenix Scales Series 400</span>
                                            <span className="text-emerald-700 font-bold">RS232 Auto-Sync 0.1g</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Eagle Digital Table Scales (USB/RS232)</span>
                                            <span className="text-emerald-700 font-bold">RS232 Auto-Sync 0.1g</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-semibold text-slate-900">CAS Scales PD-II Point of Sale</span>
                                            <span className="text-emerald-700 font-bold">RS232 Auto-Sync 0.1g</span>
                                        </div>
                                    </>
                                )}

                                {selectedHardware === 'drawer' && (
                                    <>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Standard RJ11/RJ12 Cash Drawers (4-Note / 8-Coin)</span>
                                            <span className="text-emerald-700 font-bold">Auto-Kick on Print</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-100">
                                            <span className="font-semibold text-slate-900">Posiflex Heavy Duty Steel Drawers</span>
                                            <span className="text-emerald-700 font-bold">Auto-Kick on Print</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="font-semibold text-slate-900">APG Vasario Electronic Till</span>
                                            <span className="text-emerald-700 font-bold">Auto-Kick on Print</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* S-32: Tally Prime 2-Way Sync */}
                        <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-600/30 text-violet-400 flex items-center justify-center font-bold">
                                        TP
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base">Direct Tally Prime Cloud Sync</h3>
                                        <p className="text-xs text-slate-400">XML / JSON Connector for Chartered Accountants</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-800">
                                    Auto-Sync ON
                                </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                Stop spending hours generating manual Excel sheets for your CA at the end of every month. Nexus syncs daily sales vouchers, purchase invoices, and bank payments directly into Tally Prime company ledgers.
                            </p>

                            <div className="space-y-3 text-xs font-mono">
                                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-300">Daily Sales Journal Vouchers</span>
                                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Synced (142 Invoices)
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-300">Purchase Inward GRN Ledgers</span>
                                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Synced (4 Vouchers)
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-300">GST Input / Output Tax Ledgers</span>
                                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Reconciled
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Supported Tally Versions:</span>
                                <span className="text-slate-200 font-semibold">Tally Prime 3.0, 4.0 &amp; Tally ERP 9</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

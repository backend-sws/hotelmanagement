import { useState } from 'react';

const REPORT_TABS = [
    {
        cat: 'Statutory GST Reports',
        reports: ['GSTR-1 JSON & Excel Export', 'GSTR-3B Auto-Populated Summary', 'GSTR-2B Auto-Reconciliation', 'TDS Section 194Q Report'],
    },
    {
        cat: 'Financial & Accounting',
        reports: ['Profit & Loss (Monthly / Quarterly)', 'Balance Sheet (T-Shape & Vertical)', 'Trial Balance with Group Summaries', 'Cash Flow & Fund Flow Statement'],
    },
    {
        cat: 'Inventory & Godowns',
        reports: ['Stock Valuation (FIFO / Weighted Avg)', 'Dead Stock & Slow-Moving SKUs', 'Fast Moving Items Velocity Report', 'Reorder Alert Shortage Forecast'],
    },
    {
        cat: 'Sales & Field Performance',
        reports: ['Salesperson Incentive Scorecard', 'Customer Age-wise Debt Aging Matrix', 'Branch-wise Gross Margin Comparison', 'Technician SLA & First-Time-Fix Rate'],
    },
];

export default function FinancialLedgerAndReports() {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div id="finance-reports" className="pt-16 pb-20 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 25: CrmLedger                                     */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>CUSTOMER LEDGER &amp; DEBT AGING</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        360° Party Ledgers With Age-Wise Outstanding Buckets
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Never guess who owes you money. View aging debt broken into 0-30, 31-60, 61-90, and 90+ days.
                        Send consolidated statement PDFs to client WhatsApp in one click.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <div className="text-lg font-bold text-slate-900">Apex Healthcare Distributors</div>
                                    <div className="text-xs text-slate-500 font-mono">GSTIN: 27AADCA1234F1Z1 • Credit Limit: ₹5,00,000</div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                                    Credit Utilized: 72%
                                </span>
                            </div>

                            {/* Aging Buckets */}
                            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <div className="text-[10px] text-emerald-800 uppercase font-bold">0-30 Days</div>
                                    <div className="text-sm font-extrabold text-emerald-700 mt-1">₹1,80,000</div>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                    <div className="text-[10px] text-blue-800 uppercase font-bold">31-60 Days</div>
                                    <div className="text-sm font-extrabold text-blue-700 mt-1">₹1,20,000</div>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                    <div className="text-[10px] text-amber-800 uppercase font-bold">61-90 Days</div>
                                    <div className="text-sm font-extrabold text-amber-700 mt-1">₹45,000</div>
                                </div>
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                                    <div className="text-[10px] text-rose-800 uppercase font-bold">90+ Days (Risk)</div>
                                    <div className="text-sm font-extrabold text-rose-700 mt-1">₹15,000</div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Automated 18% p.a. overdue interest calculation kicks in after 45 credit days.
                                Credit lock automatically prevents billing reps from issuing new goods until older bills are cleared.
                            </p>
                        </div>

                        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 text-center space-y-4">
                            <div>
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Outstanding Debt</span>
                                <span className="text-3xl font-extrabold text-white">₹3,60,000.00</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                    📲 Send WhatsApp Statement
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
                                >
                                    📄 Download PDF Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 26: ReportsFeatures                               */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                            <span>40+ CA-READY MIS REPORTS</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Interactive Report Hub With 1-Click Excel &amp; JSON Export
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Built for both business owners and Chartered Accountants. Export any report with live date filters, branch switches, and item category grouping.
                        </p>
                    </div>

                    {/* Report Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
                        {REPORT_TABS.map((tab, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedTab(idx)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedTab === idx
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tab.cat}
                            </button>
                        ))}
                    </div>

                    {/* Report List Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {REPORT_TABS[selectedTab].reports.map((report, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div className="text-xs font-mono font-bold text-indigo-600 uppercase">REPORT #{idx + 1}</div>
                                    <div className="font-bold text-sm text-slate-900 mt-1">{report}</div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Excel / PDF / JSON</span>
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                    >
                                        Run Preview →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTIONS 27, 28, 29: Commission, Cheque & BOQ             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* S-27: CommissionTracking */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase mb-3">
                                Incentive Engine
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Sales Commission &amp; Incentive Rules</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Calculate sales incentives automatically based on actual money collected (not just billed).
                                Tiered slabs (e.g. 2% up to ₹5L, 4% above ₹5L) auto-post directly to payroll.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-500">Leaderboard Active</span>
                            <span className="font-bold text-emerald-600">Syncs With Salary Run</span>
                        </div>
                    </div>

                    {/* S-28: ChequeManagement */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase mb-3">
                                Banking
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">PDC Cheque Registry &amp; Bounce Alerts</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Track Post-Dated Cheques (PDC) with calendar alerts 2 days before bank presentation.
                                Instant bounce entry logs return charges and dispatches automated legal reminder notice via WhatsApp.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-500">Maturity Calendar</span>
                            <span className="font-bold text-amber-600">Auto Debit Note</span>
                        </div>
                    </div>

                    {/* S-29: ProjectBOQ */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 text-[10px] font-bold uppercase mb-3">
                                Manufacturing &amp; Projects
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Project BOQ &amp; Bill of Materials (BOM)</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                For contractors, fabricators, and interior studios: Create multi-level Bill of Materials, stage-wise wastage tracking,
                                subcontractor labor billing, and real-time project gross margin profit calculators.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-500">Raw Material Staging</span>
                            <span className="font-bold text-purple-600">Real-Time Project P&amp;L</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

import React, { useState } from 'react';

export default function Gstr2bReconciliationAndItc() {
    // S-16 State: Interactive ITC Recovery & Tax Leakage Calculator
    const [annualPurchaseValue, setAnnualPurchaseValue] = useState(48000000); // ₹4.8 Cr annual procurement
    const [avgItcPercent, setAvgItcPercent] = useState(18); // 18% standard GST rate
    const [defaulterVendorPercent, setDefaulterVendorPercent] = useState(3.5); // 3.5% vendors miss filing in 2B

    const totalItcPaidToVendors = Math.round(annualPurchaseValue * (avgItcPercent / 100));
    const potentialLostItc = Math.round(totalItcPaidToVendors * (defaulterVendorPercent / 100));
    const penalInterestSaved = Math.round(potentialLostItc * 0.18); // 18% p.a. GST interest saved on DRC-01 demand

    // S-11 State: Active Reconciliation Filter
    const [filterCategory, setFilterCategory] = useState<'all' | 'matched' | 'mismatched' | 'missing'>('all');

    const sampleInvoices = [
        { id: 'PUR-01', vendor: 'Jindal Steel & Power Ltd', gstin: '27AABCJ1024P1Z4', invNo: 'INV-8419', taxValue: '₹3,24,000', status: 'matched', note: 'Exact match in 2B • Eligible for 100% ITC' },
        { id: 'PUR-02', vendor: 'Shree Ganesh Packaging', gstin: '27AAGCS9912M1Z2', invNo: 'PKG-412', taxValue: '₹42,800', status: 'mismatched', note: 'Purchase book has ₹42,800 vs 2B has ₹41,200 (₹1,600 Diff)' },
        { id: 'PUR-03', vendor: 'Bharat Heavy Fasteners', gstin: '07AAACB4410K1Z8', invNo: 'BHF-904', taxValue: '₹84,500', status: 'matched', note: 'Exact match in 2B • Eligible for 100% ITC' },
        { id: 'PUR-04', vendor: 'Apex Surface Coating Tech', gstin: '27AABCA3012L1Z5', invNo: 'ASC-210', taxValue: '₹38,400', status: 'missing', note: 'Vendor has not filed GSTR-1 • Payment auto-held' },
        { id: 'PUR-05', vendor: 'Continental Wire & Cables', gstin: '29AABCC7712Q1Z9', invNo: 'CWC-612', taxValue: '₹1,12,000', status: 'matched', note: 'Exact match in 2B • Eligible for 100% ITC' }
    ];

    const filteredInvoices = filterCategory === 'all'
        ? sampleInvoices
        : sampleInvoices.filter(i => i.status === filterCategory);

    return (
        <section id="gstr2b-itc" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Input Tax Credit Defense
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Automated GSTR-2B Reconciliation &amp; Rule 36(4) Protection
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Stop leaving hard-earned tax credits on the table. Nexus cross-references your purchase register against the government portal, auto-flags non-filing vendors, and halts payments until credit reflects in 2B.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-11 & S-13: Interactive GSTR-2B Matcher & Defaulter WhatsApp Trigger    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                    
                    {/* Left: Interactive 2B Reconciliation Table */}
                    <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Purchase Book Matcher</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    GSTR-2B Reconciliation Cockpit
                                </h3>
                            </div>

                            {/* Category Filter Tabs */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                                {(['all', 'matched', 'mismatched', 'missing'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-2.5 py-1 rounded-lg transition ${
                                            filterCategory === cat
                                                ? 'bg-purple-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {cat === 'all' && 'All (5)'}
                                        {cat === 'matched' && 'Matched (3)'}
                                        {cat === 'mismatched' && 'Diff (1)'}
                                        {cat === 'missing' && 'Missing (1)'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Invoice Reconciliation List */}
                        <div className="mt-4 space-y-2.5">
                            {filteredInvoices.map((inv) => (
                                <div key={inv.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-slate-900">{inv.vendor}</span>
                                            <span className="text-[10px] font-mono text-slate-400">({inv.invNo})</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{inv.gstin}</div>
                                        <div className="text-[11px] text-slate-600 mt-1">{inv.note}</div>
                                    </div>

                                    <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                                        <span className="font-mono font-bold text-xs text-slate-900">{inv.taxValue}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase ${
                                            inv.status === 'matched'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                : inv.status === 'mismatched'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                            <span>Auto-pulls 14th of every month from GST Portal</span>
                            <span className="font-bold text-purple-700">Rule 36(4) Safe Cap Enforced</span>
                        </div>
                    </div>

                    {/* Right: Defaulter Vendor Notice Automator (S-13) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Automated Vendor Escalation</span>
                                    <h3 className="text-lg font-black text-white mt-0.5">
                                        Defaulter WhatsApp Warning Bot
                                    </h3>
                                </div>
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                            </div>

                            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                                Don't let delinquent suppliers jeopardize your working capital. Nexus detects missing GSTR-1 filings and auto-sends statutory notice letters via WhatsApp with payment-hold warnings.
                            </p>

                            {/* Simulated Vendor WhatsApp Notice */}
                            <div className="mt-5 bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-white/5">
                                    <span>To: Apex Surface Coating Tech</span>
                                    <span className="text-rose-400 font-bold">GSTR-1 Status: UNFILED</span>
                                </div>
                                <p className="text-slate-200 text-[11px] leading-relaxed">
                                    "Dear Vendor, your invoice <strong>#ASC-210 for ₹2,13,360 (GST: ₹38,400)</strong> is missing from our GSTR-2B. As per company tax policy, payment is temporarily placed on hold until your return is filed and reflected in portal records."
                                </p>
                                <div className="pt-2 text-[10px] font-mono text-amber-300">
                                    Notice ID: NOT-2B-9142 • Auto-Logged
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Supplier Compliance Rate: <strong className="text-emerald-400">96.8%</strong></span>
                            <span>Average Filing Turnaround: <strong className="text-white">&lt;48 Hours</strong></span>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-16: Interactive ITC Recovery & Tax Leakage Calculator                   */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Statutory Tax Savings</span>
                            <h3 className="text-2xl font-black text-white mt-1">
                                Calculate Your Blocked Input Tax Credit (ITC) Recovery
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Estimate the tax credits you stand to recover annually by stopping unfiled supplier invoices and DRC-01 demand interest.
                            </p>
                        </div>
                        <div className="bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 text-xs font-mono text-emerald-300">
                            Rule 36(4) Safeguard
                        </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Annual Procurement Value</span>
                                <span className="text-emerald-400 font-mono">₹{(annualPurchaseValue / 10000000).toFixed(2)} Cr</span>
                            </div>
                            <input
                                type="range"
                                min="10000000"
                                max="200000000"
                                step="5000000"
                                value={annualPurchaseValue}
                                onChange={(e) => setAnnualPurchaseValue(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>₹1 Cr</span>
                                <span>₹10 Cr</span>
                                <span>₹20 Cr</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Average GST Tax Slab</span>
                                <span className="text-blue-400 font-mono">{avgItcPercent}% GST</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="28"
                                step="1"
                                value={avgItcPercent}
                                onChange={(e) => setAvgItcPercent(parseInt(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>5% (Food)</span>
                                <span>18% (Standard)</span>
                                <span>28% (Luxury)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Vendor Non-Filing Ratio</span>
                                <span className="text-rose-400 font-mono">{defaulterVendorPercent}%</span>
                            </div>
                            <input
                                type="range"
                                min="1.0"
                                max="8.0"
                                step="0.5"
                                value={defaulterVendorPercent}
                                onChange={(e) => setDefaulterVendorPercent(parseFloat(e.target.value))}
                                className="w-full accent-rose-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>Low (1%)</span>
                                <span>Avg (3.5%)</span>
                                <span>High (8%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculated Output Display */}
                    <div className="mt-8 bg-slate-950/70 rounded-2xl p-6 border border-white/5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Total Paid GST to Vendors</div>
                                <div className="text-xl font-bold text-white mt-1">₹{totalItcPaidToVendors.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400">Total potential input credit</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Recoverable At-Risk ITC</div>
                                <div className="text-2xl font-black text-emerald-400 mt-1">₹{potentialLostItc.toLocaleString()}</div>
                                <div className="text-[10px] text-emerald-400/80">Rescued via 2B payment holds</div>
                            </div>
                            <div className="pl-2">
                                <div className="text-xs text-amber-300 font-bold">DRC-01 Interest Penalties Avoided</div>
                                <div className="text-2xl font-black text-amber-400 mt-0.5">
                                    ₹{penalInterestSaved.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-amber-300/80">@ 18% p.a. statutory interest</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

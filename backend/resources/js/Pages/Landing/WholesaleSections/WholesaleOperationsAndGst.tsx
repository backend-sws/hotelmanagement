import React, { useState } from 'react';

export default function WholesaleOperationsAndGst() {
    const [tallySyncActive, setTallySyncActive] = useState(false);

    return (
        <section id="tally-sync" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                        Enterprise Grade Operations
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Direct NIC E-Invoicing, Tally Prime Sync &amp; Wholesale MIS
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        High-volume government IRN generation, native Tally Prime XML/ODBC sync for your Chartered Accountant, and granular multi-godown security controls.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-27 & S-28: High-Volume E-Invoicing & 2-Way Tally Prime Sync              */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-27: High-Volume B2B E-Invoicing */}
                    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                <div>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Govt Portal Bridge</span>
                                    <h3 className="text-xl font-black text-white mt-0.5">
                                        Direct NIC B2B E-Invoicing Engine
                                    </h3>
                                </div>
                                <span className="text-2xl">🏛️</span>
                            </div>

                            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                                Wholesalers generating 200+ invoices daily cannot afford portal lag. Nexus connects directly to the GSTN/NIC e-invoice servers with automated queue retry and instant signed QR code generation.
                            </p>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                                    <span className="text-slate-300 font-medium">B2B E-Invoice Generation Speed:</span>
                                    <span className="text-emerald-400 font-bold">0.38s Average per IRN</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                                    <span className="text-slate-300 font-medium">Auto-Validation Before Sending:</span>
                                    <span className="text-white font-bold">GSTIN, HSN Code &amp; State Codes Checked</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                                    <span className="text-slate-300 font-medium">E-Invoice + E-Way Combined:</span>
                                    <span className="text-blue-300 font-bold">1-Click Part-A + IRN Generation</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>✓ Zero Aggregator per-bill fees</span>
                            <span className="text-emerald-400 font-bold">Official GSP / ASP Certified</span>
                        </div>
                    </div>

                    {/* S-28: 2-Way Tally Prime & Busy Sync */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Auditor &amp; CA Friendly</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        2-Way Tally Prime &amp; Busy Sync
                                    </h3>
                                </div>
                                <span className="text-2xl">🔄</span>
                            </div>

                            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                                Keep your Chartered Accountant happy. Push B2B sales invoices, purchase inward vouchers, party khata adjustments, and inventory masters directly into Tally Prime XML without manual data entry.
                            </p>

                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-800">Tally Cloud Connector Status</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        tallySyncActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {tallySyncActive ? 'Connected & Live' : 'Ready to Sync'}
                                    </span>
                                </div>

                                <div className="space-y-1.5 text-[11px] text-slate-500">
                                    <div className="flex justify-between">
                                        <span>Sales Vouchers Synced:</span>
                                        <strong className="text-slate-800">1,482 Bills</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Party Ledgers Mapped:</span>
                                        <strong className="text-slate-800">328 Sundry Debtors</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Inventory Stock Items:</span>
                                        <strong className="text-slate-800">100% Tax Grouping Matched</strong>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setTallySyncActive(!tallySyncActive)}
                                    className="w-full mt-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                                >
                                    {tallySyncActive ? '✓ Auto-Sync Active (Daily at 11:59 PM)' : 'Simulate 1-Click Tally Prime Sync'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Also supports Busy Accounting export</span>
                            <span className="font-bold text-blue-600">No Excel Formatting Required</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-29 to S-31: Wholesale MIS, GSTR-1 Tables & Role-Based Approvals         */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* S-29: Wholesale MIS & Brand Profitability */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mb-3">
                            📊
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Brand-Wise Gross Margin MIS
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Track true net profitability per manufacturer brand after factoring in freight, cash discounts, turnover rebates, and transit damage write-offs.
                        </p>
                    </div>

                    {/* S-30: Automated GSTR-1 B2B Summary */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            🧾
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            GSTR-1 Table 4 &amp; Table 12 HSN
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Generate error-free GSTR-1 JSON summaries. Auto-checks for missing party GSTINs, mismatching tax rates, or incorrect HSN digits before filing.
                        </p>
                    </div>

                    {/* S-31: Manager OTP & RBAC Security */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            🛡️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Manager OTP Price Override Lock
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Billing clerks cannot manually edit unit prices or cancel generated invoices without an instant mobile OTP sent to the owner's WhatsApp/phone.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}

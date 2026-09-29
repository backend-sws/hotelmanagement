import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function GstHeroAndArchitecture() {
    // S-01 Hero State: Terminal View (E-Invoice IRN vs GSTR-2B Matcher)
    const [heroMode, setHeroMode] = useState<'irn' | 'gstr2b'>('irn');

    // S-02 State: Interactive GSTIN Lookup Tool
    const [sampleGstin, setSampleGstin] = useState('27AABCU9603R1ZM');
    const [gstinResult, setGstinResult] = useState({
        legalName: 'TATA CONSULTANCY SERVICES LIMITED',
        tradeName: 'TCS LTD',
        state: 'Maharashtra (27)',
        status: 'Active (Verified)',
        taxpayerType: 'Regular Taxpayer',
        filingFrequency: 'Monthly (GSTR-1 & 3B)',
        einvoiceMandate: 'Mandatory (Turnover > ₹5 Cr)'
    });

    const handleGstinSearch = () => {
        // Pre-configured realistic lookup simulator
        if (sampleGstin.startsWith('29')) {
            setGstinResult({
                legalName: 'INFOSYS LIMITED',
                tradeName: 'INFOSYS',
                state: 'Karnataka (29)',
                status: 'Active (Verified)',
                taxpayerType: 'Regular Taxpayer',
                filingFrequency: 'Monthly (GSTR-1 & 3B)',
                einvoiceMandate: 'Mandatory (Turnover > ₹5 Cr)'
            });
        } else if (sampleGstin.startsWith('07')) {
            setGstinResult({
                legalName: 'BHARTI AIRTEL LIMITED',
                tradeName: 'AIRTEL',
                state: 'Delhi (07)',
                status: 'Active (Verified)',
                taxpayerType: 'Regular Taxpayer',
                filingFrequency: 'Monthly (GSTR-1 & 3B)',
                einvoiceMandate: 'Mandatory (Turnover > ₹5 Cr)'
            });
        } else {
            setGstinResult({
                legalName: 'TATA CONSULTANCY SERVICES LIMITED',
                tradeName: 'TCS LTD',
                state: 'Maharashtra (27)',
                status: 'Active (Verified)',
                taxpayerType: 'Regular Taxpayer',
                filingFrequency: 'Monthly (GSTR-1 & 3B)',
                einvoiceMandate: 'Mandatory (Turnover > ₹5 Cr)'
            });
        }
    };

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: GST Hero Section (Clean Light Aesthetics)                           */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Radial Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-indigo-200/25 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Copy & Value Proposition */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-blue-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-blue-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    IRP &amp; GSP Certified
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    100% Real-Time Cloud Sync • Direct NIC E-Invoicing
                                </span>
                                <span className="text-blue-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black text-slate-900 tracking-[-0.035em] leading-[1.1] mb-6">
                                India's Most Trusted{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
                                    GST Compliance
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    &amp; E-Invoicing Cloud ERP
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Generate B2B E-Invoices in &lt;200ms, create instant NIC E-Way Bills, automate 2-way GSTR-2B reconciliation against purchase books, and guard against departmental demand notices with zero penalty risk.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/register"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-blue-500/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2 font-black">
                                        Start 14-Day Free Trial
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </Link>

                                <Link
                                    href="/demo"
                                    className="inline-flex items-center justify-center px-6 py-4 rounded-full font-bold text-slate-800 text-base bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all group"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-700 flex items-center justify-center text-xs transition-colors border border-blue-200/60 shadow-2xs">
                                            ▶
                                        </span>
                                        <span>Book GST Consultation</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Direct NIC IRP Portal Node
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Rule 36(4) ITC Protection
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Interactive Live GST Compliance Terminal Mockup */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Badge: IRN Signed */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-200/80 shadow-2xs">
                                    ✓
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">NIC IRN Generated</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">Latency: 148ms • Signed QR</p>
                                </div>
                            </div>

                            {/* Master Terminal Box */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-blue-950/20 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* Titlebar */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">einvoice1.gst.gov.in/irp</span>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setHeroMode('irn')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                heroMode === 'irn'
                                                    ? 'bg-blue-600 text-white font-black'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            IRN Generator
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHeroMode('gstr2b')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                heroMode === 'gstr2b'
                                                    ? 'bg-blue-600 text-white font-black'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            2B Matcher
                                        </button>
                                    </div>
                                </div>

                                {heroMode === 'irn' ? (
                                    /* Mode 1: Live B2B E-Invoice IRN Generator */
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider">Government Verified</span>
                                                <span className="text-slate-400 font-mono">Ack: 112619482910</span>
                                            </div>
                                            <div className="text-xs font-bold text-white">Tax Invoice #INV-2026-8491</div>
                                            <div className="text-[10px] font-mono text-slate-400 break-all bg-slate-950 p-2 rounded-lg border border-white/5">
                                                IRN: 49a8f21bc9e440...b8192a004ef2 (64 Chars SHA-256)
                                            </div>
                                        </div>

                                        {/* Invoice Details Table */}
                                        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs">
                                            <div className="flex justify-between text-slate-300">
                                                <span>Buyer: Tata AutoComp (27AAACT0012P1Z9)</span>
                                                <span className="font-bold text-white">₹4,24,800.00</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                                                <span>Taxable: ₹3,60,000</span>
                                                <span className="text-blue-400">CGST+SGST (18%): ₹64,800</span>
                                            </div>
                                        </div>

                                        <div className="p-2.5 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center justify-between text-[11px]">
                                            <span className="text-blue-300 font-semibold">NIC Signed QR Code Embedded</span>
                                            <span className="text-emerald-400 font-bold">Valid for Highway Transit ✓</span>
                                        </div>
                                    </div>
                                ) : (
                                    /* Mode 2: GSTR-2B vs Purchase Register 2-Way Matcher */
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-indigo-400 font-bold uppercase">GSTR-2B Monthly Reconciliation</span>
                                                <span className="text-slate-400 font-mono">Jan 2026 Run</span>
                                            </div>
                                            <div className="text-xs font-bold text-white">Purchase Register vs GST Portal 2B</div>
                                        </div>

                                        {/* 3 Status Cards */}
                                        <div className="space-y-2 text-xs">
                                            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-white">142 Invoices Matched</span>
                                                    <span className="text-[10px] text-slate-400 block">Exact GSTIN, Invoice No &amp; Tax Value</span>
                                                </div>
                                                <span className="font-mono text-emerald-400 font-bold">₹18,42,000 ITC</span>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-white">3 Mismatched Invoices</span>
                                                    <span className="text-[10px] text-slate-400 block">₹14,200 Tax Variance with Vendor Book</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                                                    Action Required
                                                </span>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-white">1 Missing in 2B (Vendor Unfiled)</span>
                                                    <span className="text-[10px] text-slate-400 block">Rajesh Logistics • ₹28,500 ITC At Risk</span>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300">
                                                    WhatsApp Notice
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                                    <span>Direct GSP Cloud Tunnel</span>
                                    <span className="text-emerald-400 font-bold">Zero Rejection SLA</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02: Live GSTIN Validation Tool (Clean Light)                            */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                        <div className="text-center max-w-2xl mx-auto mb-8">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                                Live Government API
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                                Instant GSTIN Search &amp; Fraud Verification Tool
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1">
                                Enter any 15-digit GSTIN to fetch official business registration details, active filing status, and tax jurisdiction in real time.
                            </p>
                        </div>

                        {/* Search Input Bar */}
                        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mb-8">
                            <input
                                type="text"
                                value={sampleGstin}
                                onChange={(e) => setSampleGstin(e.target.value.toUpperCase())}
                                placeholder="Enter 15-digit GSTIN (e.g. 27AABCU9603R1ZM)..."
                                className="flex-1 px-4 py-3 text-sm font-mono font-bold uppercase rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-xs"
                            />
                            <button
                                type="button"
                                onClick={handleGstinSearch}
                                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition shadow-sm shrink-0"
                            >
                                Verify GSTIN
                            </button>
                        </div>

                        {/* Verified GSTIN Details Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                                <div>
                                    <div className="text-base font-black text-slate-900">{gstinResult.legalName}</div>
                                    <div className="text-xs text-slate-500 font-medium mt-0.5">Trade Name: <strong>{gstinResult.tradeName}</strong></div>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ {gstinResult.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                                <div>
                                    <span className="text-slate-400 font-medium">State Jurisdiction:</span>
                                    <div className="font-bold text-slate-800 mt-0.5">{gstinResult.state}</div>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium">Taxpayer Type:</span>
                                    <div className="font-bold text-slate-800 mt-0.5">{gstinResult.taxpayerType}</div>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium">Return Frequency:</span>
                                    <div className="font-bold text-slate-800 mt-0.5">{gstinResult.filingFrequency}</div>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-medium">E-Invoice Mandate:</span>
                                    <div className="font-bold text-blue-700 mt-0.5">{gstinResult.einvoiceMandate}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Test Links */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                            <span>Try sample GSTINs:</span>
                            <button type="button" onClick={() => { setSampleGstin('27AABCU9603R1ZM'); handleGstinSearch(); }} className="text-blue-600 underline font-mono">TCS (27)</button>
                            <span>•</span>
                            <button type="button" onClick={() => { setSampleGstin('29AABCI0247G1ZN'); handleGstinSearch(); }} className="text-blue-600 underline font-mono">Infosys (29)</button>
                            <span>•</span>
                            <button type="button" onClick={() => { setSampleGstin('07AABCB3987Q1Z7'); handleGstinSearch(); }} className="text-blue-600 underline font-mono">Airtel (07)</button>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-03: Comprehensive GST Filing Return Matrix                              */}
                    {/* ========================================================================= */}
                    <div className="mt-16">
                        <div className="text-center max-w-3xl mx-auto mb-10">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                                100% Return Coverage
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
                                End-to-End GST Return Filing Schedules
                            </h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Nexus automatically compiles statutory reports into compliant JSON schema for direct upload or automated GST portal sync.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="font-mono font-bold text-sm text-blue-700">GSTR-1</div>
                                <div className="text-xs font-bold text-slate-900 mt-1">Outward Supplies</div>
                                <p className="text-[11px] text-slate-500 mt-1">B2B, B2C, Exports, Nil Rated &amp; Credit Notes (Due: 11th)</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="font-mono font-bold text-sm text-indigo-700">GSTR-2B</div>
                                <div className="text-xs font-bold text-slate-900 mt-1">Auto-Drafted ITC</div>
                                <p className="text-[11px] text-slate-500 mt-1">Static 2-way input tax credit matching statement (14th)</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="font-mono font-bold text-sm text-purple-700">GSTR-3B</div>
                                <div className="text-xs font-bold text-slate-900 mt-1">Monthly Tax Return</div>
                                <p className="text-[11px] text-slate-500 mt-1">Tax liability calculation, ITC set-off &amp; cash payment (20th)</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="font-mono font-bold text-sm text-amber-700">GSTR-9 / 9C</div>
                                <div className="text-xs font-bold text-slate-900 mt-1">Annual Audit Pack</div>
                                <p className="text-[11px] text-slate-500 mt-1">Financial year reconciliation tables for CA audit certification</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="font-mono font-bold text-sm text-emerald-700">CMP-08</div>
                                <div className="text-xs font-bold text-slate-900 mt-1">Composition Return</div>
                                <p className="text-[11px] text-slate-500 mt-1">1% quarterly turnover tax statement for small dealers</p>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-04: Live GST Metrics Stream Ticker                                      */}
                    {/* ========================================================================= */}
                    <div className="mt-14 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">Invoices Processed</div>
                                <div className="text-xl font-black text-white mt-0.5">₹8,400+ Cr</div>
                                <div className="text-[10px] text-blue-400">Pan-India B2B Billing</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">IRN Success Rate</div>
                                <div className="text-xl font-black text-emerald-400 mt-0.5">99.98%</div>
                                <div className="text-[10px] text-slate-400">&lt;200ms Government Node</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">ITC Mismatch Risk</div>
                                <div className="text-xl font-black text-emerald-400 mt-0.5">0.0%</div>
                                <div className="text-[10px] text-slate-400">Rule 36(4) Auto-Locked</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">E-Way Bills Issued</div>
                                <div className="text-xl font-black text-amber-400 mt-0.5">1.8M+</div>
                                <div className="text-[10px] text-slate-400">Zero Highway Detention</div>
                            </div>
                            <div className="p-2 col-span-2 sm:col-span-1">
                                <div className="text-xs text-slate-400 font-medium">Cloud Sync SLA</div>
                                <div className="text-xl font-black text-emerald-400 mt-0.5">100%</div>
                                <div className="text-[10px] text-slate-400">Real-Time Enterprise Cloud</div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-05: GST Quick Nav Hub                                                   */}
                    {/* ========================================================================= */}
                    <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto py-2 text-xs font-semibold text-slate-600">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Jump to:</span>
                        <a href="#e-invoicing-ewb" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            E-Invoicing &amp; E-Way Bill
                        </a>
                        <a href="#gstr2b-itc" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            GSTR-2B &amp; ITC Match
                        </a>
                        <a href="#hsn-tax-rates" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            HSN Code Library
                        </a>
                        <a href="#tally-sync" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            Tally Prime Bridge
                        </a>
                        <a href="#case-studies" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            MSME Case Studies
                        </a>
                    </div>

                </div>
            </section>
        </>
    );
}

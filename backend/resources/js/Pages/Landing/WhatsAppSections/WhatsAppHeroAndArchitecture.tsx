import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function WhatsAppHeroAndArchitecture() {
    // S-01 Hero State: Interactive Smartphone Mockup (Customer Commerce vs Technician Bot)
    const [smartphoneMode, setSmartphoneMode] = useState<'commerce' | 'technician'>('commerce');

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: WhatsApp Hero Section (Clean Light Aesthetics)                      */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Radial Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-teal-200/25 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Copy & Value Proposition */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-emerald-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-emerald-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    Meta Cloud API
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    100% Real-Time Cloud Sync • In-Chat Catalogs &amp; 1-Tap UPI
                                </span>
                                <span className="text-emerald-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black text-slate-900 tracking-[-0.035em] leading-[1.1] mb-6">
                                India's Most Powerful{' '}
                                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 bg-clip-text text-transparent">
                                    WhatsApp-First ERP
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    &amp; Conversational Commerce
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Turn WhatsApp into your highest-converting sales storefront, automated payment recovery agent, and field operations command center. Zero app downloads for customers or technicians.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/register"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-emerald-500/20"
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
                                        <span className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs transition-colors border border-emerald-200/60 shadow-2xs">
                                            ▶
                                        </span>
                                        <span>Test Live WhatsApp Flow</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Official Meta Tech Partner
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    1,000 TPS Direct Throughput
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Interactive WhatsApp Smartphone Mockup */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Badge: Official Green Tick */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-200/80 shadow-2xs">
                                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">Green Tick Verified</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">Official Meta Business Account</p>
                                </div>
                            </div>

                            {/* Master Smartphone Frame */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-emerald-950/20 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* WhatsApp Header */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
                                            NB
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-white">Nexus Enterprise Bot</span>
                                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-[10px] text-emerald-400 font-mono">Official Cloud API • Verified</p>
                                        </div>
                                    </div>

                                    {/* Simulator Mode Switcher */}
                                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setSmartphoneMode('commerce')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                smartphoneMode === 'commerce'
                                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Catalog &amp; UPI
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSmartphoneMode('technician')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                smartphoneMode === 'technician'
                                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Staff Bot
                                        </button>
                                    </div>
                                </div>

                                {smartphoneMode === 'commerce' ? (
                                    /* Mode 1: Customer Catalog & 1-Tap UPI Ordering */
                                    <div className="space-y-3">
                                        {/* In-Chat Product Card */}
                                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                                                <span>Store: Royal Mart Express</span>
                                                <span className="text-emerald-400 font-bold">In-Stock</span>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
                                                    🥭
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Ratnagiri Alphonso Mango (1 Dozen Box)</div>
                                                    <div className="text-[11px] text-emerald-400 font-bold mt-0.5">₹850 / Box <span className="line-through text-slate-500 font-normal">₹990</span></div>
                                                    <div className="text-[10px] text-slate-400">Export Grade A • Naturally Ripened</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                                                <button type="button" className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition text-center shadow-xs">
                                                    Add to Cart (1)
                                                </button>
                                                <button type="button" className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] transition text-center">
                                                    View 42 Items
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dynamic 1-Tap UPI Payment Notification */}
                                        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-white">Invoice #INV-9120 Generated</span>
                                                <span className="text-emerald-400 font-black font-mono">₹850.00</span>
                                            </div>
                                            <p className="text-[11px] text-slate-300">
                                                Tap below to pay instantly via Google Pay, PhonePe, or Paytm:
                                            </p>
                                            <div className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl text-center shadow-md cursor-pointer flex items-center justify-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Pay ₹850 with 1-Tap UPI
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                                            <span>Auto-cleared via Bank Webhook</span>
                                            <span className="text-emerald-400 font-bold">1.2s Settlement</span>
                                        </div>
                                    </div>
                                ) : (
                                    /* Mode 2: Field Technician Bot Dispatch */
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-rose-400 font-bold">P1 EMERGENCY DISPATCH</span>
                                                <span className="text-slate-400 font-mono">Job #4912</span>
                                            </div>
                                            <div className="text-xs font-bold text-white">Carrier 5.0 Ton Chiller Tripping</div>
                                            <div className="text-[11px] text-slate-300">
                                                📍 DLF Cyber Hub, Tower C, Gurgaon<br />
                                                👤 Client: Estate Mgr (+91 98110 XXXXX)
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                                                <button type="button" className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] text-center">
                                                    Accept &amp; Open GPS
                                                </button>
                                                <button type="button" className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-[11px] text-center">
                                                    View Spares List
                                                </button>
                                            </div>
                                        </div>

                                        {/* Gemini AI Photo Audit Box */}
                                        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between font-bold text-indigo-300">
                                                <span>Gemini 1.5 Flash Vision AI</span>
                                                <span className="text-emerald-400 font-mono">99.4% Verified</span>
                                            </div>
                                            <p className="text-[11px] text-slate-300">
                                                "Manifold Gauge reading verified: 68 PSI R32 normal. Deducted 1x CAP-45UF from Van Stock."
                                            </p>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                                            <span>Geofenced Attendance</span>
                                            <span className="text-emerald-400 font-bold">50m Radius Match</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02 & S-03: Meta Cloud API Architecture & Official Green Tick Guide      */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* S-02: Direct Meta Cloud API */}
                        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                                Direct Infrastructure
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                                Official Meta Graph API Direct Integration
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                                No shady third-party intermediaries, no message queues that drop during Diwali surges, and no inflated per-message markups. Nexus connects your business directly to Meta's global data centers.
                            </p>

                            <div className="mt-6 space-y-3 text-xs">
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Message Throughput Capacity</span>
                                    <span className="font-bold text-emerald-700 font-mono">1,000 TPS (Transactions/Sec)</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">WhatsApp Business App Co-Existence</span>
                                    <span className="font-bold text-emerald-700 font-mono">Keep Your Existing Phone</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Official End-to-End Encryption</span>
                                    <span className="font-bold text-emerald-700 font-mono">256-Bit SSL/TLS</span>
                                </div>
                            </div>
                        </div>

                        {/* S-03: Green Tick Verification Guide */}
                        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                                Brand Credibility
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                                Official Green Tick Verification Guide
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                                Stand out with the coveted Green Checkmark next to your brand name. Nexus assists your business throughout the Meta Official Business Account (OBA) submission process.
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <div className="font-bold text-slate-900">1. Meta Business Verification</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">GST Certificate &amp; Utility Bill check</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <div className="font-bold text-slate-900">2. Website Domain Lock</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">DNS TXT record validation</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <div className="font-bold text-slate-900">3. Brand Notability Submission</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">Press releases &amp; news citations</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <div className="font-bold text-slate-900">4. Green Tick Live</div>
                                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">Instant trust on every chat</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ========================================================================= */}
                    {/* S-04: Live WhatsApp Metrics Stream Ticker                                 */}
                    {/* ========================================================================= */}
                    <div className="mt-12 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">Messages Delivered</div>
                                <div className="text-xl font-black text-white mt-0.5">42M+</div>
                                <div className="text-[10px] text-emerald-400">Pan-India Cloud Delivery</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">3-Min Open Rate</div>
                                <div className="text-xl font-black text-emerald-400 mt-0.5">98.4%</div>
                                <div className="text-[10px] text-slate-400">vs 3.2% Email Open Rate</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">UPI Settlement</div>
                                <div className="text-xl font-black text-amber-400 mt-0.5">1.2s</div>
                                <div className="text-[10px] text-slate-400">Instant Ledger Clearing</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">ROI vs SMS</div>
                                <div className="text-xl font-black text-blue-400 mt-0.5">4.8x</div>
                                <div className="text-[10px] text-slate-400">Interactive Action Buttons</div>
                            </div>
                            <div className="p-2 col-span-2 sm:col-span-1">
                                <div className="text-xs text-slate-400 font-medium">Cloud Sync SLA</div>
                                <div className="text-xl font-black text-emerald-400 mt-0.5">100%</div>
                                <div className="text-[10px] text-slate-400">Real-Time Enterprise Cloud</div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-05: WhatsApp Quick Nav Hub                                              */}
                    {/* ========================================================================= */}
                    <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto py-2 text-xs font-semibold text-slate-600">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Jump to:</span>
                        <a href="#in-chat-commerce" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            In-Chat Catalogs
                        </a>
                        <a href="#payment-dunning" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            1-Tap UPI Dunning
                        </a>
                        <a href="#fieldops-automation" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            Staff &amp; FieldOps Bot
                        </a>
                        <a href="#meta-pricing" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            Meta Rate Cards
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

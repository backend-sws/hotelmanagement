import { useState, useEffect } from 'react';

export default function HeroSection({ onWatchDemo }: { onWatchDemo?: () => void }) {
    const [revenue, setRevenue] = useState(1255555);
    const [invoiceCount, setInvoiceCount] = useState(1292);
    const [activeTab, setActiveTab] = useState<'live' | 'einvoice' | 'pos' | 'fieldops'>('live');

    useEffect(() => {
        const timer = setInterval(() => {
            setRevenue((prev) => prev + Math.floor(Math.random() * 320) + 80);
            if (Math.random() > 0.65) {
                setInvoiceCount((c) => c + 1);
            }
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const trustBadges = [
        {
            icon: '🏛️',
            title: 'Direct NIC E-Invoicing',
            desc: 'Instant IRN & QR generation directly with govt portal — zero middleman charges.',
            tag: 'Official Portal API'
        },
        {
            icon: '⚡',
            title: '0.3s Barcode POS Engine',
            desc: 'Rapid counter checkout with weighing scale integration & instant thermal printing.',
            tag: 'Zero Lag'
        },
        {
            icon: '📲',
            title: 'Official WhatsApp Cloud API',
            desc: 'Automated invoice PDFs, UPI payment links & live ledger statements.',
            tag: 'Meta Verified'
        },
        {
            icon: '🔒',
            title: 'Bank-Grade AWS Mumbai',
            desc: 'ISO 27001 certified cloud, TLS 1.3 encryption & automated real-time backups.',
            tag: '99.99% Uptime'
        },
    ];

    const clientLogos = [
        'Mahavir Textiles', 'Apex Surgicals', 'Kaveri Granites', 'Royal Orchid Spas',
        'Singhania Logistics', 'Vanguard Motors', 'Urban Fresh Mart', 'Himalayan Brews',
        'Shreeji Sweets', 'TechFlow Solutions', 'Sunil Electricals', 'BlueDart Agency',
        'Ambika Jewellers', 'Metro Hardware', 'Shanti Healthcare', 'Balaji Automotives'
    ];

    return (
        <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Ambient Radial Mesh Canvas */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[680px] pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-100px] left-1/4 w-[520px] h-[520px] bg-indigo-200/35 rounded-full blur-[140px]" />
                <div className="absolute top-[60px] right-1/4 w-[480px] h-[480px] bg-violet-200/30 rounded-full blur-[140px]" />
                <div className="absolute top-[220px] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-emerald-100/40 rounded-full blur-[160px]" />
                
                {/* Modern Precision Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                {/* S-01: HeroMain Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center pt-2">
                    
                    {/* Left Column: Editorial Value Proposition & CTA */}
                    <div className="lg:col-span-7 text-left">
                        {/* Innovation Pill Chip */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-indigo-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-indigo-600/5 hover:border-indigo-300 transition-colors">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                v2.4 Live
                            </span>
                            <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Official WhatsApp Cloud API &amp; 0.3s Barcode POS
                            </span>
                            <span className="text-indigo-600">&rarr;</span>
                        </div>

                        {/* High-Impact Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-black text-slate-900 tracking-[-0.035em] leading-[1.08] mb-6">
                            India's Smartest{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                                GST Billing
                            </span>
                            <br />
                            <span className="text-slate-900">
                                &amp; Business Ops Cloud
                            </span>
                        </h1>

                        {/* Refined Subtitle */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                            One unified cloud ERP engineered for speed. Issue 0.3s thermal receipts, direct NIC e-invoices, automated WhatsApp Khata reminders, and AI-verified field operations — with 100% real-time cloud sync.
                        </p>

                        {/* High-Conversion CTA Row */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                            <a
                                href="/demo"
                                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-black text-white text-base overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-indigo-500/20"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Free 14-Day Trial
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </a>

                            <button
                                type="button"
                                onClick={onWatchDemo || (() => window.location.href = '/demo')}
                                className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold text-slate-800 text-base bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all duration-200 group"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs transition-colors border border-indigo-200/60 shadow-2xs">
                                        ▶
                                    </span>
                                    <span>Watch 3-Min Demo</span>
                                </span>
                            </button>
                        </div>

                        {/* Verified Social Proof Strip */}
                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-1.5">
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">RK</span>
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">AP</span>
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">SG</span>
                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">VK</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                                        {'★'.repeat(5)}
                                        <span className="text-slate-800 font-bold ml-1">4.9/5</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">2,400+ Verified Reviews</p>
                                </div>
                            </div>

                            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>No Credit Card Required</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Setup in 2 Minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hyper-Realistic Cloud ERP App Window with 3D Layering */}
                    <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                        {/* Ambient Glow Aura */}
                        <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                        {/* Top Floating Glass Card: UPI Payment Received */}
                        <div className="absolute -top-5 -right-2 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 animate-float">
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-200/80 shadow-2xs">
                                💬
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[11px] font-black text-slate-900">WhatsApp Khata Payment</p>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                                <p className="text-[10px] text-slate-500">+₹42,500 via UPI (Auto-Reconciled)</p>
                            </div>
                        </div>

                        {/* Main Master App Shell */}
                        <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-indigo-950/30 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden">
                            {/* App Window Chrome */}
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 ml-2">
                                        <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>nexus-billing.in/live</span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10.5px] font-bold border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    100% Cloud Sync
                                </span>
                            </div>

                            {/* Interactive Module Tabs */}
                            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-4 overflow-x-auto no-scrollbar text-xs">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('live')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                                        activeTab === 'live' 
                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    ⚡ Live Feed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('einvoice')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                                        activeTab === 'einvoice' 
                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    🧾 E-Invoice
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('pos')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                                        activeTab === 'pos' 
                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    🛒 POS Till
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('fieldops')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                                        activeTab === 'fieldops' 
                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    📍 FieldOps
                                </button>
                            </div>

                            {/* Top KPI Metrics Row */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-semibold text-slate-400">Today's Revenue</p>
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                            ↑ 24.8%
                                        </span>
                                    </div>
                                    <p className="text-xl font-black text-white mt-1 tracking-tight">
                                        ₹{revenue.toLocaleString('en-IN')}
                                    </p>
                                    <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-3/4 rounded-full" />
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-semibold text-slate-400">Bills Generated</p>
                                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                            0.28s Avg
                                        </span>
                                    </div>
                                    <p className="text-xl font-black text-white mt-1 tracking-tight">
                                        {invoiceCount.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[10.5px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                                        <span>✓</span> 99.4% IRN Auto-Synced
                                    </p>
                                </div>
                            </div>

                            {/* Live Transaction Stream Section */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        {activeTab === 'live' && 'Real-Time Activity Stream'}
                                        {activeTab === 'einvoice' && 'Direct NIC Portal Stream'}
                                        {activeTab === 'pos' && 'Multi-Till Counter Checkouts'}
                                        {activeTab === 'fieldops' && 'GPS & AI Verification Stream'}
                                    </p>
                                    <span className="text-[10px] text-slate-500 font-mono">Live WebSocket</span>
                                </div>

                                {activeTab === 'live' && (
                                    <>
                                        {/* Activity 1: WhatsApp Invoicing */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/30">
                                                    💬
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-xs font-bold text-white">INV-2026-0894 • Rahul Traders</p>
                                                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                                                            NIC Direct
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">IRN: 94a1b... • WhatsApp PDF + UPI Link Sent</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-emerald-400">₹42,500</span>
                                                <p className="text-[9px] text-slate-400">Paid UPI</p>
                                            </div>
                                        </div>

                                        {/* Activity 2: POS Barcode Checkout */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm border border-amber-500/30">
                                                    ⚡
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Counter POS #02 • Supermarket Express</p>
                                                    <p className="text-[10px] text-slate-400">Barcode Scan • 6 Items • Thermal 3" Printed</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-slate-200">₹2,840</span>
                                                <p className="text-[9px] text-slate-400">Cash / Till</p>
                                            </div>
                                        </div>

                                        {/* Activity 3: FieldOps AI Punch-In */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center text-sm border border-violet-500/30">
                                                    🤖
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Vikram S. • Sector 62 Warehouse</p>
                                                    <p className="text-[10px] text-slate-400">Geofence GPS • Gemini AI Vision Score: 98.4%</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                                Verified
                                            </span>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'einvoice' && (
                                    <>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm">
                                                    🏛️
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">INV-2026-0902 • Sharma Steels Ltd</p>
                                                    <p className="text-[10px] text-slate-400">IRN: e7c29... • Signed QR Code Validated</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-emerald-400">₹1,84,500</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm">
                                                    🚛
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">E-Way Bill #28491024 Generated</p>
                                                    <p className="text-[10px] text-slate-400">Vehicle: MH-04-AB-1290 • Distance: 180 km</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">Part-B Synced</span>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'pos' && (
                                    <>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm">
                                                    🛒
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Counter #1 — Express Groceries</p>
                                                    <p className="text-[10px] text-slate-400">4 Items • 0.24s Scan • Cash Payment</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-slate-200">₹1,240</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm">
                                                    ⚖️
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Counter #3 — Weighing Scale Sync</p>
                                                    <p className="text-[10px] text-slate-400">2.450 kg Fresh Apples • RS-232 Port Sync</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-emerald-400">₹490</span>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'fieldops' && (
                                    <>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm">
                                                    📍
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Amit Kumar • Jaipur Distributor Route</p>
                                                    <p className="text-[10px] text-slate-400">Geofence Verified • 4 Client Visits Completed</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Active</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-sm">
                                                    📸
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Deepak Verma • Shelf Display Audit</p>
                                                    <p className="text-[10px] text-slate-400">Gemini Vision AI Verified • Fraud Check Passed</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">100% Match</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* App Window Status Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Direct NIC E-Invoice &amp; E-Way API</span>
                                </span>
                                <span className="text-indigo-400 font-semibold flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Auto-Sync On
                                </span>
                            </div>
                        </div>

                        {/* Bottom Floating Glass Card: E-Way Bill Active */}
                        <div className="absolute -bottom-5 -left-2 sm:-left-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 animate-float" style={{ animationDelay: '1.5s' }}>
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base border border-indigo-200/80 shadow-2xs">
                                🏛️
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[11px] font-black text-slate-900">NIC E-Invoice Validated</p>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded">0.4s</span>
                                </div>
                                <p className="text-[10px] text-slate-500">IRN &amp; Signed QR Code Ready</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* S-02: Trust Badges Strip (4 Feature Pillars) */}
                <div className="mt-20 pt-10 border-t border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {trustBadges.map((badge, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{badge.icon}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                        {badge.tag}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {badge.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {badge.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* S-03: Client Logo Marquee */}
                <div className="mt-14 overflow-hidden relative">
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
                        Powering over 10,000+ modern growing businesses across India
                    </p>
                    
                    {/* Continuous Auto-Scrolling Ticker */}
                    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
                        <div className="flex w-max gap-4 animate-marquee">
                            {clientLogos.concat(clientLogos).map((company, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 font-bold text-xs sm:text-sm whitespace-nowrap shadow-xs hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                >
                                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                                    <span>{company}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

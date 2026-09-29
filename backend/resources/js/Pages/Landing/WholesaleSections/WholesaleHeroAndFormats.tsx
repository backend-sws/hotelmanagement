import React from 'react';
import { Link } from '@inertiajs/react';

interface WholesaleHeroAndFormatsProps {
    selectedFormat: string;
    onSelectFormat: (format: string) => void;
}

export const WHOLESALE_FORMATS = [
    {
        id: 'fmcg',
        name: 'FMCG & Packaged Goods',
        icon: '🥫',
        tag: 'Case & Box Packs',
        headline: 'Manage 20,000+ SKUs with Slab Pricing & Turnover Discounts (TOD)',
        points: [
            'Master carton to inner box to pieces automatic secondary conversions',
            'Brand-wise margin tracking (HUL, ITC, Nestlé, Parle, Adani Wilmar)',
            'Turnover discount (TOD) & monthly volume rebate auto-calculation',
            'Direct WhatsApp digital catalog sharing with live available cases'
        ]
    },
    {
        id: 'textile',
        name: 'Textiles & Garment Traders',
        icon: '🧵',
        tag: 'Thaan & Meters',
        headline: 'Surat & Ahmedabad Style Thaan-Wise Billing with Broker Dalali Ledger',
        points: [
            'Thaan/Lump tracking with piece lengths, cut meters, and fabric weights',
            'Broker/Agent (Dalal) percentage commission auto-credited per invoice',
            'Bale packing slips with lorry receipt (LR) transport numbers',
            'Customer-specific credit terms (30/60/90 days) with interest calculation'
        ]
    },
    {
        id: 'pharma',
        name: 'Pharma & Surgical C&F',
        icon: '💊',
        tag: 'FEFO & Bonus Deals',
        headline: 'Strict Drug License Verification, Near-Expiry FEFO & 10+1 Bonus Schemes',
        points: [
            'Mandatory Drug License & GSTIN lock before booking sales orders',
            'Strict First-Expiry-First-Out (FEFO) auto-allocation on pick-lists',
            'Bonus quantity billing (e.g. 10 Strip + 1 Free or 100 + 12 Bonus)',
            'Automated supplier debit notes for expired & damaged return stock'
        ]
    },
    {
        id: 'hardware',
        name: 'Electrical & Hardware',
        icon: '🔩',
        tag: 'Bulk Weight & Length',
        headline: 'Multi-Tier Slab Pricing for Fasteners, Pipes, Wires & Tools',
        points: [
            'Dual unit billing: Kgs to Pieces & Meters to Coils with zero calculation error',
            'Tier 1 / Tier 2 / Tier 3 dealer price lists based on monthly order volumes',
            'Supplier warranty serial tracking & replacement inward challans',
            'Consolidated group khata for multi-outlet retail hardware dealers'
        ]
    },
    {
        id: 'agro',
        name: 'Agrochemicals & Seeds',
        icon: '🌾',
        tag: 'Batch Germination',
        headline: 'Seed Lot Germination Expiry, Pesticide Batching & Farmer Society Ledgers',
        points: [
            'Seed lot number, test date, and germination validity percentage tracking',
            'Insecticide license validation & hazardous substance storage compliance',
            'Kisan credit cycle settlement (Harvest-season post-dated cheques)',
            'Subsidy & DBT delivery challan documentation ready for audit'
        ]
    },
    {
        id: 'building',
        name: 'Tiles & Building Materials',
        icon: '🧱',
        tag: 'Sq.Ft to Box Units',
        headline: 'Heavy Consignment E-Way Bills, Breakage Allowance & Vehicle Dispatches',
        points: [
            'Sq.Feet to Box auto-converter with batch shade & caliber matching',
            'Direct distance-calculated NIC E-Way bill generation with vehicle updates',
            'Transporter To-Pay vs Paid freight register and driver phone logging',
            'Transit breakage allowance deduction during physical unloading inspection'
        ]
    }
];

export default function WholesaleHeroAndFormats({
    selectedFormat,
    onSelectFormat
}: WholesaleHeroAndFormatsProps) {
    const activeData = WHOLESALE_FORMATS.find(f => f.id === selectedFormat) || WHOLESALE_FORMATS[0];

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: Wholesale Hero Section                                              */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-indigo-200/30 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Value Copy */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-blue-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-blue-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    B2B Cloud ERP
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    100% Real-Time Cloud Sync • Direct NIC E-Way Bill Portal
                                </span>
                                <span className="text-blue-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] font-black text-slate-900 tracking-[-0.035em] leading-[1.08] mb-6">
                                India's Most Powerful{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent">
                                    B2B Wholesale
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    &amp; Distribution ERP
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Engineered for high-volume superstockists, traders, and multi-godown distributors. Automate tiered volume slab pricing, party credit khata aging, instant NIC E-Way bills, broker commissions, and 2-way Tally Prime export.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/demo"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white text-base overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-blue-500/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Free 14-Day Trial
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
                                        <span>Book B2B Live Demo</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Direct NIC Portal E-Way &amp; IRN
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    5,000+ Indian Distributors
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Live Wholesale Dispatch Terminal (Realistic Glass Mockup) */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-teal-500/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Card: E-Way Bill Active */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 animate-float">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base border border-blue-200/80 shadow-2xs">
                                    🚛
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">E-Way Bill #289104 Valid</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">MH-04-G-4819 • 185 Km Valid</p>
                                </div>
                            </div>

                            {/* Master Terminal Box */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-blue-950/30 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* Titlebar */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">nexus-erp.in/wholesale/dispatch</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10.5px] font-bold border border-blue-500/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Central Warehouse
                                    </span>
                                </div>

                                {/* Wholesale Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
                                        <p className="text-[10.5px] text-slate-400">Total B2B Billing Today</p>
                                        <p className="text-lg font-black text-white mt-0.5">₹38,42,900</p>
                                        <p className="text-[10px] text-emerald-400 mt-1">↑ +31.4% vs last Monday</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
                                        <p className="text-[10.5px] text-slate-400">Dispatch Queue</p>
                                        <p className="text-lg font-black text-white mt-0.5">142 Orders</p>
                                        <p className="text-[10px] text-blue-400 mt-1">100% E-Way Verified</p>
                                    </div>
                                </div>

                                {/* Live Wholesale Orders List */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Live Sales Order Stream</p>
                                    
                                    {/* Order 1: FMCG Wholesale */}
                                    <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                                📦
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs font-bold text-white truncate">Singhania Mega Mart</p>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded">Tier 3 Slab</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 truncate">120 Cartons Biscuits • E-Way Synced</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-emerald-400 shrink-0 ml-2">₹2,84,000</span>
                                    </div>

                                    {/* Order 2: Textile Trader */}
                                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                                                🧵
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs font-bold text-white truncate">Mahavir Rayon Silk</p>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded">Broker 1.5%</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 truncate">840 Meters Silk Thaan • Bale #42</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-slate-200 shrink-0 ml-2">₹1,95,600</span>
                                    </div>

                                    {/* Order 3: Pharma C&F */}
                                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                                                💊
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs font-bold text-white truncate">Apothecary Chemists</p>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">FEFO Batch</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 truncate">Bonus Scheme 10+1 Applied</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-slate-200 shrink-0 ml-2">₹78,400</span>
                                    </div>
                                </div>

                                {/* Bottom Live Bar */}
                                <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[10.5px] text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Godown Stock Auto-Reserved on SO Confirmation
                                    </span>
                                    <span className="text-blue-400 font-bold">NIC Part-A Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02: Wholesale Format Switcher (6 Dedicated B2B Verticals)               */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                            Custom Built for Your Trade
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Tailored for Every Major Indian Wholesale Vertical
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Select your wholesale trade to see how Nexus adapts secondary units, broker ledgers, and trade discount schemes.
                        </p>
                    </div>

                    {/* Format Tabs Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
                        {WHOLESALE_FORMATS.map((fmt) => {
                            const isSelected = selectedFormat === fmt.id;
                            return (
                                <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => onSelectFormat(fmt.id)}
                                    className={`p-3 rounded-2xl text-center transition-all border ${
                                        isSelected 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-[1.02]' 
                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{fmt.icon}</div>
                                    <p className="text-xs font-bold leading-tight">{fmt.name}</p>
                                    <span className={`text-[10px] inline-block mt-1 px-1.5 py-0.2 rounded font-medium ${
                                        isSelected ? 'bg-white/20 text-blue-100' : 'bg-slate-200/70 text-slate-600'
                                    }`}>
                                        {fmt.tag}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Vertical Showcase Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2">
                                    <span>{activeData.icon}</span>
                                    <span>{activeData.name} Architecture</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    {activeData.headline}
                                </h3>
                            </div>
                            <Link
                                href="/demo"
                                className="px-5 py-2.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs font-black shadow-md shadow-blue-500/30 transition-all shrink-0"
                            >
                                Schedule Custom Workflow Demo &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                            {activeData.points.map((pt, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                        ✓
                                    </span>
                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                                        {pt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-03: Live Wholesale Metrics Stream                                       */}
            {/* ========================================================================= */}
            <section className="py-8 bg-slate-950 text-white border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-3">
                            <p className="text-2xl sm:text-3xl font-black text-blue-400">₹14.8 Cr</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Monthly B2B Receivables Managed</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-emerald-400">0.4s</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">NIC E-Way Bill Auto-Generation</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-indigo-400">100%</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Multi-Godown Real-Time Sync</p>
                        </div>
                        <div className="p-3 border-l border-slate-800">
                            <p className="text-2xl sm:text-3xl font-black text-amber-400">-12 Days</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Average DSO Collection Cycle</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-04: Wholesale Quick Action Hub (Jump Links)                             */}
            {/* ========================================================================= */}
            <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 overflow-x-auto no-scrollbar gap-4">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] shrink-0">Wholesale Modules:</span>
                    <a href="#tier-pricing" className="hover:text-blue-600 transition-colors shrink-0">📊 Tier Slab Pricing</a>
                    <a href="#credit-khata" className="hover:text-blue-600 transition-colors shrink-0">📒 Party Credit Radar</a>
                    <a href="#eway-bills" className="hover:text-blue-600 transition-colors shrink-0">🚛 Automated E-Way Bills</a>
                    <a href="#godown-stn" className="hover:text-blue-600 transition-colors shrink-0">📦 Multi-Godown STN</a>
                    <a href="#broker-ledger" className="hover:text-blue-600 transition-colors shrink-0">🤝 Broker Commission</a>
                    <a href="#tally-sync" className="hover:text-blue-600 transition-colors shrink-0">🔄 Tally Prime Sync</a>
                    <a href="#roi-calculator" className="hover:text-blue-600 transition-colors shrink-0">💰 B2B ROI Calculator</a>
                </div>
            </div>
        </>
    );
}

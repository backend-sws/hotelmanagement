import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

interface ManufacturingHeroAndFormatsProps {
    selectedFormat: string;
    onSelectFormat: (format: string) => void;
}

export const MANUFACTURING_FORMATS = [
    {
        id: 'automotive',
        name: 'Automotive & CNC Machining',
        icon: '⚙️',
        tag: 'Heat Nos & Job Work',
        headline: 'Mill Test Traceability, CNC Cycle Times & GST Rule 55 Delivery Challans',
        points: [
            'End-to-end heat number tracking from steel billets to finished precision turned shafts',
            'Subcontractor job work outward tracking with 180-day GST Section 143 return alerts',
            'Operator piece-rate output logging and machine spindle hourly cost calculation',
            'Pre-Dispatch Inspection (PDI) reports with micron tolerance dimensional charts'
        ]
    },
    {
        id: 'textiles',
        name: 'Textiles & Garment Exports',
        icon: '🧵',
        tag: 'Shrinkage & Sizes',
        headline: 'Style-Color-Size Matrix, Fabric Roll Shrinkage & Job Work Dyeing/Washing',
        points: [
            'Multi-dimensional Style-Color-Size (SCS) variant matrix across 20+ cutting sizes',
            'Fabric roll inspection with 4-point defect grading and dynamic shrinkage allowance',
            'Embroidery, dyeing, and washing job work outward challans with weight-loss tracking',
            'Assembly line hourly piece-rate production tracker with bundle barcode tickets'
        ]
    },
    {
        id: 'chemicals',
        name: 'Chemicals & Pharmaceuticals',
        icon: '🧪',
        tag: 'Batch Yield & CGMP',
        headline: 'Master Formula BOM, Reaction Vessel Yield Loss & FSSAI / FDA Batch Records',
        points: [
            'Automated master formula scaling based on reactor vessel capacity and raw material assay',
            'Distillation and evaporation yield loss reconciliation with volatile solvent recovery',
            'BMR (Batch Manufacturing Record) digital sign-off with multi-user supervisory approval',
            'Quarantine vs approved warehouse bin segregation for active raw chemicals'
        ]
    },
    {
        id: 'plastics',
        name: 'Plastics & Injection Molding',
        icon: '📦',
        tag: 'Mold Cavity & Regrind',
        headline: 'Cavity Count Multipliers, Runner Scrap Regrind % & Tool Life Tracking',
        points: [
            'Shot weight calculation: cavity count x part weight + runner system weight',
            'Virgin polymer granules + regrind scrap mixing ratio management in production orders',
            'Mold maintenance counter tracking total clamp shots against preventive service limits',
            'Defect classification: short shot, flash, sink marks, and warpage rejection slips'
        ]
    },
    {
        id: 'electronics',
        name: 'Electronics & PCB Assembly',
        icon: '💡',
        tag: 'SMT Feeder & Serials',
        headline: 'Component Reel Barcodes, SMT Pick-and-Place Feeder Setup & Serial RMA',
        points: [
            'SMT reel barcode scanning prevents mounting wrong resistor/capacitor values on feeders',
            'Individual motherboard serial barcode tracking tied to micro-controller chip ID',
            'Automated solder paste stencil life and reflow oven temperature curve audit logs',
            'Component supplier RMA gateway for defective integrated circuits and capacitors'
        ]
    },
    {
        id: 'food',
        name: 'Food & Beverage Processing',
        icon: '🥫',
        tag: 'Expiry & FSSAI Lot',
        headline: 'Perishable Batch Expiry, Recipe Shrinkage & Backward Traceability',
        points: [
            'FEFO (First-Expired, First-Out) dispatch allocation prevents warehouse spoilage',
            'Cooking, baking, and moisture shrinkage loss automatically factored into landed recipe cost',
            'Full backward recall traceability: identify all retail packs created from contaminated milk/oil lot',
            'Daily laboratory quality checks: Brix level, pH balance, and moisture % parameters'
        ]
    }
];

export default function ManufacturingHeroAndFormats({
    selectedFormat,
    onSelectFormat
}: ManufacturingHeroAndFormatsProps) {
    // S-01 Hero State: Router Job Traveler vs Multi-Level BOM View
    const [heroTab, setHeroTab] = useState<'router' | 'bom'>('router');

    const activeSector = MANUFACTURING_FORMATS.find(f => f.id === selectedFormat) || MANUFACTURING_FORMATS[0];

    return (
        <>
            {/* ========================================================================= */}
            {/* S-01: Manufacturing Hero Section (Clean Light Aesthetics)                 */}
            {/* ========================================================================= */}
            <section className="relative pt-32 sm:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Ambient Radial Lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-80px] left-1/4 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[140px]" />
                    <div className="absolute top-[60px] right-1/4 w-[450px] h-[450px] bg-orange-200/25 rounded-full blur-[140px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                        
                        {/* Left Column: Copy & Value Proposition */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-200/90 text-xs font-bold text-slate-800 mb-6 shadow-xs shadow-amber-600/5">
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                                    Cloud ERP 2.4
                                </span>
                                <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    100% Real-Time Cloud Sync • Multi-Level BOM &amp; Shop Orders
                                </span>
                                <span className="text-amber-600">&rarr;</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black text-slate-900 tracking-[-0.035em] leading-[1.1] mb-6">
                                Master Multi-Level BOMs,{' '}
                                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 bg-clip-text text-transparent">
                                    Shop Floor Work Orders
                                </span>
                                <br />
                                <span className="text-slate-900">
                                    &amp; GST Section 143 Job Work
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
                                Built specifically for Indian MSME machine shops, fabricators, chemical batchers, and exporters. Real-time material reservation, machine OEE, subcontractor delivery challans under GST Rule 55, and automated landed costing.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <Link
                                    href="/register"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-slate-950 text-base overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-amber-400/40"
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
                                        <span className="w-7 h-7 rounded-full bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center text-xs transition-colors border border-amber-200/60 shadow-2xs">
                                            ▶
                                        </span>
                                        <span>Book Factory Floor Demo</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Trust Proof */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    100% Real-Time Cloud Sync
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Form GST ITC-04 Compliant
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Direct Tally Prime Bridge
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Interactive Live Shop Floor Terminal Mockup */}
                        <div className="lg:col-span-5 relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-indigo-500/15 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

                            {/* Floating Badge: Mill Heat Verified */}
                            <div className="absolute -top-5 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-base border border-amber-200/80 shadow-2xs">
                                    ⚙️
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[11px] font-black text-slate-900">Mill Heat Tested</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-500">EN-19 Alloy • Hardness: 240 BHN</p>
                                </div>
                            </div>

                            {/* Master Terminal Box */}
                            <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 shadow-2xl shadow-slate-950/20 p-5 sm:p-6 backdrop-blur-2xl overflow-hidden text-white">
                                {/* Titlebar */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                                        <span className="text-[11px] font-mono text-slate-400 ml-2">nexus-mfg.in/plant-pune</span>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setHeroTab('router')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                heroTab === 'router'
                                                    ? 'bg-amber-500 text-slate-950'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Router Card
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setHeroTab('bom')}
                                            className={`px-2.5 py-1 rounded-md transition ${
                                                heroTab === 'bom'
                                                    ? 'bg-amber-500 text-slate-950'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            BOM Tree
                                        </button>
                                    </div>
                                </div>

                                {heroTab === 'router' ? (
                                    /* Router Job Card View */
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                        Active Work Order
                                                    </span>
                                                    <span className="text-xs font-mono text-slate-400">WO #8942-AUTO</span>
                                                </div>
                                                <span className="text-xs font-black text-amber-400">76% Complete</span>
                                            </div>
                                            <p className="text-xs font-bold text-white mt-1">
                                                CNC Hardened Spline Shaft (EN-19)
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Target: <strong>500 Pcs</strong> • Client: <strong>Tata AutoComp</strong>
                                            </p>
                                        </div>

                                        {/* Routing Stages */}
                                        <div className="space-y-2">
                                            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                                                        ✓
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-white">1. Raw Slitting</span>
                                                        <span className="text-[10px] text-slate-400 block">Band Saw M/C #02</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-emerald-400 font-bold">500 Billets Done</span>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                                                        ▶
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-white">2. CNC Turning (Doosan #04)</span>
                                                        <span className="text-[10px] text-slate-400 block">Cycle: 14.8 min/pc</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-amber-300 font-bold">410 / 500 Pcs (82%)</span>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-blue-500/30 flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                                                        →
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-white">3. Job Work Nitriding</span>
                                                        <span className="text-[10px] text-slate-400 block">Apex Heat Treaters</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-blue-300 font-bold">Rule 55 Challan #412</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                                            <span>Machine Spindle OEE: <strong className="text-emerald-400">88.4%</strong></span>
                                            <span>Scrap Rate: <strong className="text-white">&lt;1.2%</strong></span>
                                        </div>
                                    </div>
                                ) : (
                                    /* Multi-Level BOM Tree View */
                                    <div className="space-y-2 font-mono text-[11px]">
                                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                                            <div className="font-bold text-amber-400 mb-1">
                                                📦 Submersible Pump 5HP (ASY-MTR-5HP)
                                            </div>
                                            <div className="text-[10px] text-slate-400">Total Landed Cost: ₹24,180.00</div>
                                        </div>

                                        <div className="pl-3 border-l-2 border-amber-500/60 space-y-1 text-slate-300">
                                            <div className="p-2 rounded-lg bg-slate-900/60 flex items-center justify-between">
                                                <span>├── ⚙️ Impeller Sub-Assembly (Qty: 6)</span>
                                                <span className="text-amber-300">₹6,840</span>
                                            </div>
                                            <div className="pl-4 text-slate-400 text-[10px]">
                                                └── SS-304 Stamping (+4% Swarf Scrap)
                                            </div>

                                            <div className="p-2 rounded-lg bg-slate-900/60 flex items-center justify-between">
                                                <span>├── ⚡ Rewindable Motor 5HP (Qty: 1)</span>
                                                <span className="text-blue-300">₹11,200</span>
                                            </div>
                                            <div className="pl-4 text-slate-400 text-[10px]">
                                                └── Enamelled Copper Wire (3.8 kg @ LME Rate)
                                            </div>

                                            <div className="p-2 rounded-lg bg-slate-900/60 flex items-center justify-between">
                                                <span>└── 🔧 Mechanical Seal Kit (Qty: 1)</span>
                                                <span className="text-slate-300">₹1,450</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                                            <span>Auto-Rollup Cost Engine</span>
                                            <span className="text-emerald-400 font-bold">100% Margin Protected</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-02: 6 Specialized Manufacturing Verticals Switcher (Clean Light)        */}
            {/* ========================================================================= */}
            <section id="verticals" className="py-16 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                            Specialized MSME Workflows
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                            Engineered for Your Specific Manufacturing Sector
                        </h2>
                        <p className="text-slate-600 text-sm mt-2">
                            From precision CNC machine shops to chemical batch reactors and garment cutting lines, Nexus adapts to your shop floor routing.
                        </p>
                    </div>

                    {/* Sector Selection Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                        {MANUFACTURING_FORMATS.map((format) => {
                            const isSelected = selectedFormat === format.id;
                            return (
                                <button
                                    key={format.id}
                                    type="button"
                                    onClick={() => onSelectFormat(format.id)}
                                    className={`p-3.5 rounded-2xl text-center transition border ${
                                        isSelected
                                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black scale-[1.02]'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="text-2xl mb-1">{format.icon}</div>
                                    <div className="text-xs font-bold leading-tight">{format.name}</div>
                                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>
                                        {format.tag}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Sector Feature Card */}
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                            <div className="max-w-2xl">
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                                    {activeSector.tag}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                                    {activeSector.headline}
                                </h3>
                            </div>
                            <Link
                                href="/register"
                                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition shadow-sm shrink-0"
                            >
                                Explore {activeSector.name} →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            {activeSector.points.map((pt, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-2.5">
                                        ✓
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        {pt}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-03: Live Production Metrics Stream Ticker                               */}
                    {/* ========================================================================= */}
                    <div className="mt-12 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-x-0 sm:divide-x divide-slate-100">
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">Volume Tracked</div>
                                <div className="text-xl font-black text-slate-900 mt-0.5">4.8M MT</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">Metal, Fabric &amp; Bulk</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">Traceability Rate</div>
                                <div className="text-xl font-black text-amber-600 mt-0.5">99.7%</div>
                                <div className="text-[10px] text-slate-500">Heat No to Serial</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">ITC-04 Tax Risk</div>
                                <div className="text-xl font-black text-emerald-600 mt-0.5">0.0%</div>
                                <div className="text-[10px] text-slate-500">180-Day Rule Enforced</div>
                            </div>
                            <div className="p-2">
                                <div className="text-xs text-slate-400 font-medium">Scrap Reduction</div>
                                <div className="text-xl font-black text-blue-600 mt-0.5">-14.2%</div>
                                <div className="text-[10px] text-slate-500">BOM Scrap Accounting</div>
                            </div>
                            <div className="p-2 col-span-2 sm:col-span-1">
                                <div className="text-xs text-slate-400 font-medium">Cloud Sync SLA</div>
                                <div className="text-xl font-black text-emerald-600 mt-0.5">100%</div>
                                <div className="text-[10px] text-slate-500">Real-Time Enterprise Cloud</div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* S-04: Manufacturing Quick Nav Hub                                         */}
                    {/* ========================================================================= */}
                    <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto py-2 text-xs font-semibold text-slate-600">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Jump to:</span>
                        <a href="#bom-work-orders" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            BOM &amp; Routing
                        </a>
                        <a href="#gst-job-work" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            GST Section 143 Job Work
                        </a>
                        <a href="#batch-oee" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            Heat Trace &amp; Machine OEE
                        </a>
                        <a href="#qc-costing" className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                            Landed Cost &amp; Tally Sync
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

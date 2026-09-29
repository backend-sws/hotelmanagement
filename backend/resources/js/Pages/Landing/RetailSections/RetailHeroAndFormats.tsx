import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface RetailHeroAndFormatsProps {
    selectedFormat: string;
    onSelectFormat: (formatId: string) => void;
}

const RETAIL_FORMATS = [
    {
        id: 'supermarket',
        name: 'Supermarkets & FMCG',
        icon: '🛒',
        tagline: 'High volume checkout, weighing scale sync & loose grain barcoding',
        stats: '0.3s Checkout per Item',
        keyFeatures: ['EAN-13 / GS1 barcode scan', 'Electronic scale RS-232 sync', 'Multi-counter cash drawers', 'Loose dry-fruit / grain printing'],
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
        id: 'apparel',
        name: 'Apparel & Footwear',
        icon: '👔',
        tagline: '2D Size & Color matrix, garment barcode tags & season sale BOGO',
        stats: '1 SKU = 24 Variants',
        keyFeatures: ['Size × Color variant grid', 'Barcode price tag printing', 'End-of-season BOGO promotions', 'Garment trial return tracking'],
        badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
        id: 'pharmacy',
        name: 'Pharmacy & Chemists',
        icon: '💊',
        tagline: 'FEFO batch rotation, 45-day expiry warning & doctor prescription log',
        stats: '100% Drug Compliance',
        keyFeatures: ['Batch & Expiry date lookup', 'Schedule H1 drug audit register', 'Substitute salt recommendations', 'Doctor referral commission'],
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
        id: 'electronics',
        name: 'Electronics & Mobile',
        icon: '📱',
        tagline: 'Dual IMEI & serial tracking, brand warranty cards & EMI financing',
        stats: 'IMEI Scan on Billing',
        keyFeatures: ['Dual IMEI 1 & 2 capture', 'Serial number warranty validation', 'Bajaj Finserv / HDFC EMI split', 'Technician repair job sheets'],
        badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
        id: 'hardware',
        name: 'Hardware & Electricals',
        icon: '🔧',
        tagline: 'Dual unit billing (Meters / Bundles), contractor ledger & quotation converter',
        stats: 'Multi-Unit Conversions',
        keyFeatures: ['Meters / Coils / Kgs units', 'Electrician khata credit balance', 'Quotation to invoice in 1 click', 'Plumbing fitting part finder'],
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
        id: 'kirana',
        name: 'Mom & Pop Kirana',
        icon: '🏪',
        tagline: 'Simple vernacular interface, customer udhar diary & WhatsApp bill link',
        stats: 'Zero Computer Training',
        keyFeatures: ['Hindi / Regional UI support', 'Digital customer udhar khata', 'WhatsApp payment reminder bot', 'Cloud tablet & mobile billing'],
        badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
];

export default function RetailHeroAndFormats({
    selectedFormat,
    onSelectFormat,
}: RetailHeroAndFormatsProps) {
    const activeFormat = RETAIL_FORMATS.find((f) => f.id === selectedFormat) || RETAIL_FORMATS[0];

    return (
        <>
            {/* ========================================================= */}
            {/* SECTION 1: RetailHero                                     */}
            {/* ========================================================= */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-white via-indigo-50/25 to-[#fafafa] border-b border-slate-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-200/40 via-indigo-200/30 to-blue-200/30 blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>High-Speed Retail Billing &amp; Inventory Suite</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto">
                        India's Fastest Barcode POS &amp;{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                            Supermarket Cloud ERP
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Say goodbye to checkout queues. Issue bills in 0.3 seconds with 100% keyboard shortcuts,
                        sync electronic weighing scales, track batch expiries, manage customer credit khata, and dispatch WhatsApp receipts.
                    </p>

                    {/* Quick Metric Pills */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> 0.3s Checkout Speed
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> 100% Real-Time Cloud Sync
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> Weighing Scale RS232 Sync
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <span className="text-emerald-600">✓</span> Paperless WhatsApp Bills
                        </div>
                    </div>

                    {/* Dual Action CTA */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/demo"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                        >
                            Start Retail Free Trial →
                        </Link>
                        <a
                            href="#retail-pos-features"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Explore POS Features ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 2: RetailSegmentSelector                          */}
            {/* ========================================================= */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
                        <span>TAILORED RETAIL WORKFLOWS</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Built For Every Retail Business Format
                    </h2>
                    <p className="mt-2 text-slate-600 text-sm">
                        Select your retail vertical below to preview customized checkout rules, item masters, and hardware settings.
                    </p>
                </div>

                {/* Segment Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {RETAIL_FORMATS.map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => onSelectFormat(f.id)}
                            className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                                selectedFormat === f.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-2xl mb-1">{f.icon}</span>
                            <span className="text-xs font-bold truncate max-w-full">{f.name}</span>
                        </button>
                    ))}
                </div>

                {/* Active Format Spotlight Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{activeFormat.icon}</span>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">{activeFormat.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{activeFormat.tagline}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {activeFormat.keyFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                PERFORMANCE BENCHMARK
                            </span>
                            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">
                                {activeFormat.stats}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Tested in 1,200+ Indian retail counters</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

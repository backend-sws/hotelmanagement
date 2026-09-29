import React, { useState } from 'react';

interface BlogHeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
}

export default function BlogHeroAndFeaturedPicks({
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory
}: BlogHeroProps) {
    const categories = [
        { id: 'all', label: 'All Articles' },
        { id: 'gst', label: 'GST & Statutory' },
        { id: 'retail', label: 'Retail & POS' },
        { id: 'wholesale', label: 'Wholesale & Supply Chain' },
        { id: 'whatsapp', label: 'WhatsApp Commerce' },
        { id: 'cfo', label: 'CFO & Business Growth' }
    ];

    const popularTags = [
        '#GSTR2BReconciliation',
        '#EInvoicingNIC',
        '#WhatsAppCommerce',
        '#FEFOBatchTracking',
        '#TallyPrimeSync'
    ];

    return (
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

            {/* ========================================================================= */}
            {/* S-01: Blog Hero Header & Audience Metrics                                 */}
            {/* ========================================================================= */}
            <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Nexus Insights &amp; Knowledge Hub
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                            Practical Guides, Statutory Tax Insights &amp;{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Cloud ERP Playbooks
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Written by distributed systems engineers, veteran Chartered Accountants, and retail trade leaders. Actionable blueprints to grow sales, eliminate GST penalties, and scale multi-branch operations.
                        </p>

                        {/* ========================================================================= */}
                        {/* S-02: Live Article Instant Search & Popular Query Chips                  */}
                        {/* ========================================================================= */}
                        <div className="max-w-2xl mx-auto pt-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-sm">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search 85+ articles on GSTR-2B, E-Invoicing, WhatsApp catalogs, Tally sync..."
                                    className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-slate-900"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 font-bold"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Popular Query Chips */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
                                <span className="font-semibold text-slate-700">Trending:</span>
                                {popularTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag.replace('#', ''))}
                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors font-medium border border-slate-200"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* S-01 Audience Metrics Strip */}
                    <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl font-black text-blue-600 font-mono">85+</div>
                            <div className="text-xs font-bold text-slate-700 mt-0.5">In-Depth Playbooks</div>
                            <p className="text-[10px] text-slate-400">Step-by-step guides</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl font-black text-emerald-600 font-mono">45,000+</div>
                            <div className="text-xs font-bold text-slate-700 mt-0.5">Monthly MSME Readers</div>
                            <p className="text-[10px] text-slate-400">Entrepreneurs &amp; CAs</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl font-black text-purple-600 font-mono">6 Domains</div>
                            <div className="text-xs font-bold text-slate-700 mt-0.5">Specialized Hubs</div>
                            <p className="text-[10px] text-slate-400">Retail, GST, Tech, Ops</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl font-black text-amber-600 font-mono">100%</div>
                            <div className="text-xs font-bold text-slate-700 mt-0.5">Real-Time Cloud Sync</div>
                            <p className="text-[10px] text-slate-400">Zero clunky desktop lock-in</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-03: Sticky Category Pill Navigation Filter                              */}
            {/* ========================================================================= */}
            <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/80 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* S-04: Featured Editorial Headline Card                                    */}
            {/* ========================================================================= */}
            <section className="py-16 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600/40">
                                        ⭐ Flagship Editorial
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">12 min read • Updated September 2026</span>
                                </div>

                                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                                    The Ultimate Guide to GSTR-2B Automated Reconciliation &amp; Section 16(2)(aa) Defense in 2026
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                                    How Indian wholesalers and distributors are recovering up to ₹14.8 Lakhs in unclaimed Input Tax Credit, preventing ASMT-10 scrutiny demand notices, and automating defaulter supplier follow-ups via WhatsApp.
                                </p>

                                <div className="pt-2 flex items-center gap-3 text-xs">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">
                                        AD
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Ananya Deshmukh, FCA</div>
                                        <div className="text-slate-400 text-[11px]">Head of Statutory Policy &amp; Former Big-4 Partner</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-4">
                                <a
                                    href="/blog/gstr-2b-reconciliation-guide"
                                    className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 text-center"
                                >
                                    Read Complete Guide →
                                </a>
                                <span className="text-[11px] text-slate-400">Included: Ready-to-use ASMT-11 Reply Annexure Templates</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-05: Trending Articles Carousel / Row                                     */}
            {/* ========================================================================= */}
            <section className="py-12 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔥</span>
                            <h3 className="font-black text-slate-900 text-lg">Trending Across Indian Businesses</h3>
                        </div>
                        <span className="text-xs text-slate-500">Ranked by weekly read volume</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                                    WhatsApp Commerce
                                </span>
                                <h4 className="font-black text-slate-900 text-sm mt-2.5 leading-snug">
                                    How to Get the Official WhatsApp Green Tick (OBA) in 2026: 4-Step Checklist
                                </h4>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    The exact documentation, Meta Business Manager verifications, and PR criteria required for Indian MSMEs.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>8 min read</span>
                                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Read Playbook →</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    FMCG &amp; Retail
                                </span>
                                <h4 className="font-black text-slate-900 text-sm mt-2.5 leading-snug">
                                    FEFO vs FIFO: How Batch Expiry Tracking Stops ₹3.2L in Monthly FMCG Waste
                                </h4>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    Practical inventory workflow eliminating expired milk, biscuits, and pharmaceuticals from supermarket shelves.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>6 min read</span>
                                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Read Playbook →</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                    E-Invoicing Highway
                                </span>
                                <h4 className="font-black text-slate-900 text-sm mt-2.5 leading-snug">
                                    Direct NIC IRP E-Invoicing: Eliminating Highway Transit Checkpoint Delays
                                </h4>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                    How automated simultaneous IRN and E-Way Bill generation protects transport consignments from Section 129 penalties.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>7 min read</span>
                                <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Read Playbook →</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

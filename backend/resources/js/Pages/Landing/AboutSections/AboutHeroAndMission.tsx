import React, { useState } from 'react';

export default function AboutHeroAndMission() {
    // S-02 Interactive comparison state
    const [storyView, setStoryView] = useState<'traditional' | 'nexus'>('nexus');

    return (
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-purple-100/40 blur-3xl pointer-events-none -z-10" />

            {/* ========================================================================= */}
            {/* S-01: About Hero with Live Metric Counters                                */}
            {/* ========================================================================= */}
            <section className="pt-24 pb-16 sm:pt-32 sm:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-6">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Our Journey &amp; Mission
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            Empowering 63 Million Indian MSMEs with{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Real-Time Cloud Intelligence
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            We are replacing 20-year-old clunky desktop software with lightning-fast, collaborative cloud ERP designed specifically for the unique speed, scale, and compliance requirements of Indian trade.
                        </p>

                        {/* CTA Cluster */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 hover:scale-105"
                            >
                                Experience Nexus Live
                            </a>
                            <a
                                href="#genesis-story"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 shadow-sm"
                            >
                                Read Our Story ↓
                            </a>
                        </div>
                    </div>

                    {/* S-01 Live Metrics Counter Strip */}
                    <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">12,000+</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">Active Businesses</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Retail, FMCG, Manufacturing</p>
                        </div>

                        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">₹8,400+ Cr</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">Annual GMV Processed</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Verified Indian Commerce</p>
                        </div>

                        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">28 States</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">&amp; 8 Union Territories</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Pan-India Footprint</p>
                        </div>

                        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">100%</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">Real-Time Cloud Sync</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Sub-50ms Central Cluster</p>
                        </div>

                        <div className="col-span-2 lg:col-span-1 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center">
                            <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">99.99%</div>
                            <div className="text-xs font-bold text-slate-700 mt-1">Statutory Uptime SLA</div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Direct NIC IRP Connected</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-05: About Quick Nav Hub (Light Sticky Navigation Bar)                   */}
            {/* ========================================================================= */}
            <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-y border-slate-200/80 py-2.5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
                    <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max text-xs font-bold text-slate-600">
                        <a href="#genesis-story" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            The Genesis
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#mission-values" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Mission &amp; Values
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#founders-leadership" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Founders &amp; Leadership
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#engineering-stack" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Engineering Architecture
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#nationwide-offices" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Nationwide Offices
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#workplace-culture" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Life at Nexus
                        </a>
                        <span className="text-slate-300">•</span>
                        <a href="#social-impact" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            Green Impact &amp; FAQs
                        </a>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* S-02: Company Genesis & The Problem We Solved                             */}
            {/* ========================================================================= */}
            <section id="genesis-story" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                How It All Began
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                Built in 2021 to Fix India’s Broken Desktop Accounting Reality
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                Five years ago, our founders watched a wholesale distributor in Crawford Market, Mumbai lose three years of customer khata ledger records when a single office desktop computer suffered a hard drive crash.
                            </p>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                Despite India having the world&apos;s most advanced digital payment rail (UPI) and automated statutory network (GST &amp; E-Invoicing), 90% of business owners were still handcuffed to slow, single-machine desktop software developed in the late 1990s.
                            </p>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                                Nexus Billing was engineered from scratch on modern cloud microservices with sub-second synchronization, ensuring that no business ever loses data, no billing counter ever halts, and every invoice is instantly verified against statutory portals.
                            </p>
                        </div>

                        {/* Interactive Comparison Card */}
                        <div className="lg:col-span-6">
                            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                                    <h3 className="font-black text-slate-900 text-base">The Generational Shift in Indian ERP</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setStoryView('traditional')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                storyView === 'traditional'
                                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                    : 'bg-white text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            Legacy Desktop Era
                                        </button>
                                        <button
                                            onClick={() => setStoryView('nexus')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                storyView === 'nexus'
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'bg-white text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            Nexus Cloud Engine
                                        </button>
                                    </div>
                                </div>

                                {storyView === 'traditional' ? (
                                    <div className="space-y-4 text-xs text-slate-600">
                                        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100">
                                            <div className="font-bold text-rose-900 mb-1">❌ Local Hard Drive Vulnerability</div>
                                            Data sits on one PC in the shop. A power surge, ransomware, or hard drive failure wipes out years of accounts.
                                        </div>
                                        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100">
                                            <div className="font-bold text-rose-900 mb-1">❌ Pen-Drive CA Data Sharing</div>
                                            Every month-end, owners export files onto USB drives to deliver to Chartered Accountants, causing version collisions.
                                        </div>
                                        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100">
                                            <div className="font-bold text-rose-900 mb-1">❌ Disconnected E-Invoicing Portals</div>
                                            Staff must manually copy invoice data into the NIC portal or E-Way Bill website, causing typos and transit delays.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 text-xs text-slate-600">
                                        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-emerald-900 mb-1">✓ 100% Real-Time Cloud Sync &amp; Automatic Backup</div>
                                            Every line item and voucher is securely mirrored to AWS Mumbai &amp; Hyderabad data centers with zero data loss.
                                        </div>
                                        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-emerald-900 mb-1">✓ Simultaneous Multi-Counter &amp; Multi-Branch Access</div>
                                            Run 20 counters in 5 different cities simultaneously. Owners monitor sales, cash flow, and stock from their phones.
                                        </div>
                                        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-emerald-900 mb-1">✓ Direct NIC IRP API Connection (&lt;200ms)</div>
                                            Official B2B IRN numbers and signed QR codes generate automatically upon clicking &quot;Save &amp; Print&quot;.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-03 & S-04: Core Mission, Vision & Guiding Values Matrix                  */}
            {/* ========================================================================= */}
            <section id="mission-values" className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mission & Vision Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl mb-6">
                                🎯
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Mission</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-2 mb-4">
                                Democratize Enterprise Cloud ERP for Every Indian Business Owner
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                To eliminate the technological divide between giant retail corporations and neighborhood Indian MSMEs by providing high-throughput, enterprise-grade cloud ERP tools at an accessible, transparent subscription.
                            </p>
                        </div>

                        <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl mb-6">
                                🚀
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Our Vision</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-2 mb-4">
                                The Operating System Powering India’s $5 Trillion Economy
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                To become the default digital backbone for Indian commerce—where every retail receipt, factory batch, wholesale consignment, and GST return is authenticated, synchronized, and reconciled automatically.
                            </p>
                        </div>
                    </div>

                    {/* S-04: Guiding Values Matrix */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">How We Build</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            The Four Principles Guiding Every Decision
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-2xl mb-3">⚡</div>
                            <h4 className="font-bold text-slate-900 text-sm">Zero Downtime Reliability</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                When a billing counter halts, a store loses customers. We engineer our cloud clusters with multi-AZ failover for uninterrupted operation.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-2xl mb-3">💎</div>
                            <h4 className="font-bold text-slate-900 text-sm">Radically Honest Pricing</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                Zero hidden annual maintenance contracts (AMC), zero surprise update charges, and no per-invoice micro-fees. What you see is what you pay.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-2xl mb-3">🧠</div>
                            <h4 className="font-bold text-slate-900 text-sm">Continuous Modern Innovation</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                We were first to bring official Meta WhatsApp Cloud API catalogs, Gemini Vision AI invoice OCR, and instant 2-way GSTR-2B matching to Indian MSMEs.
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <div className="text-2xl mb-3">🤝</div>
                            <h4 className="font-bold text-slate-900 text-sm">Customer Obsession</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                Real human support engineers reachable on phone and WhatsApp in under 3 minutes, speaking Hindi, English, Gujarati, Marathi, Tamil, and Telugu.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

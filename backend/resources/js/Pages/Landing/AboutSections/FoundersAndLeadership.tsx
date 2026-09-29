import React, { useState } from 'react';

export default function FoundersAndLeadership() {
    // S-09 State: Leadership Philosophy Tabs
    const [philosophyTab, setPhilosophyTab] = useState<'cloud_vs_desktop' | 'data_integrity' | 'vernacular'>('cloud_vs_desktop');

    const leadership = [
        {
            name: "Arjun Mehta",
            role: "Co-Founder & Chief Executive Officer",
            experience: "ex-Flipkart Supply Chain Director",
            bio: "14+ years building massive Indian scale inventory distribution and e-commerce networks handling over 2M packages daily.",
            avatar: "👨‍💼",
            linkedin: "#"
        },
        {
            name: "Rohit Verma",
            role: "Co-Founder & Chief Technology Officer",
            experience: "ex-SAP Enterprise Cloud Architect",
            bio: "Distributed systems specialist with deep expertise in multi-region relational database clusters and real-time ledger replication.",
            avatar: "👨‍💻",
            linkedin: "#"
        },
        {
            name: "Pooja Iyer",
            role: "Chief Product Officer",
            experience: "ex-Intuit & Fintech Product Lead",
            bio: "Pioneered frictionless vernacular merchant interfaces, enabling non-technical shop owners to master POS billing in under 15 minutes.",
            avatar: "👩‍💼",
            linkedin: "#"
        }
    ];

    const executiveTeam = [
        { name: "Vikram Sengupta", role: "VP of Engineering", background: "12 yrs in Distributed Caching & High-Throughput APIs" },
        { name: "Ananya Deshmukh, FCA", role: "Head of Statutory & GST Policy", background: "Former Big-4 Partner guiding Indian GST & E-Invoicing mandates" },
        { name: "Suresh Pillai", role: "VP of Customer Success", background: "Manages 24/7 multilingual support operations across 180+ cities" },
        { name: "Deepak Sharma", role: "VP of Merchant Growth", background: "Built national retail franchise distribution networks across Tier 2/3 India" }
    ];

    return (
        <section id="founders-leadership" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Leadership &amp; Vision
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Built by Engineers &amp; Operators Who Understand Indian Scale
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Our leadership combines enterprise ERP architectural discipline from global tech leaders with deep empathy for the everyday realities of Indian storefronts and factories.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-06: Founders Profile Showcase                                           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {leadership.map((founder, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-3xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
                            <div>
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl mb-5 shadow-sm">
                                    {founder.avatar}
                                </div>
                                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                                    {founder.experience}
                                </span>
                                <h3 className="text-xl font-black text-slate-900 mt-2">{founder.name}</h3>
                                <p className="text-xs font-bold text-slate-600 mb-3">{founder.role}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{founder.bio}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">Bangalore Hub</span>
                                <span className="text-purple-600 font-bold hover:underline cursor-pointer">Verified Profile →</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================================================= */}
                {/* S-07 & S-08: Executive Leadership & Advisory Board Grid                   */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                        <div>
                            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Functional Leadership</span>
                            <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                Executive Team &amp; Statutory Advisors
                            </h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                            120+ Engineers, Product Specialists &amp; Support Advisors
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {executiveTeam.map((exec, idx) => (
                            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200">
                                <h4 className="font-black text-slate-900 text-sm">{exec.name}</h4>
                                <div className="text-xs font-bold text-purple-700 mt-0.5">{exec.role}</div>
                                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{exec.background}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-09: Interactive Leadership Philosophy Tabs                              */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Engineering Dogma</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                                The Principles Behind Every Architectural Choice
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setPhilosophyTab('cloud_vs_desktop')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    philosophyTab === 'cloud_vs_desktop'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Why Cloud Sync Wins
                            </button>
                            <button
                                onClick={() => setPhilosophyTab('data_integrity')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    philosophyTab === 'data_integrity'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Zero Data Loss Invariants
                            </button>
                            <button
                                onClick={() => setPhilosophyTab('vernacular')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    philosophyTab === 'vernacular'
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Vernacular First Design
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        {philosophyTab === 'cloud_vs_desktop' && (
                            <div className="space-y-3">
                                <h4 className="font-black text-slate-900 text-base">The Desktop Illusion is Over</h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    Traditional software companies told Indian merchants to buy expensive local desktop servers, configure local area networks, and manually back up data to USB drives daily. In reality, 70% of business owners forgot backups, and when hard drives failed, businesses were crippled for weeks.
                                </p>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    By running a 100% Real-Time Cloud Sync engine, Nexus delivers continuous data durability across AWS Mumbai &amp; Hyderabad data centers. If a cashier spills tea on a billing laptop, you can boot any new browser and resume billing in 10 seconds with zero lost invoices.
                                </p>
                            </div>
                        )}

                        {philosophyTab === 'data_integrity' && (
                            <div className="space-y-3">
                                <h4 className="font-black text-slate-900 text-base">Double-Entry Relational Rigor</h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    We reject &quot;eventual consistency&quot; for money and inventory. Every single financial debit and credit in Nexus is wrapped in strict ACID relational transactions. An invoice cannot exist without corresponding stock reduction and GST liability postings.
                                </p>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    This means your Chartered Accountant will never find &quot;ghost entries&quot;, unbalanced trial balances, or negative inventory values during year-end statutory audits.
                                </p>
                            </div>
                        )}

                        {philosophyTab === 'vernacular' && (
                            <div className="space-y-3">
                                <h4 className="font-black text-slate-900 text-base">Software that Speaks the Language of Indian Bazaars</h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    Enterprise ERPs from Europe and the US were built for desktop keyboards and corporate English. Nexus is designed for billing staff in Surat, Ludhiana, Coimbatore, and Patna.
                                </p>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    With high-contrast shortcut keys (F1-F12), barcode scanner instant-focus, and localized WhatsApp notifications in Hindi, Gujarati, Marathi, Tamil, and Telugu, any staff member can bill customers accurately on day one.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-10: Founders' Open Letter to Indian MSMEs                                */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-800">
                            Our Solemn Promise
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            An Open Letter to Every Indian Business Owner
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            &quot;We believe your business data is sacrosanct. Unlike legacy platforms that lock your records behind proprietary file formats or ad networks that monetize customer contact books, Nexus maintains a strict zero-monetization data ethics policy.&quot;
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            &quot;Your customer phone numbers, your supplier purchase prices, and your turnover figures will never be sold, mined for advertising, or shared with third parties. You can export your entire database in open formats (CSV, Excel, JSON) at any time with a single click. We succeed only when your business operates with speed, pride, and total statutory peace of mind.&quot;
                        </p>
                        <div className="pt-4 flex items-center gap-4 text-xs">
                            <div>
                                <div className="font-bold text-white">Arjun Mehta &amp; Rohit Verma</div>
                                <div className="text-slate-400">Co-Founders, Nexus Billing Technologies Pvt Ltd</div>
                            </div>
                            <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60 font-mono text-[11px]">
                                Immutable Founder Commitment
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

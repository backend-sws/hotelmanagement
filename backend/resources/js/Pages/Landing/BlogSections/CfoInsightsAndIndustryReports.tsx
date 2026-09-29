import React, { useState } from 'react';

interface Props {
    searchQuery: string;
    activeCategory: string;
}

export default function CfoInsightsAndIndustryReports({ searchQuery, activeCategory }: Props) {
    const [downloadEmail, setDownloadEmail] = useState('');
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    if (activeCategory !== 'all' && activeCategory !== 'cfo') {
        return null;
    }

    const articles = [
        {
            title: "Indian MSME Working Capital Index 2026: Unlocking ₹18 Lakhs Trapped in Blocked ITC",
            slug: "indian-msme-working-capital-index-2026",
            readTime: "12 min read",
            author: "Ananya Deshmukh, FCA",
            category: "Research Report",
            summary: "Comprehensive survey of 1,200 Indian distributors revealing how non-compliant vendor filings trap over ₹18 Lakhs in working capital per enterprise.",
            tag: "#WorkingCapital"
        },
        {
            title: "The Hidden Cost of Desktop Accounting: Hardware Crashes, AMC Fees, and Lost Counter Sales",
            slug: "hidden-cost-of-desktop-accounting-software",
            readTime: "8 min read",
            author: "Arjun Mehta, CEO",
            category: "Financial ROI",
            summary: "Why traditional desktop software costs 3x more than SaaS once you factor in server upgrades, annual maintenance contracts (AMC), and lost revenue from local crashes.",
            tag: "#CloudVsDesktop"
        }
    ];

    const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = (e: React.FormEvent) => {
        e.preventDefault();
        if (downloadEmail.includes('@')) {
            setDownloadSuccess(true);
        }
    };

    return (
        <section id="cfo-insights" className="py-16 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-21: Cluster Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-10">
                    <div>
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Executive Strategy &amp; Capital Efficiency</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            CFO Insights, Working Capital &amp; Industry Reports
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">
                            Data-driven research and financial frameworks to protect operating margins and maximize business valuation.
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        Strategic Playbooks
                    </span>
                </div>

                {/* S-22 & S-23: Article Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {filtered.map((article, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all group"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                                        {article.category}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400">{article.readTime}</span>
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                                    {article.summary}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">By {article.author}</span>
                                <a
                                    href={`/blog/${article.slug}`}
                                    className="font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                                >
                                    Read Report <span>→</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================================================= */}
                {/* S-24: Downloadable Master GST Audit Readiness Checklist                   */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-3">
                            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                                📑 Free 16-Page CA Reference Guide
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                2026-27 Master GST Audit Readiness Checklist
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Includes step-by-step verification protocols for Form GSTR-9 Table 8, E-Invoicing 24-hour void rules, Reverse Charge Mechanism Section 9(3) GTA ledgers, and sample ASMT-11 reply annexures.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">✓</span> 100% Free PDF</span>
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">✓</span> CA Practice Approved</span>
                                <span className="flex items-center gap-1.5"><span className="text-emerald-400 font-bold">✓</span> Instant Download Link</span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
                            {downloadSuccess ? (
                                <div className="text-center py-4 space-y-2">
                                    <div className="text-3xl">🎉</div>
                                    <h4 className="font-black text-white text-base">Checklist Sent!</h4>
                                    <p className="text-xs text-slate-300">
                                        We have delivered your free PDF checklist to <span className="text-amber-400 font-mono">{downloadEmail}</span>.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleDownload} className="space-y-3">
                                    <div className="text-xs font-bold text-white mb-1">Enter your work email for instant access:</div>
                                    <input
                                        type="email"
                                        required
                                        value={downloadEmail}
                                        onChange={(e) => setDownloadEmail(e.target.value)}
                                        placeholder="ca.name@firm.com or director@company.in"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                                    >
                                        Download Free PDF Checklist ↓
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center">Zero spam. Unsubscribe anytime with 1 click.</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

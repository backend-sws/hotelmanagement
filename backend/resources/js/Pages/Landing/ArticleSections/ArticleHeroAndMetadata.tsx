import React, { useState } from 'react';

interface Props {
    title: string;
    category: string;
    readTime: string;
    fontSize: 'sm' | 'base' | 'lg';
    setFontSize: (size: 'sm' | 'base' | 'lg') => void;
}

export default function ArticleHeroAndMetadata({
    title,
    category,
    readTime,
    fontSize,
    setFontSize
}: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 pt-24 pb-12 sm:pt-32 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-01: Breadcrumb Navigation & Category Pill Badge                         */}
                {/* ========================================================================= */}
                <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                    <span>/</span>
                    <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
                    <span>/</span>
                    <span className="text-slate-900 font-semibold">{category}</span>
                </nav>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        {category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        Updated September 2026 • {readTime}
                    </span>
                </div>

                {/* ========================================================================= */}
                {/* S-02: Main Article Headline & Editorial Deck                              */}
                {/* ========================================================================= */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                    {title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                    A comprehensive legal and technical playbook on automating purchase register reconciliation, protecting against Section 16(2)(aa) disallowance, and drafting legally sound ASMT-11 replies.
                </p>

                {/* ========================================================================= */}
                {/* S-03: Author Credentials Card & Verification Badge                        */}
                {/* ========================================================================= */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm mb-8">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-600/20">
                            AD
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 text-sm">Ananya Deshmukh, FCA</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                    ✓ Verified CA Review
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">
                                Head of Statutory Policy • Former Big-4 Indirect Tax Director
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                        Peer Reviewed by Arjun Mehta (CEO)
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-04: Sticky Reading Tools & Social Share Bar                             */}
                {/* ========================================================================= */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 mb-10">
                    {/* Share Buttons */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Share:</span>
                        <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 font-semibold text-slate-700 transition-colors"
                        >
                            {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
                        </button>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-colors"
                        >
                            💬 WhatsApp
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold transition-colors"
                        >
                            💼 LinkedIn
                        </a>
                    </div>

                    {/* Font Size Adjuster */}
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700 mr-1">Text Size:</span>
                        <button
                            onClick={() => setFontSize('sm')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                fontSize === 'sm' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                        >
                            A-
                        </button>
                        <button
                            onClick={() => setFontSize('base')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                fontSize === 'base' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('lg')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                fontSize === 'lg' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                        >
                            A+
                        </button>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-05: Key Takeaways Callout (Executive Summary in 60 Seconds)             */}
                {/* ========================================================================= */}
                <div className="bg-blue-50/80 rounded-3xl p-6 sm:p-7 border border-blue-200/90 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">💡</span>
                        <h2 className="text-base font-black text-blue-950 uppercase tracking-wide">
                            Executive Summary in 60 Seconds
                        </h2>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                        <li className="flex items-start gap-2.5">
                            <span className="text-blue-700 font-black">1.</span>
                            <span><strong>GSTR-2B is Mandatory, 2A is Defunct:</strong> Finance Act amendments to CGST Section 16(2)(aa) mandate that no ITC can be availed unless the invoice is reflected in Form GSTR-2B.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="text-blue-700 font-black">2.</span>
                            <span><strong>Rule 36(4) Strict Cap:</strong> Availing excess ITC beyond auto-populated eligible 2B leads to automatic ASMT-10 notice generation with 18% p.a. interest liability under Section 50.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <span className="text-blue-700 font-black">3.</span>
                            <span><strong>30th November Annual Cut-off:</strong> Missed vendor invoices from FY 2025-26 cannot be claimed after November 30th of the subsequent financial year—costing distributors lakhs in lost margins.</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

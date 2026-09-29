import React, { useState } from 'react';

export default function InteractiveAudienceEngagement() {
    // S-15 State: Poll voting
    const [selectedPoll, setSelectedPoll] = useState<number | null>(null);

    // S-16 State: Download state
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    // S-17 State: Helpfulness rating
    const [rated, setRated] = useState<'yes' | 'no' | null>(null);

    const pollOptions = [
        { label: "Manual Excel VLOOKUP spreadsheets", pct: 38 },
        { label: "Traditional desktop accounting software", pct: 32 },
        { label: "Our CA manages it manually at month-end", pct: 21 },
        { label: "Automated real-time cloud ERP", pct: 9 }
    ];

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => {
            setDownloading(false);
            setDownloaded(true);
        }, 1200);
    };

    return (
        <section className="py-16 bg-white border-b border-slate-200/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* ========================================================================= */}
                {/* S-15: Interactive Article Reader Poll                                     */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <h3 className="text-lg font-black text-slate-900">
                            Reader Pulse: How Does Your Business Currently Reconcile GSTR-2B?
                        </h3>
                    </div>

                    <div className="space-y-2.5">
                        {pollOptions.map((option, idx) => (
                            <div key={idx} className="relative">
                                {selectedPoll === null ? (
                                    <button
                                        onClick={() => setSelectedPoll(idx)}
                                        className="w-full text-left p-3.5 bg-white hover:bg-blue-50/60 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center justify-between"
                                    >
                                        <span>{option.label}</span>
                                        <span className="text-slate-400 font-normal">Vote →</span>
                                    </button>
                                ) : (
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 relative overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 bottom-0 bg-blue-100/70 -z-0 transition-all duration-700"
                                            style={{ width: `${option.pct}%` }}
                                        />
                                        <div className="relative z-10 flex justify-between items-center text-xs font-semibold text-slate-900">
                                            <span>
                                                {option.label} {selectedPoll === idx && <span className="text-blue-600 font-bold">(Your Vote)</span>}
                                            </span>
                                            <span className="font-mono text-blue-700">{option.pct}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {selectedPoll !== null && (
                        <p className="text-[11px] text-slate-400 text-right">Based on 1,420+ votes from Indian business owners</p>
                    )}
                </div>

                {/* ========================================================================= */}
                {/* S-16: Downloadable Excel Spreadsheet Asset                                */}
                {/* ========================================================================= */}
                <div className="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Free Download
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                            GSTR-2B vs Purchase Register 3-Way Matcher (XLSX)
                        </h3>
                        <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                            Macro-free Excel spreadsheet pre-loaded with fuzzy matching formulas, invoice slash normalizers, and automated mismatch variance flagging.
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        {downloaded ? (
                            <div className="px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm">
                                <span>✓</span> Download Complete!
                            </div>
                        ) : (
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
                            >
                                {downloading ? 'Preparing File...' : 'Download XLSX (Free)'}
                            </button>
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-17 & S-18: Helpfulness Rating & Expert Consultation Callout             */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Helpfulness */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Was This Playbook Helpful?</h4>
                        {rated === null ? (
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setRated('yes')}
                                    className="px-4 py-2 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                                >
                                    👍 Yes, very clear
                                </button>
                                <button
                                    onClick={() => setRated('no')}
                                    className="px-4 py-2 bg-white hover:bg-rose-50 hover:border-rose-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all"
                                >
                                    👎 Needs more details
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-emerald-700 font-bold">
                                Thank you for helping us maintain high editorial standards!
                            </p>
                        )}
                    </div>

                    {/* Expert Consultation Callout */}
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                        <div className="text-xs font-bold text-blue-900 uppercase">Received an ASMT-10 Notice?</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Our statutory advisory desk offers free 20-minute notice evaluations for registered Indian MSMEs.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block text-xs font-bold text-blue-700 hover:underline pt-1"
                        >
                            Schedule Free CA Assessment →
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}

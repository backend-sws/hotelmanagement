import React from 'react';

export default function WhatYouWillLearnCurriculum() {
    const modules = [
        {
            num: "01",
            title: "100% Real-Time Multi-Branch Cloud Sync",
            duration: "5 Minutes",
            color: "blue",
            bullets: [
                "How 10+ billing counters operate simultaneously with zero stock collisions.",
                "Live mobile manager app: monitor cashier drawers and gross margins from anywhere in the world.",
                "Sub-50ms central cloud replication across AWS Mumbai & Hyderabad data centers."
            ]
        },
        {
            num: "02",
            title: "Direct NIC E-Invoicing & GSTR-2B Matching",
            duration: "8 Minutes",
            color: "emerald",
            bullets: [
                "Generating 64-character IRN and signed QR codes in <200ms without visiting government websites.",
                "Automated GSTR-2B two-way matching: discovering missed vendor credits and capping Rule 36(4) claims.",
                "Automated WhatsApp dunning: recovering locked ITC from non-filing suppliers."
            ]
        },
        {
            num: "03",
            title: "Two-Way Tally Prime Bridge & WhatsApp Commerce",
            duration: "7 Minutes",
            color: "purple",
            bullets: [
                "Direct XML/ODBC sync posting sales vouchers and tax ledgers directly into Tally Prime.",
                "In-chat native WhatsApp product catalogs and automated 1-tap UPI payment dunning.",
                "Complimentary 24-hour master data migration from your existing accounting software."
            ]
        }
    ];

    return (
        <section id="demo-curriculum" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-15: Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Structured Agenda
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        What We Cover in Your 20-Minute Personalized Walkthrough
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        No generic slide presentations. We jump straight into live working software loaded with sample data from your specific business sector.
                    </p>
                </div>

                {/* S-16 to S-18: Curriculum Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {modules.map((mod, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm flex items-center justify-center shadow-sm">
                                        {mod.num}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 font-mono bg-white px-2.5 py-1 rounded-full border border-slate-200">
                                        ⏱️ {mod.duration}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 leading-snug">
                                    {mod.title}
                                </h3>

                                <ul className="space-y-2.5 text-xs text-slate-600">
                                    {mod.bullets.map((b, bIdx) => (
                                        <li key={bIdx} className="flex items-start gap-2">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-400">
                                Live interactive screen sharing on Google Meet
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

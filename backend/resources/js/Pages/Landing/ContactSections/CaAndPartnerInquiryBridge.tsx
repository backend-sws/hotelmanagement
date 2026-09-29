import React from 'react';

export default function CaAndPartnerInquiryBridge() {
    const partnerDesks = [
        {
            title: "Chartered Accountants & Tax Practitioners",
            email: "ca.desk@nexusbilling.in",
            icon: "📜",
            description: "Direct priority line for CAs. Get help with multi-client access, GSTR-9/9C audit pack generation, or apply for complimentary CA practice software licenses.",
            actionText: "Join CA Partner Program →",
            link: "/partners"
        },
        {
            title: "POS Hardware Vendors & OEMs",
            email: "hardware.lab@nexusbilling.in",
            icon: "🖨️",
            description: "Partner with our hardware certification lab to test USB/Ethernet thermal printers, barcode scanners, and weighing scale SDK drivers for certified compatibility.",
            actionText: "Hardware Certification Info →",
            link: "/contact#inquiry-form"
        },
        {
            title: "Enterprise Multi-Chain RFPs (50+ Stores)",
            email: "enterprise@nexusbilling.in",
            icon: "🏢",
            description: "For retail supermarket chains, hotel conglomerates, and manufacturing groups requiring private cloud VPCs, custom ERP connectors, and dedicated account managers.",
            actionText: "Request Enterprise RFP Meeting →",
            link: "/demo"
        },
        {
            title: "Careers & Talent Acquisition",
            email: "careers@nexusbilling.in",
            icon: "💼",
            description: "Want to join our mission? Send your resume or GitHub profile to our recruitment team, or browse active openings in distributed systems, design, and sales.",
            actionText: "View Open Careers →",
            link: "/careers"
        }
    ];

    return (
        <section id="partner-inquiries" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Ecosystem &amp; Partnerships
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Dedicated Desks for CAs, Hardware Vendors &amp; Enterprises
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Nexus collaborates with an extensive network of accounting professionals, hardware distributors, and retail solution integrators across India.
                    </p>
                </div>

                {/* Partner Desks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {partnerDesks.map((desk, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{desk.icon}</span>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">{desk.title}</h3>
                                        <div className="text-xs font-mono text-purple-700 font-bold">{desk.email}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                                    {desk.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <a
                                    href={desk.link}
                                    className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                                >
                                    {desk.actionText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================================================= */}
                {/* S-25: Responsible Security Vulnerability Disclosure                       */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                                🛡️ Responsible Disclosure
                            </span>
                            <h4 className="text-base font-black text-white">Security Vulnerability &amp; Bug Bounty Desk</h4>
                            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                                If you believe you have discovered a security or privacy vulnerability within Nexus services, please disclose it to our Security Engineering Response Team at <span className="text-amber-400 font-mono">security@nexusbilling.in</span>. We acknowledge reports within 24 hours.
                            </p>
                        </div>
                        <a
                            href="/security"
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-700 whitespace-nowrap"
                        >
                            View Security Policy →
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}

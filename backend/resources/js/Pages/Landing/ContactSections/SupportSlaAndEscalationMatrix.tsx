import React from 'react';

export default function SupportSlaAndEscalationMatrix() {
    const slas = [
        {
            level: "P1 — Critical",
            desc: "Storefront billing counter halted, checkout POS frozen, or payment gateway crash",
            response: "< 5 Minutes",
            target: "< 30 Minutes",
            channel: "Dedicated Phone SOS / Direct Video Call",
            color: "rose"
        },
        {
            level: "P2 — Major",
            desc: "NIC IRP E-Invoicing rejection, GSTR-2B sync failure, or branch sync lag",
            response: "< 30 Minutes",
            target: "< 2 Hours",
            channel: "Priority Phone / WhatsApp Desk",
            color: "amber"
        },
        {
            level: "P3 — Standard",
            desc: "User permissions, custom thermal bill template formatting, Tally ledger mapping",
            response: "< 2 Hours",
            target: "< 6 Hours",
            channel: "WhatsApp & Email Ticket Portal",
            color: "blue"
        },
        {
            level: "P4 — Minor",
            desc: "New feature suggestions, non-urgent data exports, bulk product uploads",
            response: "< 4 Hours",
            target: "Same Business Day",
            channel: "Email & Knowledge Base",
            color: "slate"
        }
    ];

    return (
        <section id="support-slas" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                        Operational Peace of Mind
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Guaranteed Service Level Agreements (SLAs) &amp; Escalation
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        When a retail checkout register stops, your business loses money. We treat store uptime as mission-critical infrastructure backed by legally enforceable SLAs.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-16: Support SLA Table                                                   */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-700 font-bold">
                                <th className="pb-3 pl-2">Severity Level</th>
                                <th className="pb-3">Incident Scenario</th>
                                <th className="pb-3">First Response SLA</th>
                                <th className="pb-3">Target Resolution</th>
                                <th className="pb-3 pr-2">Priority Channel</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80">
                            {slas.map((sla, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="py-4 pl-2 font-black">
                                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                            sla.color === 'rose' ? 'bg-rose-100 text-rose-800' :
                                            sla.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                                            sla.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-200 text-slate-800'
                                        }`}>
                                            {sla.level}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-700 max-w-xs">{sla.desc}</td>
                                    <td className="py-4 font-mono font-bold text-slate-900">{sla.response}</td>
                                    <td className="py-4 font-mono font-bold text-slate-900">{sla.target}</td>
                                    <td className="py-4 pr-2 text-slate-600 font-medium">{sla.channel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ========================================================================= */}
                {/* S-18: Counter Emergency Hotline Banner                                    */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-r from-rose-900 via-red-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-16 border border-rose-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-950 px-3 py-1 rounded-full border border-rose-700">
                                🚨 Live Store Emergency Line
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white">
                                Store Checkout Down During Peak Customer Rush?
                            </h3>
                            <p className="text-xs text-rose-200 leading-relaxed">
                                Our dedicated Counter Emergency SOS line bypasses standard IVR automated menus directly to a Level 2 systems technician. Reserved strictly for active cashier outages.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex flex-col items-start lg:items-end">
                            <div className="text-xl font-mono font-black text-amber-300 bg-black/40 px-4 py-2 rounded-xl border border-rose-700">
                                📞 +91 747 949 9718
                            </div>
                            <span className="text-[11px] text-rose-300 mt-1.5 font-medium">Priority Flash Dial for Active Outlets</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-17 & S-19: 3-Tier Escalation Ladder & Remote Assistance Guide           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                📶
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">3-Tier Escalation Architecture</h3>
                                <p className="text-xs text-slate-500">Structured resolution hierarchy</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 mt-4">
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-blue-900 block mb-0.5">Tier 1: Frontline Merchant Specialists</strong>
                                Barcode scanner pairing, thermal receipt margins, user logins, and daily shift day-end reconciliation.
                            </div>
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-blue-900 block mb-0.5">Tier 2: Cloud Systems &amp; Network Engineers</strong>
                                Database replication sync lag, IRP portal SSL certificate handshakes, and WhatsApp Cloud API queue monitoring.
                            </div>
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-blue-900 block mb-0.5">Tier 3: FCA Statutory &amp; Core Architecture Leads</strong>
                                Direct escalation for ASMT-10 notice replies, GSTR-9 discrepancy reconciliation, and multi-tenant schema patches.
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                🖥️
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Instant Remote Desktop Assistance</h3>
                                <p className="text-xs text-slate-500">Zero-friction AnyDesk &amp; TeamViewer pairing</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 mt-4">
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-emerald-900 block mb-0.5">Step 1: 1-Click Secure Pairing</strong>
                                Share your temporary session code with our certified engineer over phone or WhatsApp.
                            </div>
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-emerald-900 block mb-0.5">Step 2: Driver &amp; COM Port Diagnostics</strong>
                                Engineer configures USB virtual COM port drivers for thermal printers and electronic weighing scales.
                            </div>
                            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                                <strong className="text-emerald-900 block mb-0.5">Step 3: Verified Test Print in &lt;3 Minutes</strong>
                                Live test invoice printed on your counter, session disconnected with zero lingering remote access.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-20: Customer Satisfaction Benchmarks                                    */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center">
                    <div className="max-w-2xl mx-auto mb-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Independent Quality Audits</span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">Verified Customer Satisfaction Metrics</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-3xl font-black text-emerald-600 font-mono">98.6%</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">First-Contact Resolution</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">P1/P2 issues solved on first call</p>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-3xl font-black text-blue-600 font-mono">4.9 / 5.0</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">Merchant Rating</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Across 2,400+ verified store reviews</p>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-3xl font-black text-purple-600 font-mono">14,200+</div>
                            <div className="text-xs font-bold text-slate-900 mt-1">Tickets Resolved</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">0 unresolved critical outages</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

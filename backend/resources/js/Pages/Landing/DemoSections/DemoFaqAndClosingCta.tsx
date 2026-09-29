import React, { useState } from 'react';

export default function DemoFaqAndClosingCta() {
    // S-24 State: FAQ Accordion
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "Is the live walkthrough completely free of charge?",
            a: "Yes, 100% free with zero obligation. There are no sales pressure tactics or hidden consultation fees. We want you to evaluate whether Nexus is the right architectural fit for your store or distribution operations."
        },
        {
            q: "Who from our business should attend the demo session?",
            a: "We recommend including the business owner/director, the store manager or head cashier, and your accountant. This ensures all operational, inventory, and statutory tax questions are addressed simultaneously."
        },
        {
            q: "Can our Chartered Accountant or bookkeeper join the call?",
            a: "Absolutely! We encourage you to invite your CA. Our statutory specialists will demonstrate the automated GSTR-2B matching, Rule 36(4) capping, and two-way Tally Prime bridge directly to them."
        },
        {
            q: "Do I need to install any software or browser extensions before the demo?",
            a: "Zero downloads required. The walkthrough happens over a standard Google Meet link that opens in any browser on your laptop, desktop, or mobile smartphone."
        },
        {
            q: "How quickly can we go live with Nexus after the demo?",
            a: "Most retail stores and wholesale distributors go live within 24 hours. Our onboarding team performs complimentary data migration of your customer khata balances, supplier ledgers, and stock items from Tally, Marg, Vyapar, or Excel overnight."
        }
    ];

    // S-28: Schema.org JSON-LD
    const demoJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Nexus ERP Personalized Walkthrough & Demo',
        'provider': {
            '@type': 'Organization',
            'name': 'Nexus Billing Technologies Pvt Ltd',
            'url': 'https://nexusbilling.in'
        },
        'serviceType': 'Enterprise Cloud ERP Consultation & POS Demonstration',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'INR',
            'description': 'Free 20-minute tailored software demonstration'
        }
    };

    return (
        <section id="demo-faqs" className="py-20 bg-white">
            {/* Schema Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(demoJsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-24: Demo Booking FAQs                                                   */}
                {/* ========================================================================= */}
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Demo FAQs</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            Everything You Need to Know Before Booking
                        </h3>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm divide-y divide-slate-200">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-4 first:pt-0 last:pb-0">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between text-left gap-4 group"
                                >
                                    <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                        {faq.q}
                                    </span>
                                    <span className="text-slate-400 font-bold text-lg leading-none">
                                        {expandedFaq === index ? '−' : '+'}
                                    </span>
                                </button>
                                {expandedFaq === index && (
                                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-25: Enterprise Security & Compliance Badges                             */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 mb-20 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
                        Enterprise Regulatory Compliance &amp; Certifications
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-800">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200">
                            <div>🏛️ Direct NIC GSP</div>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Authorized API Bridge</p>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200">
                            <div>🔒 ISO 27001:2022</div>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Information Security</p>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200">
                            <div>🛡️ SOC 2 Type II</div>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Privacy Certified</p>
                        </div>
                        <div className="p-3 bg-white rounded-2xl border border-slate-200">
                            <div>🇮🇳 100% Indian Cloud</div>
                            <p className="text-[10px] text-slate-400 font-normal mt-0.5">AWS Mumbai Hosted</p>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-27: Closing Instant Trial CTA                                           */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/20 px-3.5 py-1 rounded-full border border-amber-300/30">
                            Instant Self-Serve Access
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Can’t Wait for Your Call? Test Drive Live Right Now.
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            Create your free sandbox account in under 60 seconds. Full access to multi-counter checkout, automated GST e-invoicing, WhatsApp catalogs, and Tally export.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="#self-guided-sandbox"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-900 font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105"
                            >
                                Test Live Sandbox Now ↑
                            </a>
                            <a
                                href="https://wa.me/917479499718?text=Hi,%20I%20would%20like%20a%20quick%20Nexus%20ERP%20demo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg"
                            >
                                💬 Book via WhatsApp in 30s
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> 100% Free 14-Day Trial
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Free Tally Master Import
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

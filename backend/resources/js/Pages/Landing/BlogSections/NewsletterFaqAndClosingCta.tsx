import React, { useState } from 'react';

export default function NewsletterFaqAndClosingCta() {
    // S-25 State: Newsletter Subscription Form
    const [subscriberChannel, setSubscriberChannel] = useState<'email' | 'whatsapp'>('whatsapp');
    const [subscriberContact, setSubscriberContact] = useState('');
    const [subscribedSuccess, setSubscribedSuccess] = useState(false);

    // S-26 State: FAQ Accordion
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "How frequently are tax guides updated following GST Council meetings?",
            a: "Our statutory policy team reviews official CBIC notifications within 4 hours of publication. Articles covering rate changes, GSTR-3B changes, or E-Invoicing mandates are updated the same business day."
        },
        {
            q: "Can our CA firm distribute Nexus articles and checklists to our clients?",
            a: "Yes. All our guides and downloadable PDF audit checklists are freely shareable for non-commercial educational purposes, provided Nexus Billing is attributed as the original source."
        },
        {
            q: "How can I pitch a guest contribution as a practicing Chartered Accountant?",
            a: "We welcome technical, high-value statutory analysis from practicing FCAs and tax lawyers. You can apply through our CA Contributor Program to get your articles published in front of 45,000+ business owners."
        },
        {
            q: "Do your playbooks apply to both Composition and Regular taxpayers?",
            a: "Yes. We specifically demarcate rules between regular taxpayers filing GSTR-1/3B with full Input Tax Credit versus composition merchants filing quarterly CMP-08 statements."
        },
        {
            q: "Are the downloadable Excel templates and sample checklists free to use?",
            a: "100% free. All our calculation spreadsheets, ASMT-11 reply formats, and batch FEFO tracking templates can be downloaded and used in your business without watermarks or paywalls."
        },
        {
            q: "Can I request an in-depth guide on a specific industry or tax topic?",
            a: "Absolutely. Send your suggestions to editorial@nexusbilling.in. We prioritize topics with the highest reader demand every sprint."
        }
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (subscriberContact.length > 5) {
            setSubscribedSuccess(true);
        }
    };

    return (
        <section id="blog-footer-cta" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ========================================================================= */}
                {/* S-25: Weekly MSME Growth Newsletter                                       */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 mb-20 shadow-sm">
                    <div className="max-w-3xl mx-auto text-center space-y-3">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                            📬 The Weekly Nexus Ledger
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                            Join 45,000+ Indian Business Owners &amp; CAs
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                            Delivered every Tuesday: 1 breaking GST update, 1 retail inventory profit hack, and 1 WhatsApp commerce case study. No promotional spam.
                        </p>

                        {/* Subscription Form */}
                        <div className="pt-4 max-w-md mx-auto">
                            {subscribedSuccess ? (
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                                    <div className="text-2xl">✅</div>
                                    <div className="text-sm font-black text-emerald-900">Welcome to The Ledger!</div>
                                    <p className="text-xs text-emerald-700">
                                        You are confirmed for Tuesday delivery at <span className="font-mono font-bold">{subscriberContact}</span>.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="space-y-3">
                                    <div className="flex justify-center gap-2 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setSubscriberChannel('whatsapp')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                subscriberChannel === 'whatsapp'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-white text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            Receive on WhatsApp
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSubscriberChannel('email')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                subscriberChannel === 'email'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-slate-600 border border-slate-200'
                                            }`}
                                        >
                                            Receive on Email
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type={subscriberChannel === 'email' ? 'email' : 'tel'}
                                            required
                                            value={subscriberContact}
                                            onChange={(e) => setSubscriberContact(e.target.value)}
                                            placeholder={subscriberChannel === 'email' ? 'Enter your work email...' : 'Enter 10-digit WhatsApp number...'}
                                            className="flex-1 px-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                                        >
                                            Subscribe Free
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400">One-click unsubscribe anytime. Strict zero-spam policy.</p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-26: Blog Knowledge Base FAQs                                            */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-20">
                    <div className="max-w-2xl mb-8">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Editorial FAQs</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                            Reader Questions &amp; Content Guidelines
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-4">
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
                                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-8">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-27: CA & Expert Contributor Teaser                                      */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-20 shadow-xl border border-blue-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-950 px-3 py-1 rounded-full border border-blue-700">
                                Write for Nexus Insights
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white">
                                Are You a Practicing CA, Retail Specialist, or Supply Chain Leader?
                            </h3>
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Share your technical tax analyses and inventory optimization case studies with 45,000+ monthly business readers. Authors receive dedicated profile backlinks and national recognition.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <a
                                href="/contact"
                                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                            >
                                Apply as Guest Contributor →
                            </a>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-28: Closing Conversion CTA                                              */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/20 px-3.5 py-1 rounded-full border border-amber-300/30">
                            Action Beats Knowledge
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Ready to Put These Best Practices into Action?
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                            Stop reading about automated E-Invoicing and 2B reconciliation—experience it live in your business with our 14-day free trial.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-900 font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105"
                            >
                                Start 14-Day Free Trial
                            </a>
                            <a
                                href="/contact"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-950/40 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-950/60 transition-all border border-white/20"
                            >
                                Schedule Guided Walkthrough
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Instant GSTIN Verification
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> 7-Day Multilingual Support
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

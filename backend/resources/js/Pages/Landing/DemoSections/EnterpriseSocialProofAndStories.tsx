import React from 'react';

export default function EnterpriseSocialProofAndStories() {
    const stories = [
        {
            company: "Royal Supermarket",
            city: "Hyderabad, Telangana",
            industry: "Retail Supermarket Chain",
            metric: "70% Faster Checkout",
            quote: "During festival weekends, our 4 billing registers used to crawl on desktop software. With Nexus cloud sync, each customer bill prints in 4 seconds flat.",
            tag: "Multi-Counter Retail"
        },
        {
            company: "Mahalaxmi FMCG Distributors",
            city: "Nagpur, Maharashtra",
            industry: "Wholesale & Distribution",
            metric: "₹14.8L ITC Recovered",
            quote: "The live GSTR-2B matching alone paid for our subscription 20 times over. We caught 3 defaulting suppliers before the 30th November cutoff.",
            tag: "GSTR-2B Automation"
        },
        {
            company: "Kailash Engineering Works",
            city: "Rajkot, Gujarat",
            industry: "Precision Manufacturing",
            metric: "Zero Highway Delays",
            quote: "Simultaneous IRN and E-Way bill generation eliminated all highway checkpoint detentions. Transporters love our clear QR passes.",
            tag: "E-Invoicing & EWB"
        }
    ];

    const consultants = [
        { name: "Rohan Khurana", role: "Senior ERP Architect", experience: "8+ yrs retail supply chain", avatar: "👨‍💼" },
        { name: "Meera Nair, CA Inter", role: "Statutory Tax Lead", experience: "Expert in GSTR-2B & Tally Bridge", avatar: "👩‍💼" },
        { name: "Karthik Raman", role: "Hardware Solutions Specialist", experience: "Printer & Scanner Lab Lead", avatar: "👨‍💻" }
    ];

    return (
        <section id="merchant-stories" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-19: Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Proven Indian Success
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Join 12,000+ Thriving Stores, Warehouses &amp; Factories
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Hear how business owners across 28 Indian states transformed their daily counter operations and statutory compliance with Nexus.
                    </p>
                </div>

                {/* S-20 to S-22: Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {stories.map((story, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                                        {story.tag}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">{story.city}</span>
                                </div>

                                <div>
                                    <div className="text-2xl font-black text-purple-800 font-mono">{story.metric}</div>
                                    <h3 className="font-black text-slate-900 text-base mt-0.5">{story.company}</h3>
                                    <p className="text-xs text-slate-500">{story.industry}</p>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed italic border-t border-slate-100 pt-3">
                                    &quot;{story.quote}&quot;
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Verified Customer</span>
                                <span className="text-purple-600 font-semibold">Read Full Case Study →</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================================================= */}
                {/* S-23: Senior Product Consultants Strip                                    */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto mb-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meet Your Demo Host</span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">
                            Led by Senior Domain Specialists, Not Pushy Sales Reps
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {consultants.map((c, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                                <div className="text-2xl">{c.avatar}</div>
                                <div>
                                    <div className="font-black text-slate-900 text-xs">{c.name}</div>
                                    <div className="text-[11px] text-purple-700 font-semibold">{c.role}</div>
                                    <div className="text-[10px] text-slate-500">{c.experience}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

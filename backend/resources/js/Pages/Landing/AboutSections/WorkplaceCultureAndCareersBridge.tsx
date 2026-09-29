import React from 'react';

export default function WorkplaceCultureAndCareersBridge() {
    const spotlights = [
        {
            name: "Sneha Patil",
            role: "Senior Distributed Systems Engineer",
            quote: "At Nexus, a 20ms latency spike isn't an abstract database metric—it's a line of customers waiting at a grocery store counter in Thane. That sense of direct real-world impact pushes our engineering team to obsess over sub-second performance.",
            tenure: "3 Years at Nexus",
            team: "Core Infrastructure"
        },
        {
            name: "Tanmay Kulkarni",
            role: "Staff Product Designer",
            quote: "We don't design for Silicon Valley techies. We design for a 55-year-old hardware shop owner in Rajkot who types fast on a numpad and needs to print 500 bills a day. Making complex multi-state GST logic feel invisible and effortless is our greatest joy.",
            tenure: "2 Years at Nexus",
            team: "Product & UX"
        },
        {
            name: "Farhan Sheikh",
            role: "Merchant Success Escalations Lead",
            quote: "When a distributor's printer disconnects on Dhanteras evening, we don't send an automated email ticket. We jump on a live video call and fix the driver port in 90 seconds. Saving a merchant's festive billing run gives us immense pride.",
            tenure: "4 Years at Nexus",
            team: "Customer Success"
        }
    ];

    const awards = [
        { title: "Most Reliable Cloud ERP 2025", issuer: "National MSME Conclave", icon: "🏆" },
        { title: "Top 10 Indian SaaS Innovators", issuer: "TechSparks Bengaluru", icon: "⭐" },
        { title: "Great Place to Work® Certified", issuer: "GPTW Institute 2025-26", icon: "🎖️" },
        { title: "DPIIT Recognized Startup", issuer: "Govt of India #DIPP89104", icon: "🏛️" }
    ];

    return (
        <section id="workplace-culture" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Culture &amp; People
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Where Craft, Rigor &amp; Customer Obsession Meet
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        We are a passionate team of builders, problem-solvers, and trade advocates united by a single mission: giving Indian business owners the technology they deserve.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-21 & S-22: Life at Nexus & Inclusive Workplace                          */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                🛠️
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">The Nexus Engineering Ethos</h3>
                                <p className="text-xs text-slate-500">High ownership, customer immersion, and continuous learning</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-xs text-slate-600 mt-6">
                            <li className="flex items-start gap-2.5">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Storefront Shadowing:</strong> Every engineer and product manager spends 1 day every quarter standing behind an actual retail or wholesale billing counter to witness user pain points firsthand.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Blameless Postmortems:</strong> When an incident occurs, we analyze the systemic root cause without assigning blame, turning failures into automated architectural guardrails.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-purple-600 font-bold">✓</span>
                                <span><strong>Bi-Weekly Ship Showcases:</strong> Every team demoes working code directly to the company every other Friday—no slide decks, only working software.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                🤝
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Diversity &amp; Growth</h3>
                                <p className="text-xs text-slate-500">A workplace built on merit, respect, and holistic well-being</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="text-2xl font-black text-emerald-600 font-mono">40%</div>
                                <div className="text-xs font-bold text-slate-800 mt-1">Women in Leadership</div>
                                <p className="text-[11px] text-slate-500 mt-0.5">Engineering &amp; Product</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="text-2xl font-black text-emerald-600 font-mono">14 States</div>
                                <div className="text-xs font-bold text-slate-800 mt-1">Distributed Talent</div>
                                <p className="text-[11px] text-slate-500 mt-0.5">Remote-First Flexibility</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="text-2xl font-black text-emerald-600 font-mono">₹50,000</div>
                                <div className="text-xs font-bold text-slate-800 mt-1">Learning Stipend</div>
                                <p className="text-[11px] text-slate-500 mt-0.5">Annual Books &amp; Courses</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="text-2xl font-black text-emerald-600 font-mono">100%</div>
                                <div className="text-xs font-bold text-slate-800 mt-1">Comprehensive Health</div>
                                <p className="text-[11px] text-slate-500 mt-0.5">Coverage for Family &amp; Parents</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-23: Employee Spotlights                                                 */}
                {/* ========================================================================= */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Voices of Nexus</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">Hear from the People Building the Platform</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {spotlights.map((spotlight, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                    {spotlight.team}
                                </span>
                                <p className="text-xs text-slate-600 mt-4 leading-relaxed italic">
                                    &quot;{spotlight.quote}&quot;
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="font-bold text-slate-900 text-sm">{spotlight.name}</div>
                                <div className="text-xs text-slate-500">{spotlight.role}</div>
                                <div className="text-[11px] text-purple-600 font-semibold mt-0.5">{spotlight.tenure}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ========================================================================= */}
                {/* S-24: Company Awards & Recognition                                        */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Industry Recognition</span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">Honored by Industry Leaders &amp; MSME Councils</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {awards.map((award, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                <div className="text-2xl mb-1">{award.icon}</div>
                                <h4 className="text-xs font-black text-slate-900">{award.title}</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">{award.issuer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-25: Careers Bridge Teaser Banner                                        */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-purple-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-950 px-3 py-1 rounded-full border border-purple-700">
                                We Are Hiring!
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">
                                Want to Build the Digital Nervous System of Indian Trade?
                            </h3>
                            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                                We’re looking for distributed systems engineers, React frontend architects, Chartered Accountants, and merchant onboarding leads to join our mission.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <a
                                href="/careers"
                                className="px-7 py-3.5 bg-white hover:bg-purple-50 text-purple-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
                            >
                                Explore Open Positions →
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

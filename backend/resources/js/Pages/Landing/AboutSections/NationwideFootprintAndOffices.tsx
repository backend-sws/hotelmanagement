import React, { useState } from 'react';

export default function NationwideFootprintAndOffices() {
    // S-16 State: Regional Office Hub Selector
    const [selectedHub, setSelectedHub] = useState<'bengaluru' | 'mumbai' | 'delhi' | 'surat' | 'hyderabad'>('bengaluru');

    // S-20 State: Milestone Timeline Year Selector
    const [activeYear, setActiveYear] = useState<'2021' | '2022' | '2023' | '2024' | '2025' | '2026'>('2026');

    const offices = {
        bengaluru: {
            city: "Bengaluru (HQ)",
            address: "Nexus Tower, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
            focus: "Global Engineering, Core Cloud Architecture & Product Design",
            teamSize: "75+ Engineers & Designers",
            phone: "+91 747 949 9718"
        },
        mumbai: {
            city: "Mumbai",
            address: "The Capital, Level 7, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051",
            focus: "Enterprise Distribution, Financial Compliance & Banking Partnerships",
            teamSize: "30+ Enterprise Account Specialists",
            phone: "+91 22 6830 1100"
        },
        delhi: {
            city: "Delhi NCR",
            address: "Statesman House, Barakhamba Road, Connaught Place, New Delhi 110001",
            focus: "Statutory Policy, GST Affairs & Government GSP Relations",
            teamSize: "15+ Policy & Chartered Accountants",
            phone: "+91 11 4320 5500"
        },
        surat: {
            city: "Surat",
            address: "Textile Market Tower, Ring Road, Surat, Gujarat 395002",
            focus: "Textile Trade, FMCG Center of Excellence & Merchant Training",
            teamSize: "25+ Implementation Consultants",
            phone: "+91 261 240 7700"
        },
        hyderabad: {
            city: "Hyderabad",
            address: "Cyber Towers, Hitec City, Madhapur, Hyderabad, Telangana 500081",
            focus: "Cloud Infrastructure, High-Throughput SRE & Disaster Recovery",
            teamSize: "20+ DevOps & Database Architects",
            phone: "+91 40 4850 9900"
        }
    };

    const currentOffice = offices[selectedHub];

    return (
        <section id="nationwide-offices" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                        Nationwide Presence
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Rooted in Bengaluru, Supporting Merchants in 180+ Cities
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        With regional engineering, compliance, and merchant support offices across India, we are always within reach of your business operations.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-16: Pan-India Presence & Regional Hub Selector                          */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                        <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Regional Hubs</span>
                            <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                Explore Our Regional Innovation &amp; Support Centers
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(['bengaluru', 'mumbai', 'delhi', 'surat', 'hyderabad'] as const).map((hub) => (
                                <button
                                    key={hub}
                                    onClick={() => setSelectedHub(hub)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                                        selectedHub === hub
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {hub}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Hub Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏢</span>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900">{currentOffice.city} Hub</h4>
                                    <p className="text-xs text-slate-500">{currentOffice.focus}</p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 flex items-start gap-2 pt-1">
                                <span className="text-slate-400">📍</span>
                                <span>{currentOffice.address}</span>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Dedicated Staff:</span>
                                <span className="font-bold text-slate-900">{currentOffice.teamSize}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Direct Desk:</span>
                                <span className="font-bold font-mono text-emerald-700">{currentOffice.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Working Hours:</span>
                                <span className="font-bold text-slate-900">Mon - Sat, 9am - 8pm IST</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-17 & S-18: Tier-2/3 Impact & 7-Day Multilingual Support Desk             */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                                🇮🇳
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Empowering Bharat Beyond Metros</h3>
                                <p className="text-xs text-slate-500">Over 62% of Nexus merchants operate in Tier 2, 3 &amp; 4 trade centers</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            From wholesale cloth merchants in Surat and machinery fabricators in Rajkot to spice exporters in Guntur and grocery chains in Siliguri—Nexus is engineered to run flawlessly on affordable hardware (even ₹12,000 basic laptops) with zero performance degradation.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Surat</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Jaipur</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Indore</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Coimbatore</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Rajkot</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Varanasi</span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Guwahati</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                💬
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">7-Day Multilingual Support Desk</h3>
                                <p className="text-xs text-slate-500">Average first response time: 2 minutes 45 seconds</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            We know that a billing counter cannot wait 24 hours for a support email ticket. Our dedicated customer success engineers are reachable via phone and WhatsApp 7 days a week, speaking your local business language.
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px] font-bold text-blue-700">
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Hindi (हिंदी)</span>
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">English</span>
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Gujarati (ગુજરાતી)</span>
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Marathi (मराठी)</span>
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Tamil (தமிழ்)</span>
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Telugu (తెలుగు)</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-19: On-Ground Partner Network                                           */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-16 shadow-xl border border-blue-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-950 px-3 py-1 rounded-full border border-blue-700">
                                Physical Implementation
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white">
                                450+ Certified On-Ground Implementation Partners
                            </h3>
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Need someone to visit your store, connect thermal receipt printers, configure barcode scales, and train your staff in person? Our certified IT partner network spans 180+ cities across India.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <a
                                href="/partners"
                                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                            >
                                Find Local Partner Near You →
                            </a>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-20: Interactive Merchant Milestone Timeline (2021 - 2026)               */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Five Years of Relentless Execution</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">
                            From Day One to India’s Fastest Growing Cloud ERP
                        </h3>
                    </div>

                    {/* Timeline Tabs */}
                    <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
                        {(['2021', '2022', '2023', '2024', '2025', '2026'] as const).map((year) => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                                    activeYear === year
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                    {/* Milestone Card */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 max-w-3xl mx-auto">
                        {activeYear === '2021' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2021: The Genesis in Bangalore</div>
                                <h4 className="text-base font-black text-slate-900">Nexus v1.0 Launch for Retail Supermarkets</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Founded by Arjun Mehta and Rohit Verma in Koramangala, Bengaluru. Released the first version of our high-speed cloud billing engine designed for supermarket barcode counters. First 100 pilot stores onboarded in Karnataka.
                                </p>
                            </div>
                        )}

                        {activeYear === '2022' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2022: Multi-Warehouse Expansion</div>
                                <h4 className="text-base font-black text-slate-900">Crossed 1,000 Merchants &amp; Batch / Expiry Tracking</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Expanded into pharma and FMCG distribution with FEFO batch tracking. Opened regional implementation hub in Surat to support Gujarat textile traders. Achieved 99.98% cloud uptime across holiday sales.
                                </p>
                            </div>
                        )}

                        {activeYear === '2023' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2023: Direct Government NIC Integration</div>
                                <h4 className="text-base font-black text-slate-900">1-Click E-Invoicing &amp; E-Way Bill Highway</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Became authorized direct GSP pipeline provider. Integrated sub-200ms IRN generation and Pin-to-Pin E-Way bills directly within the billing checkout screen. Expanded to Mumbai and Delhi regional offices.
                                </p>
                            </div>
                        )}

                        {activeYear === '2024' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2024: The ₹5,000 Cr GMV Milestone</div>
                                <h4 className="text-base font-black text-slate-900">Launched FieldOps &amp; Manufacturing Job Work ERP</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Added multi-stage bill of materials (BOM), scrap tracking, and field technician dispatch capabilities. Crossed ₹5,000 Crores in cumulative annual GMV processed with 7,500 active Indian enterprises.
                                </p>
                            </div>
                        )}

                        {activeYear === '2025' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2025: Official Meta WhatsApp Cloud Partner</div>
                                <h4 className="text-base font-black text-slate-900">In-Chat Catalogs, Dynamic UPI Dunning &amp; 10,000 Merchants</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Partnered directly with Meta to pioneer conversational commerce in India. Businesses could now send native product catalogs and recover payment dues via 1-tap WhatsApp UPI links, dropping payment default rates by 70%.
                                </p>
                            </div>
                        )}

                        {activeYear === '2026' && (
                            <div className="space-y-2 text-xs">
                                <div className="text-blue-600 font-mono font-bold text-sm">2026: The AI &amp; Statutory Audit Frontier</div>
                                <h4 className="text-base font-black text-slate-900">Gemini Vision AI, 12,000+ Merchants &amp; 28 States</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Rolled out Google Gemini 1.5 Flash Vision OCR for instant purchase bill scanning, automated 2-way GSTR-2B ITC protection, and comprehensive ASMT-10 notice audit defense pack. Processing over ₹8,400 Crores annually across India.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}

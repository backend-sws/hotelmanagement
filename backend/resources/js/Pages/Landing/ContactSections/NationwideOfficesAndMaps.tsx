import React from 'react';

export default function NationwideOfficesAndMaps() {
    const offices = [
        {
            city: "Bengaluru (Global HQ)",
            badge: "R&D & Engineering Hub",
            address: "Nexus Tower, 4th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560034",
            phone: "+91 747 949 9718",
            email: "bangalore.hq@nexusbilling.in",
            focus: "Distributed Database Engineering, Core Cloud POS, Architecture & Design",
            color: "blue"
        },
        {
            city: "Mumbai (Financial Hub)",
            badge: "Enterprise & Banking",
            address: "The Capital, Level 7, Plot C-70, G Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051",
            phone: "+91 22 6830 1100",
            email: "mumbai.sales@nexusbilling.in",
            focus: "Enterprise Multi-Chain ERP, Wholesale FMCG Relations & Fintech Integrations",
            color: "purple"
        },
        {
            city: "Delhi NCR (Statutory)",
            badge: "GST Policy & GSP Desk",
            address: "Statesman House, Barakhamba Road, Connaught Place, New Delhi, Delhi 110001",
            phone: "+91 11 4320 5500",
            email: "delhi.policy@nexusbilling.in",
            focus: "Statutory Indirect Tax Policy, NIC Portal Relations & CA Advisory Network",
            color: "amber"
        },
        {
            city: "Surat (Retail Center)",
            badge: "Textile & FMCG Ops",
            address: "Textile Market Tower, Ring Road, Surat, Gujarat 395002",
            phone: "+91 261 240 7700",
            email: "surat.ops@nexusbilling.in",
            focus: "Textile Wholesale, Vernacular Merchant Training & Counter Hardware Lab",
            color: "emerald"
        },
        {
            city: "Hyderabad (Cloud SRE)",
            badge: "High-Throughput Infra",
            address: "Cyber Towers, Hitec City, Madhapur, Hyderabad, Telangana 500081",
            phone: "+91 40 4850 9900",
            email: "hyderabad.infra@nexusbilling.in",
            focus: "24/7 Cloud Site Reliability, AWS Multi-Region Clusters & Network Latency",
            color: "indigo"
        }
    ];

    return (
        <section id="regional-offices" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-11: Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Nationwide Operations
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Visit Our Regional Innovation &amp; Support Centers
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Walk into any of our regional offices for physical POS hardware benchmarking, custom enterprise workflow consultations, or statutory CA tax clinics.
                    </p>
                </div>

                {/* S-12 to S-15: Regional Office Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offices.map((office, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-slate-900">{office.city}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                        {office.badge}
                                    </span>
                                </div>

                                <div className="text-xs text-slate-600 flex items-start gap-2 pt-1 leading-relaxed">
                                    <span className="text-slate-400 mt-0.5">📍</span>
                                    <span>{office.address}</span>
                                </div>

                                <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                                    <strong>Primary Focus:</strong> {office.focus}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Direct Desk:</span>
                                    <span className="font-mono font-bold text-slate-900">{office.phone}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Email:</span>
                                    <span className="font-medium text-blue-600 truncate max-w-[180px]">{office.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

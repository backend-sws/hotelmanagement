import React from 'react';

interface Props {
    searchQuery: string;
    activeCategory: string;
}

export default function RetailPosAndWholesaleGuides({ searchQuery, activeCategory }: Props) {
    if (activeCategory !== 'all' && activeCategory !== 'retail' && activeCategory !== 'wholesale') {
        return null;
    }

    const articles = [
        {
            title: "Preventing Dead Inventory: How FEFO Batch & Expiry Tracking Saves 4% of FMCG Margin",
            slug: "fefo-batch-expiry-tracking-fmcg-guide",
            readTime: "7 min read",
            author: "Pooja Iyer, CPO",
            category: "Inventory Control",
            summary: "Supermarkets and pharmaceutical retailers lose lakhs in expired stock. Learn how First-Expiry-First-Out automation rotates batches and alerts clerks 60 days in advance.",
            tag: "#FEFOBatchTracking"
        },
        {
            title: "Connecting Physical Storefront Billing with Online WhatsApp Catalog Ordering",
            slug: "omnichannel-retail-whatsapp-catalog-strategy",
            readTime: "10 min read",
            author: "Arjun Mehta, CEO",
            category: "Omni-Channel",
            summary: "Sell to walk-in foot traffic and local digital customers simultaneously. Learn how live cloud stock locking prevents accidental double selling of the last SKU.",
            tag: "#OmniChannelRetail"
        },
        {
            title: "Role-Based Permissions & Cash Drawer Shift Reconciliation: Eliminating Counter Leakage",
            slug: "cashier-fraud-prevention-shift-reconciliation",
            readTime: "6 min read",
            author: "Suresh Pillai",
            category: "Store Security",
            summary: "Blind cash closeouts, mandatory manager OTP authorization for line-item voids, and timestamped drawer openings that eliminate checkout register shortages.",
            tag: "#RetailPOS"
        },
        {
            title: "Cutting DSO from 45 to 15 Days: Automated WhatsApp Payment Reminder Schedules",
            slug: "cutting-dso-whatsapp-payment-dunning-playbook",
            readTime: "8 min read",
            author: "Deepak Sharma",
            category: "Credit Recovery",
            summary: "Stop chasing wholesale clients on uncomfortable phone calls. Discover the 4-stage automated WhatsApp dunning schedule that recovers khata balances 3x faster.",
            tag: "#KhataDunning"
        }
    ];

    const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0 && searchQuery !== '') {
        return null;
    }

    return (
        <section id="retail-wholesale-guides" className="py-16 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-11: Cluster Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-10">
                    <div>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Storefront &amp; Warehouse Operations</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            Retail POS &amp; Wholesale Supply Chain Playbooks
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">
                            Proven operational systems to speed up cashier queues, eliminate stock shrinkage, and optimize distributor cash flows.
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        {filtered.length} Guides Available
                    </span>
                </div>

                {/* S-12 to S-15: Article Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filtered.map((article, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all group"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        {article.category}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400">{article.readTime}</span>
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                                    {article.summary}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">By {article.author}</span>
                                <a
                                    href={`/blog/${article.slug}`}
                                    className="font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
                                >
                                    Read Article <span>→</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

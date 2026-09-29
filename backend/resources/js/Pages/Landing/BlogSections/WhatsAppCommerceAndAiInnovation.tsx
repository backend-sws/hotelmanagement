import React from 'react';

interface Props {
    searchQuery: string;
    activeCategory: string;
}

export default function WhatsAppCommerceAndAiInnovation({ searchQuery, activeCategory }: Props) {
    if (activeCategory !== 'all' && activeCategory !== 'whatsapp') {
        return null;
    }

    const articles = [
        {
            title: "How to Get the Official WhatsApp Green Tick (OBA) for Your Business in 4 Simple Steps",
            slug: "whatsapp-green-tick-verification-guide-india",
            readTime: "8 min read",
            author: "Rohit Verma, CTO",
            category: "Meta API",
            summary: "Everything you need to know about Meta Business Manager verification, brand notability press criteria, and domain verification for Indian enterprises.",
            tag: "#WhatsAppCommerce"
        },
        {
            title: "From WhatsApp Message to GST Tax Invoice in 30 Seconds: Complete Flow Architecture",
            slug: "whatsapp-catalog-to-gst-invoice-architecture",
            readTime: "11 min read",
            author: "Pooja Iyer, CPO",
            category: "Commerce Tech",
            summary: "Deep dive into native product catalog webhooks, shopping cart payloads, automated Place of Supply tax splits, and dynamic UPI QR code generation.",
            tag: "#ConversationalCommerce"
        },
        {
            title: "Eliminating Manual Purchase Entry: Using Vision AI to Digitize Paper Bills in 3 Seconds",
            slug: "gemini-vision-ai-paper-bill-digitization",
            readTime: "6 min read",
            author: "Sneha Patil",
            category: "Vision AI",
            summary: "Manual purchase data entry leads to clerical errors and missed ITC. See how Google Gemini 1.5 Flash extracts supplier GSTIN, HSN lines, and tax values with 99.4% accuracy.",
            tag: "#VisionAI"
        },
        {
            title: "How Machine Learning Prepares Indian Retailers for Festive Dhanteras & Diwali Surges",
            slug: "festive-season-safety-stock-forecasting",
            readTime: "9 min read",
            author: "Arjun Mehta, CEO",
            category: "Data Science",
            summary: "Avoid selling out during your biggest revenue weekends of the year. Learn how predictive replenishment algorithms model festive lead times and vendor shipping delays.",
            tag: "#StockForecasting"
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
        <section id="whatsapp-ai-guides" className="py-16 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* S-16: Cluster Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-10">
                    <div>
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Conversational Commerce &amp; Machine Intelligence</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                            WhatsApp Commerce &amp; Practical AI Innovations
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">
                            Modern customer sales channels, automated payment collections, and OCR vision workflows designed for Indian trade.
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                        {filtered.length} Guides Available
                    </span>
                </div>

                {/* S-17 to S-20: Article Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filtered.map((article, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all group"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full border border-purple-200">
                                        {article.category}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400">{article.readTime}</span>
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                                    {article.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                                    {article.summary}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">By {article.author}</span>
                                <a
                                    href={`/blog/${article.slug}`}
                                    className="font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
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

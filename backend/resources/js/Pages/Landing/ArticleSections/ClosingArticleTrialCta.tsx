import React from 'react';

interface Props {
    title: string;
    description: string;
    slug: string;
    datePublished: string;
    author: string;
}

export default function ClosingArticleTrialCta({
    title,
    description,
    slug,
    datePublished,
    author
}: Props) {
    // S-25: Schema.org Article & FAQ Structured Data
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': title,
        'description': description,
        'image': 'https://nexusbilling.in/images/nexus-blog-og.jpg',
        'datePublished': datePublished,
        'dateModified': '2026-09-18',
        'author': {
            '@type': 'Person',
            'name': author,
            'jobTitle': 'Head of Statutory Policy'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Nexus Billing Technologies Pvt Ltd',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://nexusbilling.in/images/nexus-logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://nexusbilling.in/blog/${slug}`
        }
    };

    return (
        <section className="py-20 bg-white">
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* ========================================================================= */}
                {/* S-23: Closing Article Trial Hero Card                                     */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-black/20 px-3.5 py-1 rounded-full border border-amber-300/30">
                            Zero Penalty Guarantee
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Experience Automated GSTR-2B Reconciliation in Your Business
                        </h2>
                        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                            Stop spending 15 hours every month on Excel VLOOKUP matching. Connect Nexus directly to your GST portal and protect every rupee of Input Tax Credit.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                            <a
                                href="/demo"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-blue-900 font-black text-xs uppercase tracking-wider hover:bg-blue-50 transition-all shadow-xl shadow-black/20 hover:scale-105"
                            >
                                Start 14-Day Free Trial
                            </a>
                            <a
                                href="/contact"
                                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-950/40 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-950/60 transition-all border border-white/20"
                            >
                                Book Free CA Consultation
                            </a>
                        </div>

                        {/* S-24: Trust Badges */}
                        <div className="flex flex-wrap justify-center items-center gap-5 pt-5 text-xs text-blue-200">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Direct NIC GSP Partner
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-300 font-bold">✓</span> Free Data Migration
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

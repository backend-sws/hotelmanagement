import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 25 Blog Article Sections
import ArticleHeroAndMetadata from './ArticleSections/ArticleHeroAndMetadata';
import ArticleBodyContentAndStatutoryAlerts from './ArticleSections/ArticleBodyContentAndStatutoryAlerts';
import CodePayloadAndTemplatesSection from './ArticleSections/CodePayloadAndTemplatesSection';
import InteractiveAudienceEngagement from './ArticleSections/InteractiveAudienceEngagement';
import RelatedArticlesAndAuthorFooter from './ArticleSections/RelatedArticlesAndAuthorFooter';
import ClosingArticleTrialCta from './ArticleSections/ClosingArticleTrialCta';

interface Props {
    slug?: string;
}

export default function BlogArticlePage({ slug = 'gstr-2b-reconciliation-guide' }: Props) {
    // Reading font size state
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

    // Article metadata mapping
    const articleMap: Record<string, { title: string; category: string; readTime: string; description: string }> = {
        'gstr-2b-reconciliation-guide': {
            title: "The Ultimate Guide to GSTR-2B Automated Reconciliation & Section 16(2)(aa) Defense in 2026",
            category: "GST & Statutory",
            readTime: "12 min read",
            description: "How Indian wholesalers and distributors are recovering up to ₹14.8 Lakhs in unclaimed Input Tax Credit and preventing ASMT-10 scrutiny notices."
        },
        'e-invoicing-nic-irp-mandate-guide': {
            title: "Step-by-Step Guide to NIC IRP E-Invoicing for Businesses with ₹5+ Cr Turnover",
            category: "GST & Statutory",
            readTime: "9 min read",
            description: "Statutory formula for 64-character IRN hashes, signed QR code payloads, and the 24-hour cancellation window on the government portal."
        },
        'whatsapp-green-tick-verification-guide-india': {
            title: "How to Get the Official WhatsApp Green Tick (OBA) for Your Business in 4 Simple Steps",
            category: "WhatsApp Commerce",
            readTime: "8 min read",
            description: "Complete guide on Meta Business Manager verification, trademark compliance, and press notability criteria for Indian MSMEs."
        }
    };

    const currentArticle = articleMap[slug] || {
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || "The Ultimate Guide to GSTR-2B Automated Reconciliation & Section 16(2)(aa) Defense in 2026",
        category: "GST & Statutory",
        readTime: "10 min read",
        description: "Authoritative practical playbook on indirect tax compliance, real-time inventory management, and cloud ERP execution."
    };

    return (
        <SiteLayout>
            <Head>
                <title>{`${currentArticle.title} | Nexus Insights`}</title>
                <meta name="description" content={currentArticle.description} />
                <meta name="keywords" content="GSTR-2B reconciliation guide, Section 16(2)(aa), Rule 36(4) 105% cap, ASMT-10 notice defense, ASMT-11 reply draft, input tax credit calculator" />
                <link rel="canonical" href={`https://nexusbilling.in/blog/${slug}`} />

                {/* OpenGraph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={currentArticle.title} />
                <meta property="og:description" content={currentArticle.description} />
                <meta property="og:image" content="/images/nexus-blog-og.jpg" />
                <meta property="og:url" content={`https://nexusbilling.in/blog/${slug}`} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={currentArticle.title} />
                <meta name="twitter:description" content={currentArticle.description} />
            </Head>

            {/* S-01 to S-05: Hero, Metadata, Author Badge, Share Toolbar & Executive Summary */}
            <ArticleHeroAndMetadata
                title={currentArticle.title}
                category={currentArticle.category}
                readTime={currentArticle.readTime}
                fontSize={fontSize}
                setFontSize={setFontSize}
            />

            {/* S-06 to S-10: Sticky TOC, Statutory Section 16 Analysis, Alert Box & Risk Calculator */}
            <ArticleBodyContentAndStatutoryAlerts fontSize={fontSize} />

            {/* S-11 to S-14: ASMT-11 Draft, JSON Payload Viewer, WhatsApp Template & Pitfalls */}
            <CodePayloadAndTemplatesSection />

            {/* S-15 to S-18: Interactive Poll, Downloadable XLSX, Rating & Advisory Callout */}
            <InteractiveAudienceEngagement />

            {/* S-19 to S-22: Detailed Author Bio, Related Guides, Comments & Newsletter Teaser */}
            <RelatedArticlesAndAuthorFooter />

            {/* S-23 to S-25: Closing Trial CTA, Trust Badges & JSON-LD Structured Data */}
            <ClosingArticleTrialCta
                title={currentArticle.title}
                description={currentArticle.description}
                slug={slug}
                datePublished="2026-09-15"
                author="Ananya Deshmukh, FCA"
            />
        </SiteLayout>
    );
}

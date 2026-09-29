import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 28 Blog Listing Sections
import BlogHeroAndFeaturedPicks from './BlogSections/BlogHeroAndFeaturedPicks';
import GstAndStatutoryGuidesGrid from './BlogSections/GstAndStatutoryGuidesGrid';
import RetailPosAndWholesaleGuides from './BlogSections/RetailPosAndWholesaleGuides';
import WhatsAppCommerceAndAiInnovation from './BlogSections/WhatsAppCommerceAndAiInnovation';
import CfoInsightsAndIndustryReports from './BlogSections/CfoInsightsAndIndustryReports';
import NewsletterFaqAndClosingCta from './BlogSections/NewsletterFaqAndClosingCta';

export default function BlogPage() {
    // Top-level shared search and category filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    return (
        <SiteLayout>
            <Head>
                <title>Nexus Insights Blog — GST Guides, Retail POS &amp; WhatsApp Commerce for Indian MSMEs</title>
                <meta
                    name="description"
                    content="Explore 85+ actionable guides, statutory tax playbooks, and cloud ERP strategies for Indian retailers, wholesalers, and manufacturers. Direct NIC E-Invoicing, GSTR-2B reconciliation, and WhatsApp sales."
                />
                <meta
                    name="keywords"
                    content="GST guides India, GSTR-2B reconciliation blog, e-invoicing NIC portal tutorial, retail POS management India, WhatsApp commerce catalog blog, Tally Prime accounting sync guide, Indian MSME working capital"
                />
                <link rel="canonical" href="https://nexusbilling.in/blog" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Nexus Insights Blog — MSME Growth, GST &amp; Cloud ERP Playbooks" />
                <meta
                    property="og:description"
                    content="Practical playbooks and statutory tax guides written by veteran Chartered Accountants and ERP systems engineers for Indian businesses."
                />
                <meta property="og:image" content="/images/nexus-blog-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/blog" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Insights — Knowledge Hub for Indian Commerce" />
                <meta
                    name="twitter:description"
                    content="Discover in-depth playbooks on GST compliance, retail supermarket billing, and WhatsApp in-chat commerce."
                />

                {/* Schema.org Blog & CollectionPage Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Blog',
                        'name': 'Nexus Insights Knowledge Hub',
                        'url': 'https://nexusbilling.in/blog',
                        'description': 'Authoritative tax playbooks, retail POS management guides, and WhatsApp conversational commerce tutorials for Indian MSMEs.',
                        'publisher': {
                            '@type': 'Organization',
                            'name': 'Nexus Billing Technologies Pvt Ltd',
                            'logo': 'https://nexusbilling.in/images/nexus-logo.png'
                        }
                    })}
                </script>
            </Head>

            {/* S-01 to S-05: Hero, Live Search, Category Switcher, Flagship Editorial & Trending Row */}
            <BlogHeroAndFeaturedPicks
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* S-06 to S-10: GST, E-Invoicing & Statutory Compliance Playbooks */}
            <GstAndStatutoryGuidesGrid
                searchQuery={searchQuery}
                activeCategory={activeCategory}
            />

            {/* S-11 to S-15: Retail POS & Wholesale Distribution Playbooks */}
            <RetailPosAndWholesaleGuides
                searchQuery={searchQuery}
                activeCategory={activeCategory}
            />

            {/* S-16 to S-20: WhatsApp Commerce & Practical AI Innovations */}
            <WhatsAppCommerceAndAiInnovation
                searchQuery={searchQuery}
                activeCategory={activeCategory}
            />

            {/* S-21 to S-24: CFO Insights, Working Capital Index & Master GST Checklist */}
            <CfoInsightsAndIndustryReports
                searchQuery={searchQuery}
                activeCategory={activeCategory}
            />

            {/* S-25 to S-28: Weekly Newsletter, Reader FAQs, Guest Contributor & Closing CTA */}
            <NewsletterFaqAndClosingCta />
        </SiteLayout>
    );
}

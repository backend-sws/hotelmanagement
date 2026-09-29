import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 30 About Us Sections
import AboutHeroAndMission from './AboutSections/AboutHeroAndMission';
import FoundersAndLeadership from './AboutSections/FoundersAndLeadership';
import EngineeringCultureAndTechStack from './AboutSections/EngineeringCultureAndTechStack';
import NationwideFootprintAndOffices from './AboutSections/NationwideFootprintAndOffices';
import WorkplaceCultureAndCareersBridge from './AboutSections/WorkplaceCultureAndCareersBridge';
import SocialImpactFaqAndClosing from './AboutSections/SocialImpactFaqAndClosing';

export default function AboutPage() {
    return (
        <SiteLayout>
            <Head>
                <title>About Nexus Billing — Building India&apos;s Most Dependable Cloud ERP &amp; POS Platform</title>
                <meta
                    name="description"
                    content="Learn how Nexus Billing is empowering 12,000+ Indian MSMEs across retail, wholesale, manufacturing, and services with real-time cloud sync, automated GST compliance, and AI-first business intelligence."
                />
                <meta
                    name="keywords"
                    content="about Nexus Billing, Indian cloud ERP founders, retail billing company Bangalore, GST software team India, cloud POS architecture, Indian MSME tech enabler"
                />
                <link rel="canonical" href="https://nexusbilling.in/about" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="About Nexus Billing — India's Most Dependable Cloud ERP" />
                <meta
                    property="og:description"
                    content="Founded in 2021 to replace clunky desktop software with high-throughput real-time cloud ERP for 63 million Indian MSMEs."
                />
                <meta property="og:image" content="/images/nexus-about-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/about" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About Nexus Billing — Empowering Indian Commerce" />
                <meta
                    name="twitter:description"
                    content="Discover the journey, engineering principles, and nationwide presence behind India's fastest growing cloud ERP platform."
                />

                {/* Schema.org Organization Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        'name': 'Nexus Billing Technologies Pvt Ltd',
                        'url': 'https://nexusbilling.in',
                        'logo': 'https://nexusbilling.in/images/nexus-logo.png',
                        'foundingDate': '2021',
                        'founders': [
                            {
                                '@type': 'Person',
                                'name': 'Arjun Mehta'
                            },
                            {
                                '@type': 'Person',
                                'name': 'Rohit Verma'
                            }
                        ],
                        'address': {
                            '@type': 'PostalAddress',
                            'streetAddress': 'Nexus Tower, 4th Block, Koramangala',
                            'addressLocality': 'Bengaluru',
                            'addressRegion': 'Karnataka',
                            'postalCode': '560034',
                            'addressCountry': 'IN'
                        },
                        'contactPoint': {
                            '@type': 'ContactPoint',
                            'telephone': '+91-747-949-9718',
                            'contactType': 'customer support',
                            'areaServed': 'IN',
                            'availableLanguage': ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu']
                        },
                        'sameAs': [
                            'https://twitter.com/nexusbilling',
                            'https://linkedin.com/company/nexusbilling'
                        ]
                    })}
                </script>
            </Head>

            {/* S-01 to S-05: Hero, Live Counters, Genesis & Guiding Values */}
            <AboutHeroAndMission />

            {/* S-06 to S-10: Founders, Executive Team, Philosophy & Open Letter */}
            <FoundersAndLeadership />

            {/* S-11 to S-15: Distributed Engineering, Zero Data Loss & System Architecture */}
            <EngineeringCultureAndTechStack />

            {/* S-16 to S-20: Nationwide Hubs, Bharat Impact & 2021-2026 Timeline */}
            <NationwideFootprintAndOffices />

            {/* S-21 to S-25: Culture, Inclusive Growth, Spotlights & Careers Bridge */}
            <WorkplaceCultureAndCareersBridge />

            {/* S-26 to S-30: Green Billing Impact, Data Ethics, FAQs & Closing CTA */}
            <SocialImpactFaqAndClosing />
        </SiteLayout>
    );
}

import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 35 WhatsApp Platform Sections
import WhatsAppHeroAndArchitecture from './WhatsAppSections/WhatsAppHeroAndArchitecture';
import InteractiveCommerceAndCatalog from './WhatsAppSections/InteractiveCommerceAndCatalog';
import PaymentDunningAndRecovery from './WhatsAppSections/PaymentDunningAndRecovery';
import FieldOpsAndStaffAutomation from './WhatsAppSections/FieldOpsAndStaffAutomation';
import BroadcastMarketingAndMetaPricing from './WhatsAppSections/BroadcastMarketingAndMetaPricing';
import WhatsAppSocialProofAndClosing from './WhatsAppSections/WhatsAppSocialProofAndClosing';

export default function WhatsAppFeaturesPage() {
    return (
        <SiteLayout>
            <Head>
                <title>WhatsApp Cloud API ERP &amp; Commerce Software India — Catalog, UPI &amp; Automation | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Meta WhatsApp Cloud API ERP platform. In-chat catalog ordering, automated payment dunning with dynamic UPI links, zero-app field technician dispatch, Gemini Vision AI photo verification, and transparent Meta utility/marketing pricing."
                />
                <meta
                    name="keywords"
                    content="WhatsApp commerce software India, Meta WhatsApp Cloud API billing, WhatsApp in-chat catalog, automated payment reminder WhatsApp, UPI payment link WhatsApp, zero-app field service WhatsApp, Gemini AI photo inspection WhatsApp, green tick verification India"
                />
                <link rel="canonical" href="https://nexusbilling.in/features/whatsapp" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="WhatsApp Cloud API ERP &amp; In-Chat Commerce Engine | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Turn WhatsApp into your primary sales, payment recovery, and staff dispatch command center with official Meta Cloud API direct integration."
                />
                <meta property="og:image" content="/images/nexus-whatsapp-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/features/whatsapp" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus WhatsApp ERP — Official Meta Cloud API Platform" />
                <meta
                    name="twitter:description"
                    content="Sell via native WhatsApp catalogs, collect dues via 1-tap dynamic UPI, and manage field technicians with zero app downloads."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus WhatsApp Cloud API & Commerce Platform',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'Conversational ERP and in-chat commerce software for Indian businesses powered by official Meta WhatsApp Cloud API featuring in-chat catalog ordering, 1-tap UPI payment links, zero-app technician dispatch, and automated khata dunning.',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'INR',
                            'description': '14-Day Free Trial with live WhatsApp bot testing'
                        },
                        'featureList': [
                            'Direct Meta Graph API Integration with 1,000 TPS Throughput',
                            'Official Business Account (OBA) Green Tick Verification Guidance',
                            'In-Chat Native Product Catalogs with Variant Selection and Cart Checkout',
                            'Instant 1-Tap Cart to Official GST Tax Invoice Generation',
                            'Customer Khata Ledger Balance PDF Statements on Demand',
                            'Automated Payment Dunning Escalation with Embedded Dynamic UPI Intent',
                            'Zero-App Field Technician Task Dispatch via WhatsApp Interactive Buttons',
                            'Google Gemini 1.5 Flash Vision AI Work Photo Proof Verification',
                            '50m Geofenced Staff Attendance and GPS Location Verification',
                            'Transparent Meta Conversation Pricing Billing (Utility, Marketing, Service)'
                        ]
                    })}
                </script>
            </Head>

            {/* Page Container */}
            <div className="min-h-screen bg-white">
                {/* 1. Hero, Meta Cloud Architecture, Metrics Ticker & Quick Nav (Sections 1-5) */}
                <WhatsAppHeroAndArchitecture />

                {/* 2. In-Chat Catalogs, Cart to Invoice & Abandoned Cart Recovery (Sections 6-11) */}
                <InteractiveCommerceAndCatalog />

                {/* 3. Smart Dunning Escalation, Dynamic UPI & DSO Calculator (Sections 12-17) */}
                <PaymentDunningAndRecovery />

                {/* 4. Zero-App FieldOps Dispatch, Gemini AI & Staff HR Bot (Sections 18-23) */}
                <FieldOpsAndStaffAutomation />

                {/* 5. Official Meta Rate Cards, Broadcasts & Team Inbox (Sections 24-29) */}
                <BroadcastMarketingAndMetaPricing />

                {/* 6. MSME Case Studies, ROI Calculator, FAQ & Closing CTA (Sections 30-35) */}
                <WhatsAppSocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

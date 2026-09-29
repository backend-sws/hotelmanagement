import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 30 Contact Sections
import ContactHeroAndDirectChannels from './ContactSections/ContactHeroAndDirectChannels';
import ComprehensiveInquiryForm from './ContactSections/ComprehensiveInquiryForm';
import NationwideOfficesAndMaps from './ContactSections/NationwideOfficesAndMaps';
import SupportSlaAndEscalationMatrix from './ContactSections/SupportSlaAndEscalationMatrix';
import CaAndPartnerInquiryBridge from './ContactSections/CaAndPartnerInquiryBridge';
import ContactFaqAndTrustClosing from './ContactSections/ContactFaqAndTrustClosing';

export default function ContactPage() {
    // Shared inquiry type state between Hero pill filter and Form
    const [selectedInquiryType, setSelectedInquiryType] = useState('demo');

    return (
        <SiteLayout>
            <Head>
                <title>Contact Nexus Billing — Phone, WhatsApp &amp; Regional Office Support Hub</title>
                <meta
                    name="description"
                    content="Get in touch with Nexus Billing specialists. Call +91 747 949 9718, chat on WhatsApp, or visit our regional offices in Bengaluru, Mumbai, Delhi, Surat &amp; Hyderabad. Sub-3-minute response time in 6 Indian languages."
                />
                <meta
                    name="keywords"
                    content="contact Nexus Billing, cloud POS support India, GST billing software phone number, retail ERP support Bangalore, Tally sync help desk, WhatsApp billing support"
                />
                <link rel="canonical" href="https://nexusbilling.in/contact" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Contact Nexus Billing — 7-Day Multilingual Support &amp; Regional Offices" />
                <meta
                    property="og:description"
                    content="Speak directly with our cloud ERP engineers, retail POS technicians, and Chartered Accountants across India."
                />
                <meta property="og:image" content="/images/nexus-contact-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/contact" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Nexus Billing — Phone &amp; WhatsApp Support" />
                <meta
                    name="twitter:description"
                    content="Connect with our dedicated ERP specialists 7 days a week. Average first response time: 2 minutes 45 seconds."
                />

                {/* Schema.org ContactPage & Organization Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ContactPage',
                        'name': 'Nexus Billing Contact & Support Hub',
                        'url': 'https://nexusbilling.in/contact',
                        'description': 'Customer support desk, phone lines, WhatsApp direct chat, and regional offices for Nexus Billing Technologies Pvt Ltd.',
                        'mainEntity': {
                            '@type': 'Organization',
                            'name': 'Nexus Billing Technologies Pvt Ltd',
                            'telephone': '+91-747-949-9718',
                            'email': 'support@nexusbilling.in',
                            'contactPoint': [
                                {
                                    '@type': 'ContactPoint',
                                    'telephone': '+91-747-949-9718',
                                    'contactType': 'customer support',
                                    'areaServed': 'IN',
                                    'availableLanguage': ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu']
                                },
                                {
                                    '@type': 'ContactPoint',
                                    'telephone': '+91-747-949-9718',
                                    'contactType': 'emergency POS counter support',
                                    'areaServed': 'IN'
                                }
                            ]
                        }
                    })}
                </script>
            </Head>

            {/* S-01 to S-05: Hero, Direct Phone/WhatsApp Strip, Languages & Inquiry Filter */}
            <ContactHeroAndDirectChannels
                selectedInquiryType={selectedInquiryType}
                setSelectedInquiryType={setSelectedInquiryType}
            />

            {/* S-06 to S-10: Smart Lead Inquiry Form, GSTIN Autofill & Callback Scheduler */}
            <ComprehensiveInquiryForm
                selectedInquiryType={selectedInquiryType}
            />

            {/* S-11 to S-15: Nationwide Regional Offices, Addresses & Phone Desks */}
            <NationwideOfficesAndMaps />

            {/* S-16 to S-20: Support SLAs, 3-Tier Escalation Ladder & Emergency SOS Hotline */}
            <SupportSlaAndEscalationMatrix />

            {/* S-21 to S-25: CA Priority Desk, POS Hardware Certification Lab & RFP Inquiries */}
            <CaAndPartnerInquiryBridge />

            {/* S-26 to S-30: Support FAQs, Statutory Corporate Details, CIN & Closing CTA */}
            <ContactFaqAndTrustClosing />
        </SiteLayout>
    );
}

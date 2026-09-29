import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 38 Field Services & FieldOps Sections
import FieldOpsHeroAndFormats from '../FieldOpsSections/FieldOpsHeroAndFormats';
import WhatsAppDispatchAndJobCards from '../FieldOpsSections/WhatsAppDispatchAndJobCards';
import GpsTrackingAndTaDaEngine from '../FieldOpsSections/GpsTrackingAndTaDaEngine';
import GeminiAiVisionProofAndVanStock from '../FieldOpsSections/GeminiAiVisionProofAndVanStock';
import AmcContractsAndBilling from '../FieldOpsSections/AmcContractsAndBilling';
import FieldOpsSocialProofAndClosing from '../FieldOpsSections/FieldOpsSocialProofAndClosing';

export default function FieldServicesPage() {
    const [selectedFormat, setSelectedFormat] = useState('hvac');

    return (
        <SiteLayout>
            <Head>
                <title>Field Service &amp; FieldOps ERP Software India — WhatsApp Job Cards &amp; GPS Radar | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 WhatsApp-native Field Service Management ERP. Dispatch jobs via WhatsApp bots, track technicians on live GPS radar, prevent fake TA/DA travel claims, audit repairs with Gemini 1.5 Flash Vision AI, track mobile van stock, and automate AMC renewals with UPI payment links."
                />
                <meta
                    name="keywords"
                    content="field service management software India, WhatsApp job card software, field technician GPS tracking, automated TA DA travel allowance calculator, HVAC AMC billing software, RO service software, Gemini AI photo repair verification, mobile van stock inventory, geofenced technician punch-in, SAC 9987 GST invoice"
                />
                <link rel="canonical" href="https://nexusbilling.in/solutions/field-services" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Field Service Management &amp; WhatsApp FieldOps ERP | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Zero-app technician dispatch via official Meta WhatsApp Cloud API. Background GPS tracking, Gemini AI photo inspection, mobile van stock, and automated AMC renewal."
                />
                <meta property="og:image" content="/images/nexus-fieldops-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/solutions/field-services" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus FieldOps ERP — WhatsApp Dispatch &amp; Live Technician Radar" />
                <meta
                    name="twitter:description"
                    content="Eliminate fake odometer travel claims and unbilled parts. 100% Real-Time Cloud Sync with Google Gemini AI photo proof and instant SAC 9987 invoicing."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus Field Services & FieldOps ERP',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'Field Service Management (FSM) software for Indian HVAC, RO, solar, electrical, and appliance service companies featuring WhatsApp bot dispatch, live technician GPS radar, Gemini Vision AI photo verification, mobile van inventory, and automated AMC contracts.',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'INR',
                            'description': '14-Day Free Trial with live WhatsApp bot testing'
                        },
                        'featureList': [
                            'Official Meta WhatsApp Cloud API Job Dispatch with Zero App Installation',
                            'Live Background GPS Technician Radar and 50m Geofenced Punch-in',
                            'Automated Road Kilometers TA/DA Travel Allowance Engine',
                            'Google Gemini 1.5 Flash Vision AI Work Photo Proof & Duplicate Image Detector',
                            'Mobile Van and Bike Bag Sub-Warehouse Stock Inventory Management',
                            'Damaged Scrap & Replaced Compressor Part Return Pipeline',
                            'Comprehensive & Labor-Only AMC Lifecycle with Automated WhatsApp Dunning',
                            'Equipment Weatherproof QR Code Sticker and Digital Service Cards',
                            'Live Technician Incentive and Commission Ledger',
                            'Tally Prime Cloud Sync & SAC 9987 18% Dual-Rate GST Invoicing'
                        ]
                    })}
                </script>
            </Head>

            {/* Page Container */}
            <div className="min-h-screen bg-white">
                {/* 1. Hero, 6 Industry Formats, Metrics Ticker & Quick Nav (Sections 1-4) */}
                <FieldOpsHeroAndFormats
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                />

                {/* 2. WhatsApp Bot Dispatch, Digital Job Cards & SLA Escalations (Sections 5-11) */}
                <WhatsAppDispatchAndJobCards />

                {/* 3. Live GPS Radar, 50m Geofenced Punch-In & TA/DA Engine (Sections 12-18) */}
                <GpsTrackingAndTaDaEngine />

                {/* 4. Gemini 1.5 Flash Vision AI Proof & Mobile Van Stock (Sections 19-26) */}
                <GeminiAiVisionProofAndVanStock />

                {/* 5. AMC Lifecycle, WhatsApp Dunning & SAC 9987 Invoicing (Sections 27-32) */}
                <AmcContractsAndBilling />

                {/* 6. Case Studies, ROI Calculator, Bot Tester, FAQ & Closing CTA (Sections 33-38) */}
                <FieldOpsSocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 5 Modular Components covering all 35 Wholesale Sections
import WholesaleHeroAndFormats from '../WholesaleSections/WholesaleHeroAndFormats';
import B2bPricingAndCatalog from '../WholesaleSections/B2bPricingAndCatalog';
import CreditKhataAndReceivables from '../WholesaleSections/CreditKhataAndReceivables';
import GodownLogisticsAndDispatch from '../WholesaleSections/GodownLogisticsAndDispatch';
import WholesaleOperationsAndGst from '../WholesaleSections/WholesaleOperationsAndGst';
import WholesaleSocialProofAndClosing from '../WholesaleSections/WholesaleSocialProofAndClosing';

export default function WholesalePage() {
    const [selectedFormat, setSelectedFormat] = useState('fmcg');

    return (
        <SiteLayout>
            <Head>
                <title>B2B Wholesale &amp; Distribution ERP Software — Slab Pricing &amp; E-Way Bills | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Cloud B2B Wholesale ERP for FMCG, textiles, pharma, and hardware stockists. Tiered slab pricing, party credit aging radar, automated NIC E-Way bills, multi-godown stock transfers, and Tally Prime sync."
                />
                <meta
                    name="keywords"
                    content="wholesale billing software India, B2B distribution ERP, FMCG superstockist software, textile thaan billing, party credit khata radar, automated E-Way bill software, multi godown stock transfer, Tally Prime wholesale sync, broker dalali ledger"
                />
                <link rel="canonical" href="https://nexusbilling.in/solutions/wholesale" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="B2B Wholesale &amp; Distribution Cloud ERP | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Automate tier slab pricing, customer credit limits, 0.4s NIC E-Way bills, and multi-godown stock transfers with 100% real-time cloud sync."
                />
                <meta property="og:image" content="/images/nexus-wholesale-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/solutions/wholesale" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Wholesale ERP — India's Fastest B2B Billing Software" />
                <meta
                    name="twitter:description"
                    content="Reduce receivables collection by 12 days, eliminate dead stock with FEFO, and sync with Tally Prime seamlessly."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus Wholesale & Distribution ERP',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'Cloud B2B ERP for Indian wholesalers, FMCG superstockists, textile traders, and distributors with tiered slab pricing, party credit limits, automated NIC E-Way bills, and multi-godown stock transfers.',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'INR',
                            'availability': 'https://schema.org/InStock',
                        },
                        'publisher': {
                            '@type': 'Organization',
                            'name': 'Nexus Billing Technologies',
                            'url': 'https://nexusbilling.in',
                        },
                    })}
                </script>
            </Head>

            <div className="relative bg-white text-slate-900">
                {/* Sections 1 to 4: Wholesale Hero, 6 B2B Verticals, Live Ticker & Quick Nav */}
                <WholesaleHeroAndFormats 
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                />

                {/* Sections 5 to 11: Tiered Slab Pricing, Grade Contracts, Case Conversions & Broker Ledger */}
                <B2bPricingAndCatalog />

                {/* Sections 12 to 18: Party Credit Aging Radar, WhatsApp Dunning, PDC Vault & Running Khata */}
                <CreditKhataAndReceivables />

                {/* Sections 19 to 26: Multi-Godown STN, Direct NIC E-Way Bills, FEFO & LR Transporter */}
                <GodownLogisticsAndDispatch />

                {/* Sections 27 to 31: High-Volume E-Invoicing, 2-Way Tally Prime Sync, MIS & GSTR-1 */}
                <WholesaleOperationsAndGst />

                {/* Sections 32 to 35: Distributor Case Studies, Working Capital ROI Calculator, FAQs & Closing CTA */}
                <WholesaleSocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

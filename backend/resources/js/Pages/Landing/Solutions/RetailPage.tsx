import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 36 Retail Sections
import RetailHeroAndFormats from '../RetailSections/RetailHeroAndFormats';
import PosAndCheckoutExperience from '../RetailSections/PosAndCheckoutExperience';
import { InventoryAndVariants } from '../RetailSections/InventoryAndVariants';
import { CustomerLoyaltyAndPromotions } from '../RetailSections/CustomerLoyaltyAndPromotions';
import { OperationsSecurityAndGst } from '../RetailSections/OperationsSecurityAndGst';
import { RetailSocialProofAndClosing } from '../RetailSections/RetailSocialProofAndClosing';

export default function RetailPage() {
    const [selectedFormat, setSelectedFormat] = useState('supermarket');

    return (
        <SiteLayout>
            <Head>
                <title>Retail POS &amp; Supermarket ERP Software — 0.3s Barcode Billing | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Retail POS system for supermarkets, grocery, apparel, and chemists. Real-Time Cloud POS billing, RS232 weighing scale sync, size-color variant matrix, IMEI tracking, and WhatsApp receipts."
                />
                <meta
                    name="keywords"
                    content="retail POS software India, supermarket billing software, grocery barcode billing, apparel size color matrix, weighing scale POS integration, cloud POS billing software, chemist pharmacy software, GSTR-1 B2CS retail"
                />
                <link rel="canonical" href="https://nexusbilling.in/solutions/retail" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Retail POS &amp; Supermarket Cloud ERP | Nexus Billing" />
                <meta
                    property="og:description"
                    content="0.3-second barcode checkout, real-time cloud POS, RS232 weighing scales, apparel 2D variant matrix, and automated WhatsApp paperless receipts."
                />
                <meta property="og:image" content="/images/nexus-retail-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/solutions/retail" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Retail POS — India's Fastest Billing ERP" />
                <meta
                    name="twitter:description"
                    content="Eliminate checkout queues, stop inventory shrinkage, and send WhatsApp UPI bills effortlessly."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus Retail POS & ERP',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'High-speed retail POS software for Indian supermarkets, apparel, pharmacy, and grocery stores with real-time cloud billing, barcode scanning, and RS232 weighing scale sync.',
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
                {/* Sections 1 & 2: Retail Hero & 6 Segment Format Switcher */}
                <RetailHeroAndFormats 
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                />

                {/* Sections 3 to 11: Barcode POS & Lightning Checkout Experience */}
                <PosAndCheckoutExperience />

                {/* Sections 12 to 17: Multi-Location Godown & Size/Color/IMEI Matrix */}
                <InventoryAndVariants />

                {/* Sections 18 to 23: Customer Loyalty, Digital Khata & Cash Reconciliation */}
                <CustomerLoyaltyAndPromotions />

                {/* Sections 24 to 32: Geofenced Attendance, Theft RBAC, MIS & Tally Sync */}
                <OperationsSecurityAndGst />

                {/* Sections 33 to 36: Customer Impact Studies, FAQs, ROI Calculator & Closing Ribbon */}
                <RetailSocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

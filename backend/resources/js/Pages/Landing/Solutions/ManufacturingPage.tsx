import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 33 Manufacturing & Job Work Sections
import ManufacturingHeroAndFormats from '../ManufacturingSections/ManufacturingHeroAndFormats';
import MultiLevelBomAndWorkOrders from '../ManufacturingSections/MultiLevelBomAndWorkOrders';
import GstJobWorkAndSubcontracting from '../ManufacturingSections/GstJobWorkAndSubcontracting';
import BatchTrackingAndMachineOee from '../ManufacturingSections/BatchTrackingAndMachineOee';
import QualityControlAndLandedCosting from '../ManufacturingSections/QualityControlAndLandedCosting';
import ManufacturingSocialProofAndClosing from '../ManufacturingSections/ManufacturingSocialProofAndClosing';

export default function ManufacturingPage() {
    const [selectedFormat, setSelectedFormat] = useState('automotive');

    return (
        <SiteLayout>
            <Head>
                <title>Manufacturing ERP &amp; Job Work Software India — Multi-Level BOM &amp; Shop Floor | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Cloud Manufacturing ERP for MSMEs. Multi-level Bill of Materials (BOM), shop floor work orders, Job Work under GST Section 143 (ITC-04), batch heat tracking, machine OEE, and landed cost estimation."
                />
                <meta
                    name="keywords"
                    content="manufacturing ERP software India, job work software GST Section 143, Form GST ITC-04 filing software, multi-level BOM software, shop floor routing, machine OEE tracker, CNC job work billing, steel mill heat number traceability, manufacturing journal Tally Prime"
                />
                <link rel="canonical" href="https://nexusbilling.in/solutions/manufacturing" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Manufacturing ERP &amp; Job Work Cloud Platform | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Master multi-level BOMs, shop floor router cards, GST Rule 55 delivery challans, and 180-day subcontracting aging clocks in one real-time cloud ERP."
                />
                <meta property="og:image" content="/images/nexus-manufacturing-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/solutions/manufacturing" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Manufacturing ERP — Multi-Level BOM &amp; Shop Floor Routing" />
                <meta
                    name="twitter:description"
                    content="Eliminate unreturned job work scrap and underpriced manufacturing jobs. 100% Real-Time Cloud Sync with Form GST ITC-04 export and Tally Prime sync."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus Manufacturing & Job Work ERP',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'Cloud Manufacturing ERP and Subcontracting Job Work software for Indian MSMEs featuring multi-level BOMs, shop floor routing, GST Section 143 aging tracking, Form GST ITC-04 auto-filing, machine OEE monitoring, and true landed costing.',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'INR',
                            'description': '14-Day Free Trial with full BOM & Job Work features'
                        },
                        'featureList': [
                            'Multi-Level Bill of Materials (BOM) Tree with Scrap & By-Product Recovery',
                            'Sequential Shop Floor Routing with Work Center Setup & Cycle Times',
                            'GST Rule 55 Delivery Challans with SAC 9988 Coding for Subcontracting',
                            'GST Section 143 180-Day Input & 3-Year Capital Goods Aging Clock',
                            '1-Click Quarterly Form GST ITC-04 Government JSON Export',
                            'Steel Mill Heat Number & Batch Lot Backward/Forward Traceability',
                            'Machine Availability x Performance x Quality Overall Equipment Effectiveness (OEE)',
                            'Shop Floor Router Job Traveler Barcode / QR Scanning',
                            'Three-Stage QC Gateway (GRN Inward, In-Process Line, Pre-Dispatch PDI)',
                            'Two-Way Tally Prime Manufacturing Journals and Stock Transfer Sync'
                        ]
                    })}
                </script>
            </Head>

            {/* Page Container */}
            <div className="min-h-screen bg-white">
                {/* 1. Hero, 6 Industry Formats, Metrics Ticker & Quick Nav (Sections 1-4) */}
                <ManufacturingHeroAndFormats
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                />

                {/* 2. Multi-Level BOM, Shop Routing & Material Reservation (Sections 5-10) */}
                <MultiLevelBomAndWorkOrders />

                {/* 3. GST Section 143 Job Work, Aging Clock & ITC-04 Engine (Sections 11-16) */}
                <GstJobWorkAndSubcontracting />

                {/* 4. Heat Number Traceability, Machine OEE & Shop Barcodes (Sections 17-22) */}
                <BatchTrackingAndMachineOee />

                {/* 5. 3-Stage QC Gateways, Landed Costing & Tally Prime Bridge (Sections 23-28) */}
                <QualityControlAndLandedCosting />

                {/* 6. MSME Case Studies, Scrap ROI Calculator, FAQ & Closing CTA (Sections 29-33) */}
                <ManufacturingSocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

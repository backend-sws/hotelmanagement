import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 32 GST Compliance Hub Sections
import GstHeroAndArchitecture from './GstSections/GstHeroAndArchitecture';
import EInvoicingAndEWayBillEngine from './GstSections/EInvoicingAndEWayBillEngine';
import Gstr2bReconciliationAndItc from './GstSections/Gstr2bReconciliationAndItc';
import HsnFinderAndMultiRateTax from './GstSections/HsnFinderAndMultiRateTax';
import TallyGstSyncAndAuditPack from './GstSections/TallyGstSyncAndAuditPack';
import GstSocialProofAndClosing from './GstSections/GstSocialProofAndClosing';

export default function GstCompliancePage() {
    return (
        <SiteLayout>
            <Head>
                <title>GST Billing Software &amp; E-Invoicing Platform India — GSTR-1, 2B, 3B &amp; E-Way Bill | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Automated GST Compliance &amp; E-Invoicing Cloud ERP. Direct NIC IRP E-Invoicing, automated GSTR-2B vs Purchase Book reconciliation, 1-click E-Way Bills, GSTR-1/3B JSON export, and instant GSTIN validation."
                />
                <meta
                    name="keywords"
                    content="GST billing software India, e-invoicing software NIC IRP, automated GSTR-2B reconciliation, e-way bill generation software, GSTR-1 JSON export, Rule 36(4) ITC claim cap, HSN code finder India, Tally Prime GST sync, ASMT-10 audit defense"
                />
                <link rel="canonical" href="https://nexusbilling.in/features/gst" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="GST Billing Software &amp; E-Invoicing Platform India | Nexus Billing" />
                <meta
                    property="og:description"
                    content="100% compliant Indian GST ERP. Direct NIC IRP E-Invoicing in under 200ms, automated 2-way GSTR-2B reconciliation, 1-click E-Way Bills, and Tally Prime sync."
                />
                <meta property="og:image" content="/images/nexus-gst-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/features/gst" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus GST &amp; E-Invoicing ERP — Direct NIC IRP Connected" />
                <meta
                    name="twitter:description"
                    content="Generate compliant B2B E-Invoices with authentic QR codes, match GSTR-2B credits, and sync directly with Tally Prime."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus GST Compliance & E-Invoicing Cloud ERP',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'End-to-end automated GST compliance and e-invoicing cloud software for Indian businesses. Direct government IRP connection, automated GSTR-2B vs purchase reconciliation, 1-click E-Way bill dispatch, and two-way Tally Prime bridge.',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                            'priceCurrency': 'INR',
                            'description': '14-Day Free Trial with live NIC sandbox and GSTR-2B health audit'
                        },
                        'featureList': [
                            'Direct NIC IRP E-Invoicing with Signed 64-char IRN & QR Code in <200ms',
                            'Automated GSTR-2B vs Purchase Book 2-Way Reconciliation with Defaulter Vendor WhatsApp Alerts',
                            '1-Click Pin-to-Pin Distance Calculated E-Way Bill Generation & Transshipment Updates',
                            '15,000+ HSN and SAC Code Library with Multi-Rate GST Slabs (0%, 5%, 12%, 18%, 28%)',
                            'Statutory Rule 36(4) 105% ITC Capping & Section 16(2)(aa) Compliance Guard',
                            'Two-Way Tally Prime & Tally.ERP 9 XML/ODBC Accounting Synchronization',
                            'Annual Form GSTR-9 and GSTR-9C Audit Pack Generator for Chartered Accountants',
                            'ASMT-10 & DRC-01 Department Notice Audit Defense Dossier Generator'
                        ]
                    })}
                </script>
            </Head>

            {/* S-01 to S-05: Hero & Statutory Architecture */}
            <GstHeroAndArchitecture />

            {/* S-06 to S-10: Direct IRP E-Invoicing & E-Way Bill Engine */}
            <EInvoicingAndEWayBillEngine />

            {/* S-11 to S-16: Automated GSTR-2B Reconciliation & ITC Protection */}
            <Gstr2bReconciliationAndItc />

            {/* S-17 to S-21: 15,000+ HSN Finder & Multi-Rate Tax Bifurcation */}
            <HsnFinderAndMultiRateTax />

            {/* S-22 to S-26: Two-Way Tally Prime Sync & GSTR-9 Audit Defense */}
            <TallyGstSyncAndAuditPack />

            {/* S-27 to S-32: Case Studies, Calculator, FAQ & CA Partner Program */}
            <GstSocialProofAndClosing />
        </SiteLayout>
    );
}

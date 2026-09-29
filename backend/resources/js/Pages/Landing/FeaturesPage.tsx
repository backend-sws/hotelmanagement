import { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// Modular Sections for FeaturesPage (34 Sections)
import FeaturesHeroAndNav from './FeaturesSections/FeaturesHeroAndNav';
import GstAndInvoicingDeepDive from './FeaturesSections/GstAndInvoicingDeepDive';
import AutomationAndReminders from './FeaturesSections/AutomationAndReminders';
import PosAndOfflineEngine from './FeaturesSections/PosAndOfflineEngine';
import InventoryAndSupplyChain from './FeaturesSections/InventoryAndSupplyChain';
import HrPayrollAttendance from './FeaturesSections/HrPayrollAttendance';
import FieldOpsAndAiSection from './FeaturesSections/FieldOpsAndAiSection';
import HospitalityAndRestaurant from './FeaturesSections/HospitalityAndRestaurant';
import FinancialLedgerAndReports from './FeaturesSections/FinancialLedgerAndReports';
import SecurityApiAndRoadmap from './FeaturesSections/SecurityApiAndRoadmap';

export default function FeaturesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeNav, setActiveNav] = useState('gst-billing');

    const handleNavClick = (navId: string) => {
        setActiveNav(navId);
        const element = document.getElementById(navId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCategorySelect = (catId: string) => {
        setSelectedCategory(catId);
        // Map category to relevant section ID
        const categoryAnchorMap: Record<string, string> = {
            billing: 'gst-billing',
            pos: 'retail-pos',
            inventory: 'inventory-po',
            hr: 'hr-payroll',
            fieldops: 'fieldops-ai',
            hospitality: 'hospitality',
            reports: 'finance-reports',
            security: 'security-api',
        };

        if (categoryAnchorMap[catId]) {
            handleNavClick(categoryAnchorMap[catId]);
        }
    };

    return (
        <SiteLayout>
            <Head>
                <title>All Features — GST Billing, POS, WhatsApp, HR, FieldOps | Nexus Billing</title>
                <meta
                    name="description"
                    content="Explore every feature: GST e-Invoice, barcode POS, WhatsApp invoicing, multi-godown inventory, HR payroll, WhatsApp bot geo-attendance, Gemini AI proof, hotel PMS."
                />
                <meta
                    name="keywords"
                    content="GST billing features, e-invoicing software, barcode POS features, WhatsApp automated billing, godown inventory software, field service GPS tracking, restaurant KOT POS, hotel PMS software"
                />
                <link rel="canonical" href="https://nexusbilling.in/features" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="All Features — GST Billing, POS, WhatsApp, HR, FieldOps | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Explore 34 enterprise modules in Nexus: 1-click IRN, thermal POS, WhatsApp bot punch, Gemini AI photo verification, and hotel PMS."
                />
                <meta property="og:image" content="/images/nexus-og-cover.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/features" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Billing — 34 Enterprise Features" />
                <meta
                    name="twitter:description"
                    content="Zero bloat. Zero per-invoice taxes. Everything you need from retail checkout to field operations."
                />

                {/* JSON-LD Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        'name': 'Nexus Billing All Features',
                        'description': '34 enterprise modules for billing, POS, inventory, HR, fieldops, and hospitality',
                        'publisher': {
                            '@type': 'Organization',
                            'name': 'Nexus Billing Technologies',
                            'url': 'https://nexusbilling.in',
                        },
                    })}
                </script>
            </Head>

            <div className="relative">
                {/* Section 1 & 2: Features Hero & Sticky Nav Jump */}
                <FeaturesHeroAndNav
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                    activeNav={activeNav}
                    onNavClick={handleNavClick}
                />

                {/* Section 3 - 6: GST Billing Deep-Dive & Invoicing Studio */}
                <GstAndInvoicingDeepDive />

                {/* Section 7 - 9: WhatsApp Automation & Multi-Company */}
                <AutomationAndReminders />

                {/* Section 10 - 11: High Volume POS & Real-Time Cloud Engine */}
                <PosAndOfflineEngine />

                {/* Section 12 - 14: Multi-Godown Inventory & Procurement Chain */}
                <InventoryAndSupplyChain />

                {/* Section 15 - 18: HR, Attendance, Leave & Indian Payroll */}
                <HrPayrollAttendance />

                {/* Section 19 - 22: FieldOps, TA/DA GPS & Google Gemini Vision AI */}
                <FieldOpsAndAiSection />

                {/* Section 23 - 24: Hotel PMS & Restaurant Table POS */}
                <HospitalityAndRestaurant />

                {/* Section 25 - 29: Party Ledgers, 40+ MIS Reports, Cheque & BOQ */}
                <FinancialLedgerAndReports />

                {/* Section 30 - 34: REST APIs, RBAC, CA Pack, Public Roadmap & Closing CTA */}
                <SecurityApiAndRoadmap />
            </div>
        </SiteLayout>
    );
}

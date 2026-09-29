import { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// Modular Sections for PricingPage (32 Sections)
import PricingHeroAndCards from './PricingSections/PricingHeroAndCards';
import PlanWizardAndRoi from './PricingSections/PlanWizardAndRoi';
import FeatureMatrixAndHardware from './PricingSections/FeatureMatrixAndHardware';
import DiscountsAndPerks from './PricingSections/DiscountsAndPerks';
import EnterpriseAndSocialProof from './PricingSections/EnterpriseAndSocialProof';
import FaqAndClosingPricing from './PricingSections/FaqAndClosingPricing';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features?: Record<string, any>;
}

interface PricingPageProps {
    plans?: Plan[];
}

export default function PricingPage({ plans = [] }: PricingPageProps) {
    const [isAnnual, setIsAnnual] = useState<boolean>(true); // Annual default for 20% discount benefit

    return (
        <SiteLayout>
            <Head>
                <title>Transparent Pricing Plans — GST Billing, POS &amp; WhatsApp ERP | Nexus Billing</title>
                <meta
                    name="description"
                    content="Simple, transparent pricing starting at ₹999/mo. Zero per-invoice fees, free NIC e-Invoicing, thermal POS, WhatsApp automation &amp; HR payroll. Compare plans and start 14-day free trial."
                />
                <meta
                    name="keywords"
                    content="GST billing software pricing, cloud POS cost India, WhatsApp billing price, e-invoice software plans, accounting software pricing India, Tally alternative price"
                />
                <link rel="canonical" href="https://nexusbilling.in/pricing" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Transparent Pricing Plans | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Zero per-invoice penalties. Starting at ₹999/mo with 2 months free on annual plans. Compare all 34 features."
                />
                <meta property="og:image" content="/images/nexus-og-cover.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/pricing" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Billing Pricing — Simple, Transparent SaaS" />
                <meta
                    name="twitter:description"
                    content="All features included. No per-bill charges. 14-day free trial."
                />

                {/* JSON-LD Schema: Product + AggregateOffer */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        'name': 'Nexus Billing Software Plans',
                        'description': 'Cloud GST billing, barcode POS, WhatsApp automation, and HR payroll SaaS',
                        'offers': {
                            '@type': 'AggregateOffer',
                            'priceCurrency': 'INR',
                            'lowPrice': '999',
                            'highPrice': '3999',
                            'offerCount': '3',
                        },
                    })}
                </script>
            </Head>

            <div className="relative">
                {/* Sections 1 to 4: Hero, Billing Toggle, 3 Primary Cards, Trust Strip */}
                <PricingHeroAndCards
                    plans={plans}
                    isAnnual={isAnnual}
                    onToggleBilling={setIsAnnual}
                />

                {/* Sections 5 to 7: Addons, 3-Step Plan Chooser Wizard, TCO Calculator */}
                <PlanWizardAndRoi />

                {/* Sections 8 to 11: 8-Category Feature Matrix, Hardware, 18% ITC, No Hidden Fees */}
                <FeatureMatrixAndHardware />

                {/* Sections 12 to 16: MSME Discount, Annual Perks, Trial Timeline, Migration, Payment Methods */}
                <DiscountsAndPerks />

                {/* Sections 17 to 21: 30D Money Back, Enterprise Custom Tier, ROI Testimonials, Competitor Cost */}
                <EnterpriseAndSocialProof />

                {/* Sections 22 to 32: Pricing FAQs, Referral, Free CA Seat, Live ROI Simulator, Closing CTA */}
                <FaqAndClosingPricing />
            </div>
        </SiteLayout>
    );
}

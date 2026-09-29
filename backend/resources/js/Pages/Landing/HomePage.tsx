import { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';
import VideoModal from '@/Components/Site/VideoModal';

// 38-Section Modular Architecture
import HeroSection from './Sections/HeroSection';
import PainAndSolutionSection from './Sections/PainAndSolutionSection';
import CoreFeaturesAndDashboard from './Sections/CoreFeaturesAndDashboard';
import DeepDivesSection from './Sections/DeepDivesSection';
import FieldOpsAndHRSection from './Sections/FieldOpsAndHRSection';
import ReportingAndIndustrySection from './Sections/ReportingAndIndustrySection';
import CalculatorAndPricingSection from './Sections/CalculatorAndPricingSection';
import SocialProofAndComparisonSection from './Sections/SocialProofAndComparisonSection';
import AiAndTechSection from './Sections/AiAndTechSection';
import InteractiveBotAndDemoSection from './Sections/InteractiveBotAndDemoSection';
import FaqAndClosingSection from './Sections/FaqAndClosingSection';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features?: string[];
}

interface Props {
    plans?: Plan[];
}

export default function HomePage({ plans = [] }: Props) {
    const [demoModalOpen, setDemoModalOpen] = useState(false);

    return (
        <SiteLayout>
            <Head>
                <title>NexusBilling — India's #1 Cloud GST Billing, Invoicing &amp; WhatsApp FieldOps SaaS</title>
                <meta
                    name="description"
                    content="Automate GST billing, WhatsApp invoicing, barcode POS, multi-godown inventory, staff attendance, and field engineer management with AI-powered verification. Start free 14-day trial."
                />
                <meta
                    name="keywords"
                    content="GST billing software India, cloud billing SaaS, WhatsApp invoicing, barcode POS software, field operations attendance, hotel PMS billing, Tally alternative, e-invoice IRN generator"
                />
                <link rel="canonical" href="https://nexusbilling.in/" />

                {/* OpenGraph / Social Metadata */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="NexusBilling — India's #1 Cloud GST Billing &amp; FieldOps SaaS" />
                <meta
                    property="og:description"
                    content="1-click WhatsApp invoicing, GST e-invoices, barcode POS, multi-godown inventory &amp; AI-verified attendance."
                />
                <meta property="og:image" content="/images/nexus-og-cover.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="NexusBilling — Cloud GST Billing &amp; WhatsApp FieldOps" />
                <meta
                    name="twitter:description"
                    content="One unified cloud platform for GST billing, barcode POS, inventory, HR attendance, and WhatsApp automation."
                />

                {/* JSON-LD Schema: SoftwareApplication + Organization */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'NexusBilling',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'All (Web, PWA, iOS, Android, Windows, Mac)',
                        'offers': {
                            '@type': 'AggregateOffer',
                            'priceCurrency': 'INR',
                            'lowPrice': '999',
                            'highPrice': '3999',
                        },
                        'aggregateRating': {
                            '@type': 'AggregateRating',
                            'ratingValue': '4.9',
                            'ratingCount': '2480',
                        },
                    })}
                </script>
            </Head>

            {/* Main Page Body with all 38 Sections */}
            <div className="relative">
                {/* S-01 to S-03 */}
                <HeroSection onWatchDemo={() => setDemoModalOpen(true)} />

                {/* S-04 to S-05 */}
                <PainAndSolutionSection />

                {/* S-06 to S-07 */}
                <CoreFeaturesAndDashboard />

                {/* S-08 to S-11 */}
                <DeepDivesSection />

                {/* S-12 to S-14 */}
                <FieldOpsAndHRSection />

                {/* S-15 to S-18 */}
                <ReportingAndIndustrySection />

                {/* S-19 to S-22 */}
                <CalculatorAndPricingSection plans={plans} />

                {/* S-23 to S-26 */}
                <SocialProofAndComparisonSection />

                {/* S-27 to S-30 */}
                <AiAndTechSection />

                {/* S-31 to S-34 */}
                <InteractiveBotAndDemoSection />

                {/* S-35 to S-38 */}
                <FaqAndClosingSection />
            </div>

            {/* Video Demo Modal */}
            {demoModalOpen && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
                    onClick={() => setDemoModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setDemoModalOpen(false)}
                            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                            ✕
                        </button>
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="NexusBilling 3-Min Demo Walkthrough"
                            allow="autoplay; fullscreen"
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </SiteLayout>
    );
}

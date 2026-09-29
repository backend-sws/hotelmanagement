import AnimatedSection from '@/Components/Site/AnimatedSection';
import TestimonialCard from '@/Components/Site/TestimonialCard';
import VideoModal from '@/Components/Site/VideoModal';
import ComparisonTable from '@/Components/Site/ComparisonTable';

export default function SocialProofAndComparisonSection() {
    const testimonials = [
        {
            name: 'Sunil Agrawal',
            company: 'Agrawal Kirana Mart, Indore',
            role: 'Founder',
            quote: 'Earlier our counter queue was 10 people deep during evening rush hours. With Nexus POS and barcode scanner, our bill generation takes under 5 seconds. WhatsApp bills saved us ₹8,000/month on paper rolls.',
            rating: 5,
            industry: 'Retail',
            accentColor: 'indigo',
        },
        {
            name: 'Ramesh Patel',
            company: 'Shreeji Electricals & Cables, Ahmedabad',
            role: 'Managing Director',
            quote: 'Managing 3 godowns was our biggest headache. Nexus billing automatically handles multi-godown stock transfers and e-Way bills. My CA loves the 1-click GSTR-1 JSON export.',
            rating: 5,
            industry: 'Wholesale',
            accentColor: 'emerald',
        },
        {
            name: 'Vikramaditya Roy',
            company: 'Mayfair Boutique Retreat, Udaipur',
            role: 'General Manager',
            quote: 'Having Hotel PMS, restaurant food billing, and staff attendance all in one single login is incredible. We eliminated 3 separate software subscriptions and saved ₹45,000 yearly.',
            rating: 5,
            industry: 'Hospitality',
            accentColor: 'amber',
        },
        {
            name: 'Praveen Nair',
            company: 'Skyline HVAC Systems, Bengaluru',
            role: 'Operations Head',
            quote: 'Our 22 technicians used to claim fake petrol allowances. Now with WhatsApp bot selfie check-in and GPS tracking, our travel allowance claims dropped by 32% instantly.',
            rating: 5,
            industry: 'Field Services',
            accentColor: 'violet',
        },
        {
            name: 'Anjali Sharma',
            company: 'StyleHub Garments, Jaipur',
            role: 'Owner',
            quote: 'The WhatsApp payment links are magic. Overdue payments that used to take 45 days are now settled within 48 hours because customers can just click and pay on UPI.',
            rating: 5,
            industry: 'Retail',
            accentColor: 'indigo',
        },
        {
            name: 'Deepak Goyal',
            company: 'Goyal Medical Distributors, Delhi',
            role: 'Partner',
            quote: 'Batch number and medicine expiry date tracking is foolproof. The system warns us 60 days before any batch expires so we return it to pharma companies with zero loss.',
            rating: 5,
            industry: 'Wholesale',
            accentColor: 'emerald',
        },
        {
            name: 'Karan Mehra',
            company: 'The Mountain Vista Resort, Manali',
            role: 'Proprietor',
            quote: 'Room check-in folio and restaurant KOT sync automatically into one GST invoice. No confusion during guest checkout even when power or internet fluctuates.',
            rating: 5,
            industry: 'Hospitality',
            accentColor: 'amber',
        },
        {
            name: 'Siddharth Rao',
            company: 'Apex Elevator & Lift Engineering, Hyderabad',
            role: 'Director',
            quote: 'The AI photo proof verification stops technicians from uploading duplicate maintenance photos. Our client satisfaction score jumped from 82% to 98%.',
            rating: 5,
            industry: 'Field Services',
            accentColor: 'violet',
        },
        {
            name: 'Harpreet Singh',
            company: 'Singh Auto Spares, Ludhiana',
            role: 'Owner',
            quote: 'I had 15,000 spare part SKUs in Tally. NexusBilling imported everything in 10 minutes. The keyboard shortcuts make billing twice as fast as our old computer software.',
            rating: 5,
            industry: 'Retail',
            accentColor: 'indigo',
        },
        {
            name: 'Manoj Tiwari',
            company: 'Varanasi Silk Emporium, Varanasi',
            role: 'Founder',
            quote: 'Simple Hindi support on the WhatsApp bot meant my warehouse staff learned attendance and dispatch within one afternoon without any training classes.',
            rating: 5,
            industry: 'Wholesale',
            accentColor: 'emerald',
        },
        {
            name: 'Capt. R. Deshmukh',
            company: 'Seaside Heritage Villa, Goa',
            role: 'Owner',
            quote: 'Clean, elegant, modern software. Our front desk staff loves the visual room availability calendar. Guest communication via WhatsApp gives us 5-star Google reviews.',
            rating: 5,
            industry: 'Hospitality',
            accentColor: 'amber',
        },
        {
            name: 'Mahesh Chaurasia',
            company: 'GreenAir Pollution Control & Solar, Pune',
            role: 'Founder',
            quote: 'Technicians take on-site customer signatures on mobile phone, and the invoice is dispatched instantly to the client WhatsApp. Unbelievably good software.',
            rating: 5,
            industry: 'Field Services',
            accentColor: 'violet',
        },
    ];

    const comparisonFeatures = [
        'Cloud-Native (Access from Phone, Mac, Windows)',
        'WhatsApp Official Invoicing & PDF Dispatch',
        'WhatsApp Bot Staff Attendance & Punch-In',
        'Gemini AI Anti-Fraud Work Photo Verification',
        'Automatic GPS Distance & TA/DA Calculation',
        'Govt NIC e-Invoice & e-Way Bill in 1-Click',
        'High-Speed Barcode POS with Real-Time Cloud Sync',
        'Multi-Godown Stock Transfer & Batch Tracking',
        'Integrated Hotel PMS & Room Folio Billing',
        'Automated Overdue Payment Reminders',
        'Free Automated Tally / Excel Data Migration',
        'Zero Per-Device or Per-Computer License Fees',
    ];

    const competitors = [
        {
            name: 'NexusBilling',
            values: [true, true, true, true, true, true, true, true, true, true, true, true],
        },
        {
            name: 'Legacy Desktop (Tally/Busy)',
            values: [false, false, false, false, false, true, true, true, false, false, false, false],
        },
        {
            name: 'Simple Mobile App (Vyapar/MyBillBook)',
            values: [true, true, false, false, false, true, false, false, false, true, false, false],
        },
    ];

    const caseStudies = [
        {
            company: 'SuperMart India (3 Outlets)',
            industry: 'Retail Supermarket',
            headline: 'Reduced billing queues by 65% and recovered ₹2.4 Lakh in lost stock',
            metrics: ['65% faster counter billing', '₹2.4L stock discrepancy eliminated', '100% WhatsApp paperless billing'],
            link: '/blog',
        },
        {
            company: 'Prakash Wholesale Distributors',
            industry: 'Wholesale FMCG',
            headline: 'Cut payment collection cycles from 38 days down to 11 days via WhatsApp links',
            metrics: ['27 days faster receivables', '4,200 automated e-invoices/mo', 'Zero manual ledger typing'],
            link: '/blog',
        },
        {
            company: 'Sterling Group of Resorts',
            industry: 'Hospitality & Restaurants',
            headline: 'Replaced 4 different vendor licenses with 1 unified cloud system',
            metrics: ['₹1.8L annual software cost saved', 'Instant room + restaurant folios', '100% police KYC compliance'],
            link: '/blog',
        },
    ];

    return (
        <section className="py-24 relative bg-slate-50/70 border-t border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                {/* S-23: TestimonialsGrid */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Customer Stories
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Loved by 10,000+ Indian business owners
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Read how retailers, distributors, hoteliers, and field contractors transformed their operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t, idx) => (
                            <TestimonialCard
                                key={idx}
                                name={t.name}
                                company={t.company}
                                role={t.role}
                                quote={t.quote}
                                rating={t.rating}
                                industry={t.industry}
                                accentColor={t.accentColor}
                            />
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-24: VideoTestimonials */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Video Testimonials
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            Hear real owners speak about their growth
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'How Agrawal Mart cut cashier billing queues during Diwali rush',
                                speaker: 'Sunil Agrawal',
                                company: 'Agrawal Mart, Indore',
                                thumbnailSrc: '/images/testimonials/retail_video_thumb.jpg',
                                duration: '2:45 min',
                                videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
                            },
                            {
                                title: 'Eliminating fake staff travel claims with WhatsApp AI bot',
                                speaker: 'Praveen Nair',
                                company: 'Skyline HVAC, Bengaluru',
                                thumbnailSrc: '/images/testimonials/field_video_thumb.jpg',
                                duration: '3:15 min',
                                videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
                            },
                            {
                                title: 'Switching from legacy Tally to cloud billing in 10 minutes',
                                speaker: 'Ramesh Patel',
                                company: 'Shreeji Cables, Ahmedabad',
                                thumbnailSrc: '/images/testimonials/wholesale_video_thumb.jpg',
                                duration: '2:30 min',
                                videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
                            },
                        ].map((v, i) => (
                            <div key={i} className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <VideoModal
                                    title={v.title}
                                    speaker={v.speaker}
                                    company={v.company}
                                    thumbnailSrc={v.thumbnailSrc}
                                    duration={v.duration}
                                    videoUrl={v.videoUrl}
                                />
                                <div className="mt-4 px-1">
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{v.title}</h4>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                                        <span className="font-semibold text-slate-600">{v.speaker}, {v.company}</span>
                                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                                            Watch Case ▶
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-25: CaseStudyTeaser */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Proven Results
                        </span>
                        <h2 className="text-3xl font-black text-slate-900">
                            Measurable ROI in under 30 days
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {caseStudies.map((cs, idx) => (
                            <div
                                key={idx}
                                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">
                                        {cs.industry}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900 mt-2 mb-3">{cs.company}</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{cs.headline}</p>

                                    <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                                        {cs.metrics.map((m, mi) => (
                                            <div key={mi} className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                                                <span>⚡</span>
                                                <span>{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <a href={cs.link} className="text-xs font-bold text-indigo-600 hover:underline">
                                    Read Full Case Study →
                                </a>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-26: CompetitorComparison */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Head-to-Head Comparison
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Why modern businesses choose NexusBilling
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            See how we stack up against 20-year-old legacy software and simplistic mobile billing apps.
                        </p>
                    </div>

                    <ComparisonTable
                        features={comparisonFeatures}
                        competitors={competitors}
                        highlightIndex={0}
                    />
                </AnimatedSection>
            </div>
        </section>
    );
}

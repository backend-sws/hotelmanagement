import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 37 Hospitality Sections
import HotelHeroAndFormats from '../HotelSections/HotelHeroAndFormats';
import HotelPmsAndFrontDesk from '../HotelSections/HotelPmsAndFrontDesk';
import RestaurantTableAndKotEngine from '../HotelSections/RestaurantTableAndKotEngine';
import RecipeInventoryAndFoodAggregators from '../HotelSections/RecipeInventoryAndFoodAggregators';
import HospitalityGstAndOperations from '../HotelSections/HospitalityGstAndOperations';
import HospitalitySocialProofAndClosing from '../HotelSections/HospitalitySocialProofAndClosing';

export default function HotelPage() {
    const [selectedFormat, setSelectedFormat] = useState('resorts');

    return (
        <SiteLayout>
            <Head>
                <title>Hotel PMS &amp; Restaurant POS Software India — Room Grid &amp; Table KOT | Nexus Billing</title>
                <meta
                    name="description"
                    content="India's #1 Cloud Hotel PMS &amp; Restaurant POS software for resorts, boutique hotels, fine dining, and cafes. Visual room grid, 30s guest check-in, unified folios, table KOT routing, recipe BOM inventory, and Swiggy/Zomato sync."
                />
                <meta
                    name="keywords"
                    content="hotel PMS software India, restaurant POS software, cloud kitchen KOT software, room reservation grid, captain tablet ordering app, unified hotel guest folio, restaurant recipe BOM, Swiggy Zomato POS sync, restaurant GST 5 percent"
                />
                <link rel="canonical" href="https://nexusbilling.in/solutions/hotel" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Hotel PMS &amp; Restaurant POS Cloud ERP | Nexus Billing" />
                <meta
                    property="og:description"
                    content="Unified cloud platform for hotel room reservations, table floor plans, multi-kitchen KOT routing, and Swiggy/Zomato auto-order sync."
                />
                <meta property="og:image" content="/images/nexus-hotel-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/solutions/hotel" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus Hotel PMS &amp; Restaurant POS — Fast Cloud Hospitality ERP" />
                <meta
                    name="twitter:description"
                    content="Turn restaurant tables 25% faster, eliminate kitchen food theft with recipe BOMs, and manage room folios effortlessly."
                />

                {/* Schema.org Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        'name': 'Nexus Hotel PMS & Restaurant POS',
                        'applicationCategory': 'BusinessApplication',
                        'operatingSystem': 'Web, Windows, Android, iOS',
                        'description': 'Cloud Hotel Property Management System (PMS) and Restaurant POS software for Indian hotels, resorts, fine-dining restaurants, and cloud kitchens with room availability calendar, table KOT routing, and recipe inventory.',
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
                {/* Sections 1 to 4: Hotel Hero, 6 Hospitality Verticals, Live Ticker & Quick Nav */}
                <HotelHeroAndFormats 
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                />

                {/* Sections 5 to 11: Visual Room Grid, 30s Check-In, Folios, Night Audit & Banquets */}
                <HotelPmsAndFrontDesk />

                {/* Sections 12 to 19: Floor Plan Customizer, Waiter Captain App, Multi-Kitchen KOT & KDS */}
                <RestaurantTableAndKotEngine />

                {/* Sections 20 to 26: Recipe BOM Stock Deduction, Swiggy/Zomato Sync, Bar Excise & Food Costing */}
                <RecipeInventoryAndFoodAggregators />

                {/* Sections 27 to 32: Restaurant GST 5% vs 18%, Tally Prime Sync, Cashier Float & Hardware */}
                <HospitalityGstAndOperations />

                {/* Sections 33 to 37: Customer Case Studies, ROI Calculator, FAQs, Closing Ribbon & Trust Badges */}
                <HospitalitySocialProofAndClosing />
            </div>
        </SiteLayout>
    );
}

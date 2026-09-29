import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Components/Site/SiteLayout';

// 6 Modular Components covering all 28 Demo Booking Sections
import DemoHeroAndSchedulePicker from './DemoSections/DemoHeroAndSchedulePicker';
import IndustryTailoredDemoForm from './DemoSections/IndustryTailoredDemoForm';
import InteractiveSelfGuidedSandbox from './DemoSections/InteractiveSelfGuidedSandbox';
import WhatYouWillLearnCurriculum from './DemoSections/WhatYouWillLearnCurriculum';
import EnterpriseSocialProofAndStories from './DemoSections/EnterpriseSocialProofAndStories';
import DemoFaqAndClosingCta from './DemoSections/DemoFaqAndClosingCta';

export default function DemoPage() {
    // Shared scheduling state between Hero picker and Booking Form
    const [selectedDate, setSelectedDate] = useState('tomorrow');
    const [selectedTime, setSelectedTime] = useState('02:30 PM');
    const [selectedFormat, setSelectedFormat] = useState('meet');

    return (
        <SiteLayout>
            <Head>
                <title>Book a Live Nexus ERP Demo — 20-Minute Personalized Walkthrough &amp; Interactive Sandbox</title>
                <meta
                    name="description"
                    content="Schedule a 1-on-1 personalized demo of India's #1 Cloud ERP &amp; POS platform. Test real-time multi-counter billing, direct NIC IRP E-Invoicing, GSTR-2B reconciliation, and WhatsApp commerce live."
                />
                <meta
                    name="keywords"
                    content="book Nexus demo, live cloud POS demo India, GST billing walkthrough, retail supermarket ERP demonstration, WhatsApp commerce live test, Tally sync demonstration"
                />
                <link rel="canonical" href="https://nexusbilling.in/demo" />

                {/* OpenGraph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Book a Live Nexus ERP Demo — Personalized Walkthrough" />
                <meta
                    property="og:description"
                    content="Experience real-time multi-branch cloud sync, automated GST compliance, and WhatsApp commerce customized for your specific trade."
                />
                <meta property="og:image" content="/images/nexus-demo-og.jpg" />
                <meta property="og:url" content="https://nexusbilling.in/demo" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus ERP Live Demo — 20-Minute Personalized Screen Share" />
                <meta
                    name="twitter:description"
                    content="Test drive India's most dependable cloud ERP platform with zero setup fees and free data migration."
                />
            </Head>

            {/* S-01 to S-05: Hero, Date/Time Scheduler, Format Selector & Quick Nav */}
            <DemoHeroAndSchedulePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                selectedFormat={selectedFormat}
                setSelectedFormat={setSelectedFormat}
            />

            {/* S-06 to S-10: Industry Track Selector & Smart Demo Booking Form */}
            <IndustryTailoredDemoForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedFormat={selectedFormat}
            />

            {/* S-11 to S-14: Interactive In-Browser POS & IRN Sandbox Simulator */}
            <InteractiveSelfGuidedSandbox />

            {/* S-15 to S-18: 20-Minute Walkthrough Curriculum Agenda */}
            <WhatYouWillLearnCurriculum />

            {/* S-19 to S-23: Verified Merchant Case Studies & Consultant Credentials */}
            <EnterpriseSocialProofAndStories />

            {/* S-24 to S-28: Demo FAQs, Trust Badges, JSON-LD & Instant Trial CTA */}
            <DemoFaqAndClosingCta />
        </SiteLayout>
    );
}

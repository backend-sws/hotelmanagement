# Phase 1 — 🏠 HomePage (`/`)

**File:** `resources/js/Pages/Landing/HomePage.tsx`  
**Status:** ⏳ Pending  
**Sections:** 38  
**SEO Title:** "Nexus Billing — India's #1 Cloud GST Billing, Invoicing & WhatsApp FieldOps SaaS"  
**Meta Description:** "Automate GST billing, WhatsApp invoicing, barcode POS, inventory, HR attendance, and field staff management with AI-powered tools. Free 14-day trial."

---

## SEO Head
```tsx
<Head>
  <title>Nexus Billing — India's #1 Cloud GST Billing & Business Management SaaS</title>
  <meta name="description" content="..." />
  <meta name="keywords" content="GST billing software India, WhatsApp invoicing, cloud billing SaaS, FieldOps attendance..." />
  <link rel="canonical" href="https://nexusbilling.in/" />
  {/* OpenGraph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/og/home.jpg" />
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  {/* JSON-LD: SoftwareApplication + Organization */}
  <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Nexus Billing","applicationCategory":"BusinessApplication","operatingSystem":"Web","priceCurrency":"INR","offers":{"@type":"Offer","price":"999","priceCurrency":"INR"}}`}</script>
</Head>
```

---

## Sections (38 Total)

### S-01: `HeroMain`
**Layout:** 2-col on desktop (text left, mockup right), stacked on mobile  
**Left:**
- Green pill badge: "✨ Now with Gemini AI Vision — Anti-Fraud Proof Verification"
- H1 (96px display): "India's Smartest **GST Billing** & Business Management Platform"
- Subline (20px, slate-400): "One platform for billing, inventory, HR, WhatsApp automation, POS & AI-powered field operations — built for Indian SMEs."
- CTA Row: [Start Free 14-Day Trial →] [Watch 3-min Demo ▶]
- Trust row: "No credit card · Cancel anytime · 10,000+ businesses trust us"  
**Right:**
- Animated floating dashboard card (absolute positioned, CSS keyframe float)
- Shows: Revenue counter ticking up, Invoice status chips, WhatsApp delivered tick
- Decorative blurred gradient orbs (indigo + violet) behind card  
**Responsive:**
- Mobile: hero text centered, mockup below hero
- Desktop: side-by-side with mockup clipped at viewport edge

### S-02: `TrustBadgesStrip`
**Layout:** Horizontal flex wrap, centered  
- 6 badges with icons: ✅ GST e-Invoice Ready · 🏆 4.9/5 Rating · 🇮🇳 Made in India · 🔒 AES-256 Encrypted · ⚡ 99.9% Uptime · 📲 WhatsApp Integrated  
- Each: icon + label, `bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2`

### S-03: `ClientLogoCarousel`
- Heading: "Powering businesses across India"
- Auto-scrolling ticker (CSS marquee animation, infinite loop)
- 16 placeholder company logos (SVG monochrome white at 40% opacity)
- Duplicated for seamless loop

### S-04: `PainPointSection`
**Layout:** Left = "The problem" text, Right = 3 pain point cards  
- Heading: "Still drowning in manual billing chaos?"
- 3 cards with ❌ icons:
  1. "Hours wasted creating invoices manually — typos, wrong GST rates, rejected IRNs"
  2. "Staff attendance fraud — fake punches, inflated TA/DA claims"
  3. "Zero visibility into field staff location, tasks, and work proof"
- Bottom: "Sound familiar? Here's your escape →"

### S-05: `SolutionFlow`
**Layout:** `<StepFlow>` component — 4 numbered steps  
1. Register & Configure (5 min setup, import existing data)
2. Invite Your Team (staff get WhatsApp bot auto-linked)
3. Start Billing & Tracking (invoices, POS, attendance go live)
4. Grow With Insights (AI reports, GST filings, payroll — auto)  
- Connecting dashed gradient line between steps on desktop

### S-06: `CoreFeaturesGrid`
**Layout:** 3×2 grid on desktop, 2×3 on tablet, 1-col on mobile  
6 `<FeatureCard>` components:
1. ⚡ **GST Billing & e-Invoicing** — B2B/B2C, IRN, QR, e-Way Bill, credit notes
2. 📲 **WhatsApp Auto-Invoicing** — PDF dispatch, payment reminders, read receipts
3. 📦 **Smart Inventory** — Multi-godown, batch, expiry, reorder alerts
4. 🛒 **Barcode POS** — Offline mode, thermal receipt, quick keyboard shortcuts
5. 📍 **WhatsApp Bot FieldOps** — GPS geofencing, AI selfie proof, client OTP
6. 📊 **CA-Ready Reports** — P&L, Balance Sheet, GSTR-1/3B, analytics

### S-07: `LiveDashboardPreview`
**Layout:** Full-width dark card with browser chrome UI wrapper  
- Animated mock dashboard: sidebar + main area with charts
- SVG bar chart animating on mount (fill from 0 to values)
- Revenue: `₹14,82,500` counter increments with IntersectionObserver trigger
- Invoice count: `1,247 invoices this month` 
- WhatsApp status: green sent ticks streaming in
- Background: radial gradient glow (indigo center)

### S-08: `InvoicingDeepDive`
**Layout:** Alternating 2-col: feature text left, UI screenshot right  
- Subheading: "Billing & e-Invoicing — Never miss a GST deadline again"
- Feature bullets with check icons:
  - GST Invoice B2B / B2C / Export / SEZ
  - e-Invoice with IRN & QR code generation
  - Bulk e-Way Bill creation
  - A4, A5, thermal 58mm/80mm formats
  - Multi-GSTIN support (multiple branches)
  - Auto tax calculation (CGST/SGST/IGST)
- Right: animated invoice template mockup with IRN + QR visible

### S-09: `WhatsAppInvoicingShowcase`
**Layout:** Phone mockup animation center, text both sides  
- Heading: "Send invoices on WhatsApp — in 1 click"
- Center: animated phone showing WhatsApp chat with PDF invoice + payment link
- Left stats card: "97% open rate vs 21% email open rate"
- Right stats card: "3x faster payment collection"
- Feature list: Auto-dispatch on save, payment link embedded, delivery tick tracking, reminder sequences

### S-10: `PosModuleSection`
**Layout:** Dark card, left text + right interactive POS UI mockup  
- Heading: "High-speed Barcode POS — Sell faster, error-free"
- Features: Barcode scanner support, quick item search, keyboard shortcuts (F1-F9), offline mode, multi-payment modes (Cash, UPI, Card, Credit)
- Mockup: POS cart UI with barcode animation

### S-11: `InventorySection`
**Layout:** 3 feature cards in a row, then large stock alert mockup  
- Multi-godown stock management
- Batch & expiry date tracking  
- Low stock alerts (WhatsApp notification demo)
- FIFO/LIFO valuation
- Reorder level automation

### S-12: `FieldOpsShowcase`
**Layout:** Full-width with map background (CSS radial gradient) + overlay cards  
- Heading: "Field Operations — Complete control from WhatsApp"
- 4 floating stat cards on the "map":
  - 📍 12 Technicians active (with animated pulsing dots)
  - ✅ AI Proof Verified (confidence score 94.2%)
  - 🚗 Today's TA/DA: ₹2,847 auto-calculated
  - 📸 47 Work Photos — watermarked & tamper-proof
- Below: WhatsApp bot flow animation (3-step: task assigned → reached → photo submitted)

### S-13: `HrAttendanceSection`
**Layout:** 2-col, left = feature list, right = attendance grid mockup  
- WhatsApp punch-in/out with selfie
- GPS geofence check-in
- Shift scheduling & roster
- Leave requests & approvals
- Payroll with TA/DA auto-sync
- Late mark, overtime calculation

### S-14: `HotelPmsTeaser`
**Layout:** Full-width card with hotel room grid visual  
- Room availability calendar
- Check-in / check-out folio
- Housekeeping task management
- Restaurant POS integration
- OTA channel sync teaser

### S-15: `ReportingSuite`
**Layout:** Tab switcher (Financial / GST / HR / Operations) each showing a sample report screenshot  
- Financial: P&L, Balance Sheet, Cash Flow
- GST: GSTR-1, GSTR-3B, ITC reconciliation
- HR: Attendance summary, payroll register, TA/DA
- Operations: Field tasks, proof gallery, GPS logs

### S-16: `IndustryTabSection`
**Uses:** `<IndustryTab>` component  
- 4 tabs: 🛒 Retail | 📦 Wholesale | 🏨 Hotels | 🔧 Field Services  
- Each tab: dedicated UI screenshot + 5 relevant features list + "Learn more →" link

### S-17: `StatsBanner`
**Layout:** 4-col stats, `border-y border-white/[0.06]` dividers  
- 10,000+ Businesses Onboarded
- ₹500 Cr+ Invoices Generated
- 98.7% Customer Satisfaction
- 4.9/5 Average Rating (2,400+ reviews)  
- Each stat: large number (animated count-up), small label

### S-18: `IntegrationEcosystem`
**Layout:** Central product logo with spokes to integration logos (CSS grid radial layout)  
- WhatsApp Cloud API, Google Workspace, Razorpay, Paytm, HDFC Bank APIs
- GST Portal / NIC e-Invoice, Tally data import, Excel/CSV
- Barcode printers, thermal printers, label printers
- "Don't see your tool? Check our API docs →"

### S-19: `SecurityTrustSection`
**Layout:** 3×2 grid of security feature cards  
- 🔐 AES-256 Encryption at rest & transit
- 🌐 SSL/TLS with HSTS
- 🔄 Daily automated backups (30-day retention)
- 👤 MFA / 2FA login
- 📋 Role-based access control
- 🛡️ Penetration tested quarterly  
- Trust logos: ISO 27001 • GDPR Compliant • Data Hosted in India 🇮🇳

### S-20: `RoiCalculator`
**Layout:** Full-width dark glass card with slider on left, results on right  
- Slider 1: "How many invoices do you create per month?" (50 → 5000)
- Slider 2: "How many billing staff do you employ?" (1 → 20)
- Dynamic output (React state):
  - ⏱️ Hours saved per month: `{X} hrs`
  - 💰 Annual savings: `₹{Y}`
  - 🚀 Productivity increase: `{Z}%`
- Source note: "Based on avg. 8 mins per manual invoice"

### S-21: `PricingPreview`
**Layout:** 3 pricing cards side-by-side (desktop), stacked (mobile)  
- Monthly / Yearly toggle (uses React state, prices from props)  
- Plans from DB (Starter ₹999/mo, Growth ₹1999/mo, Enterprise ₹3999/mo)  
- "View full pricing & feature comparison →" link  
- Annual savings badge on Yearly toggle: "Save 2 months FREE"

### S-22: `FreeTrialCTA` (Banner)
**Layout:** Full-width gradient card (indigo→violet left-to-right)  
- Heading: "Start your free 14-day trial — no credit card needed"
- 4 mini feature icons: "All features · Unlimited invoices · WhatsApp enabled · Dedicated support"
- Big CTA button: "Create Free Account →"

### S-23: `TestimonialsGrid`
**Layout:** Masonry-style 3-col grid (desktop), 2-col (tablet), 1-col (mobile)  
- 12 `<TestimonialCard>` components
- 4 from Retail, 3 from Wholesale, 3 from Hotels, 2 from Field Services
- Each: photo avatar (gradient fallback), name, company, role, 5-star rating, quote
- Grid has subtle staggered animation delay

### S-24: `VideoTestimonials`
**Layout:** 3 video thumbnail cards in a row  
- Uses `<VideoModal>` component
- Overlay play button, business owner name + company below
- On click: modal opens with embedded YouTube/video

### S-25: `CaseStudyTeaser`
**Layout:** 3 large cards with gradient border  
- "SuperMart India — 3-outlet retail chain saved 40 hrs/month"
- "Prakash Distributors — Wholesale GST compliance automated"
- "Sterling Hotels — Full PMS + FieldOps in one platform"
- Each: industry tag, headline, 3 result metrics, "Read case study →"

### S-26: `CompetitorComparison`
**Uses:** `<ComparisonTable>` component  
- VS Tally / Busy Accounting / Vyapar / Marg  
- 15 features compared (WhatsApp bot, AI proof, geo-attendance, cloud multi-user, mobile app...)
- Our column highlighted in indigo

### S-27: `MobilePwaSection`
**Layout:** Left text, right = 3 device mockups (phone, tablet, laptop) overlapping  
- Works on any device — no app install needed
- PWA installable (Add to home screen)
- Offline POS mode
- Push notifications

### S-28: `AiFeaturesHighlight`
**Layout:** Full-width card with animated AI particle background  
- "Powered by Google Gemini AI"
- 3 AI use cases:
  1. 🤖 AI Vision Work Proof Verification (94% accuracy, screen spoof detection)
  2. 📊 AI Sales & Inventory Insights (demand prediction, slow-moving stock alerts)
  3. 💬 AI-Powered Customer Communication (smart reminder tone adjustment)

### S-29: `PartnerProgramTeaser`
**Layout:** 2-col card: left dark, right indigo gradient  
- "Earn ₹5,000–₹50,000/month as our reseller partner"
- 3 bullet benefits: recurring commission, marketing support, dedicated manager
- CTA: "Become a Partner →"

### S-30: `BlogHighlights`
**Layout:** 1 featured post (large) + 2 smaller posts (right column)  
- 3 posts with image, category tag, title, excerpt, read time, "Read more →"
- "Visit our Resource Center →" link

### S-31: `GstComplianceBanner`
**Layout:** Full-width banner with GST logo pattern background  
- "100% GST Compliant — Always Up to Date"
- 6 compliance badges: e-Invoice · e-Way Bill · GSTR-1 · GSTR-3B · ITC Reconciliation · Audit Trail
- "GST rules change? We update within 24 hours — guaranteed."

### S-32: `WhatsAppBotDemo`
**Layout:** Center: animated chat mockup (CSS keyframe step-by-step message appear)  
- Shows bot conversation:
  1. Employee: "Hi"
  2. Bot: "🙏 Namaste Rajesh! Choose an option: [Punch In] [My Tasks] [Status]"
  3. Employee: taps [Punch In]
  4. Bot: "Please share your live location 📍"
  5. Employee shares location (verified ✅)
  6. Bot: "Now take a selfie 📷"
  7. Employee sends selfie (AI verified ✅ 96.4% confidence)
  8. Bot: "🎉 Attendance marked! 09:12 AM"

### S-33: `NewsMediaMentions`
**Layout:** Horizontal strip with publication logos  
- "Featured In" heading
- 6-8 grey-out media/tech logos (YourStory, Economic Times, Inc42, Entrackr...)

### S-34: `DemoRequestSection`
**Layout:** 2-col — left: what you'll see list, right: lead form  
- Form fields: Name, Company, Phone, Industry (select), Team Size (select)
- Submit → POST /lead (Inertia form)
- Success state: "✅ Demo booked! Check your WhatsApp."

### S-35: `HowItWorksTimeline`
**Layout:** Horizontal timeline on desktop, vertical on mobile  
- 5 steps with numbered nodes + connecting line:
  1. Sign up (2 min)
  2. Add your GSTIN & configure (5 min)
  3. Import products/contacts (bulk Excel/CSV)
  4. Invite staff (WhatsApp auto-link)
  5. Start billing & tracking live

### S-36: `TrustAndCompliance`
**Layout:** 2-row grid of compliance/trust badges (large card format)  
- GSTN Authorized · Data in India · ISO 27001 · HTTPS/SSL · GDPR · MFA · 99.9% Uptime SLA · 24x7 Support

### S-37: `FrequentlyAskedSection`
**Uses:** 10 `<FAQItem>` components in 2-col layout on desktop  
- Q1: Is my data safe? A: AES-256 + India servers + daily backups
- Q2: Does it work on mobile? A: PWA, any browser, no app needed
- Q3: How does WhatsApp integration work? A: Meta Cloud API, plug & play
- Q4: Can I migrate from Tally/Busy? A: Free data migration included
- Q5: Is GST e-Invoice supported? A: Yes, IRN + QR from NIC portal
- Q6: Does it work offline? A: POS works offline, syncs when connected
- Q7: Can multiple users access simultaneously? A: Yes, role-based multi-user
- Q8: Is there an annual contract? A: Monthly or annual, cancel anytime
- Q9: What support is available? A: WhatsApp + Email + Video call (by plan)
- Q10: Is there a free trial? A: 14 days, all features, no card needed  
- JSON-LD FAQPage schema embedded

### S-38: `FinalHeroCTA`
**Layout:** Full-screen section with gradient mesh background  
- Large centered heading: "Ready to transform your business?"
- Sub: "Join 10,000+ Indian businesses already using Nexus Billing"
- 2 buttons: [Start Free Trial — It's Free] [Talk to Sales]
- Floating mini testimonial quotes (3 short quotes absolutely positioned)

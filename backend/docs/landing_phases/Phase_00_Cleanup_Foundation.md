# Phase 0 — 🗑️ Cleanup + Foundation + Shared Components

**Status:** ⏳ Pending  
**Estimated Files:** 20 new shared component files + route/controller changes  
**Prerequisite for:** All other phases

---

## Step 1: DELETE Old Landing Files

```
DELETE: resources/js/Pages/LandingPage.tsx
DELETE: resources/js/Pages/Landing/About.tsx
DELETE: resources/js/Pages/Landing/Blog.tsx
DELETE: resources/js/Pages/Landing/Contact.tsx
DELETE: resources/js/Components/Landing/CTASection.tsx
DELETE: resources/js/Components/Landing/ContactSection.tsx
DELETE: resources/js/Components/Landing/FAQSection.tsx
DELETE: resources/js/Components/Landing/FeatureShowcase.tsx
DELETE: resources/js/Components/Landing/FeaturesSection.tsx
DELETE: resources/js/Components/Landing/FooterSection.tsx
DELETE: resources/js/Components/Landing/HeroSection.tsx
DELETE: resources/js/Components/Landing/Navbar.tsx
DELETE: resources/js/Components/Landing/PricingSection.tsx
DELETE: resources/js/Components/Landing/StatsSection.tsx
DELETE: resources/js/Components/Landing/TestimonialsSection.tsx
DELETE: resources/js/Components/Landing/useIntersectionObserver.ts
```

## Step 2: Update routes/web.php

Replace old landing routes with LandingController.

## Step 3: Create LandingController.php

```php
class LandingController extends Controller {
    public function home()    { return Inertia::render('Landing/HomePage', [...]); }
    public function features(){ return Inertia::render('Landing/FeaturesPage'); }
    public function pricing() { return Inertia::render('Landing/PricingPage', ['plans' => Plan::where('is_active',true)->get()]); }
    // ... all 20 pages
    public function submitLead(Request $r) { /* validate + save Lead */ }
}
```

## Step 4: Create 14 Shared Components

### 4.1 SiteLayout.tsx
- Wraps every landing page
- Renders `<SiteNavbar>` + `{children}` + `<SiteFooter>`
- Applies global dark background `bg-[#030712] text-white font-sans antialiased`
- Imports Google Fonts (Plus Jakarta Sans + Inter) via `<Head>` link tags

### 4.2 SiteNavbar.tsx
**Responsive:** Hamburger on mobile, full mega-nav on desktop
- Logo (left)
- Nav groups: Products ▾, Solutions ▾, Resources ▾, Pricing, About
- Products mega-dropdown: Billing, POS, Inventory, HR, FieldOps, Hotel PMS
- Solutions mega-dropdown: Retail, Wholesale, Hotel, Field Services, Manufacturing
- Resources dropdown: Blog, Docs, Changelog, Status
- "Sign In" ghost link → `/login`
- "Start Free Trial" emerald CTA → `/register`
- Sticky on scroll (adds `backdrop-blur-xl bg-[#030712]/80 border-b border-white/[0.06]`)
- Mobile: slide-down drawer with all links, accordion sub-menus

### 4.3 SiteFooter.tsx
**5 columns:**
1. Brand column: Logo + tagline + social icons (Twitter/X, LinkedIn, YouTube, WhatsApp)
2. Product: Billing, POS, Inventory, HR, FieldOps, Hotel PMS, WhatsApp Bot, GST
3. Solutions: Retail, Wholesale, Hotels, Field Services, Manufacturing
4. Company: About, Blog, Careers, Partners, Security, Press
5. Legal: Privacy, Terms, Compliance, Refund Policy
- Bottom bar: © 2026 • GST Ready • Made in India 🇮🇳 • All rights reserved
- Newsletter subscribe input field
- Mobile: accordion-collapsible columns

### 4.4 AnimatedSection.tsx
- IntersectionObserver HOC
- Props: `delay?: number`, `direction?: 'up' | 'left' | 'right' | 'scale'`
- Applies CSS class when in viewport: `opacity-0 translate-y-10` → `opacity-100 translate-y-0`
- transition-duration: 600ms, easing: cubic-bezier(0.16, 1, 0.3, 1)

### 4.5 GradientBadge.tsx
- Props: `color?: 'indigo' | 'emerald' | 'violet' | 'amber'`, `children`
- Renders small pill: `text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full`
- Color variants:
  - indigo: `bg-indigo-500/10 text-indigo-400 border border-indigo-500/20`
  - emerald: `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
  - violet: `bg-violet-500/10 text-violet-400 border border-violet-500/20`
  - amber: `bg-amber-500/10 text-amber-400 border border-amber-500/20`

### 4.6 FeatureCard.tsx
- Props: `icon`, `title`, `description`, `badge?`, `href?`, `gradient?`
- Glass card with icon in colored circle, title, description
- Hover: lift + glow border
- Optional: gradient left-border accent

### 4.7 PricingCard.tsx
- Props: `plan`, `isPopular?`, `billingCycle: 'monthly'|'yearly'`
- Displays: Plan name, price (animated when toggle), features checklist
- Popular plan: violet/indigo gradient border + glow + "Most Popular" badge
- CTA button: "Start Free Trial" or "Contact Sales"

### 4.8 TestimonialCard.tsx
- Props: `name`, `company`, `role`, `quote`, `rating`, `avatar?`, `industry?`
- Star rating component (filled/empty stars)
- Quote with large decorative `"` mark
- Industry badge bottom-right
- Hover: slight scale-up

### 4.9 IndustryTab.tsx
- Props: `tabs: {id, label, icon, content}[]`
- Horizontal scrollable tab bar on mobile
- Active tab: gradient underline + text color change
- Content area: animated crossfade between tab panels

### 4.10 StepFlow.tsx
- Props: `steps: {number, title, description, icon}[]`
- Horizontal on desktop (with connecting dashed gradient line)
- Vertical on mobile
- Each step: numbered circle with gradient fill, title, description

### 4.11 VideoModal.tsx
- Props: `thumbnailSrc`, `videoUrl`, `title`
- Thumbnail with play button overlay
- Click → modal opens with YouTube/Loom embed or `<video>` tag
- Modal: dark overlay, close button, responsive video container

### 4.12 ComparisonTable.tsx
- Props: `features: string[]`, `competitors: {name, values: boolean[]}[]`, `highlightColumn?: number`
- Sticky header row
- Checkmark (✅) vs X (❌) cells
- Highlighted column (our product) with indigo background
- Mobile: horizontally scrollable

### 4.13 FAQItem.tsx
- Props: `question`, `answer`, `defaultOpen?`
- Accordion with smooth height animation (CSS max-height transition)
- + / − toggle icon with rotation animation
- `itemScope itemType="FAQPage"` schema markup

### 4.14 DemoBanner.tsx
- Sticky bottom bar (appears after 50% scroll)
- "👋 Want to see it live? Book a free 30-min demo →"
- Dismiss button (stores in sessionStorage)
- Emerald gradient background with subtle pulse animation
- Mobile: full-width bar; Desktop: centered pill shape

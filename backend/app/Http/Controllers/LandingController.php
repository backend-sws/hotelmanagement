<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    private function activePlans(): array
    {
        return Plan::where('is_active', true)
            ->orderBy('price_monthly')
            ->get(['id', 'name', 'description', 'price_monthly', 'price_yearly', 'features'])
            ->toArray();
    }

    public function home(): Response
    {
        return Inertia::render('Landing/HomePage', [
            'plans' => $this->activePlans(),
        ]);
    }

    public function features(): Response
    {
        return Inertia::render('Landing/FeaturesPage');
    }

    public function whatsappFeatures(): Response
    {
        return Inertia::render('Landing/WhatsAppFeaturesPage');
    }

    public function gstCompliance(): Response
    {
        return Inertia::render('Landing/GstCompliancePage');
    }

    public function pricing(): Response
    {
        return Inertia::render('Landing/PricingPage', [
            'plans' => $this->activePlans(),
        ]);
    }

    public function solutionsRetail(): Response
    {
        return Inertia::render('Landing/Solutions/RetailPage');
    }

    public function solutionsWholesale(): Response
    {
        return Inertia::render('Landing/Solutions/WholesalePage');
    }

    public function solutionsHotel(): Response
    {
        return Inertia::render('Landing/Solutions/HotelPage');
    }

    public function solutionsFieldServices(): Response
    {
        return Inertia::render('Landing/Solutions/FieldServicesPage');
    }

    public function solutionsManufacturing(): Response
    {
        return Inertia::render('Landing/Solutions/ManufacturingPage');
    }

    public function about(): Response
    {
        return Inertia::render('Landing/AboutPage');
    }

    public function blog(): Response
    {
        return Inertia::render('Landing/BlogPage');
    }

    public function blogArticle(string $slug): Response
    {
        return Inertia::render('Landing/BlogArticlePage', ['slug' => $slug]);
    }

    public function contact(): Response
    {
        return Inertia::render('Landing/ContactPage');
    }

    public function demo(): Response
    {
        return Inertia::render('Landing/DemoPage');
    }

    public function partners(): Response
    {
        return Inertia::render('Landing/PartnersPage');
    }

    public function security(): Response
    {
        return Inertia::render('Landing/SecurityPage');
    }

    public function careers(): Response
    {
        return Inertia::render('Landing/CareersPage');
    }

    public function privacy(): Response
    {
        return Inertia::render('Landing/PrivacyPage');
    }

    public function terms(): Response
    {
        return Inertia::render('Landing/TermsPage');
    }

    public function submitLead(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'business_name'   => 'required|string|max:150',
            'contact_person'  => 'required|string|max:100',
            'phone'           => 'required|string|max:20',
            'email'           => 'nullable|email|max:150',
            'notes'           => 'nullable|string|max:500',
        ]);

        Lead::create([
            'business_name'  => $validated['business_name'],
            'contact_person' => $validated['contact_person'],
            'phone'          => $validated['phone'],
            'email'          => $validated['email'] ?? null,
            'status'         => 'new',
            'notes'          => $validated['notes'] ?? 'Lead from website landing page',
        ]);

        return back()->with('success', 'Thanks! We will reach out on WhatsApp within 30 minutes.');
    }
}


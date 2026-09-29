<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

// ─── Public Landing Pages ─────────────────────────────────────────────────────
Route::get('/',                      [LandingController::class, 'home'])->name('home');
Route::get('/features',              [LandingController::class, 'features'])->name('features');
Route::get('/features/whatsapp',     [LandingController::class, 'whatsappFeatures'])->name('features.whatsapp');
Route::get('/features/gst',          [LandingController::class, 'gstCompliance'])->name('features.gst');
Route::get('/pricing',               [LandingController::class, 'pricing'])->name('pricing');
Route::get('/solutions/retail',      [LandingController::class, 'solutionsRetail'])->name('solutions.retail');
Route::get('/solutions/wholesale',   [LandingController::class, 'solutionsWholesale'])->name('solutions.wholesale');
Route::get('/solutions/hotel',       [LandingController::class, 'solutionsHotel'])->name('solutions.hotel');
Route::get('/solutions/field-services', [LandingController::class, 'solutionsFieldServices'])->name('solutions.field-services');
Route::get('/solutions/manufacturing',  [LandingController::class, 'solutionsManufacturing'])->name('solutions.manufacturing');
Route::get('/about',                 [LandingController::class, 'about'])->name('about');
Route::get('/blog',                  [LandingController::class, 'blog'])->name('blog');
Route::get('/blog/{slug}',           [LandingController::class, 'blogArticle'])->name('blog.article');
Route::get('/contact',               [LandingController::class, 'contact'])->name('contact');
Route::get('/demo',                  [LandingController::class, 'demo'])->name('demo');
Route::get('/partners',              [LandingController::class, 'partners'])->name('partners');
Route::get('/security',              [LandingController::class, 'security'])->name('security');
Route::get('/careers',               [LandingController::class, 'careers'])->name('careers');
Route::get('/privacy',               [LandingController::class, 'privacy'])->name('privacy');
Route::get('/terms',                 [LandingController::class, 'terms'])->name('terms');

// Lead capture (demo request / contact form)
Route::post('/lead', [LandingController::class, 'submitLead'])->name('lead.submit')->middleware('throttle:5,1');

// ─── Authenticated App ────────────────────────────────────────────────────────
Route::get('/dashboard', function () {
    return inertia('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

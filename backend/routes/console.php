<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

\Illuminate\Support\Facades\Schedule::command('attendance:cleanup-photos')->daily();
\Illuminate\Support\Facades\Schedule::command('attendance:auto-absent')->everyFifteenMinutes();
\Illuminate\Support\Facades\Schedule::command('attendance:process-forgot-checkout')->everyThirtyMinutes();

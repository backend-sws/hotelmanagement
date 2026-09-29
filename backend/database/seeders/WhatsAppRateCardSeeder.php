<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WhatsAppRateCard;

class WhatsAppRateCardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            ['category' => 'utility',        'wholesale_cost' => 0.35, 'retail_price' => 0.75],
            ['category' => 'authentication', 'wholesale_cost' => 0.12, 'retail_price' => 0.40],
            ['category' => 'service',        'wholesale_cost' => 0.30, 'retail_price' => 0.60],
            ['category' => 'marketing',      'wholesale_cost' => 0.85, 'retail_price' => 1.40],
            ['category' => 'ai_vision',      'wholesale_cost' => 0.04, 'retail_price' => 0.25],
        ];

        foreach ($defaults as $d) {
            WhatsAppRateCard::updateOrCreate(
                ['business_id' => null, 'category' => $d['category']],
                [
                    'wholesale_cost' => $d['wholesale_cost'],
                    'retail_price'   => $d['retail_price'],
                    'is_active'      => true
                ]
            );
        }
    }
}

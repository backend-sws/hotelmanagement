<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Business;
use App\Models\Plan;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\Supplier;
use App\Models\Expense;
use App\Models\InventoryMovement;

class TestBusinessSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Create Test User ────────────────────────────────────────
        $user = User::where('email', 'test@demo.com')->first();
        if ($user) {
            $this->command->info('Test user already exists. Skipping...');
            return;
        }

        $user = User::create([
            'name' => 'Demo Shop Owner',
            'email' => 'test@demo.com',
            'phone' => '9999900000',
            'password' => Hash::make('password123'),
        ]);

        // ─── 2. Create Business ─────────────────────────────────────────
        $plan = Plan::where('name', 'Enterprise Plan')->first();
        $business = Business::create([
            'name' => 'Demo Traders (Hardware & Electricals)',
            'email' => 'test@demo.com',
            'phone' => '9999900000',
            'gst_number' => '27AABCD1234E1ZP',
            'address' => 'Shop No. 5, Main Market, Near Bus Stand',
            'owner_id' => $user->id,
            'status' => 'active',
            'plan_id' => $plan ? $plan->id : null,
            'plan_expires_at' => now()->addYear(),
            'state' => 'Bihar',
            'pincode' => '845401',
            'description' => 'Demo hardware and electricals shop for testing billing features',
        ]);

        // Attach user to business
        $user->businesses()->attach($business->id);

        // Assign Business Admin role
        setPermissionsTeamId($business->id);
        $businessAdminRole = \Spatie\Permission\Models\Role::firstOrCreate([
            'name' => 'Business Admin',
            'business_id' => $business->id,
            'guard_name' => 'web'
        ]);
        
        $businessPermissions = [
            'manage_sales', 'manage_inventory', 'manage_purchases',
            'manage_expenses', 'manage_customers', 'manage_suppliers',
            'manage_staff', 'manage_attendance', 'manage_payroll',
            'manage_business_settings',
        ];
        $businessAdminRole->syncPermissions($businessPermissions);
        
        $user->assignRole($businessAdminRole);

        // ─── 3. Seed Categories ─────────────────────────────────────────
        $categories = [];
        $catNames = ['Cement', 'Steel & Iron', 'Paints', 'Electricals', 'Plumbing', 'Tiles'];
        foreach ($catNames as $name) {
            $categories[$name] = Category::create([
                'business_id' => $business->id,
                'name' => $name,
            ]);
        }

        // ─── 4. Seed Brands ────────────────────────────────────────────
        $brands = [];
        $brandNames = ['Ultratech', 'Ambuja', 'Tata Tiscon', 'Jindal Panther', 'Asian Paints', 'Berger', 'Havells', 'Anchor', 'Supreme', 'Ashirvad'];
        foreach ($brandNames as $name) {
            $brands[$name] = Brand::create([
                'business_id' => $business->id,
                'name' => $name,
            ]);
        }

        // ─── 5. Seed Products with Batches ──────────────────────────────
        $products = [
            ['cat' => 'Cement', 'brand' => 'Ultratech', 'model' => 'PPC 50KG', 'unit' => 'bag', 'hsn' => '2523', 'gst' => 28, 'pp' => 320, 'mrp' => 380, 'qty' => 500],
            ['cat' => 'Cement', 'brand' => 'Ambuja', 'model' => 'PPC 50KG', 'unit' => 'bag', 'hsn' => '2523', 'gst' => 28, 'pp' => 310, 'mrp' => 370, 'qty' => 300],
            ['cat' => 'Steel & Iron', 'brand' => 'Tata Tiscon', 'model' => 'TMT Bar 12mm', 'unit' => 'kg', 'hsn' => '7214', 'gst' => 18, 'pp' => 65, 'mrp' => 85, 'qty' => 2000],
            ['cat' => 'Steel & Iron', 'brand' => 'Jindal Panther', 'model' => 'TMT Bar 10mm', 'unit' => 'kg', 'hsn' => '7214', 'gst' => 18, 'pp' => 64, 'mrp' => 84, 'qty' => 1500],
            ['cat' => 'Paints', 'brand' => 'Asian Paints', 'model' => 'Royale Luxury Emulsion 20L', 'unit' => 'ltr', 'hsn' => '3209', 'gst' => 18, 'pp' => 5500, 'mrp' => 6800, 'qty' => 50],
            ['cat' => 'Paints', 'brand' => 'Berger', 'model' => 'Silk Glamor 20L', 'unit' => 'ltr', 'hsn' => '3209', 'gst' => 18, 'pp' => 5200, 'mrp' => 6500, 'qty' => 40],
            ['cat' => 'Electricals', 'brand' => 'Havells', 'model' => 'Wire 1.5 sq mm (90m)', 'unit' => 'coil', 'hsn' => '8544', 'gst' => 18, 'pp' => 850, 'mrp' => 1100, 'qty' => 100],
            ['cat' => 'Electricals', 'brand' => 'Anchor', 'model' => 'Roma Switch 6A', 'unit' => 'nos', 'hsn' => '8536', 'gst' => 18, 'pp' => 25, 'mrp' => 45, 'qty' => 1000],
            ['cat' => 'Plumbing', 'brand' => 'Supreme', 'model' => 'PVC Pipe 1 inch x 20ft', 'unit' => 'nos', 'hsn' => '3917', 'gst' => 18, 'pp' => 350, 'mrp' => 500, 'qty' => 200],
            ['cat' => 'Plumbing', 'brand' => 'Ashirvad', 'model' => 'CPVC Pipe 1/2 inch', 'unit' => 'nos', 'hsn' => '3917', 'gst' => 18, 'pp' => 120, 'mrp' => 180, 'qty' => 300],
        ];

        $createdProducts = [];
        $counter = 1;
        foreach ($products as $p) {
            $product = Product::create([
                'business_id' => $business->id,
                'category_id' => $categories[$p['cat']]->id,
                'brand_id' => $brands[$p['brand']]->id,
                'model_name' => $p['model'],
                'item_code' => 'ITM-00' . $counter++,
                'unit' => $p['unit'],
                'hsn_code' => $p['hsn'],
                'gst_rate' => $p['gst'],
                'purchase_rate' => $p['pp'],
                'sale_rate' => $p['mrp'],
                'purchase_price' => $p['pp'], // Legacy fallback
                'mrp' => $p['mrp'], // Legacy fallback
                'quantity' => $p['qty'],
                'status' => 'in_stock',
            ]);

            // Create a batch for each product
            ProductBatch::create([
                'product_id' => $product->id,
                'batch_number' => 'BATCH-' . strtoupper(Str::random(6)),
                'purchase_price' => $p['pp'],
                'mrp' => $p['mrp'],
                'original_quantity' => $p['qty'],
                'remaining_quantity' => $p['qty'],
            ]);

            $createdProducts[] = $product;
        }

        // ─── 6. Seed Customers ──────────────────────────────────────────
        $customerData = [
            ['name' => 'Rahul Builders', 'phone' => '9876543210', 'address' => 'Patna, Bihar', 'gstin' => '10AABCR1234F1Z1', 'balance_type' => 'debit', 'balance' => 50000],
            ['name' => 'Priya Constructions', 'phone' => '9876543211', 'address' => 'Muzaffarpur, Bihar', 'gstin' => '10AABCP1234F1Z1', 'balance_type' => 'debit', 'balance' => 15000],
            ['name' => 'Amit Sharma (Contractor)', 'phone' => '9876543212', 'address' => 'Gaya, Bihar', 'gstin' => null, 'balance_type' => 'debit', 'balance' => 0],
            ['name' => 'Sneha Interiors', 'phone' => '9876543213', 'address' => 'Bhagalpur, Bihar', 'gstin' => '10AABCS1234F1Z1', 'balance_type' => 'debit', 'balance' => 20000],
        ];

        $customers = [];
        foreach ($customerData as $c) {
            $customers[] = Customer::create([
                'business_id' => $business->id,
                'name' => $c['name'],
                'phone' => $c['phone'],
                'address' => $c['address'],
                'gstin' => $c['gstin'],
                'opening_balance' => $c['balance'],
                'balance_type' => $c['balance_type'],
            ]);
        }

        // ─── 7. Seed Suppliers ──────────────────────────────────────────
        $supplierData = [
            ['name' => 'Ultratech Cement Depot', 'phone' => '9800000001', 'email' => 'ultratech@supplier.com', 'address' => 'Patna Wholesale', 'gst' => '10AABCJ1234E1ZP'],
            ['name' => 'Tata Steel Distributor', 'phone' => '9800000002', 'email' => 'tata@supplier.com', 'address' => 'Delhi NCR', 'gst' => '07AABCK5678F2ZQ'],
            ['name' => 'Havells Wholesaler', 'phone' => '9800000003', 'email' => 'havells@supplier.com', 'address' => 'Lucknow', 'gst' => '09AABCS9012G3ZR'],
        ];

        foreach ($supplierData as $s) {
            Supplier::create([
                'business_id' => $business->id,
                'name' => $s['name'],
                'phone' => $s['phone'],
                'address' => $s['address'],
                'gstin' => $s['gst'],
            ]);
        }

        // ─── 8. Seed Sales (Sample Invoices) ────────────────────────────
        $salesData = [
            // Sale 1: Cash sale
            [
                'customer_idx' => 0,
                'items' => [
                    ['product_idx' => 0, 'qty' => 50], // Ultratech Cement
                    ['product_idx' => 2, 'qty' => 200], // Tata Tiscon
                ],
                'payment_mode' => 'Cash',
                'discount' => 500,
                'days_ago' => 5,
            ],
            // Sale 2: Split payment
            [
                'customer_idx' => 1,
                'items' => [
                    ['product_idx' => 4, 'qty' => 5], // Asian Paints
                ],
                'payment_mode' => 'Split',
                'discount' => 1000,
                'days_ago' => 3,
                'split' => ['Cash' => 15000, 'UPI' => 18000],
            ],
            // Sale 3: Cash sale
            [
                'customer_idx' => 2,
                'items' => [
                    ['product_idx' => 6, 'qty' => 10], // Havells Wire
                    ['product_idx' => 7, 'qty' => 50], // Anchor Switch
                ],
                'payment_mode' => 'Cash',
                'discount' => 0,
                'days_ago' => 2,
            ],
        ];

        foreach ($salesData as $saleData) {
            $totalAmount = 0;
            $itemsPayload = [];

            foreach ($saleData['items'] as $itemData) {
                $product = $createdProducts[$itemData['product_idx']];
                $batch = $product->batches()->first();
                $subtotal = $product->sale_rate * $itemData['qty'];
                $totalAmount += $subtotal;

                $itemsPayload[] = [
                    'product' => $product,
                    'batch' => $batch,
                    'qty' => $itemData['qty'],
                    'price' => $product->sale_rate,
                    'subtotal' => $subtotal,
                ];
            }

            $discount = $saleData['discount'];
            $finalAmount = $totalAmount - $discount;

            $sale = Sale::create([
                'business_id' => $business->id,
                'customer_id' => $saleData['customer_idx'] !== null ? $customers[$saleData['customer_idx']]->id : null,
                'user_id' => $user->id,
                'invoice_number' => 'INV-DEMO-' . strtoupper(Str::random(6)),
                'total_amount' => $totalAmount,
                'discount' => $discount,
                'round_off' => 0,
                'final_amount' => $finalAmount,
                'paid_amount' => $finalAmount,
                'payment_mode' => $saleData['payment_mode'],
                'date' => now()->subDays($saleData['days_ago'])->toDateString(),
                'status' => 'completed',
            ]);

            // Create sale items & deduct stock
            foreach ($itemsPayload as $ip) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $ip['product']->id,
                    'product_batch_id' => $ip['batch'] ? $ip['batch']->id : null,
                    'quantity' => $ip['qty'],
                    'unit_price' => $ip['price'],
                    'subtotal' => $ip['subtotal'],
                ]);

                // Deduct stock
                $ip['product']->decrement('quantity', $ip['qty']);
                if ($ip['batch']) {
                    $ip['batch']->decrement('remaining_quantity', $ip['qty']);
                }

                InventoryMovement::create([
                    'product_id' => $ip['product']->id,
                    'type' => 'out',
                    'quantity' => $ip['qty'],
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                ]);
            }

            // Create payments
            if (!empty($saleData['split'])) {
                foreach ($saleData['split'] as $mode => $amount) {
                    SalePayment::create([
                        'sale_id' => $sale->id,
                        'payment_mode' => $mode,
                        'amount' => $amount,
                    ]);
                }
            } else {
                SalePayment::create([
                    'sale_id' => $sale->id,
                    'payment_mode' => $saleData['payment_mode'],
                    'amount' => $finalAmount,
                ]);
            }
        }

        // ─── 9. Seed Expenses ───────────────────────────────────────────
        $expenseData = [
            ['category' => 'Rent', 'amount' => 15000, 'desc' => 'Monthly shop rent - July 2026', 'days_ago' => 10],
            ['category' => 'Electricity', 'amount' => 3500, 'desc' => 'Electricity bill - June 2026', 'days_ago' => 8],
            ['category' => 'Staff Salary', 'amount' => 12000, 'desc' => 'Helper boy salary', 'days_ago' => 5],
            ['category' => 'Transport', 'amount' => 2000, 'desc' => 'Stock pickup from Patna', 'days_ago' => 3],
        ];

        foreach ($expenseData as $e) {
            Expense::create([
                'business_id' => $business->id,
                'category' => $e['category'],
                'amount' => $e['amount'],
                'description' => $e['desc'],
                'expense_date' => now()->subDays($e['days_ago'])->toDateString(),
                'added_by' => $user->id,
            ]);
        }

        $this->command->info('✅ Test business (Billing context) seeded successfully!');
        $this->command->info('   Login: test@demo.com / password123');
    }
}

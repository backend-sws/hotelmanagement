<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Business;
use App\Models\BusinessLocation;
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
use App\Models\Attendance;
use App\Models\BankAccount;
use App\Models\CashBankEntry;
use App\Models\ChequeRegister;
use App\Models\LedgerEntry;
use App\Models\Project;
use App\Models\MaterialConsumption;
use App\Models\MaterialConsumptionItem;
use App\Models\SalaryAdvance;

class TestBusinessSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🌱 Starting full BillKaro Enterprise ERP Master Seeder for test@demo.com...');

        // ─── 1. Create Master Test Admin User ───────────────────────────
        $user = User::where('email', 'test@demo.com')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'BillKaro Managing Director',
                'email' => 'test@demo.com',
                'phone' => '9898980001',
                'password' => Hash::make('password123'),
            ]);
        }

        // ─── 2. Create Enterprise Business Profile ──────────────────────
        $plan = Plan::where('name', 'Enterprise Plan')->first();
        $business = Business::firstOrCreate(
            ['email' => 'contact@billkaro.in'],
            [
                'name' => 'BillKaro Enterprises ERP (HQ)',
                'email' => 'contact@billkaro.in',
                'phone' => '9898980001',
                'gst_number' => '27AAACB1234F1Z9',
                'address' => 'Corporate Tower, Unit 402, BKC Hub',
                'owner_id' => $user->id,
                'status' => 'active',
                'plan_id' => $plan ? $plan->id : null,
                'plan_expires_at' => now()->addYear(),
                'state' => 'Maharashtra',
                'pincode' => '400051',
                'description' => 'Comprehensive enterprise construction, hardware & billing operation',
            ]
        );

        if (!$user->businesses->contains($business->id)) {
            $user->businesses()->attach($business->id);
        }

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

        // ─── 3. Add Staff Employees & Attendance ────────────────────────
        $staffRole = \Spatie\Permission\Models\Role::firstOrCreate([
            'name' => 'Staff',
            'business_id' => $business->id,
            'guard_name' => 'web'
        ]);

        $staffMembers = [
            ['name' => 'Rahul Sharma (Site Supervisor)', 'email' => 'rahul@billkaro.in', 'phone' => '9800000101', 'salary' => 35000],
            ['name' => 'Amit Kumar (Accounts & Billing)', 'email' => 'amit@billkaro.in', 'phone' => '9800000102', 'salary' => 28000],
        ];

        foreach ($staffMembers as $idx => $sm) {
            $staffUser = User::firstOrCreate(
                ['email' => $sm['email']],
                [
                    'name' => $sm['name'],
                    'phone' => $sm['phone'],
                    'password' => Hash::make('password123'),
                ]
            );

            if (!$staffUser->businesses->contains($business->id)) {
                $staffUser->businesses()->attach($business->id);
            }
            $staffUser->assignRole($staffRole);

            // Attendance Check-in for today
            Attendance::firstOrCreate(
                ['user_id' => $staffUser->id, 'date' => now()->toDateString()],
                [
                    'business_id' => $business->id,
                    'status' => 'present',
                    'check_in_time' => '09:15:00',
                    'check_out_time' => null,
                ]
            );

            // Seed salary advance
            if ($idx === 0) {
                SalaryAdvance::firstOrCreate(
                    ['user_id' => $staffUser->id, 'amount' => 5000],
                    [
                        'business_id' => $business->id,
                        'given_date' => now()->toDateString(),
                        'notes' => 'Emergency family requirement',
                        'status' => 'approved',
                    ]
                );
            }
        }

        // ─── 4. Godowns / Business Locations ────────────────────────────
        $mainWarehouse = BusinessLocation::firstOrCreate(
            ['name' => 'Main Yard & Storehouse (Mumbai HQ)', 'business_id' => $business->id],
            ['address' => 'Industrial Area, Phase II, Mumbai, Maharashtra', 'is_default' => true, 'latitude' => 19.0760, 'longitude' => 72.8777, 'radius_meters' => 500]
        );
        $siteWarehouse = BusinessLocation::firstOrCreate(
            ['name' => 'Site-A Construction Store (Thane)', 'business_id' => $business->id],
            ['address' => 'Project Site Camp, West Thane, Maharashtra', 'is_default' => false, 'latitude' => 19.1972, 'longitude' => 72.9772, 'radius_meters' => 800]
        );

        // ─── 5. Categories & Brands ─────────────────────────────────────
        $catNames = ['Cement & Concrete', 'Structural Steel', 'Luxury Paints', 'Electrical Fittings', 'Plumbing & Valves', 'Industrial Hardware'];
        $categories = [];
        foreach ($catNames as $name) {
            $categories[$name] = Category::firstOrCreate(['business_id' => $business->id, 'name' => $name]);
        }

        $brandNames = ['UltraTech', 'Tata Tiscon', 'Asian Paints', 'Havells', 'Anchor Roma', 'Supreme Pipes', 'Jindal Panther'];
        $brands = [];
        foreach ($brandNames as $name) {
            $brands[$name] = Brand::firstOrCreate(['business_id' => $business->id, 'name' => $name]);
        }

        // ─── 6. Products, Batches & Low Stock Alert Items ───────────────
        $productsData = [
            // Standard Stock
            ['cat' => 'Cement & Concrete', 'brand' => 'UltraTech', 'model' => 'Super PPC Portland 50KG', 'unit' => 'bag', 'hsn' => '2523', 'gst' => 28, 'pp' => 340, 'mrp' => 410, 'qty' => 450, 'reorder' => 50],
            ['cat' => 'Structural Steel', 'brand' => 'Tata Tiscon', 'model' => '500D TMT Rebar 12mm', 'unit' => 'kg', 'hsn' => '7214', 'gst' => 18, 'pp' => 68, 'mrp' => 88, 'qty' => 3500, 'reorder' => 500],
            ['cat' => 'Luxury Paints', 'brand' => 'Asian Paints', 'model' => 'Royale Glitz Emulsion 20L', 'unit' => 'ltr', 'hsn' => '3209', 'gst' => 18, 'pp' => 6200, 'mrp' => 7600, 'qty' => 45, 'reorder' => 10],
            ['cat' => 'Electrical Fittings', 'brand' => 'Havells', 'model' => 'FR Shield Wire 2.5 sqmm (90m)', 'unit' => 'coil', 'hsn' => '8544', 'gst' => 18, 'pp' => 1250, 'mrp' => 1650, 'qty' => 80, 'reorder' => 20],
            ['cat' => 'Plumbing & Valves', 'brand' => 'Supreme Pipes', 'model' => 'UPVC Heavy Drainage Pipe 4 inch', 'unit' => 'nos', 'hsn' => '3917', 'gst' => 18, 'pp' => 650, 'mrp' => 950, 'qty' => 150, 'reorder' => 30],
            
            // Critical Low Stock Items (To power Executive Dashboard Alert Widget!)
            ['cat' => 'Industrial Hardware', 'brand' => 'Jindal Panther', 'model' => 'Titanium Coated Masonry Drill Bit 10mm', 'unit' => 'nos', 'hsn' => '8207', 'gst' => 18, 'pp' => 320, 'mrp' => 480, 'qty' => 4, 'reorder' => 25],
            ['cat' => 'Industrial Hardware', 'brand' => 'Anchor Roma', 'model' => 'Heavy Duty Industrial Circuit Breaker 63A', 'unit' => 'nos', 'hsn' => '8536', 'gst' => 18, 'pp' => 1100, 'mrp' => 1550, 'qty' => 2, 'reorder' => 15],
        ];

        $createdProducts = [];
        $pCount = 101;
        foreach ($productsData as $p) {
            $product = Product::firstOrCreate(
                ['business_id' => $business->id, 'model_name' => $p['model']],
                [
                    'category_id' => $categories[$p['cat']]->id,
                    'brand_id' => $brands[$p['brand']]->id,
                    'item_code' => 'BLK-' . $pCount++,
                    'unit' => $p['unit'],
                    'hsn_code' => $p['hsn'],
                    'gst_rate' => $p['gst'],
                    'purchase_rate' => $p['pp'],
                    'sale_rate' => $p['mrp'],
                    'purchase_price' => $p['pp'],
                    'mrp' => $p['mrp'],
                    'quantity' => $p['qty'],
                    'min_stock_alert' => $p['reorder'],
                    'status' => 'in_stock',
                ]
            );

            ProductBatch::firstOrCreate(
                ['product_id' => $product->id],
                [
                    'batch_number' => 'BATCH-BLK-' . strtoupper(Str::random(5)),
                    'purchase_price' => $p['pp'],
                    'mrp' => $p['mrp'],
                    'original_quantity' => $p['qty'],
                    'remaining_quantity' => $p['qty'],
                ]
            );

            $createdProducts[] = $product;
        }

        // ─── 7. Customers & Suppliers (Khata Ledger Dues) ───────────────
        $customersData = [
            ['name' => 'DLF Commercial Infrastructures Ltd', 'phone' => '9876500001', 'address' => 'Lower Parel, Mumbai', 'gstin' => '27AAACD5678P1Z5', 'due' => 165000],
            ['name' => 'L&T Express Realty Projects', 'phone' => '9876500002', 'address' => 'Powai, Mumbai', 'gstin' => '27AAACL8899Q2Z1', 'due' => 85000],
            ['name' => 'Rajesh Shrivastava (Independent Villa)', 'phone' => '9876500003', 'address' => 'Juhu Scheme, West Mumbai', 'gstin' => null, 'due' => 24000],
        ];

        $createdCustomers = [];
        foreach ($customersData as $c) {
            $cust = Customer::firstOrCreate(
                ['business_id' => $business->id, 'name' => $c['name']],
                [
                    'phone' => $c['phone'],
                    'address' => $c['address'],
                    'gstin' => $c['gstin'],
                    'opening_balance' => $c['due'],
                    'balance_type' => 'debit',
                ]
            );
            $createdCustomers[] = $cust;

            // Seed Khata Receivable Ledger Entry
            LedgerEntry::firstOrCreate(
                ['business_id' => $business->id, 'party_type' => 'customer', 'party_id' => $cust->id, 'narration' => 'Opening Khata Receivable Balance'],
                [
                    'entry_type' => 'opening_balance',
                    'date' => now()->subDays(5)->toDateString(),
                    'debit' => $c['due'],
                    'credit' => 0,
                    'balance' => $c['due'],
                ]
            );
        }

        $suppliersData = [
            ['name' => 'UltraTech Cement Maharashtra Depot', 'phone' => '9900011111', 'gst' => '27AAACU1122M1ZM', 'payable' => 110000],
            ['name' => 'Tata Tiscon Mumbai Wholesale Yard', 'phone' => '9900022222', 'gst' => '27AAACT3344N2ZN', 'payable' => 45000],
        ];

        foreach ($suppliersData as $s) {
            $supp = Supplier::firstOrCreate(
                ['business_id' => $business->id, 'name' => $s['name']],
                ['phone' => $s['phone'], 'address' => 'Navi Mumbai Hub', 'gstin' => $s['gst']]
            );

            // Seed Khata Payable Ledger Entry
            LedgerEntry::firstOrCreate(
                ['business_id' => $business->id, 'party_type' => 'supplier', 'party_id' => $supp->id, 'narration' => 'Supplier Credit Invoice Due'],
                [
                    'entry_type' => 'purchase_bill',
                    'date' => now()->subDays(7)->toDateString(),
                    'debit' => 0,
                    'credit' => $s['payable'],
                    'balance' => -$s['payable'],
                ]
            );
        }

        // ─── 8. Cash & Bank Accounts (Liquid Reserves & Cheques) ────────
        $hdfc = BankAccount::firstOrCreate(
            ['business_id' => $business->id, 'account_number' => '50200088991100'],
            [
                'account_name' => 'BillKaro ERP Current A/c',
                'ifsc_code' => 'HDFC0000241',
                'bank_name' => 'HDFC Bank Ltd',
                'branch' => 'BKC Mumbai Corporate',
                'opening_balance' => 450000,
                'current_balance' => 450000,
                'is_default' => true,
            ]
        );

        $icici = BankAccount::firstOrCreate(
            ['business_id' => $business->id, 'account_number' => '001105009922'],
            [
                'account_name' => 'BillKaro Settlement A/c',
                'ifsc_code' => 'ICIC0000011',
                'bank_name' => 'ICICI Bank',
                'branch' => 'Bandra East',
                'opening_balance' => 180000,
                'current_balance' => 180000,
                'is_default' => false,
            ]
        );

        // Cash drawer deposit
        CashBankEntry::firstOrCreate(
            ['business_id' => $business->id, 'account_type' => 'cash', 'reference_no' => 'CASH-DEP-01'],
            [
                'entry_type' => 'cash_receipt',
                'account_name' => 'Main Cash Drawer',
                'amount' => 95000,
                'payment_mode' => 'Cash',
                'narration' => 'Daily counter counter collections & liquid float',
                'date' => now()->toDateString(),
                'entered_by' => $user->id,
            ]
        );

        // Pending bank cheques for widget
        ChequeRegister::firstOrCreate(
            ['business_id' => $business->id, 'cheque_number' => '889912'],
            [
                'bank_account_id' => $hdfc->id,
                'bank_name' => 'ICICI Bank',
                'branch' => 'Lower Parel',
                'cheque_date' => now()->addDays(2)->toDateString(),
                'amount' => 125000,
                'type' => 'received',
                'party_type' => 'customer',
                'party_id' => $createdCustomers[0]->id,
                'in_favour_of' => 'BillKaro Enterprises ERP (HQ)',
                'status' => 'pending',
                'notes' => 'Advance milestone payment for mall construction',
            ]
        );

        ChequeRegister::firstOrCreate(
            ['business_id' => $business->id, 'cheque_number' => '542109'],
            [
                'bank_account_id' => $icici->id,
                'bank_name' => 'State Bank of India',
                'branch' => 'Andheri West',
                'cheque_date' => now()->addDays(4)->toDateString(),
                'amount' => 60000,
                'type' => 'issued',
                'party_type' => 'supplier',
                'party_id' => 1,
                'in_favour_of' => 'UltraTech Cement Maharashtra Depot',
                'status' => 'pending',
                'notes' => 'Settlement against invoice delivery',
            ]
        );

        // ─── 9. Active Contracting Projects & Consumption ───────────────
        $project1 = Project::firstOrCreate(
            ['business_id' => $business->id, 'project_code' => 'PRJ-MALL-26'],
            [
                'name' => 'High-Rise Mall Complex Structural Phase',
                'client_name' => 'DLF Commercial Infrastructures Ltd',
                'client_phone' => '9876500001',
                'site_address' => 'Plot 14, Commercial Zone, Lower Parel',
                'city' => 'Mumbai',
                'start_date' => now()->subDays(20)->toDateString(),
                'end_date' => now()->addDays(60)->toDateString(),
                'contract_value' => 2500000,
                'status' => 'active',
                'description' => 'Complete structure & piping contracting works',
                'location_id' => $siteWarehouse->id,
                'created_by' => $user->id,
            ]
        );

        $project2 = Project::firstOrCreate(
            ['business_id' => $business->id, 'project_code' => 'PRJ-VILLA-04'],
            [
                'name' => 'Luxury Villa Interior & Wiring Suite',
                'client_name' => 'Rajesh Shrivastava',
                'client_phone' => '9876500003',
                'site_address' => 'Villa 104, Juhu Scheme',
                'city' => 'Mumbai',
                'start_date' => now()->subDays(10)->toDateString(),
                'end_date' => now()->addDays(25)->toDateString(),
                'contract_value' => 750000,
                'status' => 'active',
                'description' => 'Electrical automation and premium paint finishes',
                'location_id' => $mainWarehouse->id,
                'created_by' => $user->id,
            ]
        );

        // Record material consumption on project 1
        $consumption = MaterialConsumption::firstOrCreate(
            ['business_id' => $business->id, 'project_id' => $project1->id, 'consumption_number' => 'CON-MALL-001'],
            [
                'date' => now()->subDays(3)->toDateString(),
                'notes' => 'Site structural foundation and pillar pour consumption',
                'entered_by' => $user->id,
            ]
        );

        MaterialConsumptionItem::firstOrCreate(
            ['consumption_id' => $consumption->id, 'product_id' => $createdProducts[0]->id],
            [
                'quantity' => 120,
                'unit' => 'bag',
                'rate' => 340,
                'amount' => 40800,
                'notes' => 'Poured in Sector 4 pillars',
            ]
        );

        MaterialConsumptionItem::firstOrCreate(
            ['consumption_id' => $consumption->id, 'product_id' => $createdProducts[1]->id],
            [
                'quantity' => 800,
                'unit' => 'kg',
                'rate' => 68,
                'amount' => 54400,
                'notes' => 'Reinforced structural grid',
            ]
        );

        // ─── 10. Chronological 14-Day Sales & Expense Trend Chart Data ──
        $salesTrend = [
            ['days' => 13, 'amt' => 45000, 'cust' => 0, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 12, 'amt' => 82000, 'cust' => 1, 'mode' => 'Cheque', 'type' => 'sales_invoice'],
            ['days' => 11, 'amt' => 38000, 'cust' => 2, 'mode' => 'UPI', 'type' => 'sales_invoice'],
            ['days' => 10, 'amt' => 115000, 'cust' => 0, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 9,  'amt' => 64000, 'cust' => 1, 'mode' => 'Cash', 'type' => 'sales_invoice'],
            ['days' => 8,  'amt' => 92000, 'cust' => 0, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 7,  'amt' => 128000, 'cust' => 1, 'mode' => 'Cheque', 'type' => 'sales_invoice'],
            ['days' => 6,  'amt' => 55000, 'cust' => 2, 'mode' => 'UPI', 'type' => 'sales_invoice'],
            ['days' => 5,  'amt' => 142000, 'cust' => 0, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 4,  'amt' => 76000, 'cust' => 1, 'mode' => 'Cash', 'type' => 'sales_invoice'],
            ['days' => 3,  'amt' => 180000, 'cust' => 0, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 2,  'amt' => 88000, 'cust' => 2, 'mode' => 'UPI', 'type' => 'sales_invoice'],
            ['days' => 1,  'amt' => 155000, 'cust' => 1, 'mode' => 'Bank Transfer', 'type' => 'sales_invoice'],
            ['days' => 0,  'amt' => 95000, 'cust' => 0, 'mode' => 'Cash', 'type' => 'sales_invoice'],
            
            // Quotations, Proforma, and Challan
            ['days' => 2, 'amt' => 450000, 'cust' => 0, 'mode' => 'Pending', 'type' => 'quotation'],
            ['days' => 1, 'amt' => 220000, 'cust' => 1, 'mode' => 'Pending', 'type' => 'proforma'],
            ['days' => 0, 'amt' => 15000,  'cust' => 2, 'mode' => 'Pending', 'type' => 'delivery_challan'],
        ];

        $invCounter = 1001;
        foreach ($salesTrend as $st) {
            $prefix = match($st['type']) {
                'quotation' => 'EST-BLK-',
                'proforma' => 'PRO-BLK-',
                'delivery_challan' => 'CHL-BLK-',
                default => 'INV-BLK-',
            };

            $sale = Sale::firstOrCreate(
                ['business_id' => $business->id, 'invoice_number' => $prefix . $invCounter++],
                [
                    'customer_id' => $createdCustomers[$st['cust']]->id,
                    'user_id' => $user->id,
                    'invoice_type' => $st['type'],
                    'total_amount' => $st['amt'],
                    'discount' => 0,
                    'round_off' => 0,
                    'final_amount' => $st['amt'],
                    'paid_amount' => $st['type'] === 'sales_invoice' ? $st['amt'] : 0,
                    'payment_mode' => $st['mode'],
                    'date' => now()->subDays($st['days'])->toDateString(),
                    'status' => $st['type'] === 'sales_invoice' ? 'completed' : 'pending',
                ]
            );

            // Add sample items
            $prod = $createdProducts[($st['days'] % 5)];
            $qty = max(1, round($st['amt'] / $prod->sale_rate));
            
            SaleItem::firstOrCreate(
                ['sale_id' => $sale->id, 'product_id' => $prod->id],
                [
                    'product_batch_id' => $prod->batches()->first()?->id,
                    'quantity' => $qty,
                    'unit_price' => $prod->sale_rate,
                    'subtotal' => $st['amt'],
                ]
            );

            if ($st['type'] === 'sales_invoice') {
                SalePayment::firstOrCreate(
                    ['sale_id' => $sale->id],
                    ['payment_mode' => $st['mode'], 'amount' => $st['amt']]
                );

                InventoryMovement::firstOrCreate(
                    ['reference_type' => 'sale', 'reference_id' => $sale->id],
                    ['product_id' => $prod->id, 'type' => 'out', 'quantity' => $qty]
                );
            }
        }

        // ─── 11. Operational Expenses (To match Revenue Chart) ──────────
        $expensesData = [
            ['category' => 'Site Heavy Machinery & JCB Rent', 'amount' => 45000, 'days' => 12],
            ['category' => 'Site Worker Wages & Labour Payouts', 'amount' => 32000, 'days' => 9],
            ['category' => 'Logistics & Truck Freight Cargo', 'amount' => 18500, 'days' => 7],
            ['category' => 'HQ Electricity & Commercial Utility', 'amount' => 14200, 'days' => 5],
            ['category' => 'Office Refreshments & Site Travel', 'amount' => 8500,  'days' => 2],
            ['category' => 'Diesel & Generator Fuel Replacements', 'amount' => 22000, 'days' => 0],
        ];

        foreach ($expensesData as $e) {
            Expense::firstOrCreate(
                ['business_id' => $business->id, 'description' => $e['category'], 'amount' => $e['amount']],
                [
                    'category' => explode(' ', $e['category'])[0],
                    'expense_date' => now()->subDays($e['days'])->toDateString(),
                    'added_by' => $user->id,
                ]
            );
        }

        $this->command->info('✅ BillKaro Enterprise ERP Master Seeder completed successfully!');
        $this->command->info('👉 Primary Admin ID: test@demo.com');
        $this->command->info('👉 Password:         password123');
        $this->command->info('   (Includes 14-Day Analytics, Active Site Projects, Low Stock Alerts, Khata Dues & Complete Financial Suite)');
    }
}

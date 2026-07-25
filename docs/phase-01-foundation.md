# Phase 1 — Foundation: Database + Item Master
> **Duration:** Day 1 – Day 3
> **Goal:** Existing product/inventory structure ko billing software ke liye ready karo. Item Master (gitti/ballu/tiles/cement) + GST + HSN + units setup.

---

## Day 1 — Backend: Database Migrations + Models

### ✅ Tasks

#### 1.1 Existing Tables Ko Modify Karo

**Migration: Update `products` table → Item Master**
```
File: database/migrations/XXXX_update_products_for_billing.php

Add columns:
+ unit          ENUM(ton, cft, brass, bag, sqft, nos, rft, lumpsum, kg, ltr, mtr, set)
+ hsn_code      VARCHAR(10) nullable
+ gst_rate      ENUM(0, 5, 12, 18, 28) default 18
+ sale_rate     DECIMAL(12,2) default 0
+ purchase_rate DECIMAL(12,2) default 0
+ min_stock_alert DECIMAL(10,3) default 0
+ barcode       VARCHAR(50) nullable unique
+ opening_stock DECIMAL(10,3) default 0
+ description   TEXT nullable

Remove / make nullable:
~ imei → nullable (soft deprecate, don't hard delete)
~ serial_no → nullable
~ status ENUM → keep but add 'available' as default
```

**Migration: Update `customers` table**
```
File: database/migrations/XXXX_update_customers_for_billing.php

Add columns:
+ gstin             VARCHAR(15) nullable
+ state_code        VARCHAR(2) nullable
+ state_name        VARCHAR(50) nullable
+ price_list_id     FK nullable
+ credit_limit      DECIMAL(12,2) default 0
+ credit_days       INT default 0
+ opening_balance   DECIMAL(12,2) default 0
+ balance_type      ENUM(debit, credit) default debit
```

**Migration: Update `suppliers` table**
```
Add columns:
+ gstin          VARCHAR(15) nullable
+ state_code     VARCHAR(2) nullable
+ opening_balance DECIMAL(12,2) default 0
+ balance_type   ENUM(debit, credit) default credit
```

#### 1.2 New Tables Create Karo

**Migration: `price_lists` table**
```sql
id, business_id, name VARCHAR(50), description TEXT, is_default BOOLEAN
created_at, updated_at
```

**Migration: `price_list_items` table**
```sql
id, price_list_id, product_id, sale_rate DECIMAL(12,2)
```

**Migration: Update `business_locations`**
```
Add:
+ location_type ENUM(godown, site, yard, office) default godown
+ is_default    BOOLEAN default false
```

**Migration: `gst_settings` (per business)**
```sql
id, business_id
gstin VARCHAR(15)
business_name_on_gst VARCHAR(100)
state_code VARCHAR(2)
state_name VARCHAR(50)
is_composition_dealer BOOLEAN default false
e_invoice_enabled BOOLEAN default false
created_at, updated_at
```

#### 1.3 Models Update Karo

**`backend/app/Models/Product.php`**
- Add `unit`, `hsn_code`, `gst_rate`, `sale_rate`, `purchase_rate`, `min_stock_alert`, `barcode` to `$fillable`
- Add scope: `scopeLowStock()` — products where `quantity <= min_stock_alert`
- Add accessor: `getFormattedUnitAttribute()`

**`backend/app/Models/Customer.php`**
- Add gstin, state fields to `$fillable`
- Add relationship: `priceList()`

**New Model: `backend/app/Models/PriceList.php`**
- HasMany `priceListItems`
- BelongsToBusiness trait

**New Model: `backend/app/Models/PriceListItem.php`**
- BelongsTo `PriceList`, `Product`

---

## Day 2 — Backend: Item Master API + Price List API

### ✅ Tasks

#### 2.1 Update `InventoryController` (Item Master)

**File:** `backend/app/Http/Controllers/Api/Business/InventoryController.php`

```
Changes:
- index()  → Add filters: category, low_stock, unit, gst_rate
- store()  → Accept new fields: hsn_code, gst_rate, unit, sale_rate, purchase_rate, barcode
- update() → Same as store
- show()   → Return with price_list rates
- Add new method: lowStockAlert() → products below min_stock_alert
- Add new method: generateBarcode($id) → generate + return barcode
```

**Request Validation:**
```php
// StoreProductRequest.php update
'unit'           => 'required|in:ton,cft,brass,bag,sqft,nos,rft,lumpsum,kg,ltr,mtr,set',
'hsn_code'       => 'nullable|string|max:10',
'gst_rate'       => 'required|in:0,5,12,18,28',
'sale_rate'      => 'required|numeric|min:0',
'purchase_rate'  => 'nullable|numeric|min:0',
'min_stock_alert'=> 'nullable|numeric|min:0',
'barcode'        => 'nullable|string|unique:products,barcode',
'opening_stock'  => 'nullable|numeric|min:0',
```

#### 2.2 New `PriceListController`

**File:** `backend/app/Http/Controllers/Api/Business/PriceListController.php`

```
Methods:
- index()   → list all price lists with item count
- store()   → create price list
- show()    → price list with all items + current product info
- update()  → update name/description
- destroy() → soft delete (if not in use)
- syncItems(priceListId) → POST: bulk update rates for products
- getForProduct(productId) → GET: all price lists with rate for this product
```

#### 2.3 New `GstSettingController`

**File:** `backend/app/Http/Controllers/Api/Business/GstSettingController.php`

```
Methods:
- show()   → get business GST settings
- update() → save GSTIN, state, e-invoice toggle
```

#### 2.4 Routes Add Karo

**File:** `backend/routes/api.php` — business group mein add:
```php
// Item Master
Route::get('inventory/low-stock', [InventoryController::class, 'lowStockAlert']);
Route::get('inventory/{id}/barcode', [InventoryController::class, 'generateBarcode']);

// Price Lists
Route::apiResource('price-lists', PriceListController::class);
Route::post('price-lists/{id}/items', [PriceListController::class, 'syncItems']);
Route::get('price-lists/product/{productId}', [PriceListController::class, 'getForProduct']);

// GST Settings
Route::get('gst-settings', [GstSettingController::class, 'show']);
Route::put('gst-settings', [GstSettingController::class, 'update']);
```

---

## Day 3 — Frontend: Item Master UI Rebuild

### ✅ Tasks

#### 3.1 Item Master Page Rebuild

**File:** `frontend/src/features/business/inventory/pages/InventoryPage.tsx`

```
Changes:
- Table columns update:
  OLD: Brand | Model | IMEI | MRP | Status
  NEW: Item Name | HSN Code | Unit | Sale Rate | Purchase Rate | GST% | Stock | Min Alert

- Filters add:
  + Unit filter dropdown (ton/cft/brass...)
  + GST rate filter
  + Low stock toggle (red highlight)
  + Category filter (existing)

- Add "Low Stock Alert" badge on items below minimum
```

#### 3.2 Add/Edit Item Form Rebuild

**File:** `frontend/src/features/business/inventory/components/AddProductForm.tsx` (ya jo bhi existing form hai)

```
Form Fields:
Section 1 — Basic Info:
  - Item Name (text)
  - Category (dropdown — existing)
  - Description (textarea)
  - HSN Code (text, 4-8 digits)

Section 2 — Unit & Rates:
  - Unit (dropdown: Ton/CFT/Brass/Bag/Sqft/Nos/Rft/Kg/Ltr/Mtr/Set/Lumpsum)
  - Sale Rate (number)
  - Purchase Rate (number)
  - GST Rate (dropdown: 0%/5%/12%/18%/28%)
  - MRP (number, optional)

Section 3 — Stock:
  - Opening Stock (number)
  - Minimum Stock Alert (number — low stock trigger)
  - Barcode (text, auto-generate button)

Section 4 — Remove (IMEI, Serial No, Brand — hide these)
```

#### 3.3 Price List Management Page

**New file:** `frontend/src/features/business/inventory/pages/PriceListPage.tsx`

```
Features:
- List: Retail / Wholesale / Contractor price lists
- Create new price list with name
- Click → Open price list:
  - Table of all products
  - Editable rate column per product
  - Bulk save
- Assign price list to customer (link to customer form)
```

#### 3.4 GST Settings Page

**Modify:** `frontend/src/features/business/settings/pages/BusinessSettingsPage.tsx`

```
Add new "GST & Tax" tab:
- GSTIN (text with format validation: 15 chars)
- Business Name on GST
- State (dropdown of Indian states with codes)
- Composition Dealer toggle
- E-Invoice enabled toggle
- Save button
```

#### 3.5 Categories Update

**File:** `frontend/src/features/business/inventory/pages/CategoriesPage.tsx`

```
Change default category suggestions:
OLD: Mobile, Electronics, Accessories
NEW: Aggregate (Gitti/Ballu), Cement & TMT, Tiles & Flooring, 
     Sand & Stone, Paint, Hardware, Labour, Other
```

#### 3.6 Sidebar Navigation Update

**File:** `frontend/src/components/layout/` (sidebar component)

```
Rename:
- "Items" → "Item Master"
- Add under Inventory section: "Price Lists"
Remove:
- "Brands" link (deactivate route)
```

---

## ✅ Phase 1 Done — Checklist

- [ ] Migration: products table updated (unit, hsn, gst_rate, rates)
- [ ] Migration: customers + suppliers GST fields
- [ ] Migration: price_lists + price_list_items tables
- [ ] Migration: gst_settings table
- [ ] Model: Product.php updated
- [ ] Model: PriceList.php + PriceListItem.php created
- [ ] InventoryController: updated with new fields + low stock
- [ ] PriceListController: created
- [ ] GstSettingController: created
- [ ] Routes: updated
- [ ] Frontend: Item Master table + form rebuilt
- [ ] Frontend: Price List page created
- [ ] Frontend: GST Settings tab added
- [ ] Frontend: Categories updated
- [ ] Frontend: Sidebar updated

---

## 🔗 Next → [Phase 2: Invoice Engine](./phase-02-invoice-engine.md)

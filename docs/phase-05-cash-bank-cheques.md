# Phase 5 — Cash/Bank Entries + Cheque Register
> **Duration:** Day 15 – Day 16
> **Goal:** Roz ka cash aana-jaana record karo + cheque tracking. EMI Finance Ledger ko replace karo Cheque Register se.

---

## Day 15 — Backend: Cash/Bank + Cheque

### ✅ Tasks

#### 15.1 Migrations

**Migration: Create `cash_bank_entries` table**
```sql
id, business_id
entry_type    ENUM(cash_receipt, cash_payment, bank_receipt, bank_payment)
account_type  ENUM(cash, bank) DEFAULT 'cash'
account_name  VARCHAR(100) nullable  ← "HDFC Bank", "Petty Cash"
party_type    ENUM(customer, supplier, other) nullable
party_id      BIGINT nullable
amount        DECIMAL(12,2)
payment_mode  ENUM(cash, upi, neft, rtgs, cheque, dd, other)
reference_no  VARCHAR(100) nullable  ← UPI transaction ID, cheque no.
narration     TEXT
date          DATE
entered_by    BIGINT FK (users)
created_at, updated_at
```

**Migration: Create `cheque_register` table**
```sql
id, business_id
cheque_number  VARCHAR(50)
bank_name      VARCHAR(100)
branch         VARCHAR(100) nullable
cheque_date    DATE
amount         DECIMAL(12,2)
type           ENUM(received, issued)  ← received from customer / issued to supplier
party_type     ENUM(customer, supplier)
party_id       BIGINT
in_favour_of   VARCHAR(100)  ← name on cheque
deposit_date   DATE nullable
clearance_date DATE nullable
bounce_date    DATE nullable
bounce_reason  VARCHAR(255) nullable
status         ENUM(pending, deposited, cleared, bounced, cancelled) DEFAULT 'pending'
reference_invoice_id BIGINT nullable  ← linked invoice/purchase
notes          TEXT nullable
created_at, updated_at
```

**Migration: Create `bank_accounts` table**
```sql
id, business_id
account_name   VARCHAR(100)  ← "HDFC Savings", "SBI Current"
account_number VARCHAR(20)
ifsc_code      VARCHAR(20)
bank_name      VARCHAR(100)
branch         VARCHAR(100) nullable
opening_balance DECIMAL(12,2) DEFAULT 0
is_default     BOOLEAN DEFAULT false
created_at, updated_at
```

#### 15.2 `CashBankController`

**File:** `backend/app/Http/Controllers/Api/Business/CashBankController.php`

```
Methods:

index()
  - Filter: date, entry_type, account_type, party
  - Returns entries list with running balance
  - Today's opening cash balance

store()
  - Validate entry_type, amount, date
  - Link to party if provided (update ledger)
  - Log activity

dayBook($date)
  - GET /cash-bank/day-book?date=2026-07-24
  - All transactions of a specific day
  - Cash opening balance + all entries + closing balance
  - Bank entries separately

cashBalance()
  - GET: Current cash in hand
  - = Opening + receipts - payments

bankBalance($accountId)
  - GET: Current bank balance for an account
```

#### 15.3 `ChequeController`

**File:** `backend/app/Http/Controllers/Api/Business/ChequeController.php`

```
Methods:

index()
  - Filter: type (received/issued), status, date_range
  - Return with party name, amount, bank

store()
  - Record new cheque (received or issued)
  - Link to invoice/purchase if provided

show($id) / update($id) / destroy($id)

updateStatus($id)
  - PATCH: {status: 'deposited', deposit_date: '...'}
  - PATCH: {status: 'cleared', clearance_date: '...'}
  - PATCH: {status: 'bounced', bounce_date: '...', bounce_reason: '...'}
  - On bounce: send alert, update party outstanding

pending()
  - GET: Cheques pending deposit (received but not deposited)
  - Sort by cheque_date ASC (oldest first)

upcoming()
  - GET: Cheques due for deposit in next 7 days

summary()
  - Total received pending, total issued pending
  - Count by status
```

#### 15.4 `BankAccountController`

**File:** `backend/app/Http/Controllers/Api/Business/BankAccountController.php`

```
- CRUD for bank accounts
- Used in cash_bank_entries + cheque_register
```

#### 15.5 Routes

```php
// Cash/Bank
Route::get('cash-bank/day-book', [CashBankController::class, 'dayBook']);
Route::get('cash-bank/cash-balance', [CashBankController::class, 'cashBalance']);
Route::get('cash-bank/bank-balance/{accountId}', [CashBankController::class, 'bankBalance']);
Route::apiResource('cash-bank', CashBankController::class);

// Cheques
Route::get('cheques/pending', [ChequeController::class, 'pending']);
Route::get('cheques/upcoming', [ChequeController::class, 'upcoming']);
Route::get('cheques/summary', [ChequeController::class, 'summary']);
Route::patch('cheques/{id}/status', [ChequeController::class, 'updateStatus']);
Route::apiResource('cheques', ChequeController::class);

// Bank Accounts
Route::apiResource('bank-accounts', BankAccountController::class);
```

---

## Day 16 — Frontend: Cash Book + Cheque Register Pages

### ✅ Tasks

#### 16.1 Cash/Bank Entry Page

**New files:**
```
frontend/src/features/business/cashbook/
  pages/
    CashBookPage.tsx
    DayBookPage.tsx
  components/
    CashEntryForm.tsx
    BalanceCard.tsx
  api/
    cashbookService.ts
```

**`CashBookPage.tsx`:**
```
Layout:
Header cards:
  [Cash in Hand: ₹X,XXX] [HDFC Bank: ₹X,XXX] [SBI: ₹X,XXX]

Filter bar: Date | Type | Account | Party

Table:
  Date | Type | Party | Mode | Narration | Debit | Credit | Balance
  (Color: receipt = green row, payment = red row)

"+ Add Entry" button → opens CashEntryForm modal

Entry types:
  - Cash Receipt (customer payment)
  - Cash Payment (supplier payment / expense)
  - Bank Receipt
  - Bank Payment
```

**`CashEntryForm.tsx` (modal):**
```
Fields:
- Entry Type (Radio: Cash Receipt / Cash Payment / Bank Receipt / Bank Payment)
- Date (default: today)
- Account (if bank: select bank account)
- Party (optional: customer or supplier search)
- Amount
- Payment Mode (Cash / UPI / NEFT / Cheque / DD)
- Reference Number (UPI ID, cheque no, etc.)
- Narration / Description
- Link to Invoice (optional: search invoice)
```

**`DayBookPage.tsx`:**
```
Date picker (default: today)

Summary:
  Opening Cash Balance: ₹X
  Total Receipts: ₹X
  Total Payments: ₹X
  Closing Cash Balance: ₹X

Table: All transactions of the day
  Time | Type | Party | Narration | Amount | Mode
```

#### 16.2 Cheque Register Page

**New files:**
```
frontend/src/features/business/cheques/
  pages/
    ChequeRegisterPage.tsx
  components/
    ChequeForm.tsx
    ChequeStatusModal.tsx
    ChequeSummaryCards.tsx
  api/
    chequeService.ts
```

**`ChequeRegisterPage.tsx`:**
```
Alert section (top):
  [⚠️ 3 cheques pending deposit] [⏰ 2 cheques due this week]

Tabs: Received | Issued

Summary Cards:
  Pending Deposit | Deposited | Cleared | Bounced

Table:
  Cheque# | Bank | Date | Party | Amount | Deposit Date | Status | Actions

Status badges (colored):
  ⚪ Pending → 🟡 Deposited → 🟢 Cleared / 🔴 Bounced

Actions:
  "Mark Deposited" → opens modal with deposit_date
  "Mark Cleared" → opens modal with clearance_date
  "Mark Bounced" → opens modal with reason
  View linked invoice

"+ Add Cheque" button → ChequeForm modal
```

**`ChequeForm.tsx` (modal):**
```
Fields:
- Type: Received (from customer) / Issued (to supplier)
- Cheque Number
- Bank Name + Branch
- Cheque Date (printed on cheque)
- In Favour Of
- Amount
- Party (customer / supplier search)
- Link to Invoice/Purchase (optional)
- Notes
```

#### 16.3 Finance Ledger → Replace

**Modify:** `frontend/src/features/business/finance/pages/FinanceLedgerPage.tsx`

```
Option A: Redirect /finance → /outstanding (recommended)
Option B: Keep as combined view of cash + cheques

→ Go with Option A: 
   Add redirect route in App.tsx:
   <Route path="/finance" element={<Navigate to="/outstanding" replace />} />
```

#### 16.4 Routes Update (App.tsx)

```typescript
const CashBookPage = lazy(() => import('@/features/business/cashbook/pages/CashBookPage'));
const DayBookPage = lazy(() => import('@/features/business/cashbook/pages/DayBookPage'));
const ChequeRegisterPage = lazy(() => import('@/features/business/cheques/pages/ChequeRegisterPage'));

<Route path="/cashbook" element={<BusinessRoute><CashBookPage /></BusinessRoute>} />
<Route path="/daybook" element={<BusinessRoute><DayBookPage /></BusinessRoute>} />
<Route path="/cheques" element={<BusinessRoute><ChequeRegisterPage /></BusinessRoute>} />
<Route path="/finance" element={<Navigate to="/outstanding" replace />} />
```

---

## ✅ Phase 5 Done — Checklist

**Database:**
- [ ] cash_bank_entries table created
- [ ] cheque_register table created
- [ ] bank_accounts table created

**Backend:**
- [ ] CashBankController: CRUD + day book + balance
- [ ] ChequeController: CRUD + status updates + pending/summary
- [ ] BankAccountController: CRUD
- [ ] Routes added

**Frontend:**
- [ ] CashBookPage (running balance + color coded)
- [ ] CashEntryForm modal
- [ ] DayBookPage (date-wise all transactions)
- [ ] ChequeRegisterPage (tabs + alerts + status management)
- [ ] ChequeForm modal + ChequeStatusModal
- [ ] Finance route → redirected to Outstanding
- [ ] Routes updated

---

## 🔗 Previous → [Phase 4](./phase-04-purchase-supplier.md) | Next → [Phase 6](./phase-06-stock-inventory.md)

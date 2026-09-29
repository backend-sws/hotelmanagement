# Phase 10 — 🧾 GST Compliance Hub (`/features/gst`)

**File:** `resources/js/Pages/Landing/GstCompliancePage.tsx`  
**Status:** ✅ Complete | **Sections:** 32

**SEO Title:** "GST Billing Software & E-Invoicing Platform India — GSTR-1, 2B, 3B & E-Way Bill | Nexus Billing"  
**Meta Description:** "India's #1 Automated GST Compliance & E-Invoicing Cloud ERP. Direct NIC IRP E-Invoicing, automated GSTR-2B vs Purchase Book reconciliation, 1-click E-Way Bills, GSTR-1/3B JSON export, and instant GSTIN validation."

---

## 🧾 Key Sections (32 Sections):

### Module 1: GST Hero & Statutory Architecture (Sections 1-5)
1. `GstHero` — "India's Most Trusted 100% Compliant GST & E-Invoicing Cloud Platform" with an interactive dual-mode compliance terminal (Live B2B E-Invoice IRN Generator vs GSTR-2B ITC Matcher).
2. `LiveGstinValidationTool` — Interactive GSTIN verification tool: enter any 15-digit GSTIN to fetch business legal trade name, active status, tax type, and filing frequency via live government API.
3. `ComprehensiveGstFilingMatrix` — Coverage of all key GST returns: GSTR-1 (Sales), GSTR-3B (Monthly Summary), GSTR-2B (ITC Match), GSTR-9 (Annual), CMP-08 (Composition).
4. `LiveGstMetricsStream` — Live ticker: ₹8,400+ Cr Invoices Processed, 99.98% IRN Generation Success, 0% ITC Mismatch Penalty, 100% Real-Time Cloud Sync.
5. `GstQuickNavHub` — Light sticky jump navigation bar for rapid module exploration.

### Module 2: E-Invoicing & E-Way Bill Generation (Sections 6-10)
6. `DirectIrpEInvoicingEngine` — Direct API connection with government IRP portals (NIC, Cygnet, Clear) generating 64-character IRN and signed QR codes in &lt;200ms.
7. `InstantEWayBillDispatch` — 1-click E-Way Bill generation directly from the invoice dispatch screen with automated Pin-to-Pin distance calculation.
8. `MultiVehicleAndConsolidatedEwb` — Support for transshipment, vehicle breakdown number updates, and consolidated E-Way Bills for multiple delivery drop-offs.
9. `B2cDynamicUpiQrCompliance` — Mandatory dynamic UPI QR code on B2C tax invoices for companies with turnover &gt;₹500 Cr.
10. `InteractiveEInvoiceSimulator` — Interactive web simulator letting users preview a live GST Tax Invoice with an authentic scanned IRN QR code.

### Module 3: GSTR-2B vs Purchase Reconciliation & ITC Protection (Sections 11-16)
11. `AutomatedGstr2bReconciliation` — 2-way matching of supplier invoices on the GST portal against your purchase register: categorizes into Matched, Mismatched, and Missing in 2B.
12. `Rule364ItcMaximizer` — Prevents claiming excess ITC and guards against GST department demand notices by enforcing the statutory 105% ITC claim cap.
13. `DefaulterSupplierNoticeAutomator` — Automated WhatsApp and email alerts sent to non-filing suppliers whose missing GSTR-1 invoices are blocking your tax credits.
14. `CreditNoteAndDebitNoteReconciliation` — Proper statutory adjustment of purchase returns, rate difference debit notes, and post-sale discount credit notes.
15. `ReverseChargeMechanismRcmEngine` — Automatic tracking of RCM under Section 9(3) and 9(4) for GTA transport, legal services, and unregistered vendor purchases.
16. `InteractiveItcRecoveryCalculator` — Interactive slider demonstrating how automated 2B reconciliation saves ₹2.4L to ₹18L annually in lost tax credits.

### Module 4: HSN / SAC Codes, Multi-Rate Tax & Composition (Sections 17-21)
17. `IntelligentHsnSacCodeFinder` — Smart search library covering 15,000+ HSN and SAC codes with multi-rate GST schedules (0%, 5%, 12%, 18%, 28%) and compensation cess.
18. `CompositionVsRegularEngine` — Dual billing mode: 1% Composition billing with "Bill of Supply" vs Regular 18% Tax Invoice with full Input Tax Credit.
19. `InterStateVsIntraStateTaxBifurcation` — Automated location detection splitting line items into CGST + SGST (intra-state) or IGST (inter-state) based on Place of Supply.
20. `ExportInvoicingUnderLut` — Compliant export invoices in foreign currencies (USD, EUR, AED) with Letter of Undertaking (LUT) reference for zero-tax shipping.
21. `SpecialEconomicZoneSezBilling` — Dedicated tax billing rules for SEZ developers and SEZ units with and without payment of integrated tax.

### Module 5: Accounting Bridge, Tally Prime & Audit Defense (Sections 22-26)
22. `TwoWayTallyPrimeGstSync` — Bi-directional cloud sync posting sales, purchases, and tax ledgers (Output CGST, Output SGST, Input IGST) directly into Tally Prime.
23. `AnnualGstr9AuditPack` — 1-click generation of annual GSTR-9 and GSTR-9C reconciliation tables with turnover mismatch analysis.
24. `DepartmentNoticeAuditDefense` — Comprehensive audit trails, invoice amendment history, and timestamped dispatch records to answer ASMT-10 scrutiny notices.
25. `GstTdsAndTcsCompliance` — Deductions under Section 51 (GST TDS for government supplies) and Section 52 (GST TCS for e-commerce operators).
26. `RoleBasedTaxAuthorization` — Granular permission gates preventing junior billing clerks from editing finalized invoices or voiding IRN-generated bills.

### Module 6: Enterprise Social Proof, FAQ & Closing (Sections 27-32)
27. `VerifiedGstCaseStudies` — 3 real-world MSME case studies:
   - *Mahalaxmi FMCG Distributors (Nagpur)*: Reconciled 4,200 monthly purchase bills, recovered ₹14.8L in missed GSTR-2B input credits.
   - *Kailash Engineering Works (Rajkot)*: 100% compliant E-Invoicing for 65 CNC machines, zero transport highway detention.
   - *Siddhi Polychem (Vapi)*: Automated multi-state GST filing across Maharashtra, Gujarat, and Daman depots.
28. `InteractiveGstPenaltyCalculator` — Interactive calculator estimating potential Section 122 penalty savings and interest reduction.
29. `GstComplianceFaqSection` — 8 detailed FAQs covering E-Invoicing turnover limits, GSTR-2B reconciliation, E-Way Bill validity, and amendment rules.
30. `GovernmentComplianceAndSecurityBadges` — Official IRP GSP Partner, 256-Bit SSL, ISO 27001 Certified, 99.99% Cloud SLA.
31. `ClosingGstTrialCta` — High-converting closing banner with 14-day free trial CTA and free GST health audit booking.
32. `TaxConsultantAndCaPartnerProgram` — Dedicated portal for chartered accountants and tax practitioners to manage multiple client GST filings from one master dashboard.

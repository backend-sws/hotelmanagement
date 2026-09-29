# Phase 8 — 🏭 Solutions — Manufacturing & Job Work ERP (`/solutions/manufacturing`)

**File:** `resources/js/Pages/Landing/Solutions/ManufacturingPage.tsx`  
**Status:** ✅ Complete | **Sections:** 33

**SEO Title:** "Manufacturing ERP & Job Work Software India — Multi-Level BOM & Shop Floor | Nexus Billing"  
**Meta Description:** "India's #1 Cloud Manufacturing ERP for MSMEs. Multi-level Bill of Materials (BOM), shop floor work orders, Job Work under GST Section 143 (ITC-04), batch heat tracking, machine OEE, and landed cost estimation."

---

## 🏭 Key Sections (33 Sections):

### Module 1: Manufacturing Hero & Industry Verticals (Sections 1-4)
1. `ManufacturingHero` — "India's #1 Cloud Manufacturing & Job Work ERP for MSMEs" (Interactive Shop Floor Work Order vs Multi-Level BOM Terminal).
2. `ManufacturingVerticalSwitcher` — 6 specialized Indian manufacturing sectors:
   - *Automotive & CNC Machining* (Heat numbers, mill test reports, job work outward)
   - *Textiles & Garment Manufacturing* (Style-color-size matrix, fabric shrinkage, cutting markers)
   - *Chemicals & Pharmaceuticals* (Batch formulation, yield loss, CGMP compliance)
   - *Plastics & Injection Molding* (Mold cavity count, runner scrap regrind %, cycle times)
   - *Electronics & PCB Assembly* (SMT feeder pick-and-place, component reels, serial warranty)
   - *Food & Beverage Processing* (Batch expiry dates, recipe BOM, FSSAI lot traceability)
3. `LiveProductionMetricsStream` — Live ticker: 4.8M Metric Tons Tracked, 99.7% Inventory Traceability, 0% ITC-04 GST Penalty Risk, 100% Real-Time Cloud Sync.
4. `ManufacturingQuickNavHub` — Sticky jump navigation for quick module exploration.

### Module 2: Multi-Level BOM & Production Work Orders (Sections 5-10)
5. `MultiLevelBomTreeBuilder` — Hierarchical raw material and sub-assembly tree with dynamic scrap percentage calculation.
6. `ShopFloorRoutingEngine` — Sequential routing steps (Raw Material Slitting -> CNC Turning -> Hardening -> Powder Coating -> Final Assembly -> QA).
7. `WorkOrderGenerationAndDispatch` — 1-click conversion from Sales Order to Production Work Order with material reservation.
8. `MaterialRequisitionSlip` — Auto-generated store issue slips ensuring shop floor workers only receive allocated BOM quantities.
9. `ScrapAndByProductRecovery` — Tracking metal turning scrap, runner regrind, and offcut resale to credit product unit cost.
10. `InteractiveBomCostingSimulator` — Interactive slider calculating finished good cost based on raw material, machine hourly rate, and direct labor.

### Module 3: GST Section 143 Job Work & Subcontracting (Sections 11-16)
11. `JobWorkOutwardDeliveryChallan` — Compliant delivery challans for sending raw material to job workers with SAC 9988 coding.
12. `GstSection143AgingTracker` — 180-day (Capital Goods: 3-year) return clock to prevent deemed supply tax liabilities under GST law.
13. `FormGstItc04AutoFiling` — 1-click auto-generation of quarterly Form GST ITC-04 report for outward and inward job work goods.
14. `SubcontractorRateCards` — Flexible contract pricing: per kg, per meter, per piece, or machine hours with TDS Section 194C deduction.
15. `JobWorkScrapAccountability` — Tracking whether scrap/turnings are retained by subcontractor or returned to principal manufacturer.
16. `SubcontractorVendorPortal` — Job workers update completion status, dispatch challan numbers, and delivery weights from their phones.

### Module 4: Batch Heat Tracking, Machine OEE & Shop Floor IoT (Sections 17-22)
17. `BatchLotAndHeatNumberTraceability` — Complete backward/forward traceability from raw material supplier heat number to final dispatched customer serial.
18. `MachineDowntimeAndOeeTracker` — Visual breakdown monitoring: Availability x Performance x Quality = Overall Equipment Effectiveness (OEE).
19. `ShopFloorBarcodeWorkCenterScanner` — Workers scan QR barcodes on router job travelers at each machine stage using smartphone or rugged scanner.
20. `PreventiveMaintenanceSchedules` — Machine runtime hour meters triggering automated lubrication, tool replacement, and maintenance alerts.
21. `OperatorPieceRateIncentive` — Real-time tracking of operator output per shift for accurate piece-rate wage settlement.
22. `ProductionYieldAndVarianceReport` — Daily comparison of theoretical BOM output vs actual production yield identifying shop floor theft and inefficiency.

### Module 5: Quality Control, Landed Costing & Tally Prime Sync (Sections 23-28)
23. `ThreeStageQcInspectionGateway` — Raw material inward inspection (GRN QC), In-process line check, and Pre-dispatch inspection (PDI) with rejection slips.
24. `TrueLandedCostEstimation` — Raw material cost + inbound freight + electricity tariff + direct labor + overhead absorption per finished unit.
25. `MrpRawMaterialShortageAlerts` — Material Requirements Planning engine calculating lead times, minimum order quantities (MOQ), and safety stock alerts.
26. `TallyPrimeManufacturingSync` — Automatic creation of Manufacturing Journals, Stock Transfer Vouchers, and Job Work consumption entries in Tally Prime.
27. `EWayBillAndEInvoiceDispatchGate` — Direct generation of NIC E-Way Bills and B2B E-Invoices right from factory dispatch bay.
28. `StatutoryHsnAndGstBilling` — Manufacturing HSN chapters (72, 73, 84, 85) with multi-rate GST, reverse charge mechanism (RCM), and export LUT invoicing.

### Module 6: Enterprise Social Proof, ROI Calculator & Closing (Sections 29-33)
29. `VerifiedManufacturingCaseStudies` — 3 real-world MSME case studies:
   - *Precision Auto Forgings (Pune)*: 120 CNC machines, saved ₹4.2L monthly on unreturned job work scrap.
   - *Apex Garment Exports (Tirupur)*: 350 sewing lines, cut fabric shrinkage wastage from 6.8% to 1.9%.
   - *Shree Polychem (Vapi)*: Chemical batching, 100% compliance on batch traceability and zero expired raw material loss.
30. `InteractiveManufacturingRoiCalculator` — Dynamic sliders for monthly raw material turnover and scrap percentage calculating annual bottom-line savings.
31. `ManufacturingFaqSection` — 8 manufacturing-specific FAQs with search and category filters (Job Work, BOM, Tally, GST ITC-04).
32. `IndustrialSecurityAndReliabilityBadges` — 100% Real-Time Cloud Sync, ISO 9001 audit-ready reports, 256-bit AES database encryption, 99.99% Cloud SLA.
33. `ClosingManufacturingTrialCta` — High-conversion banner with 14-day free trial CTA and custom ERP consultation booking.

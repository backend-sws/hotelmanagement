import{r as i,j as e}from"./app-C0-4sjZ8.js";function p(){const[n,t]=i.useState(!1),[o,a]=i.useState(!1),s=`To,
The Proper Officer / Superintendent of Central/State GST,
Range / Ward [Ward Number], [City, State]

Subject: Reply to Scrutiny Notice issued in Form GST ASMT-10 dated [Date] under Reference Number [RefNo] for FY 2025-26.

Respected Sir/Madam,

With reference to the notice cited above regarding alleged discrepancy in Input Tax Credit (ITC) between Form GSTR-3B and Form GSTR-2A/2B for the tax period [Month/Year], the Taxpayer [Business Name, GSTIN: 27AAAAA0000A1Z5] respectfully submits as under:

1. Verification of Tax Invoices under Section 16(2):
The Taxpayer is in possession of genuine tax invoices issued by suppliers registered under the GST Act. All goods/services were duly received and payments, including tax components, have been discharged through legitimate banking channels within 180 days in compliance with the second proviso to Section 16(2) of the CGST Act.

2. Reconciliation with Form GSTR-2B:
The difference highlighted in Table 4(A)(5) pertains to supplies reported by vendors in subsequent GSTR-1 filings. An itemized invoice-by-invoice reconciliation statement along with Supplier Tax Declarations and Bank Remittance Proofs is enclosed herewith as Annexure-A.

3. Absence of Revenue Loss or Mala Fide Intent:
Reliance is placed on the decisions of the Hon'ble High Courts holding that bona fide purchasing dealers who have paid tax to registered suppliers cannot be penalized for subsequent procedural delays on the part of suppliers.

In light of the above submissions and documentary evidence, it is humbly prayed that the proceedings initiated under Form GST ASMT-10 may kindly be dropped in Form GST ASMT-12.

Yours faithfully,
For [Business Legal Name]
Authorized Signatory / Chartered Accountant
Date: [Date] | Place: [City]`,r=`Dear [Supplier Name],

Greetings from [Your Business Name].

During our monthly GSTR-2B statutory reconciliation for [Month Year], we observed that the following purchase invoices issued by your firm ([Supplier GSTIN]) are NOT reflecting on the GST Portal:

• Inv No: [Invoice Number] | Date: [Date] | Taxable: ₹[Amount] | GST: ₹[Tax]
• Inv No: [Invoice Number] | Date: [Date] | Taxable: ₹[Amount] | GST: ₹[Tax]

Total Blocked Input Tax Credit: ₹[Total Tax Amount]

As per CGST Section 16(2)(aa), our firm cannot avail this tax credit until you file Form GSTR-1. Kindly upload these invoices in your next filing and share the filing ARN acknowledgment.

Thank you,
Accounts Department
[Your Company Name] | Ph: [Your Phone]`,l=()=>{typeof navigator<"u"&&navigator.clipboard&&(navigator.clipboard.writeText(s),t(!0),setTimeout(()=>t(!1),2500))},d=()=>{typeof navigator<"u"&&navigator.clipboard&&(navigator.clipboard.writeText(r),a(!0),setTimeout(()=>a(!1),2500))};return e.jsx("section",{className:"py-16 bg-slate-50 border-b border-slate-200/80",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",children:[e.jsxs("div",{id:"asmt-11-template",className:"bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs font-bold text-blue-600 uppercase tracking-wider",children:"Statutory Defense Asset"}),e.jsx("h3",{className:"text-xl font-black text-slate-900 mt-0.5",children:"Form GST ASMT-11 Ready-to-File Reply Draft"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Pre-drafted response to ASMT-10 or DRC-01A scrutiny notices citing Section 16 and judicial precedents."})]}),e.jsx("button",{onClick:l,className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm",children:n?"✓ Copied to Clipboard!":"📋 Copy ASMT-11 Draft"})]}),e.jsx("pre",{className:"bg-slate-950 p-5 rounded-2xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800",children:s})]}),e.jsxs("div",{className:"bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-slate-800",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs font-bold text-amber-400 uppercase tracking-wider",children:"Technical Data Structure"}),e.jsx("h3",{className:"text-lg font-black text-white mt-0.5",children:"Official GSTR-2B Government API JSON Payload"})]}),e.jsx("span",{className:"text-[10px] font-mono bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/80",children:"GSP PAYLOAD: HTTP 200"})]}),e.jsx("pre",{className:"p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto",children:`{
  "cgin": "27AAAAA0000A1Z5",
  "fp": "092026",
  "b2b": [
    {
      "ctin": "24BBBBB1111B1Z2",
      "cfs": "Y",
      "inv": [
        {
          "inum": "INV-26-8891",
          "idt": "12-09-2026",
          "val": 118000.00,
          "pos": "27",
          "rchrg": "N",
          "itcavl": "Y",
          "irn": "4a8c6f...64charHash...",
          "items": [
            {
              "num": 1,
              "hsn": "8415",
              "txval": 100000.00,
              "camt": 9000.00,
              "samt": 9000.00,
              "csamt": 0.00
            }
          ]
        }
      ]
    }
  ]
}`}),e.jsxs("p",{className:"text-[11px] text-slate-400 leading-relaxed",children:["Nexus automatically parses the ",e.jsx("code",{children:'itcavl: "Y"'})," flag and 64-character ",e.jsx("code",{children:"irn"})," hash to ensure that only authenticated invoices are factored into your GSTR-3B tax credit ledger."]})]}),e.jsxs("div",{className:"bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs font-bold text-emerald-700 uppercase tracking-wider",children:"Recovery Playbook"}),e.jsx("h3",{className:"text-xl font-black text-slate-900 mt-0.5",children:"Defaulter Supplier WhatsApp Notice Template"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Send polite yet legally definitive alerts to suppliers who have collected GST from you but neglected to upload GSTR-1."})]}),e.jsx("button",{onClick:d,className:"px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm",children:o?"✓ Copied Template!":"💬 Copy WhatsApp Text"})]}),e.jsx("pre",{className:"bg-emerald-50/60 p-5 rounded-2xl font-sans text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-emerald-100",children:r})]}),e.jsxs("div",{id:"common-pitfalls",className:"bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4",children:[e.jsx("h3",{className:"text-xl font-black text-slate-900 pb-3 border-b border-slate-100",children:"3. Five Costly Reconciliation Mistakes to Avoid in FY 2026-27"}),e.jsxs("div",{className:"space-y-3 text-xs text-slate-600",children:[e.jsxs("div",{className:"p-3.5 bg-slate-50 rounded-xl border border-slate-200",children:[e.jsx("strong",{className:"text-slate-900 block mb-0.5",children:"1. Relying on GSTR-2A for monthly GSTR-3B filings"}),"Section 16(2)(aa) does not recognize GSTR-2A. Availing credit based on GSTR-2A after January 1, 2022 is illegal and automatically flagged for recovery under Section 73/74."]}),e.jsxs("div",{className:"p-3.5 bg-slate-50 rounded-xl border border-slate-200",children:[e.jsx("strong",{className:"text-slate-900 block mb-0.5",children:"2. Availing RCM credit without paying cash liability first"}),"Reverse Charge Mechanism (Section 9(3)/9(4)) tax must be paid via Electronic Cash Ledger. You cannot pay RCM using existing ITC balances; credit can only be availed in the subsequent tax period after cash discharge."]}),e.jsxs("div",{className:"p-3.5 bg-slate-50 rounded-xl border border-slate-200",children:[e.jsx("strong",{className:"text-slate-900 block mb-0.5",children:"3. Missing the 30th November Annual Amendment Deadline"}),"Invoices from FY 2025-26 not reported by vendors in GSTR-1 by 30th November 2026 permanently lapse under Section 16(4). You cannot recover this credit in GSTR-9."]}),e.jsxs("div",{className:"p-3.5 bg-slate-50 rounded-xl border border-slate-200",children:[e.jsx("strong",{className:"text-slate-900 block mb-0.5",children:"4. Ignoring vendor GSTR-3B non-filing (Section 16(2)(c))"}),"Even if an invoice is visible in GSTR-2B, if the supplier fails to file GSTR-3B and pay the tax collected to the Government, the department can demand provisional reversal under Rule 37A."]}),e.jsxs("div",{className:"p-3.5 bg-slate-50 rounded-xl border border-slate-200",children:[e.jsx("strong",{className:"text-slate-900 block mb-0.5",children:"5. Neglecting Credit Note adjustments"}),"Failing to reverse ITC on supplier credit notes reported in Table 4 of GSTR-2B results in excess ITC claims and automated DRC-01 notices."]})]})]})]})})}export{p as default};

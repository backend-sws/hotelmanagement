export type Language = 'en' | 'hi';

export interface DocSection {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  icon: string;
  content: {
    en: string;
    hi: string;
  };
}

export const docsData: DocSection[] = [
  {
    id: "getting-started",
    title: {
      en: "Getting Started & Dashboard",
      hi: "शुरुआत कैसे करें (Dashboard)",
    },
    icon: "LayoutDashboard",
    content: {
      en: `
### Welcome to your Shop CRM!

The **Dashboard** gives you a quick summary of your business today. 

* **Pending Payments:** Total amount customers owe you (Udhar).
* **Staff Present:** Number of employees marked present today.
* **Low Stock Alerts:** Items that are running out of stock and need to be ordered.
* **Recent Activity:** A quick log of bills made and payments received.

**How to Start?**
1. Setup your business profile and upload your logo from **Settings**.
2. Add your **Staff** & configure their Payroll components.
3. Start adding **Products** in Inventory.
4. Go to **POS** to create your first bill!
      `,
      hi: `
### आपके शॉप CRM में आपका स्वागत है!

**Dashboard (डैशबोर्ड)** आपको आपकी दुकान का आज का पूरा हिसाब एक ही जगह दिखाता है।

* **Pending Payments:** वो कुल पैसा जो कस्टमर्स से उधार (Udhar) में लेना बाकी है।
* **Staff Present:** आज कितने कर्मचारी (Staff) काम पर आए हैं।
* **Low Stock Alerts:** वो सामान जो दुकान में खत्म होने वाला है और जिसका ऑर्डर देना है।
* **Recent Activity:** आज जो भी बिल बने या पेमेंट आई, उसकी ताज़ा जानकारी।

**शुरुआत कैसे करें?**
1. सबसे पहले **Settings** में जाकर अपनी दुकान का नाम और लोगो (Logo) सेट करें।
2. फिर अपने **Staff** (कर्मचारियों) को जोड़ें और उनकी सैलरी सेट करें।
3. अपनी दुकान का स्टॉक (**Inventory**) चढ़ाएं।
4. और फिर **POS** में जाकर अपना पहला बिल बनाएं!
      `
    }
  },
  {
    id: "pos-billing",
    title: {
      en: "POS & Billing (Udhar & EMI)",
      hi: "POS और बिलिंग (उधार और EMI)",
    },
    icon: "Monitor",
    content: {
      en: `
### Point of Sale (POS)

The POS module is where you create bills for your customers.

**Making a Bill:**
1. Select the items you want to sell. Enter the Serial/IMEI number if applicable.
2. Select the Customer (or add a new one on the spot).
3. The system will calculate the total. You can apply a discount if needed.

**Payment Methods:**
* **Cash/UPI/Card:** Standard full payments.
* **Udhar (Credit):** If the customer is not paying the full amount, select "Udhar" and enter how much they are paying today (Down payment). The rest goes to their Credit Ledger (Udhar Khata) and their invoice will show a red **CREDIT** stamp.
* **EMI (Finance):** If the customer is buying on EMI (e.g. Bajaj Finserv, TVS Credit), enter the Finance Company name, Loan amount, and Tenure. The remaining balance will show as "Paid by Finance" in green on the receipt.

**WhatsApp Sharing:**
After completing a sale, you can click "Share WhatsApp" to automatically send the invoice PDF link to the customer's phone!
      `,
      hi: `
### POS (बिल बनाने का सिस्टम)

POS में आप अपने कस्टमर्स के लिए बिल बनाते हैं।

**बिल कैसे बनाएं:**
1. जो सामान बेचना है उसे चुनें। अगर मोबाइल है तो उसका IMEI नंबर डालें।
2. कस्टमर का नाम चुनें (या तुरंत नया कस्टमर जोड़ लें)।
3. सिस्टम खुद ही टोटल बिल बता देगा। आप चाहें तो डिस्काउंट भी दे सकते हैं।

**पेमेंट के तरीके:**
* **Cash/UPI/Card:** अगर कस्टमर पूरा पैसा एक साथ दे रहा है।
* **Udhar (उधार):** अगर कस्टमर कुछ पैसा बाद में देगा, तो "Udhar" चुनें और आज जितना पैसा दे रहा है वो डाल दें। बाकी का पैसा उसके "उधार खाते" में जुड़ जाएगा और बिल पर लाल रंग का **CREDIT** स्टाम्प छपकर आएगा।
* **EMI (फाइनेंस):** अगर कस्टमर EMI पर फ़ोन ले रहा है (जैसे Bajaj, TVS), तो फाइनेंस कंपनी का नाम और लोन का अमाउंट डालें। बिल पर अपने आप "Paid by Finance" हरे रंग में छप जाएगा क्योंकि वो पैसा आपको कंपनी देगी।

**WhatsApp पर बिल भेजना:**
बिल बनने के बाद "Share WhatsApp" बटन दबाएं, बिल सीधा कस्टमर के मोबाइल पर चला जाएगा!
      `
    }
  },
  {
    id: "staff-payroll",
    title: {
      en: "Staff & Payroll (Salary)",
      hi: "स्टाफ और पेरोल (सैलरी)",
    },
    icon: "Users",
    content: {
      en: `
### Managing Staff, Attendance & Payroll (Full Guide)

This module is a complete **Help Desk** for calculating the end-of-month salary for your shop employees without manual calculations. It tracks their daily earnings, loans, commissions, and attendance penalties.

---

### 1. Daily Earnings & Attendance Logic

Before calculating the salary, the system determines the **Per Day Salary** of the staff based on the month.
* **Formula:** \`Daily Wage = (Basic Pay + Allowances) ÷ Total Days in the Month\`
* *(Example: If Basic Pay is ₹15,000 in a 30-day month, the Daily Wage is ₹500/day).*

**How Attendance Affects Salary:**
You must mark attendance daily (Present, Half Day, or Absent):
* **Present:** No deduction. (Earns full ₹500 for the day).
* **Half Day:** Half-day deduction. (Loses ₹250 for the day).
* **Absent:** Full day deduction. (Loses ₹500 for the day).

---

### 2. Salary Advances (Loans)

If a staff member asks for money during the month (e.g., ₹2000 for emergency):
1. Go to **HR -> Salary Advances** and issue the advance.
2. The system keeps this in a ledger.
3. At the end of the month, this ₹2000 is **automatically deducted** from their final salary.

---

### 3. Sales Commission

If you want to motivate your staff to sell more:
1. Go to Settings and set a Commission Rate (e.g., 2% on Profit or Sales).
2. When creating a bill in POS, select the Staff's name in the "Sold By" dropdown.
3. The system tracks all their sales. At the end of the month, their total commission is **automatically added** to their salary as a bonus!

---

### 4. The Final Payroll Formula

At the end of the month, go to **Payroll** and click "Generate Payroll". The system will look at the entire month's data and use this exact formula:

> **[+] Fixed Earnings:** (Basic Pay + Fixed Allowances)
> **[-] Attendance Penalties:** (Daily Wage × Total Absents) + (Daily Wage × 0.5 × Total Half Days)
> **[-] Fixed Deductions:** (Any PF, ESI, or fixed monthly penalties)
> **[-] Advances Taken:** (Money taken during the month)
> **[+] Total Commission:** (Earned from sales this month)
> 
> **= NET PAYABLE SALARY**

Once generated, you can print a detailed **Salary Slip** for the employee!
      `,
      hi: `
### स्टाफ की सैलरी, हाजिरी और पेरोल (पूरी जानकारी)

यह मॉड्यूल आपकी दुकान के कर्मचारियों की सैलरी का पूरा **Help Desk** है। यह बिना किसी कैलकुलेटर के उनके हर दिन की कमाई, उधार (Advance), कमीशन और छुट्टियों का खुद हिसाब रखता है।

---

### 1. रोज़ की कमाई और हाजिरी (Attendance) का लॉजिक

सैलरी बनाने से पहले, सिस्टम यह देखता है कि महीने में कितने दिन हैं और उस हिसाब से **1 दिन की सैलरी (Daily Wage)** निकालता है।
* **फॉर्मूला:** \`1 दिन की सैलरी = (बेसिक सैलरी + भत्ते) ÷ महीने के कुल दिन\`
* *(उदाहरण: अगर 30 दिन के महीने में बेसिक सैलरी ₹15,000 है, तो 1 दिन की सैलरी ₹500/दिन होगी)।*

**हाजिरी से सैलरी कैसे कटती है?:**
आपको रोज़ स्टाफ की हाजिरी लगानी होती है:
* **Present (आया है):** कोई पैसा नहीं कटेगा (पूरे ₹500 मिलेंगे)।
* **Half Day (आधे दिन):** आधे दिन के पैसे कटेंगे (₹250 कटेंगे)।
* **Absent (छुट्टी):** पूरे दिन के पैसे कटेंगे (₹500 कटेंगे)।

---

### 2. एडवांस सैलरी (Salary Advance)

अगर कोई कर्मचारी महीने के बीच में पैसे मांगता है (जैसे ₹2000 इमरजेंसी के लिए):
1. **HR -> Salary Advances** में जाकर उसे पैसे दें।
2. सिस्टम इसे अपने खाते में लिख लेगा।
3. महीने के अंत में जब सैलरी बनेगी, तो ये ₹2000 उसकी फाइनल सैलरी से **अपने आप कट (Deduct) जाएंगे**। आपको याद रखने की ज़रूरत नहीं!

---

### 3. सेल पर कमीशन (Sales Commission)

अगर आप चाहते हैं कि आपका स्टाफ ज़्यादा सेल करे:
1. Settings में जाकर कमीशन का रेट तय करें (जैसे 2%)।
2. जब भी कोई स्टाफ बिल बनाए (POS में), तो "Sold By" में उसका नाम चुनें।
3. पूरे महीने में उसने जितनी सेल की होगी, उसका टोटल कमीशन महीने के अंत में उसकी सैलरी में **अपने आप बोनस के तौर पर जुड़ जाएगा**!

---

### 4. फाइनल सैलरी का फॉर्मूला (Payroll Generation)

महीने के अंत में, **Payroll** में जाकर "Generate Payroll" पर क्लिक करें। सिस्टम पूरे महीने का डाटा देखकर इस फॉर्मूले से सैलरी बनाएगा:

> **[+] फिक्स कमाई:** (Basic Pay + फिक्स Allowances)
> **[-] छुट्टियों के पैसे कटे:** (1 दिन की सैलरी × कुल Absents) + (1 दिन की सैलरी × 0.5 × कुल Half Days)
> **[-] फिक्स कटौतियां:** (जैसे कोई फिक्स फण्ड या पेनल्टी)
> **[-] एडवांस लिया गया:** (महीने के बीच में लिए गए पैसे)
> **[+] कुल कमीशन:** (पूरे महीने सेल करके कमाया गया पैसा)
> 
> **= फाइनल सैलरी (NET PAYABLE)**

सैलरी जनरेट होने के बाद, आप कर्मचारी को उसकी पूरी **सैलरी स्लिप (Salary Slip)** प्रिंट करके दे सकते हैं!
      `
    }
  },
  {
    id: "inventory",
    title: {
      en: "Inventory & Purchases",
      hi: "स्टॉक और खरीदारी (Inventory)",
    },
    icon: "Store",
    content: {
      en: `
### Inventory Management

Keep track of what items are in your shop and who you bought them from.

**1. Adding Stock:**
* Go to Items/Inventory to add your products. 
* Set a **Reorder Alert Level**. For example, if you set it to 5, the Dashboard will alert you when you have less than 5 pieces left so you can order more in time.

**2. Suppliers & Purchases:**
* When the distributor sends new stock, go to **Suppliers** and add a New Purchase.
* You can record how much you paid the supplier and how much is pending (Khata).
* The stock of the items purchased will automatically increase in your shop's inventory!
      `,
      hi: `
### दुकान का स्टॉक (Inventory)

अपनी दुकान के सारे सामान और डिस्ट्रीब्यूटर के खाते का हिसाब यहाँ रखें।

**1. स्टॉक चढ़ाना:**
* Inventory में जाकर अपना नया सामान जोड़ें।
* **Reorder Alert** सेट करें। मान लीजिए आपने इसे 5 पर सेट किया, तो जैसे ही वो सामान दुकान में 5 से कम होगा, डैशबोर्ड आपको बता देगा कि "सामान ख़त्म हो रहा है, नया मंगवा लो!"

**2. सप्लायर और खरीद (Purchases):**
* जब डिस्ट्रीब्यूटर (Supplier) से नया माल आए, तो Suppliers में जाकर "New Purchase" (नयी खरीद) चढ़ाएं।
* आप लिख सकते हैं कि डिस्ट्रीब्यूटर को कितना पैसा दे दिया है और कितना बाकी (खाता) है।
* जो माल आप यहाँ चढ़ाएंगे, वो अपने आप आपकी दुकान के स्टॉक (Inventory) में जुड़ जाएगा!
      `
    }
  },
  {
    id: "plan-subscription",
    title: {
      en: "Plans & Subscription",
      hi: "प्लान और सब्सक्रिप्शन",
    },
    icon: "Crown",
    content: {
      en: `
### Plans & Subscription

Manage your shop's CRM subscription and billing easily.

**Checking Your Plan Validity:**
* You can always check your active plan and remaining days directly from the top header on any page (e.g., "PROFESSIONAL PLAN - 365 Days Left").

**Renewing or Changing Your Plan:**
1. Go to **Settings** and open the **Subscription** tab.
2. Here you will see your current active plan, its expiry date, and a history of all your past payments.
3. To renew, simply click on the **Renew/Upgrade** button, choose your preferred billing cycle (Monthly or Yearly), and complete the payment securely via Razorpay.
4. Your plan will be updated instantly!
      `,
      hi: `
### प्लान और सब्सक्रिप्शन (Recharge)

अपने शॉप CRM के रिचार्ज और प्लान की जानकारी यहाँ देखें।

**अपने प्लान की वैलिडिटी (Validity) कैसे चेक करें:**
* आप किसी भी पेज पर सबसे ऊपर (Header में) अपना एक्टिव प्लान और बचे हुए दिन देख सकते हैं (जैसे: "PROFESSIONAL PLAN - 365 Days Left")। 

**प्लान रिन्यू (Renew) कैसे करें:**
1. **Settings** में जाएं और **Subscription** टैब खोलें।
2. यहाँ आपको आपका मौजूदा प्लान, उसके ख़त्म होने की तारीख़, और आपकी पिछली पेमेंट्स की पूरी हिस्ट्री दिखेगी।
3. रिचार्ज करने के लिए **Renew/Upgrade** बटन दबाएं, अपना नया प्लान चुनें, और Razorpay के ज़रिए सुरक्षित पेमेंट करें।
4. पेमेंट होते ही आपका प्लान तुरंत अपडेट हो जाएगा!
      `
    }
  },
  {
    id: "billing-documents",
    title: {
      en: "Billing & Documents",
      hi: "बिलिंग और डाक्यूमेंट्स",
    },
    icon: "FileText",
    content: {
      en: `
### Billing & Documents (Invoices, Quotations, Challans)

This module handles all your official documentation and billing needs.

**1. Sales Invoices & Proforma:**
* Create professional tax invoices for your B2B and B2C sales.
* Need to send an estimate before confirming the sale? Create a **Proforma Invoice** first.

**2. Quotations (Estimates):**
* Use Quotations to give your customers price estimates. These do not affect your stock or accounting until converted into a final invoice.

**3. Delivery Challans:**
* If you are dispatching goods without an immediate invoice (e.g., for approval or job work), generate a **Delivery Challan** to accompany the shipment.
      `,
      hi: `
### बिलिंग और डाक्यूमेंट्स (Invoices, Quotations, Challans)

यह मॉड्यूल आपके सभी ज़रूरी डाक्यूमेंट्स और बिल बनाने के काम आता है।

**1. पक्के बिल (Sales Invoices) और प्रोफार्मा:**
* अपने B2B और B2C ग्राहकों के लिए पक्के टैक्स इनवॉइस बनाएं।
* अगर कस्टमर को डील फाइनल करने से पहले एस्टीमेट (कच्चा बिल) चाहिए, तो आप **Proforma Invoice** बना कर दे सकते हैं।

**2. कोटेशन (Quotations):**
* कोटेशन का इस्तेमाल ग्राहकों को रेट लिस्ट या एस्टीमेट देने के लिए होता है। इसे बनाने से आपके स्टॉक या खाते पर कोई असर नहीं पड़ता।

**3. डिलीवरी चालान (Challans):**
* अगर आप बिना पक्के बिल के माल भेज रहे हैं (जैसे अप्रूवल के लिए या कारीगर के पास), तो माल के साथ भेजने के लिए **Delivery Challan** बनाएं।
      `
    }
  },
  {
    id: "khata-outstanding",
    title: {
      en: "Khata & Outstanding",
      hi: "खाता और बकाया (Khata)",
    },
    icon: "BookOpen",
    content: {
      en: `
### Khata (Ledger) & Outstanding Management

Track who owes you money and who you owe money to.

**1. Customer & Supplier Khata (Ledger):**
* Every customer and supplier has a dedicated Ledger (Khata).
* It automatically tracks all their invoices, payments, and outstanding balances.
* You can easily view their full transaction history in one place.

**2. Outstanding Aging Report:**
* This powerful report shows you exactly which payments are overdue and by how many days (e.g., 0-30 days, 30-60 days).
* Use this to follow up with customers for pending payments and improve your cash flow!
      `,
      hi: `
### खाता (Ledger) और बकाया (Outstanding)

यहाँ आप देख सकते हैं कि किससे कितना पैसा लेना है और किसको कितना देना है।

**1. कस्टमर और सप्लायर खाता (Ledger):**
* हर ग्राहक और सप्लायर का एक अलग खाता (Ledger) होता है।
* यह सिस्टम उनके सारे बिलों, पेमेंट्स और बकाया (उधार) का खुद हिसाब रखता है।
* आप किसी भी कस्टमर का पूरा लेन-देन एक ही जगह देख सकते हैं।

**2. बकाया रिपोर्ट (Outstanding Aging):**
* यह रिपोर्ट आपको बताती है कि किन ग्राहकों का पैसा कितने दिनों से रुका हुआ है (जैसे: 0-30 दिन, 30-60 दिन)।
* इसका इस्तेमाल करके आप समय पर तगादा (Follow-up) कर सकते हैं और अपनी पेमेंट निकलवा सकते हैं!
      `
    }
  },
  {
    id: "cash-bank-cheques",
    title: {
      en: "Cash, Bank & Cheques",
      hi: "कैश, बैंक और चेक",
    },
    icon: "Wallet",
    content: {
      en: `
### Cash, Bank & Cheque Management

Keep tight control over your daily cash flow and bank transactions.

**1. Cash & Bank Book (Rozka Day Book):**
* Tracks every single rupee coming in or going out of your business.
* You can maintain multiple bank accounts, petty cash, and digital wallets (UPI/GPay).
* View daily summaries in the **Rozka Day Book** to tally your cash counter at the end of the day.

**2. Cheque Register:**
* When a customer pays by cheque, record it here.
* Track the status of every cheque (Received, Deposited, Cleared, or Bounced).
* Never lose track of a post-dated cheque again!
      `,
      hi: `
### कैश, बैंक और चेक का हिसाब

अपने रोज़ के कैश और बैंक के लेन-देन का पक्का हिसाब रखें।

**1. कैश और बैंक बुक (रोज़का Day Book):**
* व्यापार में आने और जाने वाले हर एक रुपये का हिसाब रखता है।
* आप अलग-अलग बैंक खाते, गल्ले का कैश (Petty Cash), और UPI (PhonePe/GPay) सब जोड़ सकते हैं।
* शाम को गल्ला मिलाने के लिए **रोज़का Day Book** देखें।

**2. चेक रजिस्टर (Cheque Register):**
* जब कोई कस्टमर चेक से पेमेंट दे, तो उसकी एंट्री यहाँ करें।
* हर चेक का स्टेटस ट्रैक करें (जैसे: बैंक में लगाया, पास हो गया, या बाउंस हो गया)।
* आगे की तारीख़ (PDC) वाले चेकों का भी हिसाब रखें ताकि कोई चेक छूटे नहीं!
      `
    }
  },
  {
    id: "relationships",
    title: {
      en: "Customers & Suppliers",
      hi: "कस्टमर्स और सप्लायर्स",
    },
    icon: "Users",
    content: {
      en: `
### Managing Relationships

Maintain a complete directory of your business contacts.

**1. Customers:**
* Store important details like Phone, Address, GSTIN, and Credit Limits.
* Set opening balances if they already owed you money before you started using the CRM.

**2. Suppliers (Vendors):**
* Manage the details of distributors and companies you purchase goods from.
* Similar to customers, you can track their GST details and opening balances.
      `,
      hi: `
### कस्टमर्स और सप्लायर्स (Directory)

अपने सभी व्यापारिक संपर्कों (Contacts) की जानकारी एक जगह सुरक्षित रखें।

**1. कस्टमर्स (Customers):**
* ग्राहकों का फ़ोन नंबर, पता, GST नंबर और उनकी उधार सीमा (Credit Limit) सेव करें।
* अगर CRM शुरू करने से पहले ही किसी का पुराना उधार बाकी है, तो उसे 'Opening Balance' में डाल दें।

**2. सप्लायर्स (Suppliers/Vendors):**
* उन डिस्ट्रीब्यूटर्स और कंपनियों की डिटेल रखें जिनसे आप माल खरीदते हैं।
* ग्राहकों की तरह ही आप सप्लायर्स के भी पुराने बकाया (Opening Balance) सेट कर सकते हैं।
      `
    }
  },
  {
    id: "stock-godowns",
    title: {
      en: "Stock & Godowns",
      hi: "स्टॉक और गोदाम (Godowns)",
    },
    icon: "Warehouse",
    content: {
      en: `
### Advanced Stock Management

Track your inventory accurately across multiple locations.

**1. Godowns (Warehouses):**
* If you store goods in multiple shops or godowns, you can create them here.
* Easily see exactly how much stock is present in which specific godown using the **Stock Summary**.

**2. Stock Transfers:**
* Need to move items from the main godown to your retail shop? 
* Use the **Stock Transfer** feature to officially record the movement of goods between your locations to prevent theft and discrepancies.
      `,
      hi: `
### एडवांस स्टॉक मैनेजमेंट

अलग-अलग जगहों पर रखे अपने स्टॉक की पूरी जानकारी रखें।

**1. गोदाम (Godowns/Warehouses):**
* अगर आपका माल अलग-अलग दुकानों या गोदामों में रखा है, तो आप उन्हें सिस्टम में जोड़ सकते हैं।
* **Stock Summary** में आप देख सकते हैं कि कौन सा माल किस गोदाम में कितना पड़ा है।

**2. स्टॉक ट्रांसफर (Stock Transfers):**
* क्या आपको मेन गोदाम से दुकान पर माल भेजना है?
* माल इधर-उधर करने के लिए **Stock Transfer** की एंट्री करें। इससे माल की चोरी नहीं होगी और स्टॉक का हिसाब एकदम पक्का रहेगा।
      `
    }
  },
  {
    id: "projects",
    title: {
      en: "Projects & BOQ",
      hi: "प्रोजेक्ट्स और BOQ",
    },
    icon: "Building2",
    content: {
      en: `
### Project & Site Management

Ideal for contractors, builders, and service providers.

**1. Projects & Sites:**
* Create a dedicated Project/Site to track all expenses, material consumption, and billing related to a specific job.

**2. BOQ (Bill of Quantities):**
* Create detailed estimates and material requirements for large contracts.

**3. Labour & Wages:**
* Track daily labour attendance at specific sites and calculate their wages accurately based on the project they worked on.
      `,
      hi: `
### प्रोजेक्ट्स और साइट (Sites) का काम

यह फीचर ठेकेदारों (Contractors), बिल्डर्स और सर्विस देने वालों के लिए बहुत काम का है।

**1. प्रोजेक्ट्स और साइट्स (Projects):**
* किसी भी नए ठेके या साइट के लिए एक 'प्रोजेक्ट' बनाएं।
* उस साइट पर कितना माल लगा, कितना खर्चा हुआ और कितने के बिल बने, यह सब अलग से ट्रैक करें।

**2. BOQ (Bill of Quantities):**
* बड़े टेंडर या ठेके के लिए माल का एस्टीमेट (BOQ) तैयार करें।

**3. लेबर और दिहाड़ी (Labour & Wages):**
* ट्रैक करें कि कौन सी लेबर किस साइट पर कितने दिन काम पर आई, और उनकी दिहाड़ी का पूरा हिसाब रखें।
      `
    }
  },
  {
    id: "reports",
    title: {
      en: "GST & Financial Reports",
      hi: "GST और फाइनेंस रिपोर्ट्स",
    },
    icon: "Calculator",
    content: {
      en: `
### Comprehensive Reporting

Understand the financial health of your business instantly.

**1. GST Returns:**
* The system automatically generates your GSTR-1, GSTR-3B, and HSN summary reports based on your sales and purchases. You can hand these directly to your CA.

**2. Financial Statements:**
* View your **Profit & Loss Statement** to see exactly how much money your business is making.
* Check your **Balance Sheet** for a snapshot of your assets and liabilities.

**3. Sales Analysis:**
* Understand which products are selling the most, who your top customers are, and track the performance of your sales staff!
      `,
      hi: `
### बिज़नेस की पूरी रिपोर्ट (Reports)

एक क्लिक में जानिए कि आपका बिज़नेस कैसा चल रहा है।

**1. GST रिटर्न्स (GST Returns):**
* आपके बनाए हुए बिलों के आधार पर सिस्टम खुद ही GSTR-1, GSTR-3B और HSN रिपोर्ट तैयार कर देता है। आप इसे सीधा अपने CA (वकील) को दे सकते हैं।

**2. फाइनेंस रिपोर्ट्स (P&L):**
* अपनी **Profit & Loss (P&L)** रिपोर्ट देखें और जानें कि आपको असल में कितना मुनाफा (Profit) या नुकसान हो रहा है।
* अपनी दुकान की पूरी संपत्ति और देनदारी देखने के लिए **Balance Sheet** चेक करें।

**3. सेल्स एनालिसिस (Sales Analysis):**
* जानें कि कौन सा सामान सबसे ज़्यादा बिक रहा है, आपके सबसे अच्छे ग्राहक कौन हैं, और आपके किस सेल्समैन ने सबसे ज़्यादा सेल की है!
      `
    }
  }
];

export interface IndustryDetailData {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  typicalProblems: Array<{ title: string; detail: string }>;
  bundle: Array<{ item: string; description: string }>;
  workflowDiagram: Array<{
    step: string;
    trigger: string;
    action: string;
    outcome: string;
  }>;
  conceptProjectSlug: string;
}

export const INDUSTRIES_DATA: IndustryDetailData[] = [
  {
    slug: "clinics",
    title: "Clinics & Healthcare",
    headline: "Patient booking websites and automated WhatsApp reminders for clinics.",
    summary:
      "Reduce front-desk phone load and appointment no-shows with a fast clinic website, doctor slot picker, and automated WhatsApp patient reminders.",
    typicalProblems: [
      { title: "Missed reception calls", detail: "Patients call during busy clinic hours and book elsewhere when lines are engaged." },
      { title: "Appointment no-shows", detail: "Patients forget evening or next-day slots without a timely WhatsApp reminder." },
      { title: "Scattered patient enquiries", detail: "Treatment questions on WhatsApp and Google Maps are not logged in one place." },
    ],
    bundle: [
      { item: "Clinic & Doctor Website", description: "Mobile-first profiles for doctors, treatments, timings, and Google Maps directions." },
      { item: "Online Slot Booking", description: "Patients pick a doctor, date, and time window in under 60 seconds." },
      { item: "WhatsApp Reminders", description: "Instant booking confirmation plus a 2-hour prior reminder with location pin." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Patient visits clinic site", action: "Selects doctor & time slot", outcome: "Slot reserved in clinic schedule" },
      { step: "02", trigger: "Booking submitted", action: "n8n triggers WhatsApp API", outcome: "Patient receives instant confirmation & pin" },
      { step: "03", trigger: "2 hours before visit", action: "Automated reminder sent", outcome: "Patient confirms or reschedules in 1 tap" },
      { step: "04", trigger: "Consultation complete", action: "Follow-up check-in message", outcome: "Higher repeat care & patient trust" },
    ],
    conceptProjectSlug: "clinic-booking-system",
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    headline: "High-converting property listings and automated lead follow-up CRM.",
    summary:
      "Capture every buyer enquiry from your website and ad campaigns, send project brochures on WhatsApp automatically, and track every site visit in a clean CRM.",
    typicalProblems: [
      { title: "Delayed brochure delivery", detail: "Buyers enquire late at night and lose interest if the floor plan arrives the next afternoon." },
      { title: "Forgotten site-visit follow-ups", detail: "Sales agents juggle dozens of leads in notebooks or disconnected Excel sheets." },
      { title: "Hard-to-browse project PDFs", detail: "Heavy 30MB PDF brochures fail to load cleanly on mobile data." },
    ],
    bundle: [
      { item: "Property Listing Portal", description: "Fast project pages with BHK filters, floor plans, amenities, and locality maps." },
      { item: "Instant WhatsApp Brochure Bot", description: "Sends verified project brochure and pricing sheet immediately on enquiry." },
      { item: "Lead & Site-Visit CRM", description: "Kanban pipeline tracking New Enquiry → Brochure Sent → Site Visit → Booking." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Buyer requests floor plan", action: "Form captures name & WhatsApp", outcome: "Lead created in Real Estate CRM" },
      { step: "02", trigger: "New lead webhook", action: "WhatsApp sends PDF brochure", outcome: "Buyer views floor plan within 5 seconds" },
      { step: "03", trigger: "Buyer picks site-visit date", action: "Assigned to sales manager", outcome: "Calendar invite & reminder scheduled" },
      { step: "04", trigger: "Post-visit +24h", action: "Automated follow-up prompt", outcome: "No high-intent buyer is forgotten" },
    ],
    conceptProjectSlug: "real-estate-lead-crm",
  },
  {
    slug: "restaurants",
    title: "Restaurants & Cafes",
    headline: "Digital menus, direct online ordering, and WhatsApp table & order alerts.",
    summary:
      "Let regular customers browse your live menu, reserve tables, and place direct pickup or delivery orders without giving away 30% aggregator commissions.",
    typicalProblems: [
      { title: "High aggregator commissions", detail: "Third-party delivery apps take a large cut even from your loyal neighbourhood regulars." },
      { title: "Slow PDF menus on phones", detail: "QR code menus that download large PDFs frustrate diners at the table." },
      { title: "Manual table reservation calls", detail: "Peak-hour phone calls interrupt staff during dinner service." },
    ],
    bundle: [
      { item: "Interactive Mobile Menu & Site", description: "Fast category-wise menu with dietary tags, photos, and instant search." },
      { item: "Direct Ordering & Razorpay UPI", description: "Pickup and local delivery checkout with instant UPI payment." },
      { item: "WhatsApp Order & Table Alerts", description: "Kitchen/manager alert on new order plus customer status updates." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Guest scans QR or visits site", action: "Adds items or picks table slot", outcome: "Structured cart / reservation created" },
      { step: "02", trigger: "UPI payment via Razorpay", action: "Order verified automatically", outcome: "Instant kitchen dashboard notification" },
      { step: "03", trigger: "Order marked Ready", action: "WhatsApp status alert sent", outcome: "Customer receives pickup/dispatch update" },
      { step: "04", trigger: "Next-week repeat nudge", action: "Optional loyalty offer message", outcome: "Direct repeat orders with 0% commission" },
    ],
    conceptProjectSlug: "retail-store-ecommerce",
  },
  {
    slug: "education",
    title: "Education & Coaching",
    headline: "Admission enquiry portals, course catalogues, and counsellor automation.",
    summary:
      "Help students and parents explore courses, download syllabi, book counselling sessions, and pay fees online with automated WhatsApp reminders.",
    typicalProblems: [
      { title: "Unanswered admission queries", detail: "Parents enquire during admission season and wait days for a callback." },
      { title: "Manual fee & batch tracking", detail: "Batch schedules and fee receipts are managed across multiple spreadsheets." },
      { title: "Counselling session drop-offs", detail: "Prospective students miss demo classes without timely reminders." },
    ],
    bundle: [
      { item: "Course & Admission Website", description: "Structured course pages, batch timings, faculty profiles, and syllabus downloads." },
      { item: "Enquiry & Demo Class Pipeline", description: "Automated lead assignment and counsellor follow-up dashboard." },
      { item: "WhatsApp Batch & Fee Alerts", description: "Demo class links, admission confirmations, and fee installment reminders." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Student downloads syllabus", action: "Enquiry form captures batch interest", outcome: "Lead logged in Admissions CRM" },
      { step: "02", trigger: "Instant WhatsApp flow", action: "Sends syllabus PDF + demo slot link", outcome: "Student books demo session" },
      { step: "03", trigger: "1 hour before demo class", action: "Automated WhatsApp reminder", outcome: "Higher demo class attendance" },
      { step: "04", trigger: "Enrollment & Razorpay fee", action: "Receipt generated automatically", outcome: "Student added to batch roster" },
    ],
    conceptProjectSlug: "clinic-booking-system",
  },
  {
    slug: "retail",
    title: "Retail & D2C Stores",
    headline: "Online storefronts with Razorpay checkout, inventory sync, and GST billing.",
    summary:
      "Bring your physical retail catalogue online with variant-level stock sync, UPI checkout, automated GST invoices, and WhatsApp dispatch alerts.",
    typicalProblems: [
      { title: "Manual DM order taking", detail: "Staff spend hours confirming stock and checking payment screenshots on WhatsApp." },
      { title: "Stock discrepancies", detail: "Items sold in-store remain listed online, causing order cancellations." },
      { title: "Manual GST billing", detail: "Writing tax invoices and tracking courier AWBs manually slows dispatch." },
    ],
    bundle: [
      { item: "E-commerce Storefront", description: "Searchable product catalogue with categories, variants, and mobile cart." },
      { item: "Razorpay & GST Invoicing", description: "Instant UPI/card checkout with automated CGST/SGST/IGST PDF bills." },
      { item: "Inventory & Dispatch Dashboard", description: "Central stock control with WhatsApp shipping notifications." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Customer browses catalogue", action: "Selects variant & pays via UPI", outcome: "Order confirmed via Razorpay" },
      { step: "02", trigger: "Payment webhook", action: "Stock deducted & GST invoice built", outcome: "Merchant dispatch queue updated" },
      { step: "03", trigger: "Parcel packed & shipped", action: "AWB tracking link entered", outcome: "Customer gets WhatsApp tracking alert" },
      { step: "04", trigger: "Low stock threshold", action: "Automated restock alert", outcome: "Zero overselling across channels" },
    ],
    conceptProjectSlug: "retail-store-ecommerce",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & B2B",
    headline: "Technical specification catalogues, dealer RFQ portals, and order tracking.",
    summary:
      "Make it effortless for B2B buyers and distributors to search technical specs, submit bulk RFQ enquiries, and track order production status.",
    typicalProblems: [
      { title: "Outdated PDF product catalogues", detail: "Distributors work off old spec sheets and call to check current SKUs." },
      { title: "Slow RFQ quotation turnaround", detail: "Bulk enquiries arrive via email with missing quantity or specification details." },
      { title: "Repeated order status calls", detail: "Dealers call sales reps daily to ask if their batch has been dispatched." },
    ],
    bundle: [
      { item: "Searchable B2B Spec Catalogue", description: "Filterable product specifications, datasheets, and compliance certificates." },
      { item: "Structured RFQ & Dealer Portal", description: "Multi-SKU quote request carts that capture exact quantities and delivery pins." },
      { item: "Order & Dispatch Dashboard", description: "Internal pipeline tracking RFQ → Quotation → Production → Dispatched." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Buyer filters technical specs", action: "Adds SKUs to RFQ list", outcome: "Structured RFQ logged in B2B CRM" },
      { step: "02", trigger: "RFQ notification", action: "Sales team receives alert + specs", outcome: "Fast, accurate quotation sent" },
      { step: "03", trigger: "Order enters production", action: "Milestone updated in dashboard", outcome: "Dealer receives automated status update" },
      { step: "04", trigger: "LR / Dispatch uploaded", action: "WhatsApp & email dispatch alert", outcome: "Fewer inbound status phone calls" },
    ],
    conceptProjectSlug: "real-estate-lead-crm",
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    headline: "Credible authority websites, consultation booking, and client intake automation.",
    summary:
      "Designed for CA firms, legal practices, consultants, and agencies that need a high-trust web presence, structured appointment booking, and automated client intake.",
    typicalProblems: [
      { title: "Back-and-forth scheduling", detail: "Scheduling a 30-minute consultation takes five phone calls or emails." },
      { title: "Unprepared discovery calls", detail: "Clients book meetings without sharing their context or required documents." },
      { title: "Dated digital credibility", detail: "Referrals look up your firm online and find an inactive or broken website." },
    ],
    bundle: [
      { item: "Authority Website & Insights", description: "Practice area pages, partner profiles, and SEO-ready advisory articles." },
      { item: "Cal.com Consultation Booking", description: "Real-time calendar booking synced with Google Calendar and Google Meet." },
      { item: "Automated Intake & Reminders", description: "Pre-call questionnaire and WhatsApp reminder 2 hours before the meeting." },
    ],
    workflowDiagram: [
      { step: "01", trigger: "Prospect reads practice page", action: "Picks consultation slot", outcome: "Calendar event & Meet link created" },
      { step: "02", trigger: "Booking confirmed", action: "Intake checklist sent on WhatsApp", outcome: "Client submits context before call" },
      { step: "03", trigger: "2 hours prior to meeting", action: "Automated reminder sent", outcome: "High show-up rate on consultations" },
      { step: "04", trigger: "Post-consultation", action: "Proposal & next-step summary", outcome: "Structured client onboarding" },
    ],
    conceptProjectSlug: "clinic-booking-system",
  },
];



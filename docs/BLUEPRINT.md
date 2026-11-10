# EliavaTech Website Master Blueprint

*Building What's Next.* | Version 1.0 | Written for vibecoding with Cline + Gemini API

## 0. How to use this document

- Save this as `docs/BLUEPRINT.md` in your project repo. At the start of every Cline session say: *Read docs/BLUEPRINT.md fully before doing anything.*
- Build in the phases in Section 12. Paste one phase prompt at a time, test it in the browser, then commit to Git before moving on.
- Anything marked **\[PLACEHOLDER\]** must be replaced with real details before launch.
- Prices, tool plans and costs in this document are planning estimates. Verify them on each vendor's website before paying.
- Never paste API keys into chat or commit them. They live in `.env.local` only.

## 1. Decisions and assumptions

**Confirmed by you**

- Business direction: combination of full-service agency, AI automation and industry software.
- Market: India first, international later. English only at launch.
- Lead services: websites, e-commerce, WhatsApp and AI automation, custom software (CRM, ERP and similar).
- Audience: broad, all SMB sectors, with industry-specific pages as proof of range.
- Team: three co-founders (placeholder details).
- Style: formal and enterprise voice, premium and genuine, with dark and light themes and a toggle. Interactive 3D, rich but purposeful motion.
- Goals: lead capture through consultation booking, contact form, WhatsApp and live chat. AI chatbot included. SEO and blog. Client login portal planned for Phase 2.
- Tooling: Cline with Gemini API key, domain on Cloudflare, Google Workspace email, Google Analytics, 2-week timeline.

**Assumptions I made (tell me if any are wrong)**

- Stack: Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, GSAP ScrollTrigger, React Three Fiber (Three.js), Lenis smooth scroll, PostgreSQL with Prisma.
- Hosting: domain and DNS on Cloudflare; site hosted on Vercel. Note that Vercel's free Hobby plan is for non-commercial use, so a business site should use the paid Pro plan or an alternative host. Cloudflare hosting for Next.js is possible but harder for a vibecoder, so I recommend Vercel.
- Database: managed Postgres (Neon or Supabase free tier) to store leads and chat transcripts.
- Case studies and testimonials: you have none yet, so the site will carry clearly labelled **concept projects**. Do not publish invented client names or fake testimonials. Replace them as real pilot projects finish.
- Launch pricing: set below typical market rates to win the first customers. Treat these as hypotheses to test with real conversations.

## 2. Brand system

### 2.1 Identity

- **Name:** EliavaTech. Pronounced eh-lee-AH-vah.
- **Meaning (for the About page):** Eliava comes from the Hebrew Eliav, meaning *My God is Father*. Keep this as a quiet, dignified story, not a religious message.
- **Tagline:** Building What's Next.
- **Positioning line:** *Websites, software and AI automation that help growing businesses operate smarter.*
- **Brand idea:** a steady foundation (heritage, trust) with forward motion (technology). Visually this is deep ink backgrounds, one confident indigo accent, and a rare touch of gold.

### 2.2 Logo concept

A custom geometric wordmark plus a monogram.

- **Monogram:** a letter E built from three horizontal bars, like stacked layers. The top bar is gold, the other two take the text color. The middle bar is shorter, giving a stepped, ascending feel.
- **Wordmark:** `Eliava` in the heading font at semi-bold with slightly wide letter spacing, followed by `Tech` in a lighter weight.
- Starter SVG (Cline should save it as `components/brand/Logo.tsx` and make colors follow CSS variables):

```svg
<svg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
  <rect x='8' y='8' width='32' height='8' rx='2' fill='var(--gold)'/>
  <rect x='8' y='20' width='24' height='8' rx='2' fill='currentColor'/>
  <rect x='8' y='32' width='32' height='8' rx='2' fill='currentColor'/>
</svg>
```

Provide four logo variants: full horizontal, monogram only, light-theme, dark-theme. Create the favicon from the monogram.

### 2.3 Color tokens

Define these as CSS variables on `:root` (light) and `[data-theme='dark']`, and map them in Tailwind.

| Token | Dark theme | Light theme | Use |
| --- | --- | --- | --- |
| `--bg` | #060912 | #F7F8FB | Page background |
| `--surface` | #0D1322 | #FFFFFF | Cards, panels |
| `--surface-2` | #141C31 | #EEF0F6 | Raised or hover surfaces |
| `--border` | #222C47 | #DDE1EC | Dividers, outlines |
| `--text` | #EEF1F8 | #0B1020 | Primary text |
| `--text-muted` | #9AA6C3 | #55607A | Secondary text |
| `--primary` | #7C6CFF | #4B3FE0 | Buttons, links, key accents |
| `--primary-hover` | #9A8DFF | #3A2FC4 | Hover state |
| `--gold` | #F2B84B | #C98A12 | Rare highlights only |
| `--success` | #34D399 | #0F9D6B | Success states |
| `--danger` | #F87171 | #D64545 | Errors |

Rules: gold appears at most once or twice per screen. Gradients are subtle (primary to a slightly cooler violet). Text on backgrounds must meet WCAG AA contrast (4.5:1 for body text).

### 2.4 Typography

- **Headings:** Sora or Manrope (Google Fonts via `next/font`, no external CSS requests).
- **Body and UI:** Inter.
- **Code and numbers:** JetBrains Mono.
- **Scale (desktop):** H1 64/68, H2 44/50, H3 28/36, body 17/28, small 14/22. On mobile, H1 40/44 and H2 30/36. Use `clamp()` for fluid sizing.
- Headings semi-bold, tight tracking (-0.02em). Body regular.

### 2.5 Spacing, shape and elevation

- 8px spacing grid. Section vertical padding 120px desktop, 72px mobile. Max content width 1200px.
- Radius: 12px for cards and inputs, 999px for pills and primary buttons.
- Shadows are soft in light mode. In dark mode use 1px borders and a faint primary glow on hover instead of heavy shadows.
- Glass effect (backdrop blur) only on the navbar and floating chat button.

### 2.6 Graphics and iconography

- Icons: Lucide, 1.5px stroke, consistent size.
- Hero: interactive 3D scene (Section 5).
- Section graphics: subtle grid or dot patterns, thin gradient lines, abstract isometric dashboards built in SVG or CSS. No generic stock photos of handshakes or people pointing at screens.
- Product mockups: build browser-frame and phone-frame components that show sample websites, CRM dashboards and WhatsApp chats.
- All images in WebP or AVIF through `next/image`, with alt text.

### 2.7 Voice

Formal, clear, confident. Short sentences. Talk about the customer's problem first, technology second. Avoid jargon and hype words such as revolutionary or cutting-edge.

## 3. Sitemap

1. Home `/`
2. Services `/services` and detail pages `/services/web-development`, `/services/ecommerce`, `/services/whatsapp-ai-automation`, `/services/custom-software`, `/services/cloud-support`
3. Industries `/industries` with detail pages: clinics, real estate, restaurants, education, retail, manufacturing, professional services
4. Work `/work` (concept projects now, real case studies later) and `/work/[slug]`
5. Pricing `/pricing`
6. About `/about`
7. Blog `/blog` and `/blog/[slug]` (MDX)
8. Contact `/contact` with consultation booking
9. Legal: `/privacy`, `/terms`, `/cookies`
10. Phase 2: `/portal` (client login), `/portal/projects`, `/portal/invoices`, `/portal/support`

Global elements: sticky navbar with theme toggle and primary CTA, footer, floating WhatsApp button, AI chat widget, cookie banner, custom cursor, scroll progress bar.

## 4. Page-by-page specification

### 4.1 Global navbar

Logo left; links Services, Industries, Work, Pricing, About, Blog; theme toggle (sun/moon, animated); primary button *Book a Free Consultation*. Transparent on top, becomes a blurred glass bar after 40px scroll. Services opens a mega-menu with five service tiles and short descriptions. Mobile: full-screen animated menu with staggered links.

### 4.2 Home

1. **Hero.** Left: label *Digital solutions for growing businesses*, H1 *Building What's Next.*, subtext *We design websites, automate operations and build custom software for businesses that want to grow without a technical team.* Buttons: *Book a Free Consultation* and *See Our Work*. Right: interactive 3D scene. Below: a small trust line *Websites. Automation. Software. Support.*
2. **Problem strip.** Five short cards: not found online, manual orders, lost leads, repeated customer questions, inefficient processes. Each has an icon and a one-line promise.
3. **Services overview.** Five cards (Web, E-commerce, WhatsApp and AI automation, Custom software, Cloud and support) with hover tilt and an animated arrow.
4. **How we work.** Four-step horizontal timeline that animates as you scroll: Discover, Design, Build, Support.
5. **Industries.** Horizontal scroll or tabbed showcase with the solution bundle for each industry (restaurant: website, online ordering, WhatsApp alerts; clinic: website, booking, reminders; real estate: listings, lead CRM; and so on).
6. **Interactive demo.** A small *See automation in action* panel: a looping animated WhatsApp conversation that books an appointment.
7. **Why EliavaTech.** Four value points with animated counters (use honest numbers only, such as 5 service lines, 24h response time, 2-week typical launch, and replace with real stats later).
8. **Work preview.** Three concept project cards with device mockups.
9. **Founders preview.** Three avatars, link to About.
10. **FAQ** accordion (six questions).
11. **Final CTA band.** *Have a business problem? Let's work out how technology can solve it.* with the booking button.

### 4.3 Services

Introductory header, then a grid of five service cards, then a comparison strip of what is included. Each detail page follows one template: headline and outcome, who it is for, what is included (checklist), process, tech used, sample deliverables, starting price, FAQ, CTA.

Service content summary:

- **Web development:** business sites, landing pages, booking sites, portfolios. Next.js, SEO-ready, mobile-first.
- **E-commerce:** online stores, Razorpay payments, catalogues, inventory sync, shipping and GST invoicing.
- **WhatsApp and AI automation:** WhatsApp Business API flows, lead capture, AI customer support, reminders, n8n workflows.
- **Custom software:** CRM, inventory, billing, ERP modules, dashboards, customer portals.
- **Cloud and support:** hosting, backups, monitoring, security updates, monthly support plans.

### 4.4 Industries

Grid of industry tiles, each linking to a page with: typical problems, our bundle, example workflow diagram, concept project, CTA. Seven industries at launch (clinics, real estate, restaurants, education, retail, manufacturing, professional services).

### 4.5 Work

Filterable grid by service and industry. Cards open a case study page: challenge, solution, features, tech, results. **Launch with 3 concept projects, each labelled Concept project:**

1. *Clinic booking system* (website, appointment booking, WhatsApp reminders).
2. *Retail store e-commerce* (catalogue, Razorpay checkout, inventory dashboard).
3. *Real estate lead CRM* (property listings, enquiry pipeline, automated follow-ups).

Build these as real working demos so they prove capability. Replace them with actual client work as it arrives. Do not invent metrics.

### 4.6 Pricing

Show launch pricing for the first clients. These are starting points that you must validate. The prices are below typical Indian market rates and labelled **Founding client pricing**, available to the first 10 clients (only say this if you honour it).

**Websites**

- Starter: from ₹9,999 (up to 5 pages, responsive, contact form, basic SEO)
- Business: from ₹24,999 (up to 10 pages, CMS, booking or enquiry integration, analytics)
- E-commerce: from ₹34,999 (catalogue, Razorpay, orders, GST invoices)

**Automation**

- WhatsApp automation: from ₹12,999 setup
- AI customer-support assistant: from ₹14,999 setup

**Custom software**

- CRM or business dashboard: from ₹49,999 (quoted after discovery)

**Monthly care plans**

- Essential: ₹1,499/month (hosting oversight, backups, security updates)
- Growth: ₹2,999/month (adds small edits and performance checks)
- Pro: ₹5,999/month (adds priority support and monthly reporting)

Add a note: *Prices start from the amounts shown and depend on scope. Third-party fees (WhatsApp API, payment gateways, hosting) are billed separately.* Include a toggle for One-time vs Monthly views, and a *Request a custom quote* form.

### 4.7 About

Sections: story and mission; the meaning of the name Eliava (short, tasteful); values (clarity, craftsmanship, integrity, partnership); three founder cards; how we work; CTA.

**Founders \[PLACEHOLDER\]**

- Founder 1: \[Name\], Co-founder and CEO, strategy and client relationships, \[short bio\]
- Founder 2: \[Name\], Co-founder and CTO, engineering and automation, \[short bio\]
- Founder 3: \[Name\], Co-founder and Head of Design and Product, \[short bio\]

Use neutral illustrated avatars until real photos are available.

### 4.8 Blog

MDX-based articles with categories, reading time, table of contents, author card, related posts, and Article schema. Launch with 4 articles targeting SEO (see Section 9).

### 4.9 Contact

Two columns. Left: consultation form (name, email, phone, company, service interested in, budget range, message) plus an embedded Cal.com booking calendar. Right: email, phone, WhatsApp button, address or *Remote-first, serving India* **\[PLACEHOLDER\]**, social links, and a map only if there is a physical office. Show response time (for example, *We reply within one business day*). Success state with confetti-free, elegant confirmation.

### 4.10 Legal pages

Privacy policy, terms of service and cookie policy, reviewed by a qualified professional before launch. Cookie banner that blocks Google Analytics until the visitor consents.

## 5. 3D, animation and motion specification

### 5.1 Libraries

`three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `gsap` (with ScrollTrigger), `lenis` (smooth scrolling), `next-themes` (theme toggle), `lucide-react` (icons). Pin exact versions after install and note them in `package.json`.

### 5.2 Hero 3D scene

Concept: the three-bar E monogram rebuilt as three floating, rounded 3D slabs (the top slab gold, the others indigo-tinted glass). They hover and rotate slowly, surrounded by a soft particle field and four small orbiting icon tokens (code brackets, chat bubble, shopping cart, chart) that represent the service lines.

Behavior:

- **Idle:** slow float and gentle rotation.
- **Mouse move:** the scene tilts toward the cursor (parallax).
- **Hover on the scene:** the slabs separate vertically (an exploded view) and a label appears for each layer.
- **Drag:** rotate with damping. Scroll is never hijacked by the canvas.
- **Scroll:** as the hero leaves the screen, the scene scales down and fades.
- **Theme-aware:** dark theme uses emissive indigo and gold on a near-black background; light theme uses frosted, softly lit materials on a pale background.

Implementation rules:

- Build the geometry procedurally (rounded boxes). Avoid large external 3D model files. Keep any asset under 500 KB.
- Do not load external HDR environment files. Use drei `Lightformer` or simple lights so nothing is fetched from a third party.
- Load the scene with `next/dynamic` and `ssr: false`, so the page text paints first.
- Cap device pixel ratio at 1.5 to 2. Pause rendering when the hero is off-screen (IntersectionObserver) and when the tab is hidden.
- **Fallback:** show a static SVG or poster image when WebGL is unavailable, on low-power or small phones, or when the visitor prefers reduced motion.
- Target: stable 60 fps on a mid-range laptop and at least 30 fps on a mid-range phone.

Optional second 3D moment: a rotating isometric device stack (laptop, phone, dashboard) in the Services section, using the same lighting setup.

### 5.3 Motion tokens

- Durations: fast 150 ms, base 250 ms, slow 400 ms, hero 700 to 900 ms.
- Easing: standard `cubic-bezier(0.22, 1, 0.36, 1)`, spring for playful elements (stiffness 260, damping 24).
- Stagger: 60 to 80 ms between siblings.
- Animate only `transform` and `opacity`. Never animate width, height, top or left.

### 5.4 Scroll animations

- **Reveal on scroll:** fade in and move up 24 px, triggered once when 20 percent visible.
- **Heading text reveal:** words rise from a masked line, staggered.
- **How we work:** a pinned section (GSAP ScrollTrigger) where the four steps activate in sequence while a progress line draws.
- **Industries:** horizontal scrolling track driven by vertical scroll on desktop, plain swipe carousel on mobile.
- **Parallax:** background grid and gradient orbs drift at different speeds (maximum 40 px offset).
- **Animated counters:** count up when visible, once only.
- **Marquee:** slow, pauses on hover. Use it for the technologies you work with (Next.js, React, Node, PostgreSQL, WhatsApp, Razorpay, Google Cloud, n8n) as capabilities, not as client logos.
- **Scroll progress bar:** a thin primary-colored bar at the top of the page.

### 5.5 Page transitions

Use `app/template.tsx` with Framer Motion so every route change plays an enter animation: a quick primary-colored wipe panel (about 500 ms) followed by content fading up. Keep the navbar fixed during transitions and scroll to top on navigation. If exit animations prove unreliable in the App Router, keep the enter-only version. It is more robust.

### 5.6 Micro-interactions

- **Buttons:** magnetic pull toward the cursor on desktop, arrow slides on hover, subtle press scale.
- **Cards:** 3D tilt (maximum 6 degrees) with a gradient glow that follows the cursor.
- **Links:** underline draws from left to right.
- **Custom cursor:** a small dot plus a trailing ring that grows over interactive elements and shows labels such as View or Drag. Disabled on touch devices and for reduced motion.
- **Theme toggle:** a circular reveal transition using the View Transitions API, with a fallback fade. The sun and moon icons morph.
- **Forms:** floating labels, inline validation, animated checkmark on success.
- **Chat widget:** springs open from the bottom-right button, typing indicator dots.
- **Intro:** a brief branded intro (monogram bars slide in) only on the first visit in a session and never longer than 1.2 seconds.

### 5.7 Theme toggle rules

Use `next-themes` with the `data-theme` attribute. Default to the visitor's system setting, persist the choice, and avoid a flash of the wrong theme. The logo, 3D scene, charts and images must all respond to the theme.

### 5.8 Motion accessibility

Respect `prefers-reduced-motion`: turn off parallax, auto-rotation, marquee movement, custom cursor and page wipes, and show static alternatives. Provide a visible pause control for any looping animation over 5 seconds. Nothing may flash more than three times per second.

## 6. Component library

Build these as reusable components with TypeScript props, each working in both themes.

- **Layout:** `Navbar`, `MegaMenu`, `MobileMenu`, `Footer`, `Container`, `Section`, `PageTransition`, `ScrollProgress`, `SmoothScroll`.
- **Brand:** `Logo`, `ThemeToggle`, `Cursor`.
- **Hero and 3D:** `HeroScene`, `SceneFallback`, `ParticleField`.
- **Content:** `SectionHeading`, `ServiceCard`, `IndustryTile`, `ProcessTimeline`, `FeatureList`, `StatCounter`, `Marquee`, `PricingCard`, `PricingToggle`, `FounderCard`, `ProjectCard`, `DeviceMockup`, `FAQAccordion`, `CTABand`, `BlogCard`, `TableOfContents`.
- **Interactive demos:** `WhatsAppDemo` (animated chat), `DashboardPreview` (animated CRM mock).
- **Forms:** `ContactForm`, `BookingEmbed`, `NewsletterForm`.
- **Overlays:** `ChatWidget`, `WhatsAppButton`, `CookieBanner`, `Toast`.
- **Primitives:** `Button` (primary, secondary, ghost), `Input`, `Textarea`, `Select`, `Badge`, `Card`, `Tabs`, `Tooltip`, `Modal`.

## 7. Integrations

| Integration | Purpose | Tool | Notes | Phase |
| --- | --- | --- | --- | --- |
| Consultation booking | Let visitors book a call | Cal.com embed | Free tier is enough to start; connect Google Calendar and Meet | 1 |
| Contact form | Capture leads | Next.js API route + Zod | Save to Postgres, email the team, post to n8n webhook | 1 |
| Spam protection | Block bots | Cloudflare Turnstile + honeypot + rate limit | Turnstile is free and privacy-friendly | 1 |
| Transactional email | Notify team, confirm to visitor | Resend or Google Workspace SMTP | Set SPF, DKIM and DMARC in Cloudflare DNS | 1 |
| WhatsApp | Instant contact | Click-to-chat link (wa.me) with prefilled message | No API cost; the WhatsApp Business API is for client projects | 1 |
| AI chatbot | Answer questions, capture leads | Gemini API via a server route | See 7.1 | 1 |
| Analytics | Traffic and conversions | Google Analytics 4 with consent mode | Load only after cookie consent; track form submits, booking clicks, WhatsApp clicks | 1 |
| Search visibility | Indexing | Google Search Console | Verify with a DNS record in Cloudflare; submit the sitemap | 1 |
| Business email | Professional addresses | Google Workspace | MX records via Cloudflare | 1 |
| Automation | Route leads | n8n (cloud or self-hosted) | Lead to Google Sheet, then alert the founders on WhatsApp or Slack | 1 or 2 |
| Uptime monitoring | Know if the site is down | UptimeRobot or Better Stack | Free tier | 1 |
| Error monitoring | Catch bugs | Sentry (free tier) | Optional | 2 |
| Client portal | Projects, invoices, support | Auth.js + Prisma + Razorpay + Cloudflare R2 | See Section 11 | 2 |

### 7.1 AI chatbot specification

- **Where:** floating widget on every page, and a full-width assistant on the Contact page.
- **How:** the browser sends messages to `/api/chat`. The server calls the Gemini API with your key and streams the reply back. The key must never reach the browser.
- **Model:** use a current fast Gemini model suited to chat. Check the exact model name in Google AI Studio at build time, because model names change.
- **System prompt:** it is the EliavaTech assistant; it answers only about EliavaTech services, price ranges (taken from the Pricing page), process and timelines; it never invents clients, results or discounts; it asks for name, email and need when a visitor wants a quote; and it offers the booking link or WhatsApp for anything it cannot answer.
- **Lead capture:** when contact details are collected, save them to the `Lead` table and trigger the n8n webhook.
- **Safety and cost controls:** rate limit per IP, maximum message length, maximum conversation length, a spending alert on your Google account, refusal of off-topic requests, and a short privacy note in the widget (Conversations may be stored to improve our service).
- **Fallback:** if the API fails, show the WhatsApp and booking buttons instead of an error.

### 7.2 DNS and hosting notes

Manage DNS in Cloudflare. For a Vercel-hosted site, point the records to Vercel and keep them DNS-only (grey cloud) unless you deliberately configure proxying, because proxying a site already served by Vercel can cause redirect and certificate issues. Redirect `www` to the root domain (or the reverse) and force HTTPS.

## 8. Technical architecture

### 8.1 Stack

- Next.js (App Router) with TypeScript.
- Tailwind CSS with the design tokens from Section 2.
- Framer Motion, GSAP, Lenis, React Three Fiber.
- PostgreSQL (Neon or Supabase) with Prisma.
- Zod for validation, React Hook Form for forms.
- MDX for blog posts.
- ESLint and Prettier, Git with GitHub, deployment from the main branch with preview deployments.

### 8.2 Folder structure

```
eliavatech/
  docs/BLUEPRINT.md
  app/
    (marketing)/page.tsx
    (marketing)/services/[slug]/page.tsx
    (marketing)/industries/[slug]/page.tsx
    (marketing)/work/[slug]/page.tsx
    (marketing)/pricing/page.tsx
    (marketing)/about/page.tsx
    (marketing)/blog/[slug]/page.tsx
    (marketing)/contact/page.tsx
    (legal)/privacy/page.tsx
    api/contact/route.ts
    api/chat/route.ts
    layout.tsx
    template.tsx
    sitemap.ts
    robots.ts
    opengraph-image.tsx
  components/ (brand, layout, ui, sections, three, forms, chat)
  content/ (blog MDX, projects, services data)
  lib/ (db.ts, email.ts, gemini.ts, analytics.ts, utils.ts, seo.ts)
  prisma/schema.prisma
  public/ (fonts, images, icons)
  styles/globals.css
  .env.local (never commit)
```

Keep services, industries, pricing, projects and FAQs as typed data files in `content/`. Pages render from that data, so editing copy never means editing components.

### 8.3 Database models (Prisma)

- `Lead`: id, name, email, phone, company, service, budgetRange, message, source (form, chat, booking), status (new, contacted, won, lost), createdAt.
- `ChatSession`: id, leadId (optional), createdAt.
- `ChatMessage`: id, sessionId, role, content, createdAt.
- `NewsletterSubscriber`: id, email, consent, createdAt.
- Phase 2 additions: `User`, `Account`, `Session`, `Client`, `Project`, `Invoice`, `SupportTicket`, `FileAsset`.

### 8.4 Environment variables

```
DATABASE_URL=
GEMINI_API_KEY=
RESEND_API_KEY=
NOTIFY_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=
N8N_WEBHOOK_URL=
NEXT_PUBLIC_CAL_LINK=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Create `.env.example` with empty values and add `.env*` to `.gitignore`.

## 9. SEO plan

**Technical SEO**

- Per-page title and meta description through the Next.js Metadata API. Unique Open Graph images generated with `next/og`.
- `sitemap.ts` and `robots.ts`, canonical URLs, clean slugs, one H1 per page.
- JSON-LD structured data: `Organization`, `ProfessionalService`, `WebSite`, `BreadcrumbList`, `FAQPage` on pages with FAQs, `Article` on blog posts, `Service` on service pages.
- Core Web Vitals targets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms. The 3D scene must not block text rendering.
- Image optimization, font preloading, lazy loading below the fold.

**Content SEO**

- Target phrases for India (add your city once chosen): website development for small business, e-commerce website development in India, WhatsApp automation for business, CRM software for small business, website maintenance plans in India.
- Industry pages double as SEO landing pages (website for clinics, software for real estate agents, and so on).
- First four blog posts: (1) How much does a business website cost in India? (2) WhatsApp automation for clinics and appointment-based businesses. (3) Do small businesses really need a CRM? (4) Website or Instagram page: what does a local business need?
- Publish one useful post every two weeks and link each post to a service page.

**Off-site**

- Create and verify a Google Business Profile once you have a service area or address.
- Create LinkedIn and Instagram profiles with the same handle as the domain.
- List the company in relevant Indian business directories.

## 10. Performance, accessibility, security and legal

**Performance**

- Lighthouse targets on mobile: Performance 85+, Accessibility 95+, Best Practices 95+, SEO 100. The 3D hero is the main risk, so test it first on a real mid-range phone.
- Code-split everything heavy (Three.js, GSAP, chat widget). Load chat and cursor after the page is interactive.
- Use `next/font`, `next/image`, and server components by default. Add `use client` only where interaction needs it.

**Accessibility (WCAG 2.2 AA)**

- Full keyboard navigation with visible focus rings, a skip-to-content link, semantic landmarks, and proper heading order.
- Alt text on images, labels on every field, ARIA only where native HTML cannot do the job.
- Color contrast at AA in both themes. Test the 3D scene's text overlays in both.

**Security**

- Secrets only in environment variables. Validate and sanitize all form and chat input on the server.
- Security headers (Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy) in `next.config`. Allow only the script sources you actually use (Google Analytics, Cal.com, Turnstile).
- Rate limiting on `/api/contact` and `/api/chat`. Turnstile on the contact form.
- Keep dependencies updated and run `npm audit` before launch.

**Legal and privacy**

- Privacy policy, terms and cookie policy. India's Digital Personal Data Protection Act applies to how you collect and store personal data, so have the policy reviewed by a qualified professional.
- Cookie banner with Accept and Reject options. Analytics loads only after acceptance.
- Add the company's registered name, address and contact details in the footer once you have them.

## 11. Phase 2: client login portal (after launch)

Do not build this in the first two weeks. Design the database now so it slots in later.

- **Roles:** admin (founders), team member, client.
- **Authentication:** Auth.js with email magic link or Google sign-in, plus optional two-factor authentication.
- **Client dashboard:** project status timeline, milestones, shared files, messages, invoices and payment links (Razorpay), support tickets, and maintenance plan details.
- **Admin area:** leads pipeline (from the `Lead` table), client list, project management, invoice creation, ticket inbox.
- **File storage:** Cloudflare R2 or similar, with signed URLs and size and type limits.
- **Security:** role-based access checks on every server action, audit log, session expiry, and a data export and delete path for clients.
- **Later (SaaS direction):** turn repeatable client solutions such as a clinic booking system or a real estate CRM into multi-tenant products built on the same portal foundation.

## 12. Fourteen-day build plan and Cline prompts

### How to work with Cline

- Start each phase in Plan mode and let Cline outline its steps. Switch to Act mode once the plan matches this blueprint.
- Give Cline one phase at a time. Large all-in-one prompts produce messy results.
- After each phase, ask Cline to run `npm run lint` and `npm run build`, fix errors, then open the site and check both themes and mobile width.
- Commit to Git after every phase with a clear message, so you can roll back.
- If something looks wrong, describe what you see and where, and attach a screenshot.
- Always begin with: Read docs/BLUEPRINT.md fully. Follow its design tokens, copy and structure exactly. Ask me before changing any decision.

### Day 1 to 2: foundation and design system

```
Read docs/BLUEPRINT.md fully. Create a new Next.js project (App Router, TypeScript, Tailwind CSS, ESLint) named eliavatech. Implement Section 2: CSS variables for all color tokens in light and dark (data-theme), Tailwind theme mapping, next/font setup for Sora, Inter and JetBrains Mono, spacing and radius tokens, and the Logo component with all four variants. Install next-themes and build the ThemeToggle with no flash of wrong theme. Build the primitives in Section 6 (Button, Input, Textarea, Select, Badge, Card, Tabs, Tooltip, Modal). Create a hidden /styleguide route that shows every token and component in both themes. Do not build pages yet.
```

### Day 3 to 4: layout and motion infrastructure

```
Implement the global layout: Navbar with MegaMenu and MobileMenu, Footer, SmoothScroll (Lenis), ScrollProgress, template.tsx page transition, and the Cursor component. Follow Sections 4.1 and 5.3 to 5.8 exactly, including prefers-reduced-motion handling. Create reusable animation helpers: Reveal, StaggerGroup, SplitHeading, MagneticButton, TiltCard. Add placeholder pages for every route in the sitemap so navigation works.
```

### Day 5 to 6: hero 3D and home page

```
Build the HeroScene per Section 5.2 using React Three Fiber and drei: three procedural rounded slabs forming the E monogram, particle field, four orbiting icon tokens, mouse parallax, hover exploded view, drag rotate, theme-aware materials, pause when off-screen, dynamic import with ssr false, and SceneFallback for no WebGL, low power and reduced motion. Then build every Home section in Section 4.2 in order, using typed data files in content/. Include the WhatsAppDemo animated chat and animated counters. Test at 375px, 768px and 1440px in both themes.
```

### Day 7 to 8: inner pages

```
Build Services (overview and the five detail pages), Industries (overview and seven detail pages), Work (grid with filters and three concept project pages labelled Concept project), Pricing (with the one-time and monthly toggle and the exact packages in Section 4.6), and About (with the three placeholder founder cards). Use content data files so copy is editable without touching components. Add DeviceMockup and DashboardPreview components. Do not invent client names, testimonials or metrics.
```

### Day 9: contact, database and booking

```
Set up Prisma with PostgreSQL and the models in Section 8.3. Build the Contact page: ContactForm with React Hook Form and Zod, floating labels, Cloudflare Turnstile and a honeypot field, POST to /api/contact which validates, rate limits, saves a Lead, sends an email notification with Resend, and calls the N8N_WEBHOOK_URL if set. Embed the Cal.com booking calendar using NEXT_PUBLIC_CAL_LINK. Add the floating WhatsAppButton using NEXT_PUBLIC_WHATSAPP_NUMBER with a prefilled message. Create .env.example. Handle every error state gracefully.
```

### Day 10: AI chatbot

```
Build the ChatWidget and /api/chat per Section 7.1. Use the Gemini API server-side with GEMINI_API_KEY, streaming responses, a system prompt grounded only in EliavaTech services, pricing ranges and process from the content files, per-IP rate limiting, message length limits, lead capture into the Lead table, and a fallback to WhatsApp and booking buttons when the API fails. Never expose the key to the browser. Look up the current recommended Gemini model name in the official documentation before choosing it.
```

### Day 11: blog and SEO

```
Implement the blog with MDX: listing page with categories, post page with table of contents, reading time, related posts and author card. Write the four starter posts from Section 9 as drafts for me to review. Add Metadata API for every page, sitemap.ts, robots.ts, canonical URLs, JSON-LD schemas listed in Section 9, and dynamic Open Graph images with next/og.
```

### Day 12: analytics, consent, legal and accessibility

```
Add Google Analytics 4 using NEXT_PUBLIC_GA_ID with Google consent mode, loaded only after the visitor accepts the CookieBanner. Track form submissions, booking clicks, WhatsApp clicks and chat starts as events. Create Privacy, Terms and Cookie pages with clearly marked placeholder text for legal review. Then audit the whole site for WCAG 2.2 AA: keyboard navigation, focus states, contrast in both themes, alt text, labels, heading order. Fix everything you find.
```

### Day 13: performance and quality assurance

```
Run Lighthouse and fix issues until the Section 10 targets are met on mobile. Check bundle size and code-split Three.js, GSAP and the chat widget. Verify the 3D fallback works. Add security headers in next.config. Test every page and form at 375px, 768px and 1440px in both themes, and in Chrome, Safari and Firefox. List remaining bugs and fix them.
```

### Day 14: deployment and launch

```
Prepare for deployment: confirm the build passes, env variables are documented, and no secrets are committed. Give me step-by-step instructions to deploy on Vercel, connect the Cloudflare domain with DNS-only records, set up www redirect, verify Google Search Console, submit the sitemap, and configure Google Workspace email records (MX, SPF, DKIM, DMARC). Write a launch checklist I can tick off.
```

## 13. Budget, launch checklist and next steps

### 13.1 Estimated monthly and yearly costs

These are rough planning figures. Check every price on the vendor's site before you buy.

| Item | Approximate cost | Notes |
| --- | --- | --- |
| Domain (.com via Cloudflare) | About ₹900 to 1,100 per year | Cloudflare sells domains close to wholesale price |
| Hosting (Vercel) | Free Hobby plan is for non-commercial use; the Pro plan is about US$20 per month per member | Use Pro for a business site, or choose another host |
| Google Workspace | Roughly ₹150 to 250 per user per month | Three founders means about ₹450 to 750 per month |
| Database (Neon or Supabase) | Free tier to start | Upgrade when traffic grows |
| Email sending (Resend) | Free tier to start | Enough for a lead-notification volume |
| Cal.com, Turnstile, Google Analytics, Search Console | Free |  |
| Gemini API | Very low at chatbot volumes, but set a spending alert | Pricing changes, so check the current rate card |
| n8n | Free if self-hosted; paid cloud plans exist | Start with a simple webhook to a Google Sheet if you want zero cost |
| Legal review of policies | One-time professional fee | Optional but recommended |

Realistic starting budget: about ₹5,000 to 10,000 per month including hosting and email, plus the one-time domain and optional legal review. This is an estimate, so adjust it after checking real prices.

### 13.2 Pre-launch checklist

- [ ] All placeholders replaced (founders, phone, email, address or remote line, social links)
- [ ] Pricing reviewed against what you can actually deliver
- [ ] Concept projects clearly labelled; no invented testimonials or metrics
- [ ] Contact form, booking, WhatsApp and chatbot tested end to end
- [ ] Lead notifications arriving by email and in n8n
- [ ] Cookie banner blocks analytics until consent
- [ ] Legal pages reviewed
- [ ] Lighthouse and accessibility targets met
- [ ] Both themes checked on phone and desktop
- [ ] Google Search Console verified and sitemap submitted
- [ ] Google Workspace email authenticated (SPF, DKIM, DMARC)
- [ ] Backups and uptime monitoring set up
- [ ] Social profiles and Google Business Profile created

### 13.3 Validate demand while you build

A beautiful site does not create customers on its own. During the two weeks, also:

1. List 30 local businesses in two or three sectors (for example clinics and retail shops) and note their obvious digital gaps.
2. Speak to at least 10 of them about their problems before pitching anything.
3. Offer 2 or 3 of them a discounted pilot project in exchange for a testimonial and permission to publish the case study.
4. Use those real projects to replace the concept projects.

### 13.4 Open items for you to confirm

1. Your city or service area (for SEO and the Google Business Profile).
2. Hosting: Vercel Pro versus another option, given the commercial-use rule on the free plan.
3. Real phone, WhatsApp number, business email and founder details.
4. Whether you are comfortable with the launch prices in Section 4.6 or want them adjusted.
5. Whether to show the meaning of Eliava on the home page or only on the About page.
6. Whether you prefer the gold accent or an all-indigo palette.

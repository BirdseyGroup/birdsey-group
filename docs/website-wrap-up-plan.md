# Website Wrap-Up — Work Plan

Source: `Visual Boston_Website Wrap Up.pdf` (18 items). Status as of this pass.

## ✅ Done (local, not committed)

### Group A — copy / config
- [x] **2.** Capitalize "Ecosystem" — `content/pages/home.json` (hero subtitle)
- [x] **3.** CTA buttons → Title Case ("Explore Our Expertise", "Meet the Affiliates") — `home.json`
- [x] **6.** "Performance that Build**s** Trust" — `home.json`
- [x] **7.** "Insights & Recognition." → "Insights & News" — `home.json`
- [x] **9.** Footer year 2025 → 2026 — `content/global/settings.json`
- [x] **11.** About mission last line "valued addition **to** their real estate deal team." — `content/pages/about.json`

### Group B — small code / behavior
- [x] **1.** Hero headline contrast — deeper gradient overlay — `HeroSection/heroSection.module.css`
- [x] **4.** "Meet the Affiliates" button now targets `#affiliates` (logo grid) instead of `#services` — `home.json`
- [x] **8.** Contact form left side — faint crest watermark (`birdsey-icon-only.svg`) behind the headline — `ContactSection/*`
- [x] **10.** Affiliate photos — visible "Visit website ↗" badge on hover/active state to signal they're clickable links — `BrandShowcase/*`

## ⏸ Parked — needs a decision (tracked)

- [ ] **5.** Renovation card copy. Description updated request: "A turnkey **commercial and** residential renovation contractor…". Open question: should the card title drop "Residential" to read "Turnkey Renovation Contractor", or keep the current split title? — `home.json` affiliates item 4. *(Awaiting confirm before editing.)*
- [ ] **16.** Inc. 500 Award — "Recognized as the 6th fastest-growing construction company in the U.S." Plan: place in the **footer** with a color-inverted version of the transparent-black award PNG. Needs: the award logo asset + a quick design check on footer placement.

## 🚧 Blocked — needs content / assets from client

- [x] **12.** Sandford's new headshot — new studio shot saved as `/images/team/sandford-birdsey-2026.jpeg` (cache-busting rename), referenced by `sandford-birdsey.json` + `sandford-birdsey-board.json`. The May candidate `public/images/Sandford Birdsey Headshot.jpeg` was superseded and is still tracked in the repo — candidate for deletion.
- [x] **13.** Sandford new bio — QUART brand-aligned website version applied to `content/team/sandford-birdsey.json` `bio`.
- [ ] **14.** Cooper Baker bio — currently empty. Need text. → `content/team/cooper-baker.json`.
- [ ] **15.** Troi Russell bio — currently empty. Need text. → `content/team/troi-russell.json`.

## 🔌 Done — contact form backend (#17 + #18 together)

Decision: **Forminit** (forminit.com, formerly Getform.io), form `d7bdapw3fcd`.
- [x] **17.** Contact form submits to Forminit via the `forminit` SDK in **Public** auth mode (Protected/API tokens are Pro-only). Client-side validation kept (required fields, email format, E.164 phone). Success redirects to `/thank-you`. Resend action (`app/_actions/sendContact.ts`) removed. Notification email + auto-reply configured in the Forminit dashboard.
- [x] **18.** Captcha — Forminit's built-in spam protection + rate limiting on public forms; reCAPTCHA/hCaptcha can be layered in via Forminit if needed.

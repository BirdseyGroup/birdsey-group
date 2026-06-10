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

- [ ] **12.** Sandford's new headshot. Candidate already in repo: `public/images/Sandford Birdsey Headshot.jpeg` — confirm this is the new one, then replace `/images/team/sandford-birdsey.jpeg` (used by `sandford-birdsey.json` + `sandford-birdsey-board.json`).
- [ ] **13.** Sandford new bio — need the text (PDF links an external doc). → `content/team/sandford-birdsey.json` `bio`.
- [ ] **14.** Cooper Baker bio — currently empty. Need text. → `content/team/cooper-baker.json`.
- [ ] **15.** Troi Russell bio — currently empty. Need text. → `content/team/troi-russell.json`.

## 🔌 Deferred — contact form backend decision (#17 + #18 together)

Tied to the Resend vs Forminit choice in `docs/updates.md`. User chose **decide later**.
- [ ] **17.** Connect Contact Us to the "tracking solution" (likely Forminit — submission dashboard + auto-reply).
- [ ] **18.** Captcha. If Forminit: spam filtering is built in, captcha likely unnecessary. If staying on Resend: add Cloudflare Turnstile with server-side verification in `app/_actions/sendContact.ts`.

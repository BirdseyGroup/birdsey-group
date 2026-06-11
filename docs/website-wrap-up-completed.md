# Birdsey Group — Website Wrap Up (Status)

Source: `Visual Boston_Website Wrap Up.pdf` (18 items). Each item keeps its
original number and wording. Completed items are ~~struck through~~ and marked
**✅ Done** with a note on what was changed. Open items keep their number and
show their real status, so nothing is reported as finished before it is.

---

## ✅ Completed

1. ~~**Hero Photo — can we create more contrast of the headline with the photo in
   the background?**~~ **✅ Done** — Deepened the gradient overlay on the hero
   image so the white type stays legible over the brighter areas of the photo.

2. ~~**Capitalize the letter "E" in "Ecosystem."**~~ **✅ Done** — Now reads "One
   **E**cosystem. Trusted Expertise. Results from origination to disposition."

3. ~~**CTA buttons (change to Title Case): "Explore Our Expertise" / "Meet the
   Affiliates."**~~ **✅ Done** — Both hero buttons updated to Title Case.

4. ~~**"Meet the Affiliates" button goes to Services instead of the Affiliate
   logos.**~~ **✅ Done** — The button now scrolls to the affiliate logo grid
   instead of the services section.

5. ~~**Update the Renovation card copy.**~~ **✅ Done** — Title now reads
   "**Turnkey Renovation Contractor**" (dropped "Residential") and the
   description now opens "A turnkey **commercial and** residential renovation
   contractor…".

6. ~~**Add an "S" at the end of "Build": "Performance that Builds Trust."**~~
   **✅ Done** — Corrected to "Performance that Build**s** Trust."

7. ~~**"Insights & Recognition." → change to "Insights & News" and remove the
   period.**~~ **✅ Done** — Heading is now "**Insights & News**" with no trailing
   period.

8. ~~**Contact form — it's empty on the left side. Can we add a watermark of a
   logo, or any other ideas?**~~ **✅ Done** — Added the Birdsey crest as a faint
   watermark behind the "Let's Move Real Estate Forward." headline. It's a
   light-gray mark (not gold) at a constant opacity, the headline and crest are
   centered in the column, and the area is sized so the crest always keeps clear
   space above and below as the page resizes.

9. ~~**Update date from 2025 to 2026.**~~ **✅ Done** — Footer now reads "The
   Birdsey Group LLC. **2026** – All Rights Reserved."

10. ~~**Can we get some type of button or indicator that you can click on the
    photos at the left to get to the websites?**~~ **✅ Done** — Added a "**Visit
    Website ↗**" link under each affiliate's description (the photo remains a
    link as well). Works on desktop and the mobile carousel, with a hover/arrow
    cue.

11. ~~**About Page — update the copy on the last line: "to their real estate deal
    team."**~~ **✅ Done** — Mission statement last line corrected from "a valued
    addition **of** their real estate deal team" to "a valued addition **to**
    their real estate deal team."

12. ~~**Substitute Sandford's new headshot.**~~ **✅ Done** — New studio headshot
    saved as `/images/team/sandford-birdsey-2026.jpeg` (renamed to bust browser
    and CDN caches of the old file) and both his corporate and board entries now
    point at it.

13. ~~**Switch out Sandford's bio for the new one.**~~ **✅ Done** — Replaced with
    the QUART brand-aligned website version (operational discipline / Birdsey
    Standard framing, 25+ years, 4,000+ properties, $25B+ loan value,
    GMACCM/MortgageRamp and Univest background, industry memberships) in
    `content/team/sandford-birdsey.json`.

16. ~~**Add the Inc. 500 Award: "Recognized as the 6th fastest-growing
    construction company in the U.S."**~~ **✅ Done** — Added the Inc. 500
    medallion to the footer brand column, presented as a clean white rounded
    badge with padding, with the recognition line as a caption beneath it. Also
    tidied the surrounding footer layout: more space above the Birdsey logo, and
    the copyright moved to its own full-width row at the bottom.

---

## 🚧 Open — awaiting content / assets from Birdsey

14. **Add Cooper Baker's bio.** — *need the bio text.*

15. **Add Troi Russell's bio.** — *need the bio text.*

---

## 🔌 In progress — contact form delivery (items 17 + 18 together)

17. **Connect the Contact Us page to the new tracking solution.** **Decision
    made: Forminit** (submission dashboard + auto-reply; forminit.com, formerly
    Getform.io). The form UI and validation are fully built and currently
    deliver via Resend as a stopgap. Remaining steps:
    - Birdsey/VB creates the Forminit account and a "Contact" form
      (Free plan = 100 submissions/mo; Pro $19/mo = 3,000/mo).
    - Set the form to **Protected** mode and share the **Form ID** and
      **API key** (or invite mark@visualboston.com to the workspace).
    - Dev: swap the Resend call in `app/_actions/sendContact.ts` for a
      server-side Forminit submission (`FORMINIT_API_KEY` +
      `FORMINIT_FORM_ID` env vars in Vercel); configure email notification
      to mail@birdseygroup.com and the branded auto-reply in the Forminit
      dashboard. — *blocked only on account credentials.*

18. **Will we need a Captcha?** **Resolved by the Forminit choice** — spam
    protection is built in (supports invisible reCAPTCHA v3 / hCaptcha if we
    ever want an explicit challenge), and our submissions go server-side with
    the API key, so no separate captcha is planned.

---

**Summary:** 14 of 18 complete (items 1–13, 16). Item 18 is resolved by the
Forminit decision. The rest are blocked on bio text from Birdsey (14, 15) or
Forminit account credentials (17) — not on development.

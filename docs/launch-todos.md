# Birdsey Group — Launch TODOs

Final-push checklist. Updated as new items come up.

## Contact form (Resend)
- [ ] Verify the sending domain (`birdseygroup.com`) in Resend so `noreply@birdseygroup.com` works as `from`. Until verified, set `CONTACT_FROM_EMAIL=onboarding@resend.dev` for testing.
- [ ] Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` to Vercel → Settings → Environment Variables (Production + Preview).
- [ ] Run `npm install` locally to pull the new `resend` dep, commit the lockfile.
- [ ] End-to-end test on production: submit the form, confirm the email arrives at `mail@birdseygroup.com`, confirm `reply-to` is the submitter's address.

## Handover to client accounts (GitHub / Vercel / Tina)

### GitHub
- [ ] Birdsey creates a GitHub organization (or chooses an existing one) and a private repo (e.g. `birdsey-group/website`).
- [ ] Add Birdsey as owner/admin; transfer or push-mirror the current repo into the new one.
- [ ] Update `git remote set-url origin <new-url>` locally; confirm `main` pushes cleanly to the new remote.
- [ ] Decommission the old repo (archive, don't delete) once the new one is the source of truth.
- [ ] Re-issue any branch protections, required reviews, deploy keys.

### Vercel
- [ ] Birdsey creates a Vercel team/account and adds payment method.
- [ ] Disconnect the project from the current Vercel account, then import the new GitHub repo into the Birdsey Vercel team.
- [ ] Re-create all Production + Preview env vars in the new project: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (and any others added before launch).
- [ ] Re-attach the `birdseygroup.com` domain to the new Vercel project; update DNS records as Vercel directs.
- [ ] Confirm the production deploy hooks, log drains, and analytics carry over (or re-enable).
- [ ] Delete the old Vercel project once the new one is serving the apex domain.

### TinaCMS
- [ ] Birdsey creates a Tina Cloud account (https://app.tina.io) on their own org.
- [ ] Create a new Tina project pointing at the new GitHub repo + `main` branch.
- [ ] Generate fresh `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`; put them in the new Vercel project's env vars and in their team's password manager.
- [ ] Invite Birdsey content editors to the Tina project; remove dev-team access once handed off.
- [ ] Confirm content edits via `/admin` write back to the new repo and trigger a Vercel deploy.
- [ ] Decommission the old Tina project after a successful end-to-end edit on the new one.

### Final transfer checklist
- [ ] Update README / this file with the new GitHub URL and Vercel project link.
- [ ] Hand over Resend account/owner email (or transfer the API key into a Birdsey-owned Resend workspace).
- [ ] Confirm domain registrar credentials are with Birdsey (or their IT) — DNS will need to live there long-term.
- [ ] Schedule a 30-min walkthrough with Birdsey: `/admin` editing, deploy logs, contact-form inbox.

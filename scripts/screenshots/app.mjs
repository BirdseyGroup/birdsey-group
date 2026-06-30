/**
 * Generates onboarding screenshots for the Lisa handoff document.
 *
 * External pages (no login needed):
 *   - GitHub signup
 *   - Vercel signup
 *   - TinaCMS landing
 *
 * Local pages (requires `npm run dev` to be running first):
 *   - TinaCMS admin dashboard
 *   - Team Members collection list
 *   - Team member edit form (Sandford Birdsey)
 *
 * Usage:
 *   npm run script:screenshots
 *
 * Output: docs/screenshots/
 */

import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../../docs/screenshots");
const LOCAL = "http://localhost:8000";

fs.mkdirSync(OUT, { recursive: true });

const log = (msg) => console.log(msg);

// ── Helpers ────────────────────────────────────────────────────────────────

async function save(page, filename) {
  const dest = path.join(OUT, filename);
  await page.screenshot({ path: dest, fullPage: false });
  log(`  saved  docs/screenshots/${filename}`);
}

async function isLocalRunning(page) {
  try {
    const res = await page.goto(LOCAL, { timeout: 5000 });
    return res?.ok() ?? false;
  } catch {
    return false;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

// Silence noisy console messages from external pages
page.on("console", () => {});

// ── External pages ─────────────────────────────────────────────────────────

log("\nExternal pages");
log("──────────────");

log("\n[1/3] GitHub signup");
await page.goto("https://github.com/signup", { waitUntil: "networkidle" });
await save(page, "01-github-signup.png");

log("\n[2/3] Vercel signup");
await page.goto("https://vercel.com/signup", { waitUntil: "networkidle" });
await save(page, "02-vercel-signup.png");

log("\n[3/3] TinaCMS");
await page.goto("https://tina.io", { waitUntil: "networkidle" });
await save(page, "03-tinacms-landing.png");

// ── Local pages (TinaCMS admin) ────────────────────────────────────────────

log("\nLocal admin (localhost:8000)");
log("────────────────────────────");

const running = await isLocalRunning(page);

if (!running) {
  log("\n  Skipped — dev server not running.");
  log("  Run `npm run dev`, then re-run `npm run script:screenshots`.\n");
} else {
  log("\n[4/6] Admin dashboard");
  await page.goto(`${LOCAL}/admin/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  // TinaCMS opens with an "Enter Edit Mode" modal — dismiss it to reveal the sidebar
  const enterBtn = page.getByText("Enter Edit Mode");
  if (await enterBtn.isVisible({ timeout: 5000 })) {
    await enterBtn.click();
    await page.waitForTimeout(2500);
  }
  await save(page, "04-admin-dashboard.png");

  log("\n[5/6] Team Members list");
  await page.goto(`${LOCAL}/admin/index.html#/collections/teamMember/~`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await save(page, "05-team-members-list.png");

  log("\n[6/6] Team member edit form");
  // Click the first team member row to open the edit form
  await page.locator("table tr a, [data-testid='list-item'] a, main a").first().click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500);
  await save(page, "06-team-member-edit.png");
}

await browser.close();
log("\nDone.\n");

export const SITE_URL = "https://www.birdseygroup.com";

// Search engines may only index the deployment whose production domain is
// the real site. Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the project's
// production domain (e.g. "birdsey-group-staging.vercel.app", or
// "www.birdseygroup.com" once the real domain is attached at launch), so
// staging and preview projects are automatically noindexed and the switch
// flips itself when the domain moves over. NEXT_PUBLIC_SITE_INDEXABLE=true
// is a manual override in case system env vars are disabled on the project.
export const IS_INDEXABLE =
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").includes(
    "birdseygroup.com"
  ) || process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

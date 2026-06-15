// Smooth-scroll a section into view, accounting for the fixed header.
//
// The header height is measured live rather than hardcoded so the landing
// position stays correct across breakpoints (the header is taller on desktop
// than the old hardcoded 72px assumed). A small gap is added on top so the
// section heading sits clearly below the header instead of flush against it.
const SCROLL_GAP = 24;

export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const header = document.querySelector("header");
  const headerOffset = (header?.getBoundingClientRect().height ?? 72) + SCROLL_GAP;

  const offsetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
}

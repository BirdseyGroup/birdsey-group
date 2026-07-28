/**
 * Team photos render in fixed-ratio frames with `object-fit: cover`: a square
 * on the About-page cards and the /team profile page, and a 5:4 landscape in
 * the mini-bio modal. Any source image that isn't already that ratio therefore
 * gets cropped, and the browser default (center) crops evenly off the top and
 * bottom, which decapitates tall portraits.
 *
 * The "Photo Crop Position" field in Tina lets an editor bias that crop per
 * person without re-cutting the file. Unset means center, so existing content
 * keeps its current framing.
 */
export type PhotoFocalPoint = "top" | "upper" | "center" | "lower" | "bottom";

const FOCAL_POINT_Y: Record<PhotoFocalPoint, string> = {
  top: "0%",
  upper: "20%",
  center: "50%",
  lower: "80%",
  bottom: "100%",
};

/**
 * CSS `object-position` for a stored focal point. Falls back to centered for
 * unset or unrecognised values.
 */
export function photoObjectPosition(focalPoint?: string | null): string {
  const y =
    focalPoint && focalPoint in FOCAL_POINT_Y
      ? FOCAL_POINT_Y[focalPoint as PhotoFocalPoint]
      : "50%";
  return `50% ${y}`;
}

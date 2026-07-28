import { tinaField } from "tinacms/dist/react";
import type { GlobalQuery } from "@/tina/__generated__/types";

// Builds Footer props from the generated Global query, attaching tinaField
// strings so footer content is click-to-edit inside the Tina admin preview.
// Outside the preview (no useTina metadata) tinaField resolves to a harmless
// empty value, so the same helper serves both render paths.
export function buildFooterProps(global: GlobalQuery["global"]) {
  const footer = global.footer;

  return {
    phone: footer?.phone || "",
    phoneTinaField: footer ? tinaField(footer, "phone") : undefined,
    email: footer?.email || "",
    emailTinaField: footer ? tinaField(footer, "email") : undefined,
    address: footer?.address || "",
    addressTinaField: footer ? tinaField(footer, "address") : undefined,
    copyright: footer?.copyright || "",
    copyrightTinaField: footer ? tinaField(footer, "copyright") : undefined,
    navItems: (global.navigation?.items ?? [])
      .filter((item) => item != null)
      .map((item) => ({
        label: item.label,
        href: item.href,
        tinaField: tinaField(item, "label"),
      })),
    footerNavExtras: (footer?.footerNavExtras ?? [])
      .filter((item) => item != null)
      .map((item) => ({
        label: item.label,
        href: item.href,
        tinaField: tinaField(item, "label"),
      })),
    footerLinks: (footer?.footerLinks ?? [])
      .filter((item) => item != null)
      .map((item) => ({
        label: item.label,
        href: item.href,
        openCookieSettings: item.openCookieSettings ?? undefined,
        tinaField: tinaField(item, "label"),
      })),
  };
}

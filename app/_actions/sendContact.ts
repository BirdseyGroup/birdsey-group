"use server";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const REQUIRED_FIELDS = ["name", "phone", "email", "comments"] as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const fields = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    comments: String(formData.get("comments") ?? "").trim(),
  };

  const fieldErrors: Record<string, string> = {};
  for (const key of REQUIRED_FIELDS) {
    if (!fields[key]) fieldErrors[key] = "Required";
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "mail@birdseygroup.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "noreply@birdseygroup.com";

  if (!apiKey) {
    // Resend isn't configured yet — fail loud so we don't silently drop submissions.
    return {
      status: "error",
      message:
        "The contact form is not yet connected to email delivery. Please reach out directly at mail@birdseygroup.com.",
    };
  }

  try {
    // Dynamic import so the build works before `resend` is installed.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const subject = `New contact from ${fields.name}${fields.company ? ` (${fields.company})` : ""}`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: fields.email,
      subject,
      text: [
        `Name: ${fields.name}`,
        `Phone: ${fields.phone}`,
        `Email: ${fields.email}`,
        `Company: ${fields.company || "—"}`,
        "",
        "Comments:",
        fields.comments,
      ].join("\n"),
      html: `
        <table style="font-family: system-ui, sans-serif; line-height: 1.5;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(fields.name)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(fields.phone)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(fields.email)}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(fields.company || "—")}</td></tr>
          <tr><td valign="top"><strong>Comments</strong></td><td>${escapeHtml(fields.comments).replace(/\n/g, "<br>")}</td></tr>
        </table>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        status: "error",
        message: "Couldn't send your message. Please try again or email mail@birdseygroup.com.",
      };
    }

    return { status: "success" };
  } catch (err) {
    console.error("sendContact unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}

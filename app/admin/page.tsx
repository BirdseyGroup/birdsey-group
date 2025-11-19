import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to the static admin HTML file
  redirect("/admin/index.html");
}

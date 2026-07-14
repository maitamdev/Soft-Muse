import { redirect } from "next/navigation";

export default function LegacyHomepageEditor() {
  redirect("/admin/website/pages");
}

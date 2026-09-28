import { redirect } from "next/navigation";

// Destinations were promoted from a "master" to a top-level admin section
// (rich guide CMS). Redirect the old location so bookmarks keep working.
export default function LegacyDestinationsRedirect() {
    redirect("/admin/destinations");
}

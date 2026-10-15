import { redirect } from "next/navigation"

export default function AdminIndexPage() {
  // Redirect the root /admin route to the dashboard
  redirect("/admin/dashboard")
}


import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Панель управления | Образовательный портал",
  description: "Панель управления заявками и учреждениями",
}

export default function AdminPage() {
  return <AdminDashboard />
}

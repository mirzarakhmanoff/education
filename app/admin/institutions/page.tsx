import { InstitutionsTable } from "@/components/admin/institutions-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Управление учреждениями | Образовательный портал",
  description: "Просмотр и управление образовательными учреждениями",
}

export default function InstitutionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление учреждениями</h1>
        <p className="text-muted-foreground">Добавление, редактирование и управление образовательными учреждениями</p>
      </div>

      <InstitutionsTable />
    </div>
  )
}

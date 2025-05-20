import { ApplicationsTable } from "@/components/admin/applications-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Управление заявками | Образовательный портал",
  description: "Просмотр и управление заявками на поступление в образовательные учреждения",
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление заявками</h1>
        <p className="text-muted-foreground">
          Просмотр, фильтрация и управление заявками на поступление в образовательные учреждения
        </p>
      </div>

      <ApplicationsTable />
    </div>
  )
}

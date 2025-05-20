import { StatisticsPage } from "@/components/admin/statistics-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Статистика | Образовательный портал",
  description: "Статистика и аналитика по заявкам и образовательным учреждениям",
}

export default function Statistics() {
  return <StatisticsPage />
}

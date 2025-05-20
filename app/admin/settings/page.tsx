import { SettingsPage } from "@/components/admin/settings-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Настройки | Образовательный портал",
  description: "Настройки системы и управление пользователями",
}

export default function Settings() {
  return <SettingsPage />
}

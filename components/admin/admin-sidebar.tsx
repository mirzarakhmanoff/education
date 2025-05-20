"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LayoutDashboard, FileText, School, BarChart, Settings, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="w-64 bg-card border-r h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
        </svg>
        <span className="font-bold text-xl">Админ-панель</span>
      </div>

      <nav className="space-y-2 flex-1">
        <Link href="/admin">
          <Button variant={isActive("/admin") ? "default" : "ghost"} className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Дашборд
          </Button>
        </Link>
        <Link href="/admin/applications">
          <Button variant={isActive("/admin/applications") ? "default" : "ghost"} className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Заявки
          </Button>
        </Link>
        <Link href="/admin/institutions">
          <Button variant={isActive("/admin/institutions") ? "default" : "ghost"} className="w-full justify-start">
            <School className="mr-2 h-4 w-4" />
            Учреждения
          </Button>
        </Link>
        <Link href="/admin/statistics">
          <Button variant={isActive("/admin/statistics") ? "default" : "ghost"} className="w-full justify-start">
            <BarChart className="mr-2 h-4 w-4" />
            Статистика
          </Button>
        </Link>
        <Link href="/admin/settings">
          <Button variant={isActive("/admin/settings") ? "default" : "ghost"} className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Настройки
          </Button>
        </Link>
      </nav>

      <Button
        variant="ghost"
        className="mt-auto w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Выйти
      </Button>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, LineChart } from "@/components/admin/admin-charts"
import { Loader2 } from "lucide-react"

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch statistics")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить статистику",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center">
        <p>Не удалось загрузить статистику. Пожалуйста, попробуйте позже.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
        <p className="text-muted-foreground">Обзор заявок и статистика образовательных учреждений</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Общее количество поданных заявок</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На рассмотрении</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Заявки, ожидающие рассмотрения</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Одобрено</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedApplications}</div>
            <p className="text-xs text-muted-foreground">Одобренные заявки</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Учреждения</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstitutions}</div>
            <p className="text-xs text-muted-foreground">Активные образовательные учреждения</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Заявки по типу учреждения</CardTitle>
                <CardDescription>Распределение заявок по типам образовательных учреждений</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart data={stats.applicationsByType} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Статусы заявок</CardTitle>
                <CardDescription>Распределение заявок по статусам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center justify-center p-4 bg-yellow-100 rounded-lg">
                        <span className="text-yellow-800 text-2xl font-bold">{stats.pendingApplications}</span>
                        <span className="text-yellow-800 text-sm mt-1">На рассмотрении</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-green-100 rounded-lg">
                        <span className="text-green-800 text-2xl font-bold">{stats.approvedApplications}</span>
                        <span className="text-green-800 text-sm mt-1">Одобрено</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-red-100 rounded-lg">
                        <span className="text-red-800 text-2xl font-bold">{stats.rejectedApplications}</span>
                        <span className="text-red-800 text-sm mt-1">Отклонено</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 bg-blue-100 rounded-lg">
                        <span className="text-blue-800 text-2xl font-bold">{stats.totalApplications}</span>
                        <span className="text-blue-800 text-sm mt-1">Всего</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Динамика заявок</CardTitle>
              <CardDescription>Количество заявок за последние 30 дней</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChart data={stats.applicationsByDate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

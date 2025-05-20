"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, TrendingUp, Users, School, FileCheck } from "lucide-react"
import { BarChart, LineChart, PieChart } from "@/components/admin/admin-charts"
import { StatCard } from "@/components/admin/stat-card"

export function StatisticsPage() {
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

  // Prepare data for pie chart
  const statusData = [
    { name: "На рассмотрении", value: stats.pendingApplications, color: "#FBBF24" },
    { name: "Одобрено", value: stats.approvedApplications, color: "#34D399" },
    { name: "Отклонено", value: stats.rejectedApplications, color: "#F87171" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Статистика и аналитика</h1>
        <p className="text-muted-foreground">Обзор статистики по заявкам и образовательным учреждениям</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Всего заявок"
          value={stats.totalApplications}
          description="Общее количество поданных заявок"
          icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="На рассмотрении"
          value={stats.pendingApplications}
          description="Заявки, ожидающие рассмотрения"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Одобрено"
          value={stats.approvedApplications}
          description="Одобренные заявки"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Учреждения"
          value={stats.totalInstitutions}
          description="Активные образовательные учреждения"
          icon={<School className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="trends">Тренды</TabsTrigger>
          <TabsTrigger value="distribution">Распределение</TabsTrigger>
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
                <PieChart data={statusData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
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

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Распределение по регионам</CardTitle>
                <CardDescription>Количество заявок по регионам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Данные по регионам в разработке</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Возрастное распределение</CardTitle>
                <CardDescription>Распределение заявителей по возрасту</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Данные по возрасту в разработке</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

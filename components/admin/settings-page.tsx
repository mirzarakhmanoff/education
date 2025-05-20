"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { UserManagement } from "./user-management"

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoApprove: false,
    maxDocumentSize: 5,
    maintenanceMode: false,
  })

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Настройки сохранены",
        description: "Настройки системы успешно обновлены",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Настройки</h1>
        <p className="text-muted-foreground">Управление настройками системы и пользователями</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Настройте основные параметры работы системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-approve">Автоматическое одобрение заявок</Label>
                  <Switch
                    id="auto-approve"
                    checked={settings.autoApprove}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoApprove: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Автоматически одобрять заявки, если все документы загружены
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-document-size">Максимальный размер документа (МБ)</Label>
                <Input
                  id="max-document-size"
                  type="number"
                  value={settings.maxDocumentSize}
                  onChange={(e) => setSettings({ ...settings, maxDocumentSize: Number.parseInt(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">Максимальный размер загружаемых документов в мегабайтах</p>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>Настройте параметры отправки уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email-уведомления</Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Отправлять уведомления по email при изменении статуса заявки
                </p>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
              <CardDescription>Настройте параметры работы системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Режим обслуживания</Label>
                  <Switch
                    id="maintenance-mode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Включить режим обслуживания (сайт будет недоступен для пользователей)
                </p>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить настройки"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusCard } from "@/components/application-status-card"
import { useClientTranslation } from "@/lib/i18n-client"

const statusCheckSchema = z.object({
  identifier: z.string().min(1, {
    message: "Пожалуйста, введите email или номер заявки",
  }),
})

export default function StatusPage() {
  const { t } = useClientTranslation()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [applications, setApplications] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Get applicationId from URL if available
  const applicationId = searchParams.get("applicationId")

  const form = useForm<z.infer<typeof statusCheckSchema>>({
    resolver: zodResolver(statusCheckSchema),
    defaultValues: {
      identifier: applicationId || "",
    },
  })

  // Auto-search if applicationId is provided in URL
  useState(() => {
    if (applicationId) {
      checkStatus({ identifier: applicationId })
    }
  }, [applicationId])

  async function checkStatus(values: z.infer<typeof statusCheckSchema>) {
    setIsLoading(true)
    setHasSearched(true)

    try {
      // Determine if the identifier is an email or application ID
      const isEmail = values.identifier.includes("@")

      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [isEmail ? "email" : "applicationId"]: values.identifier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при проверке статуса")
      }

      setApplications(data)

      if (data.length === 0) {
        toast({
          variant: "destructive",
          title: "Заявки не найдены",
          description: "По указанным данным заявки не найдены",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Произошла ошибка при проверке статуса",
      })
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Проверка статуса заявки</h1>

      <div className="grid gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Введите данные для проверки</CardTitle>
            <CardDescription>
              Укажите email, который вы использовали при подаче заявки, или номер заявки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(checkStatus)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email или номер заявки</FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.ru или APP-2023-00001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Проверка..." : "Проверить статус"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Результаты поиска</h2>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <ApplicationStatusCard key={application._id} application={application} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Заявки не найдены. Пожалуйста, проверьте введенные данные.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, Eye, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ApplicationDetailsDialog } from "./application-details-dialog"
import { ExportMenu } from "./export-menu"

export function ApplicationsTable() {
  const [applications, setApplications] = useState<any[]>([])
  const [institutions, setInstitutions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [institutionFilter, setInstitutionFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { toast } = useToast()

  // Fetch applications and institutions
  useEffect(() => {
    async function fetchData() {
      try {
        const [applicationsRes, institutionsRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/institutions"),
        ])

        if (!applicationsRes.ok || !institutionsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [applicationsData, institutionsData] = await Promise.all([applicationsRes.json(), institutionsRes.json()])

        setApplications(applicationsData)
        setInstitutions(institutionsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить данные",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle application status update
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application status")
      }

      // Update local state
      setApplications((prevApplications) => prevApplications.map((app) => (app._id === id ? { ...app, status } : app)))

      if (selectedApplication && selectedApplication._id === id) {
        setSelectedApplication({ ...selectedApplication, status })
      }

      toast({
        title: "Статус обновлен",
        description: `Статус заявки успешно изменен на "${
          status === "approved" ? "Одобрена" : status === "rejected" ? "Отклонена" : "На рассмотрении"
        }"`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
      })
    }
  }

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    const matchesInstitution = institutionFilter === "all" || app.institution._id === institutionFilter

    return matchesSearch && matchesStatus && matchesInstitution
  })

  // Format status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            На рассмотрении
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Одобрена
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Отклонена
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // View application details
  const viewApplicationDetails = (application: any) => {
    setSelectedApplication(application)
    setIsDetailsOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label htmlFor="search" className="text-sm font-medium">
                Поиск
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Поиск по ФИО, email или номеру заявки"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Статус
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">На рассмотрении</SelectItem>
                  <SelectItem value="approved">Одобрена</SelectItem>
                  <SelectItem value="rejected">Отклонена</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64 space-y-1">
              <label htmlFor="institution-filter" className="text-sm font-medium">
                Учреждение
              </label>
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger id="institution-filter">
                  <SelectValue placeholder="Все учреждения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все учреждения</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution._id} value={institution._id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ExportMenu data={filteredApplications} filename="applications" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№ заявки</TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Учреждение</TableHead>
                  <TableHead>Дата подачи</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell className="font-medium">{application.applicationId}</TableCell>
                      <TableCell>{application.applicantName}</TableCell>
                      <TableCell>{application.institution?.name || "Не указано"}</TableCell>
                      <TableCell>{format(new Date(application.createdAt), "d MMMM yyyy", { locale: ru })}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => viewApplicationDetails(application)}
                            title="Просмотреть детали"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600"
                            onClick={() => handleStatusUpdate(application._id, "approved")}
                            disabled={application.status === "approved"}
                            title="Одобрить заявку"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleStatusUpdate(application._id, "rejected")}
                            disabled={application.status === "rejected"}
                            title="Отклонить заявку"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedApplication && (
        <ApplicationDetailsDialog
          application={selectedApplication}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  )
}

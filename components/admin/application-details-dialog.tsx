"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CheckCircle, XCircle, FileText, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ApplicationDetailsDialogProps {
  application: any
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: string) => Promise<void>
}

export function ApplicationDetailsDialog({
  application,
  isOpen,
  onClose,
  onStatusChange,
}: ApplicationDetailsDialogProps) {
  const [notes, setNotes] = useState(application.notes || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Format application status
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

  // Format institution type
  const formatInstitutionType = (type: string) => {
    switch (type) {
      case "kindergarten":
        return "Детский сад"
      case "school":
        return "Школа"
      case "college":
        return "Колледж"
      default:
        return type
    }
  }

  // Update application notes
  const updateNotes = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${application._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to update notes")
      }

      toast({
        title: "Примечания обновлены",
        description: "Примечания к заявке успешно обновлены",
      })
    } catch (error) {
      console.error("Error updating notes:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить примечания",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>Заявка #{application.applicationId}</span>
            {getStatusBadge(application.status)}
          </DialogTitle>
          <DialogDescription>
            Подана {format(new Date(application.createdAt), "d MMMM yyyy", { locale: ru })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Личные данные</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">ФИО</span>
                  <span className="font-medium">{application.applicantName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Дата рождения</span>
                  <span className="font-medium">
                    {format(new Date(application.birthDate), "d MMMM yyyy", { locale: ru })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{application.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Телефон</span>
                  <span className="font-medium">{application.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Учреждение</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Название</span>
                  <span className="font-medium">{application.institution?.name || "Не указано"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Тип</span>
                  <span className="font-medium">
                    {application.institution?.type ? formatInstitutionType(application.institution.type) : "Не указано"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Адрес</span>
                  <span className="font-medium">
                    {application.institution?.address
                      ? `${application.institution.address}, ${application.institution.city}`
                      : "Не указано"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Документы</h3>
              {application.documents && application.documents.length > 0 ? (
                <ul className="space-y-2">
                  {application.documents.map((doc: any, index: number) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-sm">Скачать</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Документы не загружены</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Примечания</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Добавьте примечания к заявке"
                className="min-h-[100px]"
              />
              <Button variant="outline" size="sm" className="mt-2" onClick={updateNotes} disabled={isUpdating}>
                {isUpdating ? "Сохранение..." : "Сохранить примечания"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
              onClick={() => onStatusChange(application._id, "approved")}
              disabled={application.status === "approved"}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Одобрить
            </Button>
            <Button
              variant="outline"
              className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
              onClick={() => onStatusChange(application._id, "rejected")}
              disabled={application.status === "rejected"}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Отклонить
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

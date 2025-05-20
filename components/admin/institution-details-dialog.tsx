"use client"

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
import { Edit } from "lucide-react"

interface InstitutionDetailsDialogProps {
  institution: any
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function InstitutionDetailsDialog({ institution, isOpen, onClose, onEdit }: InstitutionDetailsDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{institution.name}</span>
            <Badge
              variant="outline"
              className={institution.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {institution.isActive ? "Активно" : "Неактивно"}
            </Badge>
          </DialogTitle>
          <DialogDescription>{formatInstitutionType(institution.type)}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Основная информация</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Адрес</span>
                  <span className="font-medium">{institution.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Город</span>
                  <span className="font-medium">{institution.city}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Регион</span>
                  <span className="font-medium">{institution.region}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Вместимость</span>
                  <span className="font-medium">{institution.capacity} мест</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Контактная информация</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Телефон</span>
                  <span className="font-medium">{institution.contactPhone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{institution.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Описание</h3>
          <p className="text-muted-foreground">{institution.description}</p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

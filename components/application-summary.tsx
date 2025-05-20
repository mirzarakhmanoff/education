"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface ApplicationSummaryProps {
  data: {
    applicantName: string
    birthDate: string
    email: string
    phone: string
    institution: string
    documents: {
      name: string
      url: string
      type: string
    }[]
  }
  institutions: any[]
}

export function ApplicationSummary({ data, institutions }: ApplicationSummaryProps) {
  // Find selected institution
  const selectedInstitution = institutions.find((inst) => inst._id === data.institution)

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
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Проверьте данные перед отправкой</h3>

      <Card>
        <CardHeader>
          <CardTitle>Личные данные</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ФИО</dt>
              <dd className="mt-1">{data.applicantName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Дата рождения</dt>
              <dd className="mt-1">
                {data.birthDate ? format(new Date(data.birthDate), "d MMMM yyyy", { locale: ru }) : "Не указана"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="mt-1">{data.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Телефон</dt>
              <dd className="mt-1">{data.phone}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Образовательное учреждение</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedInstitution ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Название</dt>
                <dd className="mt-1">{selectedInstitution.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Тип</dt>
                <dd className="mt-1">{formatInstitutionType(selectedInstitution.type)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Адрес</dt>
                <dd className="mt-1">
                  {selectedInstitution.address}, {selectedInstitution.city}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Контактный email</dt>
                <dd className="mt-1">{selectedInstitution.contactEmail}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground">Учреждение не выбрано</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Документы</CardTitle>
        </CardHeader>
        <CardContent>
          {data.documents && data.documents.length > 0 ? (
            <ul className="space-y-2">
              {data.documents.map((doc, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>{doc.name}</span>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Просмотреть
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Документы не загружены</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

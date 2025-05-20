import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface ApplicationStatusCardProps {
  application: any
}

export function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Заявка #{application.applicationId}</CardTitle>
            <CardDescription>
              Подана {format(new Date(application.createdAt), "d MMMM yyyy", { locale: ru })}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">ФИО</dt>
            <dd className="mt-1">{application.applicantName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Учреждение</dt>
            <dd className="mt-1">{application.institution?.name || "Не указано"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="mt-1">{application.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Телефон</dt>
            <dd className="mt-1">{application.phone}</dd>
          </div>
        </dl>

        {application.notes && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Примечание:</p>
            <p className="text-sm">{application.notes}</p>
          </div>
        )}

        {application.documents && application.documents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Документы:</p>
            <ul className="space-y-1">
              {application.documents.map((doc: any, index: number) => (
                <li key={index} className="text-sm">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

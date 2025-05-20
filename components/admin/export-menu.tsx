"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileDown } from "lucide-react"
import { format } from "date-fns"

interface ExportMenuProps {
  data: any[]
  filename: string
}

export function ExportMenu({ data, filename }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Export to CSV
  const exportToCSV = () => {
    setIsExporting(true)
    try {
      // Get all unique keys from the data
      const allKeys = new Set<string>()
      data.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== "_id" && key !== "__v") {
            allKeys.add(key)
          }
        })
      })

      // Create headers
      const headers = Array.from(allKeys)

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...data.map((item) =>
          headers
            .map((key) => {
              const value = item[key]
              if (value === null || value === undefined) return ""
              if (typeof value === "object") return JSON.stringify(value).replace(/"/g, '""')
              return `"${String(value).replace(/"/g, '""')}"`
            })
            .join(","),
        ),
      ].join("\n")

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Export to Excel (simplified CSV for Excel)
  const exportToExcel = () => {
    setIsExporting(true)
    try {
      // Prepare data for Excel
      const processedData = data.map((item) => {
        const processed: any = {}

        // Process basic fields
        processed["Номер заявки"] = item.applicationId || ""
        processed["ФИО"] = item.applicantName || ""
        processed["Email"] = item.email || ""
        processed["Телефон"] = item.phone || ""
        processed["Дата рождения"] = item.birthDate ? format(new Date(item.birthDate), "dd.MM.yyyy") : ""

        // Process institution
        if (item.institution) {
          processed["Учреждение"] = item.institution.name || ""
          processed["Тип учреждения"] = item.institution.type || ""
        } else {
          processed["Учреждение"] = ""
          processed["Тип учреждения"] = ""
        }

        // Process status
        processed["Статус"] =
          item.status === "pending"
            ? "На рассмотрении"
            : item.status === "approved"
              ? "Одобрена"
              : item.status === "rejected"
                ? "Отклонена"
                : item.status

        processed["Дата подачи"] = item.createdAt ? format(new Date(item.createdAt), "dd.MM.yyyy") : ""
        processed["Примечания"] = item.notes || ""

        return processed
      })

      // Get headers from the first item
      const headers = Object.keys(processedData[0] || {})

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...processedData.map((item) =>
          headers
            .map((key) => {
              const value = item[key]
              if (value === null || value === undefined) return ""
              return `"${String(value).replace(/"/g, '""')}"`
            })
            .join(","),
        ),
      ].join("\n")

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting || data.length === 0}>
          <FileDown className="mr-2 h-4 w-4" />
          {isExporting ? "Экспорт..." : "Экспорт"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>Экспорт в CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>Экспорт в Excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

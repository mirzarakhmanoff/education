"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, Plus, Edit, Trash, Eye } from "lucide-react"
import { InstitutionDialog } from "./institution-dialog"
import { InstitutionDetailsDialog } from "./institution-details-dialog"
import { ConfirmDialog } from "./confirm-dialog"

export function InstitutionsTable() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null)
  const { toast } = useToast()

  // Fetch institutions
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions")

        if (!response.ok) {
          throw new Error("Failed to fetch institutions")
        }

        const data = await response.json()
        setInstitutions(data)
      } catch (error) {
        console.error("Error fetching institutions:", error)
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список учреждений",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstitutions()
  }, [])

  // Handle institution creation/update
  const handleSaveInstitution = async (institutionData: any) => {
    try {
      const isEditing = !!institutionData._id

      const response = await fetch(isEditing ? `/api/institutions/${institutionData._id}` : "/api/institutions", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(institutionData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} institution`)
      }

      const savedInstitution = await response.json()

      if (isEditing) {
        setInstitutions((prev) => prev.map((inst) => (inst._id === savedInstitution._id ? savedInstitution : inst)))
      } else {
        setInstitutions((prev) => [...prev, savedInstitution])
      }

      toast({
        title: isEditing ? "Учреждение обновлено" : "Учреждение создано",
        description: isEditing ? "Учреждение успешно обновлено" : "Новое учреждение успешно создано",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving institution:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось ${institutionData._id ? "обновить" : "создать"} учреждение`,
      })
    }
  }

  // Handle institution deletion
  const handleDeleteInstitution = async () => {
    if (!selectedInstitution) return

    try {
      const response = await fetch(`/api/institutions/${selectedInstitution._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete institution")
      }

      setInstitutions((prev) => prev.filter((inst) => inst._id !== selectedInstitution._id))

      toast({
        title: "Учреждение удалено",
        description: "Учреждение успешно удалено",
      })

      setIsConfirmOpen(false)
    } catch (error) {
      console.error("Error deleting institution:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить учреждение",
      })
    }
  }

  // Filter institutions
  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || inst.type === typeFilter

    return matchesSearch && matchesType
  })

  // Format institution type
  const formatInstitutionType = (type: string) => {
    switch (type) {
      case "kindergarten":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Детский сад
          </Badge>
        )
      case "school":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Школа
          </Badge>
        )
      case "college":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Колледж
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Add new institution
  const addInstitution = () => {
    setSelectedInstitution(null)
    setIsDialogOpen(true)
  }

  // Edit institution
  const editInstitution = (institution: any) => {
    setSelectedInstitution(institution)
    setIsDialogOpen(true)
  }

  // View institution details
  const viewInstitutionDetails = (institution: any) => {
    setSelectedInstitution(institution)
    setIsDetailsOpen(true)
  }

  // Confirm institution deletion
  const confirmDeleteInstitution = (institution: any) => {
    setSelectedInstitution(institution)
    setIsConfirmOpen(true)
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
                  placeholder="Поиск по названию, городу или региону"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-1">
              <label htmlFor="type-filter" className="text-sm font-medium">
                Тип учреждения
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="kindergarten">Детские сады</SelectItem>
                  <SelectItem value="school">Школы</SelectItem>
                  <SelectItem value="college">Колледжи</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addInstitution}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить учреждение
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Город</TableHead>
                  <TableHead>Регион</TableHead>
                  <TableHead>Вместимость</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((institution) => (
                    <TableRow key={institution._id}>
                      <TableCell className="font-medium">{institution.name}</TableCell>
                      <TableCell>{formatInstitutionType(institution.type)}</TableCell>
                      <TableCell>{institution.city}</TableCell>
                      <TableCell>{institution.region}</TableCell>
                      <TableCell>{institution.capacity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => viewInstitutionDetails(institution)}
                            title="Просмотреть детали"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => editInstitution(institution)}
                            title="Редактировать"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600"
                            onClick={() => confirmDeleteInstitution(institution)}
                            title="Удалить"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Учреждения не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Institution Dialog for Add/Edit */}
      <InstitutionDialog
        institution={selectedInstitution}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveInstitution}
      />

      {/* Institution Details Dialog */}
      {selectedInstitution && (
        <InstitutionDetailsDialog
          institution={selectedInstitution}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onEdit={() => {
            setIsDetailsOpen(false)
            setIsDialogOpen(true)
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteInstitution}
        title="Удалить учреждение"
        description={`Вы уверены, что хотите удалить учреждение "${selectedInstitution?.name}"? Это действие нельзя отменить.`}
      />
    </div>
  )
}

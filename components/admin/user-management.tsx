"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, UserPlus, Edit, Trash, Shield } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { UserDialog } from "./user-dialog"
import { ConfirmDialog } from "./confirm-dialog"

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  // Fetch users
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data
      setUsers([
        {
          _id: "1",
          name: "Администратор",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date("2023-01-01"),
        },
        {
          _id: "2",
          name: "Иван Иванов",
          email: "ivan@example.com",
          role: "user",
          createdAt: new Date("2023-02-15"),
        },
        {
          _id: "3",
          name: "Мария Петрова",
          email: "maria@example.com",
          role: "user",
          createdAt: new Date("2023-03-20"),
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Handle user creation/update
  const handleSaveUser = async (userData: any) => {
    try {
      // Simulate API call
      const isEditing = !!userData._id

      // Update local state
      if (isEditing) {
        setUsers((prev) => prev.map((user) => (user._id === userData._id ? userData : user)))
      } else {
        const newUser = {
          ...userData,
          _id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        }
        setUsers((prev) => [...prev, newUser])
      }

      toast({
        title: isEditing ? "Пользователь обновлен" : "Пользователь создан",
        description: isEditing ? "Пользователь успешно обновлен" : "Новый пользователь успешно создан",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось ${userData._id ? "обновить" : "создать"} пользователя`,
      })
    }
  }

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      // Simulate API call

      // Update local state
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id))

      toast({
        title: "Пользователь удален",
        description: "Пользователь успешно удален",
      })

      setIsConfirmOpen(false)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
      })
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Format user role
  const formatUserRole = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Администратор
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Пользователь
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Add new user
  const addUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  // Edit user
  const editUser = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  // Confirm user deletion
  const confirmDeleteUser = (user: any) => {
    setSelectedUser(user)
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
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
          <CardDescription>Добавление, редактирование и удаление пользователей системы</CardDescription>
        </CardHeader>
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
                  placeholder="Поиск по имени или email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={addUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить пользователя
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
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatUserRole(user.role)}</TableCell>
                      <TableCell>{format(new Date(user.createdAt), "d MMMM yyyy", { locale: ru })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => editUser(user)} title="Редактировать">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.role !== "admin" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-purple-600"
                              onClick={() => {
                                const updatedUser = { ...user, role: "admin" }
                                handleSaveUser(updatedUser)
                              }}
                              title="Сделать администратором"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600"
                            onClick={() => confirmDeleteUser(user)}
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      Пользователи не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Dialog for Add/Edit */}
      <UserDialog
        user={selectedUser}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Удалить пользователя"
        description={`Вы уверены, что хотите удалить пользователя "${selectedUser?.name}"? Это действие нельзя отменить.`}
      />
    </div>
  )
}

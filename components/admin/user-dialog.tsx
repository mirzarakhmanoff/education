"use client"

import { useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form schema
const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, {
    message: "Имя должно содержать не менее 3 символов",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  password: z
    .string()
    .min(8, {
      message: "Пароль должен содержать не менее 8 символов",
    })
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin"], {
    required_error: "Выберите роль пользователя",
  }),
})

interface UserDialogProps {
  user: any
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function UserDialog({ user, isOpen, onClose, onSave }: UserDialogProps) {
  const isEditing = !!user

  // Initialize form
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  })

  // Reset form when user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          _id: user._id,
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
        })
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          role: "user",
        })
      }
    }
  }, [user, isOpen, form])

  // Handle form submission
  function onSubmit(values: z.infer<typeof userSchema>) {
    // If editing and password is empty, remove it from the values
    if (isEditing && !values.password) {
      const { password, ...rest } = values
      onSave(rest)
    } else {
      onSave(values)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать пользователя" : "Добавить пользователя"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Измените информацию о пользователе" : "Заполните форму для добавления нового пользователя"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ivan@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditing ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

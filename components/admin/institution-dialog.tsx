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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Form schema
const institutionSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, {
    message: "Название должно содержать не менее 3 символов",
  }),
  type: z.enum(["kindergarten", "school", "college"], {
    required_error: "Выберите тип учреждения",
  }),
  address: z.string().min(5, {
    message: "Адрес должен содержать не менее 5 символов",
  }),
  city: z.string().min(2, {
    message: "Город должен содержать не менее 2 символов",
  }),
  region: z.string().min(2, {
    message: "Регион должен содержать не менее 2 символов",
  }),
  contactPhone: z.string().min(5, {
    message: "Телефон должен содержать не менее 5 символов",
  }),
  contactEmail: z.string().email({
    message: "Введите корректный email",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Вместимость должна быть не менее 1",
  }),
  isActive: z.boolean().default(true),
})

interface InstitutionDialogProps {
  institution: any
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function InstitutionDialog({ institution, isOpen, onClose, onSave }: InstitutionDialogProps) {
  const isEditing = !!institution

  // Initialize form
  const form = useForm<z.infer<typeof institutionSchema>>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      name: "",
      type: "school",
      address: "",
      city: "",
      region: "",
      contactPhone: "",
      contactEmail: "",
      description: "",
      capacity: 100,
      isActive: true,
    },
  })

  // Reset form when institution changes
  useEffect(() => {
    if (isOpen) {
      if (institution) {
        form.reset({
          _id: institution._id,
          name: institution.name,
          type: institution.type,
          address: institution.address,
          city: institution.city,
          region: institution.region,
          contactPhone: institution.contactPhone,
          contactEmail: institution.contactEmail,
          description: institution.description,
          capacity: institution.capacity,
          isActive: institution.isActive,
        })
      } else {
        form.reset({
          name: "",
          type: "school",
          address: "",
          city: "",
          region: "",
          contactPhone: "",
          contactEmail: "",
          description: "",
          capacity: 100,
          isActive: true,
        })
      }
    }
  }, [institution, isOpen, form])

  // Handle form submission
  function onSubmit(values: z.infer<typeof institutionSchema>) {
    onSave(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Редактировать учреждение" : "Добавить учреждение"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Измените информацию об образовательном учреждении"
              : "Заполните форму для добавления нового образовательного учреждения"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Школа №1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип учреждения</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kindergarten">Детский сад</SelectItem>
                        <SelectItem value="school">Школа</SelectItem>
                        <SelectItem value="college">Колледж</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="ул. Примерная, д. 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город</FormLabel>
                    <FormControl>
                      <Input placeholder="Москва" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регион</FormLabel>
                    <FormControl>
                      <Input placeholder="Московская область" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вместимость</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактный телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактный email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@school.ru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Краткое описание образовательного учреждения"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Активно</FormLabel>
                    <p className="text-sm text-muted-foreground">Учреждение доступно для выбора при подаче заявок</p>
                  </div>
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

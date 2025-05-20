"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useClientTranslation } from "@/lib/i18n-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/file-uploader";
import { ApplicationSummary } from "@/components/application-summary";
import { useSession } from "next-auth/react";

// Step 1: Personal Information
const personalInfoSchema = z.object({
  applicantName: z.string().min(3, {
    message: "ФИО должно содержать не менее 3 символов",
  }),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Пожалуйста, введите корректную дату",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
  phone: z.string().min(5, {
    message: "Телефон должен содержать не менее 5 символов",
  }),
});

// Step 2: Institution Selection
const institutionSchema = z.object({
  institution: z.string().min(1, {
    message: "Пожалуйста, выберите учреждение",
  }),
});

// Step 3: Document Upload - matching server schema
const documentsSchema = z.object({
  documents: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      type: z.string(),
    })
  ),
});

// Combined schema for all steps
const applicationSchema = personalInfoSchema
  .merge(institutionSchema)
  .merge(documentsSchema);

export default function ApplyPage() {
  const { t } = useClientTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("personal");
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

  // Initialize form with default values
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantName: "",
      birthDate: "",
      email: session?.user?.email || "",
      phone: "",
      institution: "",
      documents: [],
    },
  });

  // Fetch institutions on component mount
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions");
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список учреждений",
        });
      }
    }

    fetchInstitutions();
  }, [toast]);

  // Handle document upload
  const handleDocumentUpload = (document: any) => {
    // Ensure document has all required fields
    const processedDocument = {
      name: document.name || "Unnamed Document",
      url: document.url || `file://${document.name}`,
      type: document.type || "application/octet-stream",
    };

    const updatedDocuments = [...uploadedDocuments, processedDocument];
    setUploadedDocuments(updatedDocuments);
    form.setValue("documents", updatedDocuments);
  };

  // Handle document removal
  const handleDocumentRemove = (index: number) => {
    const updatedDocuments = uploadedDocuments.filter((_, i) => i !== index);
    setUploadedDocuments(updatedDocuments);
    form.setValue("documents", updatedDocuments);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Validate personal info before moving to institution tab
    if (value === "institution") {
      const personalInfoValid = form.trigger([
        "applicantName",
        "birthDate",
        "email",
        "phone",
      ]);
      if (!personalInfoValid) return;
    }

    // Validate institution before moving to documents tab
    if (value === "documents" && !form.getValues("institution")) {
      const institutionValid = form.trigger(["institution"]);
      if (!institutionValid) return;
    }

    // For review tab, we'll allow proceeding even if documents are empty
    setActiveTab(value);
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    setIsLoading(true);

    try {
      // Ensure documents are properly formatted
      const formattedDocuments = uploadedDocuments.map((doc) => ({
        name: doc.name || "Unnamed Document",
        url: doc.url || `file://${doc.name}`,
        type: doc.type || "application/octet-stream",
      }));

      // Prepare the data for submission
      const dataToSubmit = {
        ...values,
        documents: formattedDocuments,
      };

      console.log("Submitting application:", dataToSubmit);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        throw new Error(data.error || "Ошибка при подаче заявки");
      }

      toast({
        title: "Заявка подана",
        description: `Ваша заявка успешно подана. Номер заявки: ${data.applicationId}`,
      });

      router.push(`/status?applicationId=${data.applicationId}`);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка подачи заявки",
        description: error.message || "Произошла ошибка при подаче заявки",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Подача заявки</h1>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Заполните форму заявки</CardTitle>
          <CardDescription>
            Пожалуйста, заполните все необходимые поля и загрузите требуемые
            документы
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Личные данные</TabsTrigger>
                  <TabsTrigger value="institution">Учреждение</TabsTrigger>
                  <TabsTrigger value="documents">Документы</TabsTrigger>
                  <TabsTrigger value="review">Проверка</TabsTrigger>
                </TabsList>

                {/* Step 1: Personal Information */}
                <TabsContent value="personal" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="applicantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Иванов Иван Иванович"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата рождения</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                          <Input placeholder="example@mail.ru" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input placeholder="+7 (999) 123-45-67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => handleTabChange("institution")}
                    >
                      Далее
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Institution Selection */}
                <TabsContent value="institution" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Образовательное учреждение</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите учреждение" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {institutions.map((institution) => (
                              <SelectItem
                                key={institution._id}
                                value={institution._id}
                              >
                                {institution.name} (
                                {institution.type === "kindergarten"
                                  ? "Детский сад"
                                  : institution.type === "school"
                                  ? "Школа"
                                  : "Колледж"}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTabChange("personal")}
                    >
                      Назад
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleTabChange("documents")}
                    >
                      Далее
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 3: Document Upload */}
                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Загрузите необходимые документы
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Пожалуйста, загрузите сканы или фотографии следующих
                      документов: свидетельство о рождении, паспорт, медицинская
                      справка и т.д.
                    </p>

                    <FileUploader onUpload={handleDocumentUpload} />

                    {uploadedDocuments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Загруженные документы:
                        </h4>
                        <ul className="space-y-2">
                          {uploadedDocuments.map((doc, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded-md"
                            >
                              <span>{doc.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDocumentRemove(index)}
                              >
                                Удалить
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTabChange("institution")}
                    >
                      Назад
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleTabChange("review")}
                    >
                      Далее
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 4: Review and Submit */}
                <TabsContent value="review" className="space-y-4 mt-4">
                  <ApplicationSummary
                    data={{ ...form.getValues(), documents: uploadedDocuments }}
                    institutions={institutions}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleTabChange("documents")}
                    >
                      Назад
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Отправка..." : "Отправить заявку"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

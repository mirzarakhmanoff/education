"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Loader2 } from "lucide-react"

interface FileUploaderProps {
  onUpload: (document: { name: string; url: string; type: string }) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, выберите файл для загрузки",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке файла")
      }

      onUpload({
        name: file.name,
        url: data.fileUrl,
        type: file.type,
      })

      setFile(null)

      toast({
        title: "Файл загружен",
        description: "Файл успешно загружен",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: error.message || "Произошла ошибка при загрузке файла",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} disabled={isUploading} />
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Загрузить
            </>
          )}
        </Button>

        {file && (
          <span className="text-sm text-muted-foreground">
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </span>
        )}
      </div>
    </div>
  )
}

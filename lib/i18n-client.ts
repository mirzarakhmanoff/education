"use client"

import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "./translations"

// Client-side translation hook
export function useClientTranslation() {
  const { language } = useLanguage()

  const t = (key: string) => {
    return getTranslation(key, language)
  }

  return { t, language }
}

import { getTranslation } from "./translations"

// Server-side translation function
export function getServerTranslation(locale = "ru") {
  return {
    t: (key: string) => getTranslation(key, locale),
    language: locale,
  }
}

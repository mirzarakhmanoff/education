import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerTranslation } from "@/lib/i18n-server"
import { LanguageSwitcher } from "@/components/language-switcher"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function Home() {
  const { t } = getServerTranslation()

  return (
    <main className="flex min-h-screen flex-col">
      <header className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
          </svg>
          <span className="font-bold text-xl">{t("app.title")}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/status">
            <Button variant="outline">{t("home.checkStatus")}</Button>
          </Link>
          <Link href="/apply">
            <Button>{t("home.applyNow")}</Button>
          </Link>
        </div>
      </header>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />

      <footer className="bg-muted py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t("app.title")}. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </main>
  )
}

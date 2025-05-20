import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getServerTranslation } from "@/lib/i18n-server"

export function HeroSection() {
  const { t } = getServerTranslation()

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("hero.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("hero.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto">
                {t("hero.applyButton")}
              </Button>
            </Link>
            <Link href="/status">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t("hero.checkStatusButton")}
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/diverse-students-classroom.png"
            alt={t("hero.imageAlt")}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}

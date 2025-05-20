import { getServerTranslation } from "@/lib/i18n-server"
import { FileCheck, Clock, School, CheckCircle, FileText, BarChart } from "lucide-react"

export function FeaturesSection() {
  const { t } = getServerTranslation()

  const features = [
    {
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      title: t("features.online.title"),
      description: t("features.online.description"),
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: t("features.time.title"),
      description: t("features.time.description"),
    },
    {
      icon: <School className="h-10 w-10 text-primary" />,
      title: t("features.choice.title"),
      description: t("features.choice.description"),
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: t("features.status.title"),
      description: t("features.status.description"),
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: t("features.documents.title"),
      description: t("features.documents.description"),
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: t("features.transparent.title"),
      description: t("features.transparent.description"),
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("features.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

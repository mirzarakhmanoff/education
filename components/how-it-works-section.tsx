import { getServerTranslation } from "@/lib/i18n-server"
import { ClipboardList, Upload, CheckSquare, Bell } from "lucide-react"

export function HowItWorksSection() {
  const { t } = getServerTranslation()

  const steps = [
    {
      icon: <ClipboardList className="h-12 w-12 text-primary" />,
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
    },
    {
      icon: <Upload className="h-12 w-12 text-primary" />,
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
    },
    {
      icon: <CheckSquare className="h-12 w-12 text-primary" />,
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
    },
    {
      icon: <Bell className="h-12 w-12 text-primary" />,
      title: t("howItWorks.step4.title"),
      description: t("howItWorks.step4.description"),
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("howItWorks.title")}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 z-0"></div>
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="md:flex items-center gap-8"
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                  <div className="bg-background p-6 rounded-full border shadow-sm">{step.icon}</div>
                </div>
                <div className="md:w-1/2 bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

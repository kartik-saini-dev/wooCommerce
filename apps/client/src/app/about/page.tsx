import { Metadata } from "next"
import { getTranslation } from "@repo/services/i18n/server"
import { siteConfig } from "@repo/ui/config/site"

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${siteConfig.name} and our mission.`,
}

export default async function AboutPage() {
  const { t } = await getTranslation()
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{t("about.title")}</h1>
        
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Welcome to <strong className="text-foreground">{siteConfig.name}</strong>, {t("about.description")}
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">{t("about.missionTitle")}</h2>
          <p>
            {t("about.missionDesc")}
          </p>
          
          <h2 className="text-2xl font-bold text-foreground mt-8">{t("about.whyChooseUsTitle")}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">{t("about.feature1Title")}</strong> {t("about.feature1Desc")}</li>
            <li><strong className="text-foreground">{t("about.feature2Title")}</strong> {t("about.feature2Desc")}</li>
            <li><strong className="text-foreground">{t("about.feature3Title")}</strong> {t("about.feature3Desc")}</li>
            <li><strong className="text-foreground">{t("about.feature4Title")}</strong> {t("about.feature4Desc")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

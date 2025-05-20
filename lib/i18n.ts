"use client"

import { useLanguage } from "@/components/language-provider"

// Translations
const translations = {
  ru: {
    app: {
      title: "ЭдуПортал",
    },
    home: {
      applyNow: "Подать заявку",
      checkStatus: "Проверить статус",
    },
    hero: {
      title: "Подача заявок в образовательные учреждения онлайн",
      description:
        "Простой и удобный способ подать заявку на поступление в детские сады, школы и колледжи без очередей и бумажной волокиты.",
      applyButton: "Подать заявку",
      checkStatusButton: "Проверить статус",
      imageAlt: "Студенты в классе",
    },
    features: {
      title: "Преимущества нашего сервиса",
      subtitle: "Мы делаем процесс подачи заявок максимально простым и удобным",
      online: {
        title: "Онлайн-заявки",
        description: "Подавайте заявки в любое время из любого места",
      },
      time: {
        title: "Экономия времени",
        description: "Больше никаких очередей и бумажной волокиты",
      },
      choice: {
        title: "Широкий выбор",
        description: "Все образовательные учреждения в одном месте",
      },
      status: {
        title: "Отслеживание статуса",
        description: "Узнавайте о статусе вашей заявки в режиме реального времени",
      },
      documents: {
        title: "Загрузка документов",
        description: "Загружайте необходимые документы прямо на сайте",
      },
      transparent: {
        title: "Прозрачность",
        description: "Полная информация о процессе рассмотрения заявки",
      },
    },
    howItWorks: {
      title: "Как это работает",
      subtitle: "Четыре простых шага для подачи заявки",
      step1: {
        title: "Заполните форму",
        description: "Введите личные данные и выберите образовательное учреждение",
      },
      step2: {
        title: "Загрузите документы",
        description: "Прикрепите необходимые документы в электронном виде",
      },
      step3: {
        title: "Отправьте заявку",
        description: "Проверьте данные и отправьте заявку на рассмотрение",
      },
      step4: {
        title: "Получите уведомление",
        description: "Дождитесь уведомления о результате рассмотрения заявки",
      },
    },
    footer: {
      rights: "Все права защищены",
    },
  },
  uz: {
    app: {
      title: "EduPortal",
    },
    home: {
      applyNow: "Ariza topshirish",
      checkStatus: "Holatni tekshirish",
    },
    hero: {
      title: "Ta'lim muassasalariga onlayn ariza topshirish",
      description:
        "Bog'chalar, maktablar va kollejlarga ariza topshirishning oson va qulay usuli, navbatlarsiz va qog'ozbozliksiz.",
      applyButton: "Ariza topshirish",
      checkStatusButton: "Holatni tekshirish",
      imageAlt: "Sinfda o'quvchilar",
    },
    features: {
      title: "Xizmatimizning afzalliklari",
      subtitle: "Biz ariza topshirish jarayonini iloji boricha oson va qulay qilamiz",
      online: {
        title: "Onlayn arizalar",
        description: "Istalgan vaqtda, istalgan joydan ariza topshiring",
      },
      time: {
        title: "Vaqtni tejash",
        description: "Endi navbatlar va qog'ozbozlik yo'q",
      },
      choice: {
        title: "Keng tanlov",
        description: "Barcha ta'lim muassasalari bir joyda",
      },
      status: {
        title: "Holat kuzatuvi",
        description: "Arizangiz holatini real vaqt rejimida bilib oling",
      },
      documents: {
        title: "Hujjatlarni yuklash",
        description: "Kerakli hujjatlarni to'g'ridan-to'g'ri saytga yuklang",
      },
      transparent: {
        title: "Shaffoflik",
        description: "Arizani ko'rib chiqish jarayoni haqida to'liq ma'lumot",
      },
    },
    howItWorks: {
      title: "Bu qanday ishlaydi",
      subtitle: "Ariza topshirish uchun to'rtta oddiy qadam",
      step1: {
        title: "Shaklni to'ldiring",
        description: "Shaxsiy ma'lumotlarni kiriting va ta'lim muassasasini tanlang",
      },
      step2: {
        title: "Hujjatlarni yuklang",
        description: "Kerakli hujjatlarni elektron shaklda biriktiring",
      },
      step3: {
        title: "Arizani yuboring",
        description: "Ma'lumotlarni tekshiring va arizani ko'rib chiqish uchun yuboring",
      },
      step4: {
        title: "Bildirishnoma oling",
        description: "Arizani ko'rib chiqish natijasi haqida bildirishnoma kutib turing",
      },
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan",
    },
  },
}

// Helper function to get translation
function getTranslation(key: string, language: string) {
  const keys = key.split(".")
  let value: any = translations[language as keyof typeof translations]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      return key // Fallback to key if translation not found
    }
  }

  return value || key
}

// Client-side translation hook
export function useClientTranslation() {
  const { language } = useLanguage()

  const t = (key: string) => {
    return getTranslation(key, language)
  }

  return { t, language }
}

// Remove "use client" directive from this export
export function getServerTranslation(locale = "ru") {
  return {
    t: (key: string) => getTranslation(key, locale),
    language: locale,
  }
}

import type { Language } from './i18n'

// Import JSON files
import homeEn from '@/messages/home/en.json'
import homeDe from '@/messages/home/de.json'
import aboutEn from '@/messages/about/en.json'
import aboutDe from '@/messages/about/de.json'
import ourTeamEn from '@/messages/our-team/en.json'
import ourTeamDe from '@/messages/our-team/de.json'
import galleryEn from '@/messages/gallery/en.json'
import galleryDe from '@/messages/gallery/de.json'
import trainingEn from '@/messages/training/en.json'
import trainingDe from '@/messages/training/de.json'
import faqEn from '@/messages/faq/en.json'
import faqDe from '@/messages/faq/de.json'
import contactEn from '@/messages/contact/en.json'
import contactDe from '@/messages/contact/de.json'
import navbarEn from '@/messages/navbar/en.json'
import navbarDe from '@/messages/navbar/de.json'
import footerEn from '@/messages/footer/en.json'
import footerDe from '@/messages/footer/de.json'

type Messages = {
  home: typeof homeEn
  about: typeof aboutEn
  ourTeam: typeof ourTeamEn
  gallery: typeof galleryEn
  training: typeof trainingEn
  faq: typeof faqEn
  contact: typeof contactEn
  navbar: typeof navbarEn
  footer: typeof footerEn
}

const messages: Record<Language, Messages> = {
  en: {
    home: homeEn,
    about: aboutEn,
    ourTeam: ourTeamEn,
    gallery: galleryEn,
    training: trainingEn,
    faq: faqEn,
    contact: contactEn,
    navbar: navbarEn,
    footer: footerEn,
  },
  de: {
    home: homeDe,
    about: aboutDe,
    ourTeam: ourTeamDe,
    gallery: galleryDe,
    training: trainingDe,
    faq: faqDe,
    contact: contactDe,
    navbar: navbarDe,
    footer: footerDe,
  },
}

export function getMessages(lang: Language, namespace: keyof Messages) {
  return messages[lang][namespace]
}

export function getTranslation(
  lang: Language,
  namespace: keyof Messages,
  key: string
): string {
  const namespaceMessages = messages[lang][namespace]
  const keys = key.split('.')
  let value: any = namespaceMessages

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English
      const fallbackMessages = messages.en[namespace]
      let fallbackValue: any = fallbackMessages
      for (const k2 of keys) {
        fallbackValue = fallbackValue?.[k2]
      }
      return typeof fallbackValue === 'string' ? fallbackValue : key
    }
  }

  return typeof value === 'string' ? value : key
}

export { messages }

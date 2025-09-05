"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { languages, defaultLanguage, type LanguageCode } from "@/lib/i18n"
import { translations, type TranslationKey } from "@/lib/translations"

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(defaultLanguage)

  // RTL languages (none in our current set, but prepared for future)
  const rtlLanguages: LanguageCode[] = []
  const isRTL = rtlLanguages.includes(currentLanguage)

  useEffect(() => {
    // Load saved language from localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("preferred-language") as LanguageCode
      if (savedLanguage && languages.find((lang) => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage)
      }
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("preferred-language", lang)
      
      // Update document direction and lang attribute
      document.documentElement.lang = lang
      document.documentElement.dir = rtlLanguages.includes(lang) ? "rtl" : "ltr"
    }
  }

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage]?.[key] || translations[defaultLanguage][key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

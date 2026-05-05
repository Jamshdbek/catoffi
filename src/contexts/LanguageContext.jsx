import { createContext, useContext, useState } from 'react'
import { getLang, setLang as saveLang, translate, LANGUAGES } from '../services/i18nService'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getLang)

  const setLang = (code) => {
    saveLang(code)
    setLangState(code)
  }

  const t = (key, vars) => translate(lang, key, vars)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import te from '../i18n/te.json'
import hi from '../i18n/hi.json'
import en from '../i18n/en.json'

const dictionaries = { te, hi, en }

const SUPPORTED_LANGUAGES = [
  { code: 'te', label: 'తెలుగు', nativeName: 'Telugu', flag: '🌾' },
  { code: 'hi', label: 'हिंदी',  nativeName: 'Hindi',   flag: '🌾' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🌾' },
]

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agrisathi_lang') || 'te'
  })

  // Persist language choice
  useEffect(() => {
    localStorage.setItem('agrisathi_lang', lang)
    // Set html lang attribute for accessibility
    document.documentElement.lang = lang
  }, [lang])

  /**
   * Translate a key. Falls back: current lang → English → key itself.
   * Supports simple interpolation: t('hello_name', { name: 'Raju' })
   * If key contains {{name}} pattern it will be replaced.
   */
  const t = useCallback((key, vars = {}) => {
    const dict = dictionaries[lang] || dictionaries['en']
    let value = dict[key] ?? dictionaries['en'][key] ?? key
    // Simple mustache-style interpolation
    Object.entries(vars).forEach(([k, v]) => {
      value = value.replace(new RegExp(`{{${k}}}`, 'g'), v)
    })
    return value
  }, [lang])

  /**
   * Get a trilingual field from an object, e.g. crop.nameTe / crop.nameEn
   * field: base field name (e.g. 'name', 'desc')
   * obj: object with fields like nameTe, nameHi, nameEn
   */
  const tf = useCallback((obj, field) => {
    if (!obj) return ''
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1) // 'Te', 'Hi', 'En'
    return obj[`${field}${suffix}`] || obj[`${field}En`] || ''
  }, [lang])

  const changeLanguage = useCallback((code) => {
    if (dictionaries[code]) setLang(code)
  }, [])

  const value = {
    lang,
    t,
    tf,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguage: SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

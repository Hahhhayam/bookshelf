import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { uk } from './uk'

void i18n.use(initReactI18next).init({
  resources: { uk: { translation: uk }, en: { translation: en } },
  lng: 'uk',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

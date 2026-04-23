import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos de traducción
const resources = {
  es: {
    translation: {
      catalog: {
        title: "Catálogo de Cartas",
        description: "Explora la colección completa de cartas de TCG Nexus. Criaturas, hechizos y artefactos te esperan para tu mazo.",
        noCards: "No hay cartas disponibles en este momento.",
        loading: "Invocando criaturas del Nexo...",
        error: "No se pudo cargar el catálogo de cartas. Por favor, reintenta más tarde.",
        retry: "Reintentar"
      }
    }
  },
  en: {
    translation: {
      catalog: {
        title: "Card Catalog",
        description: "Explore the complete collection of TCG Nexus cards. Creatures, spells, and artifacts await your deck.",
        noCards: "No cards available at this moment.",
        loading: "Summoning creatures from the Nexus...",
        error: "Could not load the card catalog. Please try again later.",
        retry: "Retry"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta idioma del navegador y localStorage
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    detection: {
      order: ['localStorage', 'navigator'], // Prioridad: localStorage primero
      caches: ['localStorage'], // Guarda en localStorage
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
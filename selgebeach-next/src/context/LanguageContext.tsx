'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { tr, Translations } from '../locales/tr';
import { en } from '../locales/en';
import { de } from '../locales/de';
import { ru } from '../locales/ru';
import { fr } from '../locales/fr';

export type Language = 'tr' | 'en' | 'de' | 'ru' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    // Check local storage for saved lang on load
    const savedLang = localStorage.getItem('selge_lang') as Language;
    if (savedLang && (['tr', 'en', 'de', 'ru', 'fr'].includes(savedLang))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selge_lang', lang);
  };

  const t = (key: keyof Translations): string => {
    const dictionaries: Record<Language, Translations> = { tr, en, de, ru, fr };
    const dictionary = dictionaries[language] || tr;
    return dictionary[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

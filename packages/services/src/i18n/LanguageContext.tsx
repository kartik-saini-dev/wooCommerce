"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import en from "./dictionaries/en.json";
import hi from "./dictionaries/hi.json";
import pa from "./dictionaries/pa.json";

type Dictionary = Record<string, string>;
type Locale = "en" | "hi" | "pa";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  hi,
  pa,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode, initialLocale: Locale }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("app-locale", newLocale);
    document.cookie = `app-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;
    
    // Trigger a soft refresh so server components re-fetch and render with the new language
    router.refresh();
  };

  const t = (key: string) => {
    const translation = dictionaries[locale][key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      return dictionaries["en"][key] || key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return a fallback if not inside a provider
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: string) => {
        return (en as Dictionary)[key] || key;
      },
    };
  }
  return context;
}

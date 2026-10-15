import { cookies } from "next/headers";
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

export async function getTranslation() {
  const cookieStore = await cookies();
  const localeVal = cookieStore.get("app-locale")?.value as Locale | undefined;
  const locale: Locale = localeVal && dictionaries[localeVal] ? localeVal : "en";

  const t = (key: string) => {
    const translation = dictionaries[locale][key];
    if (!translation) {
      console.warn(`[Server] Missing translation for key: ${key} in locale: ${locale}`);
      return dictionaries["en"][key] || key;
    }
    return translation;
  };

  return { t, locale };
}

import en from "./en.json";
import zh from "./zh.json";
import my from "./my.json";
import th from "./th.json";
import type { Lang, Translation } from "./types";

export const LANGS: Record<Lang, Translation> = {
  en,
  zh,
  my,
  th,
};

export const DEFAULT_LANG: Lang = "en";

export function isLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "zh" || value === "my" || value === "th";
}

export function getTranslation(lang: string | null | undefined): Translation {
  return LANGS[isLang(lang) ? lang : DEFAULT_LANG];
}

export type { Lang, Translation };

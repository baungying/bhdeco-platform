"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, getTranslation, isLang } from "./index";
import type { Lang, Translation } from "./types";

export function useTranslations(): {
  lang: Lang;
  t: Translation;
  setLang: (lang: Lang) => void;
} {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bh_lang");
      if (isLang(stored)) setLangState(stored);
    } catch {}

    const onLang = (event: Event) => {
      const next = (event as CustomEvent).detail;
      if (isLang(next)) setLangState(next);
    };

    window.addEventListener("bh_lang", onLang);
    return () => window.removeEventListener("bh_lang", onLang);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("bh_lang", next);
    } catch {}
    window.dispatchEvent(new CustomEvent("bh_lang", { detail: next }));
  };

  return {
    lang,
    t: getTranslation(lang),
    setLang,
  };
}

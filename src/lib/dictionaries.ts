import "server-only";
import { cache } from "react";
import { Locale } from "@/types/locale";
import { translateObject } from "@/lib/locale";

const site = {
  ar: () => import("@/dictionaries/ar.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = cache(async (locale: Locale) => {
  // if (locale === "ar" || locale === "en") return await site[locale]();

  const dic = await site["en"]();
  return (await translateObject(dic as any, locale)) as unknown as typeof dic;
});

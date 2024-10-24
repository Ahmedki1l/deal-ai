import { translateObject } from "@/lib/locale";
import { Locale } from "@/types/locale";
import { cache } from "react";
import "server-only";

const site = {
  ar: () => import("@/dictionaries/ar").then((module) => module.default),
  en: () => import("@/dictionaries/en").then((module) => module.default),
};

export const getDictionary = cache(async (locale: Locale) => {
  if (locale === "ar" || locale === "en") return await site[locale]();

  const dic = await site["ar"]();
  return (await translateObject({
    value: dic as any,
    from: "en",
    to: locale,
  })) as unknown as typeof dic;
});

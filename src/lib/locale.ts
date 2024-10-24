import { Locale } from "@/types/locale";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";
import tl from "translate";

export const i18n = {
  defaultLocale: "ar",
  locales: [
    "en",
    "ar",
    // "fr", "de"
  ],
} as const;

// Get the preferred locale, similar to the above or using a library
export function getLocale(req: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, i18n.locales, i18n.defaultLocale);
  return locale as Locale;
}

export async function t(value: string, opts?: { from: Locale; to: Locale }) {
  return tl(value, opts);
}

// -------------- logic for here
type DictionaryValue = string | boolean | DictionaryObject;
type DictionaryObject = {
  [key: string]: DictionaryValue | DictionaryValue[];
};

export async function translateObject({
  value,
  from,
  to,
}: {
  value: DictionaryValue | DictionaryValue[];
  from: Locale;
  to: Locale;
}): Promise<DictionaryValue | DictionaryValue[]> {
  if (typeof value === "boolean") return value; // skip
  if (typeof value === "string") return t(value, { from, to });

  //  arrays of dictionaries
  if (Array.isArray(value)) {
    const translatedArray: DictionaryValue[] = [];
    for (const item of value)
      translatedArray.push(
        (await translateObject({ value: item, from, to })) as any
      );

    return translatedArray;
  }

  //  objects of dictionaries
  const translatedObject: DictionaryObject = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      // keys to skip
      if (
        [
          "value",
          "icon",
          "segment",
          "href",
          "indicator",
          ...i18n?.["locales"],
        ].includes(key)
      ) {
        translatedObject[key] = value[key];
        continue;
      }

      translatedObject[key] = await translateObject({
        value: value[key],
        from,
        to,
      });
    }
  }
  return translatedObject;
}

const site = {
  ar: () => import("@/dictionaries/ar").then((module) => module.default),
  en: () => import("@/dictionaries/en").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (locale === "ar" || locale === "en") return await site[locale]();

  const dic = await site["en"]();
  return (await translateObject({
    value: dic as any,
    from: "en",
    to: locale,
  })) as unknown as typeof dic;
};

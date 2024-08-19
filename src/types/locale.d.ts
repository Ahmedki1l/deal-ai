import { i18n } from "@/lib/locale";
import dictionary from "@/dictionaries/en";

export type Locale = (typeof i18n)["locales"][number];
export type LocaleProps = { lang: Locale };
export type Dictionary = {
  [K in keyof typeof dictionary]: {
    dic: {
      [L in K]: (typeof dictionary)[K];
    };
  };
};

export type DictionaryValue = string | boolean | DictionaryObject;
export type DictionaryObject = {
  [key: string]: DictionaryValue | DictionaryValue[];
};

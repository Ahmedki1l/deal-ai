"use server";

import { Locale } from "@/types/locale";
import { cookies, headers } from "next/headers";

export async function getCookie(key: string) {
  return cookies().get(key);
}
export async function setCookie(key: string, val: string) {
  cookies().set(key, val);
}

export async function getHeader(key: string) {
  return headers().get(key) || "";
}

export async function getLocale() {
  const refererUrl = await getHeader("referer");
  let locale = "ar"; // default locale

  if (refererUrl) {
    const url = new URL(refererUrl);
    const pathname = url.pathname;

    const match = pathname.match(/^\/([a-zA-Z-]{2,5})\//);
    if (match) {
      locale = match[1];
    }
  }

  return locale as Locale;
}

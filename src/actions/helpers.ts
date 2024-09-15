"use server";

import { i18n } from "@/lib/locale";
import { Locale } from "@/types/locale";
import { hash as Hash, verify as Verify } from "@node-rs/argon2";
import { cookies, headers } from "next/headers";

export async function getCookie<T>(key: string) {
  const val = cookies().get(key)?.["value"];
  return val ? (JSON.parse(val) as T) : null;
}

export async function setCookie(key: string, val: any) {
  cookies().set(key, JSON.stringify(val));
}
export async function deleteCookie(key: string) {
  cookies().delete(key);
}

export async function getHeader(key: string) {
  return headers().get(key) ?? null;
}

export async function getLocale() {
  const refererUrl = await getHeader("referer");
  let locale: Locale = i18n?.["defaultLocale"];

  if (refererUrl) {
    const url = new URL(refererUrl);
    const pathname = url.pathname;

    const match = pathname.match(/^\/([a-zA-Z-]{2,5})\//);
    if (match) locale = match[1] as Locale;
  }

  return locale;
}

export async function hash(str: string) {
  return Hash(str, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verify(hashed: string, notHashed: string) {
  return Verify(hashed, notHashed, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

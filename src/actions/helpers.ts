"use server";

import { cookies, headers } from "next/headers";

export async function getCookie(key: string) {
  return cookies().get(key);
}
export async function setCookie(key: string, val: string) {
  cookies().set(key, val);
}

export async function getHeader(key: string) {
  const header = headers();
  return header.get(key) || "";
}

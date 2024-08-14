import type { NextRequest } from "next/server";
import { i18n, getLocale } from "@/lib/locale";

export default async function middleware(req: NextRequest) {
  // -------------------- localization
  // Check if there is any supported locale in the pathname
  const { pathname } = req.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return Response.redirect(req.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// import type { NextRequest } from "next/server";
// import { i18n, getLocale } from "@/lib/locale";
// import { Locale } from "./types/locale";

// export default async function middleware(req: NextRequest) {
//   // -------------------- localization
//   // Check if there is any supported locale in the pathname
//   const { pathname } = req.nextUrl;
//   // const pathnameHasLocale = i18n.locales.some(
//   //   (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
//   // );
//   const locale: Locale | undefined = i18n.locales.find(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
//   );

//   // // Set a custom header before redirecting
//   const res = Response.redirect(req.nextUrl);
//   const lang = locale ?? (getLocale(req) as Locale)!;
// console.log(lang, loc)
//   // if (!locale) req.nextUrl.pathname = `/${lang}${pathname}`;

//   // // e.g. incoming request is /products
//   // // The new URL is now /en-US/products
//   // const newRes = new Response(null, {
//   //   status: res.status,
//   //   headers: {
//   //     ...Object.fromEntries(res.headers),
//   //     lang,
//   //   },
//   // });

//   // return newRes;

//   return res;
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

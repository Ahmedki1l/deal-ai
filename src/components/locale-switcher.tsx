"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { i18n } from "@/lib/locale";
import { Dictionary, Locale } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";

export type LocaleSwitcherProps = {} & Dictionary["locale-switcher"];

export function LocaleSwitcher({
  dic: { "locale-switcher": c },
}: LocaleSwitcherProps) {
  const lang = useLocale();
  const pathname = usePathname();

  function redirectedPathname(pathname: string, locale: Locale) {
    if (!pathname) return i18n.defaultLocale;
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="sm" className="underline gap-1">
          <Icons.globe /> <span>{c?.[lang]}</span>
          <span className="sr-only">
            {c?.["current locale of the website"]!}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {i18n.locales.map((locale, i) => (
          <Link key={i} href={redirectedPathname(pathname, locale)}>
            <DropdownMenuItem className="cursor-pointer">
              {c?.[locale]}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

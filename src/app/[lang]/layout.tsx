import { SessionProvider } from "@/components/session-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { i18n } from "@/lib/locale";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import localFont from "next/font/local";

const montserrat = localFont({
  src: "../../../public/fonts/montserrat.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});
const poppins = localFont({
  src: "../../../public/fonts/poppins.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});
const cairo = localFont({
  src: "../../../public/fonts/cairo.ttf",
  variable: "--font-cairo",
  weight: "100 900",
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: LocaleProps;
}>;

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
export async function generateMetadata({
  params: { lang },
}: Readonly<{
  params: LocaleProps;
}>): Promise<Metadata> {
  const { site: c } = await getDictionary(lang);

  return {
    title: { template: `%s | ${c?.["name"]}`, default: `${c?.["name"]}` },
    description: c?.["description"],
  };
}
export default async function RootLayout({
  children,
  params: { lang },
}: RootLayoutProps) {
  const session = await getAuth();
  const dic = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={cn(
        // "leading-relaxed tracking-tight",
        cairo?.["className"],
        montserrat?.["variable"],
        poppins?.["variable"]
      )}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        // className="h-screen overflow-hidden"
      >
        <SessionProvider value={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider delayDuration={0} disableHoverableContent={true}>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <div
                vaul-drawer-wrapper=""
                className="flex min-h-screen flex-col bg-background"
              >
                {children}
              </div>

              <Toaster />
              <TailwindIndicator />
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";

import "@/styles/globals.css";
import "@/styles/syncfusion.css";

import { getAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/session-provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { i18n } from "@/lib/locale";
import { LocaleProps } from "@/types/locale";

const cairo = Cairo({ subsets: ["arabic"] });
const inter = Inter({ subsets: ["latin"] });

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: LocaleProps;
}>;

export const metadata: Metadata = {
  title: { template: " %s | Deal 360° AI", default: "Deal 360° AI" },
  description: "an AI system app",
};
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: RootLayoutProps) {
  const session = await getAuth();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={cn(
        "leading-relaxed tracking-tight",
        lang === "ar" ? cairo?.["className"] : inter?.["className"],
      )}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <SessionProvider value={session}>
          <TooltipProvider delayDuration={0} disableHoverableContent={true}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <div
              vaul-drawer-wrapper=""
              className="flex h-screen flex-col overflow-hidden bg-background"
            >
              {children}
            </div>

            <Toaster />
            <TailwindIndicator />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

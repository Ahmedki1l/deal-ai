import { getAuth } from "@/lib/auth";
import { i18n } from "@/lib/locale";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type HomeProps = Readonly<{
  params: LocaleProps;
}>;

export const metadata: Metadata = { title: "Home" };

export default async function Home({ params: { lang } }: HomeProps) {
  const { user } = await getAuth();
  if (user) redirect(`/${i18n?.["defaultLocale"]}/dashboard`);
  else redirect(`/${i18n?.["defaultLocale"]}/login`);

  return <div className="container flex-1 py-6">Home </div>;
}

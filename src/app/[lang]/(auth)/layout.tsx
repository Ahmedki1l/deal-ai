import { getAuth } from "@/lib/auth";
import { i18n } from "@/lib/locale";
import { LocaleProps } from "@/types/locale";
import { redirect } from "next/navigation";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
  params: LocaleProps;
}>;

export default async function AuthLayout({
  children,
  params: { lang },
}: AuthLayoutProps) {
  const { user } = await getAuth();
  if (user) redirect(`/${i18n?.["defaultLocale"]}/dashboard`);

  return <div className="flex min-h-screen flex-col">{children}</div>;
}

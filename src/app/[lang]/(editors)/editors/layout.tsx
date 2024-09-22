import { getAuth } from "@/lib/auth";
import { LocaleProps } from "@/types/locale";
import { redirect } from "next/navigation";

type EditorsLayoutProps = Readonly<{
  children: React.ReactNode;
  params: LocaleProps;
}>;

export default async function EditorsLayout({
  children,
  params: { lang },
}: EditorsLayoutProps) {
  const { user } = await getAuth();
  if (!user) redirect(`/${lang}/login`);

  return <div className="flex min-h-screen flex-col">{children}</div>;
}

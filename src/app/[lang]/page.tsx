import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";

type HomeProps = Readonly<{
  params: LocaleProps;
}>;

export const metadata: Metadata = { title: "Home" };
export default async function Home({ params: { lang } }: HomeProps) {
  return <div className="container flex-1 py-6">Home </div>;
}

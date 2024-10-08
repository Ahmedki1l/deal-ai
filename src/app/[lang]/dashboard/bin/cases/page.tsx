import { BinCasesTable } from "@/components/bin-cases-table";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";

type BinCasesProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin Cases" };
export default async function BinCases({ params: { lang } }: BinCasesProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["bin"]?.["cases"];
  const cases = await db.studyCase.findMany({
    where: {
      deletedAt: { not: null },
    },
  });

  return <BinCasesTable dic={dic} data={cases} />;
}

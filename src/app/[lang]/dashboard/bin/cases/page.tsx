import { BinCasesTable } from "@/components/bin-cases-table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import React from "react";

type BinCasesProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin Cases" };
export default async function BinCases({ params: { lang } }: BinCasesProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["bin"]?.["cases"];
  const cases = await db.caseStudy.findMany({
    where: {
      deletedAt: { not: null },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["study cases"]}</h3>
        <p className="text-sm text-muted-foreground">
          {c?.["this is how others will see you on the site."]}
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        <BinCasesTable dic={dic} data={cases} />
      </div>
    </div>
  );
}

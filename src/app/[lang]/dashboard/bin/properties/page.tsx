import { BinPropertiesTable } from "@/components/bin-properties-table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import React from "react";

type BinPropertiesProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin Properties" };
export default async function BinProperties({
  params: { lang },
}: BinPropertiesProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["bin"]?.["properties"];
  const properties = await db.property.findMany({
    where: {
      deletedAt: { not: null },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["properties"]}</h3>
        <p className="text-sm text-muted-foreground">
          {c?.["this is how others will see you on the site."]}
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        <BinPropertiesTable dic={dic} data={properties} />
      </div>
    </div>
  );
}

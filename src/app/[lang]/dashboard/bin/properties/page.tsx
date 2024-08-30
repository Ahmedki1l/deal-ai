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

  return <BinPropertiesTable dic={dic} data={properties} />;
}

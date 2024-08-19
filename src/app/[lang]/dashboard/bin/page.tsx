import { BinProjectsTable } from "@/components/bin-projects-table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import React from "react";

type BinProjectsProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin Projects" };
export default async function BinProjects({
  params: { lang },
}: BinProjectsProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["bin"];
  const projects = await db.project.findMany({
    where: {
      deletedAt: { not: null },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["projects"]}</h3>
      </div>
      <Separator />

      <div className="space-y-10">
        <BinProjectsTable dic={dic} data={projects} />
      </div>
    </div>
  );
}

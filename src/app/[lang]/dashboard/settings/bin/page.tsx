import { BinProjectsTable } from "@/components/bin-projects";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import React from "react";

type BinProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin" };
export default async function Bin({ params: { lang } }: BinProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["settings"]?.["bin"];
  const projects = await db.project.findMany({
    where: {
      NOT: {
        deletedAt: null,
      },
    },
  });
  console.log(projects);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["bin"]}</h3>
        <p className="text-sm text-muted-foreground">
          {c?.["this is how others will see you on the site."]}
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        {projects?.["length"] ? (
          <BinProjectsTable dic={dic} data={projects} />
        ) : null}
      </div>
    </div>
  );
}

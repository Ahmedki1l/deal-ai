import { BinProjectsTable } from "@/components/bin-projects-table";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";

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

  return <BinProjectsTable dic={dic} data={projects} />;
}

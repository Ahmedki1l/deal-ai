import type { Metadata } from "next";
import { CardTitle } from "@/components/ui/card";
import { getAuth } from "@/lib/auth";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { ProjectCreateButton } from "@/components/project-create-button";
import { Button } from "@/components/ui/button";
import { Table } from "./projects/table";
import { Image } from "@/components/image";
import dailyProgress from "../../../../public/images/DailyProgress.png";
import charts from "../../../../public/images/Charts.png";
import shutterstock from "../../../../public/images/shutterstock_502875937.png";

type DashboardProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Dashboard" };
export default async function Dashboard({ params: { lang } }: DashboardProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["dashboard"];
  const user = (await getAuth())?.["user"]!;
  const projects = await db.project.findMany({
    include: { caseStudy: { include: { posts: true } }, properties: true },
    where: {
      userId: user?.["id"],
    },
  });

  return (
    <div className="container flex-1 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {c?.["dashboard"]}
          </h2>
          <p className="text-muted-foreground">
            {c?.["take a glance and manage your projects."]}
          </p>
        </div>
        <div>
          <ProjectCreateButton dic={dic} user={user}>
            <Button>{c?.["create project"]}</Button>
          </ProjectCreateButton>
        </div>
      </div>

      <div className="mx-auto mt-10 flex flex-col gap-10">
        <section>
          <div className="flex justify-around gap-4 [&>div]:w-fit [&>div]:rounded-lg [&>div]:bg-white">
            <Image src={dailyProgress?.["src"]} alt="" />
            <Image src={charts?.["src"]} alt="" />
            <Image src={shutterstock?.["src"]} alt="" />
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <CardTitle>{c?.["latest projects"]}</CardTitle>
          <Table dic={dic} data={projects} />
        </div>
      </div>
    </div>
  );
}

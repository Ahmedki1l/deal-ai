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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";
import { DashboardPostsBarChart } from "@/components/dashboard-posts-bar-char";

type DashboardProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Dashboard" };
export default async function Dashboard({ params: { lang } }: DashboardProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["dashboard"];
  const user = (await getAuth())?.["user"]!;
  const projects = await db.project.findMany({
    include: {
      caseStudy: { include: { posts: true } },
      properties: true,
      platforms: true,
    },
    where: {
      userId: user?.["id"],
      deletedAt: null,
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
        <DashboardPostsBarChart dic={dic} />
        {/* <div className="grid grid-cols-2 gap-4">
          <DashboardPostsBarChart />
          <Image
            src={charts?.["src"]}
            alt=""
            className="aspect-video rounded border"
          />
          <Image
            src={shutterstock?.["src"]}
            alt=""
            className="aspect-video rounded border"
          />
        </div> */}

        <div className="flex flex-col gap-4">
          <CardTitle>{c?.["latest projects"]}</CardTitle>
          <Table dic={dic} data={projects} />
        </div>
      </div>
    </div>
  );
}

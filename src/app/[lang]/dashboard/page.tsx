import type { Metadata } from "next";
import { CardTitle } from "@/components/ui/card";
import { getAuth } from "@/lib/auth";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { ProjectCreateButton } from "@/components/project-create-button";
import { Button } from "@/components/ui/button";
import { Table } from "./projects/table";
import { DashboardPostsBarChart } from "@/components/dashboard-posts-bar-char";
import { DashboardLayout } from "@/components/dashboard-layout";

type DashboardProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Dashboard" };
export default async function Dashboard({ params: { lang } }: DashboardProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["dashboard"];
  const user = (await getAuth())?.["user"]!;
  const projects = await db.project.findMany({
    include: {
      caseStudy: { include: { posts: { include: { image: true } } } },
      properties: true,
      platforms: true,
    },
    where: {
      userId: user?.["id"],
      deletedAt: null,
    },
  });
  const posts = projects
    ?.map((p) =>
      p?.["caseStudy"]
        .map((c) =>
          c?.["posts"].map((post) => ({
            ...post,
            project: p,
          })),
        )
        .flat(),
    )
    ?.flat();

  return (
    <DashboardLayout>
      <DashboardLayout.Header>
        <div>
          <DashboardLayout.Title>{c?.["dashboard"]}</DashboardLayout.Title>
          <DashboardLayout.Description>
            {c?.["take a glance and manage your projects."]}
          </DashboardLayout.Description>
        </div>

        <div>
          <ProjectCreateButton dic={dic} user={user}>
            <Button>{c?.["create project"]}</Button>
          </ProjectCreateButton>
        </div>
      </DashboardLayout.Header>

      <div className="mt-10">
        <DashboardPostsBarChart dic={dic} posts={posts} />
      </div>
    </DashboardLayout>
  );
}

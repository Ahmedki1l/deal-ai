import type { Metadata } from "next";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ProjectCreateButton } from "@/components/project-create-button";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { Table } from "./table";

type ProjectsProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Projects" };
export default async function Projects({ params: { lang } }: ProjectsProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["projects"];
  const user = (await getAuth())?.["user"]!;
  const projects = await db.project.findMany({
    include: { caseStudy: { include: { posts: true } }, properties: true },
    where: {
      userId: user?.["id"],
    },
  });

  console.log(projects);
  if (!projects?.["length"])
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>Oops, No Projects.</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            you have not created you project yet. start working with us.
          </EmptyPlaceholder.Description>

          <ProjectCreateButton dic={dic} user={user}>
            <Button>{c?.["create project"]}</Button>
          </ProjectCreateButton>
        </EmptyPlaceholder>
      </div>
    );

  return (
    <div className="container flex-1 py-6">
      <div className="flex flex-col gap-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {c?.["projects"]}
            </h2>
            <p className="text-muted-foreground">
              {c?.["create and manage projects."]}
            </p>
          </div>
          <div>
            <ProjectCreateButton dic={dic} user={user}>
              <Button>{c?.["create project"]}</Button>
            </ProjectCreateButton>
          </div>
        </div>
        <Table dic={dic} data={projects} />
      </div>
    </div>
  );
}

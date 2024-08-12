import { Metadata } from "next";
import { db } from "@/db";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { BackButton } from "@/components/back-button";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { CaseStudyCreateButton } from "@/components/case-study-create-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PropertyCreateButton } from "@/components/property-create-button";
import { LocaleProps } from "@/types/locale";
import { getDictionary } from "@/lib/dictionaries";
import { CaseStudyTable } from "./case-study-table";
import { PropertyTable } from "./properties-table";

type ProjectProps = Readonly<{
  params: { "project-id": string } & LocaleProps;
}>;

export const metadata: Metadata = { title: "Project" };
export default async function Project({
  params: { lang, "project-id": projectId },
}: ProjectProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["projects"]?.["project"];
  const project = await db.project.findFirst({
    include: {
      caseStudy: { include: { posts: true } },
      properties: true,
    },
    where: {
      id: projectId,
    },
  });

  if (!project)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            Oops, No Such Project.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            you have not created you project yet. start working with us.
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  return (
    <div className="container flex-1 py-6">
      <div className="flex flex-col gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/projects`}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{project?.["title"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {project?.["title"]}
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <div className="flex flex-col gap-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {c?.["case studies"]}
                </h2>
                <p className="text-muted-foreground">
                  {c?.["here's a list of your case studies."]}
                </p>
              </div>
              <div>
                <CaseStudyCreateButton dic={dic} project={project}>
                  <Button>{c?.["create case study"]}</Button>
                </CaseStudyCreateButton>
              </div>
            </div>
          </div>

          <CaseStudyTable dic={dic} data={project?.["caseStudy"]} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {c?.["properties"]?.["properties"]}
              </h2>
              <p className="text-muted-foreground">
                {c?.["here's a list of your properties."]}
              </p>
            </div>
            <div>
              <PropertyCreateButton dic={dic} project={project}>
                <Button> {c?.["create properties"]}</Button>
              </PropertyCreateButton>
            </div>
          </div>

          <PropertyTable dic={dic} data={project?.["properties"]} />
        </div>
      </div>
    </div>
  );
}
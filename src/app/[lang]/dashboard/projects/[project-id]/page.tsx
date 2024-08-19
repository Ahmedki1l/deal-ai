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
import { platforms } from "@/db/enums";
import { Icons } from "@/components/icons";
import { Map } from "@/components/map";
import { ProjectRestoreButton } from "@/components/project-restore-button";
import { ProjectBinButton } from "@/components/project-bin-button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

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
      caseStudy: {
        include: { posts: { where: { deletedAt: null } } },
        where: { deletedAt: null },
      },
      platforms: true,
      properties: { where: { deletedAt: null } },
    },
    where: { id: projectId },
  });

  if (!project)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            {c?.["oops, no such project."]}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {c?.["you have not created you project yet."]}
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  const projectDeleted = !!project?.["deletedAt"];
  const detailsTable = [
    { label: c?.["distinct"], value: project?.["distinct"] },
    { label: c?.["city"], value: project?.["city"] },
    { label: c?.["country"], value: project?.["country"] },
    { label: c?.["spaces"], value: project?.["spaces"] },
    { label: c?.["property types"], value: project?.["propertyTypes"] },
    {
      label: c?.["platforms"],
      value: (
        <div className="flex flex-1 items-center justify-end gap-2">
          {project?.["platforms"]?.map((e, i) => {
            const p = platforms(lang).find(
              (p) => p?.["value"] === e?.["value"],
            );
            if (!p) return "---";

            const Icon = Icons?.[p?.["icon"]] ?? null;

            return <Icon key={i} />;
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="container flex-1 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <BackButton dic={dic}>
              <Icons.chevronLeft />
              {c?.["back to all projects"]}
            </BackButton>
          </div>

          <div>
            {projectDeleted ? (
              <ProjectRestoreButton dic={dic} asChild project={project}>
                <Button variant="secondary">{c?.["restore"]}</Button>
              </ProjectRestoreButton>
            ) : (
              <ProjectBinButton dic={dic} asChild project={project}>
                <Button variant="destructive">{c?.["delete"]}</Button>
              </ProjectBinButton>
            )}
          </div>
        </div>

        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/dashboard/projects`}>
                {c?.["projects"]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{project?.["title"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {project?.["title"]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {project?.["description"]}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                {new Date(project?.["createdAt"])?.toDateString()}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.8fr,1fr]">
            <Table>
              <TableBody>
                {detailsTable?.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {e?.["label"]}
                    </TableCell>
                    <TableCell className="text-right">{e?.["value"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Map {...project} />
          </div>
        </div>
      </div>

      <Separator className="mb-12 mt-6" />
      <div className="space-y-12">
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
                <CaseStudyCreateButton
                  disabled={projectDeleted}
                  dic={dic}
                  project={project}
                >
                  <Button disabled={projectDeleted}>
                    {c?.["create case study"]}
                  </Button>
                </CaseStudyCreateButton>
              </div>
            </div>
          </div>

          <CaseStudyTable
            disabled={projectDeleted}
            dic={dic}
            data={project?.["caseStudy"]}
          />
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
              <PropertyCreateButton
                disabled={projectDeleted}
                dic={dic}
                project={project}
              >
                <Button disabled={projectDeleted}>
                  {c?.["create properties"]}
                </Button>
              </PropertyCreateButton>
            </div>
          </div>

          <PropertyTable
            disabled={projectDeleted}
            dic={dic}
            data={project?.["properties"]}
          />
        </div>
      </div>
    </div>
  );
}

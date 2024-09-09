import { Metadata } from "next";
import { db } from "@/db";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { BackButton } from "@/components/back-button";
import { LocaleProps } from "@/types/locale";
import { getDictionary } from "@/lib/dictionaries";
import { PropertyRestoreButton } from "@/components/property-restore-button";
import { Button } from "@/components/ui/button";
import { PropertyBinButton } from "@/components/property-bin-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { Link } from "@/components/link";

type CaseStudyProps = Readonly<{
  params: { "project-id": string; "property-id": string } & LocaleProps;
}>;

export const metadata: Metadata = { title: "CaseStudy" };
export default async function CaseStudy({
  params: { lang, "project-id": projectId, "property-id": propertyId },
}: CaseStudyProps) {
  const {
    dashboard: {
      user: {
        projects: {
          project: { properties: c },
        },
      },
    },
    ...dic
  } = await getDictionary(lang);
  const property = await db.property.findFirst({
    include: { project: true },
    where: {
      id: propertyId,
    },
  });

  if (!property)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            {c?.["oops, no such property."]}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {c?.["you have not created you property yet."]}
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  const projectDeleted = !!property?.["project"]?.["deletedAt"];
  const propertyDeleted = !!property?.["deletedAt"];

  return (
    <div className="container flex-1 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href={`/dashboard/projects/${projectId}`}>
              <Icons.chevronLeft />
              {c?.["back to"]}{" "}
              <span className="font-semibold">
                {property?.["project"]?.["title"]}
              </span>
            </Link>
          </div>

          <div>
            {propertyDeleted ? (
              <PropertyRestoreButton
                disabled={projectDeleted}
                dic={dic}
                asChild
                property={property}
              >
                <Button disabled={projectDeleted} variant="secondary">
                  {c?.["restore"]}
                </Button>
              </PropertyRestoreButton>
            ) : (
              <PropertyBinButton
                disabled={projectDeleted}
                dic={dic}
                asChild
                property={property}
              >
                <Button disabled={projectDeleted} variant="destructive">
                  {c?.["delete"]}
                </Button>
              </PropertyBinButton>
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
              <BreadcrumbLink href={`/${lang}/dashboard/projects/${projectId}`}>
                {property?.["project"]?.["title"]}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{property?.["title"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {projectDeleted && (
          <Alert variant="warning">
            <Icons.exclamationTriangle />
            <AlertTitle>{c?.["warning!"]}</AlertTitle>
            <AlertDescription>
              {
                c?.[
                  "it's project is deleted, once you restore it all will be editable."
                ]
              }
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">
              {property?.["title"]}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

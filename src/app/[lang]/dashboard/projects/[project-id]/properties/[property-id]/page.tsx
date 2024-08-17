import { Metadata } from "next";
import { db } from "@/db";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { BackButton } from "@/components/back-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardDescription } from "@/components/ui/card";
import { LocaleProps } from "@/types/locale";
import { getDictionary } from "@/lib/dictionaries";

type CaseStudyProps = Readonly<{
  params: { "project-id": string; "property-id": string } & LocaleProps;
}>;

export const metadata: Metadata = { title: "CaseStudy" };
export default async function CaseStudy({
  params: { lang, "project-id": projectId, "property-id": propertyId },
}: CaseStudyProps) {
  const {
    dashboard: {
      user: { projects: c },
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
            Oops, No Such Property.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            you have not created you property yet. start working with us.
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
              <BreadcrumbLink href={`/${lang}/dashboard/projects`}>
                Projects
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
        </Breadcrumb>
        <div className="mb-4 flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">
            {property?.["title"]}
          </h2>
          <CardDescription>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </CardDescription>
        </div>
      </div>
    </div>
  );
}

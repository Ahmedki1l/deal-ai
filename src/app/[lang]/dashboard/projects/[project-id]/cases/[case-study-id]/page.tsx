import { Metadata } from "next";
import { db } from "@/db";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { PostCreateButton } from "@/components/post-create-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image } from "@/components/image";
import { Icons } from "@/components/icons";
import { PostUpdateContentButton } from "@/components/post-update-content-button";
import { PostUpdateScheduleButton } from "@/components/post-update-schedule-button";
import { Link } from "@/components/link";
import { platforms } from "@/db/enums";
import { LocaleProps } from "@/types/locale";
import { getDictionary } from "@/lib/dictionaries";
import { CaseStudyRestoreButton } from "@/components/case-study-restore-button";
import { CaseStudyBinButton } from "@/components/case-study-bin-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type CaseStudyProps = Readonly<{
  params: { "project-id": string; "case-study-id": string } & LocaleProps;
}>;

export const metadata: Metadata = { title: "CaseStudy" };
export default async function CaseStudy({
  params: { lang, "project-id": projectId, "case-study-id": caseStudyId },
}: CaseStudyProps) {
  const dic = await getDictionary(lang);
  const c =
    dic?.["dashboard"]?.["user"]?.["projects"]?.["project"]?.["cases"]?.[
      "case"
    ];

  const caseStudy = await db.caseStudy.findFirst({
    include: {
      posts: {
        include: {
          image: {
            where: {
              deletedAt: null,
            },
          },
        },
        where: { deletedAt: null },
      },
      project: {
        include: {
          platforms: true,
        },
      },
    },
    where: { id: caseStudyId },
  });

  if (!caseStudy)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            {c?.["oops, no such case study."]}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {c?.["you have not created you case study yet."]}
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  const pros: string[] = Object.values(JSON.parse(caseStudy?.["pros"]));
  const cons: string[] = Object.values(JSON.parse(caseStudy?.["cons"]));

  const projectDeleted = !!caseStudy?.["project"]?.["deletedAt"];
  const caseStudyDeleted = !!caseStudy?.["deletedAt"];

  return (
    <div className="container flex-1 py-6">
      <div className="flex flex-col gap-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/dashboard/projects`}>
                {c?.["projects"]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/dashboard/projects/${projectId}`}>
                {caseStudy?.["project"]?.["title"]}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{caseStudy?.["title"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
              {caseStudy?.["title"]}
            </h2>
          </div>
          <div>
            {caseStudyDeleted ? (
              <CaseStudyRestoreButton
                disabled={projectDeleted}
                dic={dic}
                asChild
                caseStudy={caseStudy}
              >
                <Button disabled={projectDeleted} variant="secondary">
                  {c?.["restore"]}
                </Button>
              </CaseStudyRestoreButton>
            ) : (
              <CaseStudyBinButton
                disabled={projectDeleted}
                dic={dic}
                asChild
                caseStudy={caseStudy}
              >
                <Button disabled={projectDeleted} variant="destructive">
                  {c?.["delete"]}
                </Button>
              </CaseStudyBinButton>
            )}
          </div>
        </div>
        <div>
          <Accordion type="multiple">
            <AccordionItem value="content">
              <AccordionTrigger>{c?.["case study content"]}</AccordionTrigger>
              <AccordionContent>{caseStudy?.["content"]}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="target-audience">
              <AccordionTrigger>{c?.["target audience"]}</AccordionTrigger>
              <AccordionContent>
                {caseStudy?.["targetAudience"]}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pros">
              <AccordionTrigger>{c?.["pros"]}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                  {pros?.map((e, i) => (
                    <li key={i} className="mb-1">
                      {e}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cons">
              <AccordionTrigger>{c?.["cons"]}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                  {cons?.map((e, i) => (
                    <li key={i} className="mb-1">
                      {e}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="images">
              <AccordionTrigger>{c?.["reference images"]}</AccordionTrigger>
              <AccordionContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {caseStudy?.["refImages"]?.map((e, i) => (
                  <Image key={i} src={e} alt="" />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="pt-16">
        <div className="flex items-center justify-between gap-2">
          <div className="mb-8 space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {c?.["posts"]?.["posts"]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {c?.["navigate to get what you want."]}
            </p>
          </div>

          <div>
            <PostCreateButton
              disabled={projectDeleted || caseStudyDeleted}
              dic={dic}
              caseStudy={caseStudy}
              project={caseStudy.project}
            >
              <Button disabled={projectDeleted || caseStudyDeleted}>
                {c?.["create posts"]}
              </Button>
            </PostCreateButton>
          </div>
        </div>
        {caseStudy?.["posts"]?.["length"] ? (
          <section className="space-y-8">
            {platforms.map((platform, i) => {
              const posts = caseStudy?.["posts"]?.filter(
                (p) => p?.["platform"] === platform?.["value"],
              );
              if (!posts?.["length"]) return null;

              const Icon = Icons?.[platform?.["icon"]] ?? null;
              return (
                <div key={i}>
                  <div className="mb-4 space-y-0.5">
                    <p className="flex items-center gap-2 text-sm">
                      {Icon && <Icon />} {platform?.["label"]}{" "}
                      {c?.["posts"]?.["posts"]}
                    </p>
                  </div>
                  <Carousel>
                    <CarouselContent>
                      {posts.map((e, i) => (
                        <CarouselItem
                          key={i}
                          className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                          <Card className="overview-hidden relative">
                            <Badge
                              variant={
                                e?.["confirmedAt"] ? "default" : "highlight"
                              }
                              className="absolute right-2 top-2"
                            >
                              {e?.["confirmedAt"]
                                ? "confirmed"
                                : "pre scheduled"}
                            </Badge>

                            <CardHeader className="rounded-none p-0">
                              <Link
                                href={`/dashboard/projects/${projectId}/cases/${caseStudyId}/posts/${e?.["id"]}`}
                              >
                                <Image
                                  src={
                                    e?.["image"]?.["src"] ??
                                    "https://images.unsplash.com/photo-1692166623396-1a44298e22fe?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                  }
                                  alt=""
                                  className="aspect-square rounded-none"
                                />
                              </Link>
                            </CardHeader>
                            <CardContent className="p-2 text-sm">
                              <p className="line-clamp-6">{e?.["content"]}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 p-2">
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center">
                                  <PostUpdateContentButton
                                    disabled={
                                      projectDeleted || caseStudyDeleted
                                    }
                                    dic={dic}
                                    post={e}
                                  >
                                    <Button
                                      disabled={
                                        projectDeleted || caseStudyDeleted
                                      }
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <Icons.edit />
                                    </Button>
                                  </PostUpdateContentButton>

                                  <Button
                                    disabled={
                                      projectDeleted || caseStudyDeleted
                                    }
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Icons.image />
                                  </Button>
                                  <PostUpdateScheduleButton
                                    disabled={
                                      projectDeleted || caseStudyDeleted
                                    }
                                    dic={dic}
                                    post={e}
                                  >
                                    <Button
                                      disabled={
                                        projectDeleted || caseStudyDeleted
                                      }
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <Icons.calender />
                                    </Button>
                                  </PostUpdateScheduleButton>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    {e?.["postAt"] &&
                                      new Date(
                                        e?.["postAt"],
                                      ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="w-full text-xs">
                                <p className="text-muted-foreground">
                                  <span className="font-bold">
                                    Campaign Type:{" "}
                                  </span>
                                  {e?.["campaignType"]
                                    ?.toLocaleLowerCase()
                                    .split("_")
                                    .map(
                                      (e) =>
                                        `${e[0]?.toUpperCase()}${e?.slice(1).toLocaleLowerCase()}`,
                                    )
                                    .join(" ")}
                                </p>
                                <p className="text-muted-foreground">
                                  <span className="font-bold">
                                    Content Length:{" "}
                                  </span>
                                  {e?.["contentLength"]
                                    ?.split("_")
                                    ?.map(
                                      (e) =>
                                        `${e[0]?.toUpperCase()}${e?.slice(1).toLocaleLowerCase()}`,
                                    )
                                    .join(" ")}
                                </p>
                              </div>
                            </CardFooter>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              );
            })}
          </section>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="empty" />
            <EmptyPlaceholder.Title>
              {c?.["oops, no posts."]}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {c?.["you have not created you posts yet."]}
            </EmptyPlaceholder.Description>

            <PostCreateButton
              disabled={projectDeleted || caseStudyDeleted}
              dic={dic}
              caseStudy={caseStudy}
              project={caseStudy?.["project"]}
            >
              <Button disabled={projectDeleted || caseStudyDeleted}>
                {c?.["create posts"]}
              </Button>
            </PostCreateButton>
          </EmptyPlaceholder>
        )}
      </div>
    </div>
  );
}

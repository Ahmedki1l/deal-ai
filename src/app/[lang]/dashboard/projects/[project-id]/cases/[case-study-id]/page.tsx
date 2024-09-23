import { BackButton } from "@/components/back-button";
import { CaseStudyBinButton } from "@/components/case-study-bin-button";
import { CaseStudyRestoreButton } from "@/components/case-study-restore-button";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Icons } from "@/components/icons";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { PostCreateButton } from "@/components/post-create-button";
import { PostUpdateContentButton } from "@/components/post-update-content-button";
import { PostUpdateScheduleButton } from "@/components/post-update-schedule-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/db";
import { platforms } from "@/db/enums";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { Metadata } from "next";

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
            // where: {
            //   deletedAt: null,
            // },
          },
        },
        // where: {
        //    deletedAt: null

        // },
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
            {c?.["oops, no such study case."]}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {c?.["you have not created you study case yet."]}
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href={`/dashboard/projects/${projectId}`}
              className={buttonVariants({ variant: "ghost" })}
            >
              <Icons.chevronLeft />
              {c?.["back to"]}{" "}
              <span className="font-bold">
                {caseStudy?.["project"]?.["title"]}
              </span>
            </Link>
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
        </div>
        <div>
          <Accordion type="multiple">
            <AccordionItem value="content">
              <AccordionTrigger>{c?.["study case content"]}</AccordionTrigger>
              <AccordionContent>{caseStudy?.["content"]}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="target-audience">
              <AccordionTrigger>{c?.["target audience"]}</AccordionTrigger>
              <AccordionContent>
                {(() => {
                  try {
                    const targetAudience = caseStudy?.["targetAudience"]
                      ? JSON.parse(caseStudy["targetAudience"])
                      : null;

                    const renderKeyValuePairs = (data: Record<string, any>) => (
                      <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                        {Object.entries(data).map(([key, value]) => (
                          <li key={key} className="mb-1">
                            <strong>{key}:</strong>{" "}
                            {typeof value === "object" && value !== null
                              ? renderKeyValuePairs(value)
                              : value}
                          </li>
                        ))}
                      </ul>
                    );

                    if (
                      targetAudience &&
                      typeof targetAudience === "object" &&
                      !Array.isArray(targetAudience)
                    ) {
                      return renderKeyValuePairs(targetAudience);
                    } else {
                      return (
                        <p>{c?.["no valid market strategy data available."]}</p>
                      );
                    }
                  } catch (e) {
                    console.error("Failed to parse Market_Strategy JSON", e);
                    return <p>{c?.["error loading market strategy data."]}</p>;
                  }
                })()}
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
            <AccordionItem value="Market_Strategy">
              <AccordionTrigger>{c?.["market strategy"]}</AccordionTrigger>
              <AccordionContent>
                {(() => {
                  try {
                    const marketStrategy = caseStudy?.["Market_Strategy"]
                      ? JSON.parse(caseStudy["Market_Strategy"])
                      : null;

                    const renderKeyValuePairs = (data: Record<string, any>) => (
                      <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                        {Object.entries(data).map(([key, value]) => (
                          <li key={key} className="mb-1">
                            <strong>{key}:</strong>{" "}
                            {typeof value === "object" && value !== null
                              ? renderKeyValuePairs(value)
                              : value}
                          </li>
                        ))}
                      </ul>
                    );

                    if (
                      marketStrategy &&
                      typeof marketStrategy === "object" &&
                      !Array.isArray(marketStrategy)
                    ) {
                      return renderKeyValuePairs(marketStrategy);
                    } else {
                      return (
                        <p>{c?.["no valid market strategy data available."]}</p>
                      );
                    }
                  } catch (e) {
                    console.error("Failed to parse Market_Strategy JSON", e);
                    return <p>{c?.["error loading market strategy data."]}</p>;
                  }
                })()}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Performance_Metrics">
              <AccordionTrigger>{c?.["performance metrics"]}</AccordionTrigger>
              <AccordionContent>
                {(() => {
                  try {
                    const performanceMetrics = caseStudy?.[
                      "Performance_Metrics"
                    ]
                      ? JSON.parse(caseStudy["Performance_Metrics"])
                      : null;

                    const renderKeyValuePairs = (data: Record<string, any>) => (
                      <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                        {Object.entries(data).map(([key, value]) => (
                          <li key={key} className="mb-1">
                            <strong>{key}:</strong>{" "}
                            {typeof value === "object" && value !== null
                              ? renderKeyValuePairs(value)
                              : value}
                          </li>
                        ))}
                      </ul>
                    );

                    if (
                      performanceMetrics &&
                      typeof performanceMetrics === "object" &&
                      !Array.isArray(performanceMetrics)
                    ) {
                      return renderKeyValuePairs(performanceMetrics);
                    } else {
                      return (
                        <p>
                          {c?.["no valid performance metrics data available."]}
                        </p>
                      );
                    }
                  } catch (e) {
                    console.error(
                      "Failed to parse Performance_Metrics JSON",
                      e,
                    );
                    return (
                      <p>{c?.["error loading performance metrics data."]}</p>
                    );
                  }
                })()}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ROI_Calculation">
              <AccordionTrigger>{c?.["ROI calculation"]}</AccordionTrigger>
              <AccordionContent>
                {(() => {
                  try {
                    // Parse the JSON string into an object
                    const roiCalculation = caseStudy?.["ROI_Calculation"]
                      ? JSON.parse(caseStudy["ROI_Calculation"])
                      : null;

                    // Function to render key-value pairs
                    const renderKeyValuePairs = (data: Record<string, any>) => (
                      <ul className="list-decimal ltr:pl-5 rtl:pr-5">
                        {Object.entries(data).map(([key, value]) => (
                          <li key={key} className="mb-1">
                            <strong>{key}:</strong>{" "}
                            {typeof value === "object" && value !== null
                              ? renderKeyValuePairs(value)
                              : value}
                          </li>
                        ))}
                      </ul>
                    );

                    if (
                      roiCalculation &&
                      typeof roiCalculation === "object" &&
                      !Array.isArray(roiCalculation)
                    ) {
                      return renderKeyValuePairs(roiCalculation);
                    } else {
                      return (
                        <p>
                          {c?.["no valid ROI calculation data available."]}.
                        </p>
                      );
                    }
                  } catch (e) {
                    console.error("Failed to parse ROI_Calculation JSON", e);
                    return <p>{c?.["error loading ROI calculation data."]}</p>;
                  }
                })()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Strategic_Insights">
              <AccordionTrigger>{c?.["strategic insights"]}</AccordionTrigger>
              <AccordionContent>
                {/* Remove quotes by directly rendering the content */}
                {caseStudy?.["Strategic_Insights"]?.replace(/"/g, "")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Recommendations">
              <AccordionTrigger>{c?.["recommendations"]}</AccordionTrigger>
              <AccordionContent>
                {/* Remove quotes by directly rendering the content */}
                {caseStudy?.["Recommendations"]?.replace(/"/g, "")}
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
            {caseStudy?.["posts"]?.["length"] ? (
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
            ) : null}
          </div>
        </div>
        {caseStudy?.["posts"]?.["length"] ? (
          <section className="space-y-8">
            {platforms(lang).map((platform, i) => {
              const posts = caseStudy?.["posts"]?.filter(
                (p) => p?.["platform"] === platform?.["value"],
              );
              if (!posts?.["length"]) return null;

              const Icon = Icons?.[platform?.["icon"]] ?? null;

              return (
                <div key={i}>
                  <div className="mb-4 space-y-0.5">
                    <p className="flex items-center gap-2 text-sm">
                      {Icon && <Icon />}{" "}
                      <span className="flex rtl:flex-row-reverse">
                        {platform?.["label"]} {c?.["posts"]?.["posts"]}
                      </span>
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
                                ? c?.["confirmed"]
                                : c?.["not confirmed"]}
                            </Badge>

                            <CardHeader className="rounded-none p-0">
                              <Link
                                href={`/dashboard/projects/${projectId}/cases/${caseStudyId}/posts/${e?.["id"]}`}
                              >
                                <Image
                                  src={
                                    e?.["framedImageURL"] ??
                                    e?.["image"]?.["src"]!
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
                                    {c?.["campaign type"]}:{" "}
                                  </span>
                                  {dic?.["db"]?.["campaignTypes"]?.find(
                                    (x) => x?.["value"] === e?.["campaignType"],
                                  )?.["label"] ?? ""}
                                </p>
                                <p className="text-muted-foreground">
                                  <span className="font-bold">
                                    {c?.["content length"]}:{" "}
                                  </span>
                                  {dic?.["db"]?.["contentLength"]?.find(
                                    (x) =>
                                      x?.["value"] === e?.["contentLength"],
                                  )?.["label"] ?? ""}
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

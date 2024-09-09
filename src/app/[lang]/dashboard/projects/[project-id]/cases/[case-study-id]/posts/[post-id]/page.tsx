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
import { PostUpdateForm } from "@/components/post-update-form";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { Link } from "@/components/link";
import { buttonVariants } from "@/components/ui/button";

type CaseStudyProps = Readonly<{
  params: {
    "project-id": string;
    "case-study-id": string;
    "post-id": string;
  } & LocaleProps;
}>;

export const metadata: Metadata = { title: "CaseStudy" };
export default async function CaseStudy({
  params: {
    lang,
    "project-id": projectId,
    "case-study-id": caseStudyId,
    "post-id": postId,
  },
}: CaseStudyProps) {
  const dic = await getDictionary(lang);
  const c =
    dic?.["dashboard"]?.["user"]?.["projects"]?.["project"]?.["cases"]?.[
      "case"
    ]?.["posts"]?.["post"];
  const post = await db.post.findFirst({
    include: {
      image: { where: { deletedAt: null } },
      caseStudy: {
        include: {
          project: true,
        },
      },
    },
    where: { id: postId },
  });

  if (!post)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            {c?.["oops, no such post."]}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {c?.["you have not created you post yet."]}
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  const projectDeleted = !!post?.["caseStudy"]?.["project"]?.["deletedAt"];
  const caseStudyDeleted = !!post?.["caseStudy"]?.["deletedAt"];
  const postDeleted = !!post?.["deletedAt"];

  return (
    <div className="min-h-screen flex-1 overflow-auto">
      <div className="container flex flex-col gap-5 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href={`/dashboard/projects/${projectId}/cases/${caseStudyId}`}
              className={buttonVariants({ variant: "ghost" })}
            >
              <Icons.chevronLeft />
              {c?.["back to"]}{" "}
              <span className="font-semibold">
                {post?.["caseStudy"]?.["title"]}
              </span>
            </Link>
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
                {post?.["caseStudy"]?.["project"]?.["title"]}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${lang}/dashboard/projects/${projectId}/cases/${caseStudyId}`}
              >
                {post?.["caseStudy"]?.["title"]}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post?.["title"]}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {projectDeleted ||
          (caseStudyDeleted && (
            <Alert variant="warning">
              <Icons.exclamationTriangle />
              <AlertTitle>{c?.["warning!"]}</AlertTitle>
              <AlertDescription>
                {
                  c?.[
                    "it's project or study case is deleted, once you restore it all will be editable."
                  ]
                }
              </AlertDescription>
            </Alert>
          ))}
        <div className="flex max-w-screen-xl flex-1 flex-col gap-6 py-6">
          <PostUpdateForm
            disabled={projectDeleted || caseStudyDeleted || postDeleted}
            dic={dic}
            post={post}
          />
        </div>
      </div>
    </div>
  );
}

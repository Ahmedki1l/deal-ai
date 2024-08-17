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
  const {
    dashboard: {
      user: {
        projects: {
          project: {
            cases: {
              case: { posts: c },
            },
          },
        },
      },
    },
    ...dic
  } = await getDictionary(lang);
  const post = await db.post.findFirst({
    include: {
      image: true,
      caseStudy: { include: { project: true } },
    },
    where: {
      id: postId,
      caseStudy: {
        project: {
          deletedAt: null,
        },
      },
    },
  });

  if (!post)
    return (
      <div className="container flex min-h-screen items-center justify-center py-6">
        <EmptyPlaceholder className="border-none">
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>
            Oops, No Such Case Study.
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            you have not created you case study yet. start working with us.
          </EmptyPlaceholder.Description>
          <BackButton dic={dic} />
        </EmptyPlaceholder>
      </div>
    );

  return (
    <div className="min-h-screen flex-1 overflow-auto">
      <div className="container flex flex-col gap-5 py-6">
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
        </Breadcrumb>

        <div className="flex max-w-screen-xl flex-1 flex-col gap-6 py-6">
          <PostUpdateForm dic={dic} post={post} />
        </div>
      </div>
    </div>
  );
}

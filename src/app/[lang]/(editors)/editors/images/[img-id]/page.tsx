import { Icons } from "@/components/icons";
import { ImageEditor } from "@/components/image-editor";
import { Link } from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";

type ImageEditorProps = Readonly<{
  params: { "img-id": string } & LocaleProps;
}>;

export const metadata: Metadata = { title: "ImageEditor" };
export default async function ImageEditorPage({
  params: { "img-id": imgId, lang },
}: ImageEditorProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["editors"]?.["images"]?.["image"];
  const image = await db.image.findUnique({
    include: {
      posts: { include: { caseStudy: { include: { project: true } } } },
    },
    where: { id: imgId },
  });

  if (!image || !image?.["posts"]?.["length"]) return <>NO IMAGE OR NO POST</>;

  // TODO: for many pages, handle now just one page
  const post = image?.["posts"]?.pop()!;
  return (
    <div className="flex flex-1 flex-col gap-6 py-4">
      <div className="container flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href={`/dashboard/projects/${post?.["caseStudy"]?.["project"]?.["id"]}/cases/${post?.["caseStudy"]?.["id"]}/posts/${post?.["id"]}`}
              className={buttonVariants({ variant: "ghost" })}
            >
              <Icons.chevronLeft />
              {c?.["back to"]}{" "}
              <span className="font-bold">{post?.["title"]}</span>{" "}
              {c?.["post of project"]}
              <span className="font-bold">
                {post?.["caseStudy"]?.["project"]?.["title"]}
              </span>
            </Link>
          </div>

          {/* <div>
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
        </div> */}
        </div>
      </div>

      <ImageEditor
        dic={dic}
        image={{
          ...image,
          post,
        }}
        disabled={!!post?.["deletedAt"]}
      />
    </div>
  );
}

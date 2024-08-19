import type { Metadata } from "next";

import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { Scheduler } from "@/components/scheduler";
import { platform } from "os";

type CalenderProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Calender" };
export default async function Calender({ params: { lang } }: CalenderProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["calender"];

  const user = (await getAuth())?.["user"]!;
  const posts = await db.post.findMany({
    include: {
      image: true,
      caseStudy: { include: { project: { include: { platforms: true } } } },
    },
    where: {
      confirmedAt: { not: null },
      caseStudy: {
        project: {
          userId: user?.["id"],
        },
      },
    },
  });

  return (
    <div className="container flex min-h-screen flex-1 flex-col py-6">
      <div className="flex flex-col gap-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {c?.["calender"]}
            </h2>
            <p className="text-muted-foreground">
              {c?.["timeline of your posts schedule."]}
            </p>
          </div>

          <div>
            {/* <ProjectCreateButton dic={dic} user={user}>
              <Button>{c?.["create calender]}</Button>
            </ProjectCreateButton> */}
          </div>
        </div>
      </div>

      <Scheduler dic={dic} posts={posts} />
    </div>
  );
}

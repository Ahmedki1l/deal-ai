import type { Metadata } from "next";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { db } from "@/db";
import { getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ProjectCreateButton } from "@/components/project-create-button";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { Scheduler } from "@/components/scheduler";

type CalenderProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Calender" };
export default async function Calender({ params: { lang } }: CalenderProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["calender"];

  const user = (await getAuth())?.["user"]!;
  const posts = await db.post.findMany({
    include: { image: true },
    where: {
      caseStudy: {
        project: {
          userId: user?.["id"],
        },
      },
    },
  });

  return (
    <div className="container flex-1 py-6">
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
        <Scheduler />
      </div>
    </div>
  );
}

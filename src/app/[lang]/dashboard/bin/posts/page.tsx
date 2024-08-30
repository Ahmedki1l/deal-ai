import { BinPostsTable } from "@/components/bin-posts-table";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import React from "react";

type BinPostsProps = Readonly<{ params: LocaleProps }>;

export const metadata: Metadata = { title: "Bin Posts" };
export default async function BinPosts({ params: { lang } }: BinPostsProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["bin"]?.["posts"];
  const posts = await db.post.findMany({
    include: { caseStudy: true },
    where: {
      deletedAt: { not: null },
    },
  });

  return <BinPostsTable dic={dic} data={posts} />;
}

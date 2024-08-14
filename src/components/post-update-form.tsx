"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { postUpdateSchema } from "@/validations/posts";
import { updatePost } from "@/actions/posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { PostForm } from "@/components/post-form";
import { Image as ImageType, Post } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { Image } from "./image";
import { DialogResponsive } from "./dialog";
import { DialogClose } from "./ui/dialog";
import { DrawerClose } from "./ui/drawer";
import { ImageForm } from "./image-form";
import { ImageUpdateButton } from "./image-update-button";

type PostUpdateFormProps = {
  post: Post & { image: ImageType | null };
} & Dictionary["post-update-form"] &
  Dictionary["image-update-button"] &
  Dictionary["image-form"] &
  Dictionary["post-form"] &
  Dictionary["dialog"] &
  Dictionary["back-button"];

export function PostUpdateForm({
  dic: { "post-update-form": c, ...dic },
  post,
}: PostUpdateFormProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof postUpdateSchema>>({
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      ...post,
      image: {
        prompt: post?.["image"]?.["prompt"] ?? "",
      },
    },
  });

  function onSubmit(data: z.infer<typeof postUpdateSchema>) {
    setLoading(true);
    toast.promise(updatePost(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        return c?.["updated successfully."];
      },
    });
  }
  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BackButton dic={dic} type="button" variant="ghost" size="sm" />

          <h1 className="text-md font-semibold">{c?.["post details"]}</h1>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            onClick={() => form.reset()}
            variant="outline"
            size="sm"
          >
            {c?.["discard"]}
          </Button>
          <Button type="submit" size="sm" className="w-full" disabled={loading}>
            {loading && <Icons.spinner />}
            {c?.["save changes"]}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.7fr,1fr]">
        <div
          className={cn(
            "relative h-full min-h-60 flex-col overflow-hidden rounded text-primary-foreground dark:border-r lg:flex",
            // form.watch("image") && `bg-[url(${form.getValues("image")})]`,
          )}
        >
          <div className="absolute inset-0 bg-primary/30" />
          {isValidUrl(post?.["image"]?.["src"] ?? "") ? (
            <Image src={post?.["image"]?.["src"]!} alt="" className="" />
          ) : null}
          <div className="absolute right-4 top-4 z-50 flex items-center text-lg font-medium">
            <ImageUpdateButton dic={dic} image={post?.["image"]!}>
              <Button size="icon" variant="secondary">
                <Icons.edit />
              </Button>
            </ImageUpdateButton>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{c?.["post information"]}</CardTitle>
                {/* <CardDescription>{post?.["description"]}</CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-2">
                <PostForm.title
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <PostForm.content
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <PostForm.contentLength
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                  <PostForm.campaignType
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                </div>
                <div className="grid items-center gap-4 md:grid-cols-[1fr,1fr]">
                  <PostForm.postAt
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                  <PostForm.noOfWeeks
                    dic={dic}
                    form={form as any}
                    loading={true}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button
              type="button"
              onClick={() => form.reset()}
              variant="outline"
              size="sm"
            >
              {c?.["discard"]}
            </Button>

            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={loading}
            >
              {loading && <Icons.spinner />}
              {c?.["save changes"]}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

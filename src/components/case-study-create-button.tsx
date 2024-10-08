"use client";

import { CaseStudyForm } from "@/components/case-study-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { caseStudyCreateFormSchema } from "@/validations/case-studies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Platform, Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useSession } from "./session-provider";

export type CaseStudyCreateButtonProps = {
  project: Project & { platforms: Platform[] };
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-create-button"] &
  Dictionary["case-study-form"] &
  Dictionary["dialog"];

export function CaseStudyCreateButton({
  dic: { "case-study-create-button": c, ...dic },
  project,
  disabled,
  ...props
}: CaseStudyCreateButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyCreateFormSchema>>({
    resolver: zodResolver(caseStudyCreateFormSchema),
    defaultValues: {
      projectId: project?.["id"],
      title: undefined,
      refImages: [],
    },
  });

  async function onSubmit(data: z.infer<typeof caseStudyCreateFormSchema>) {
    await clientHttpRequest(async () => {
      await axios({ locale, user }).post(`/api/study-cases`, {
        ...data,
        refImages: data?.refImages?.map((e) => e?.["base64"]),
      });

      toast.success(c?.["created successfully."]);
      setOpen(false);
      form.reset();
      router.refresh();
    }, setLoading);
  }

  return (
    <DialogResponsive
      dic={dic}
      disabled={loading}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button disabled={loading} className="w-full md:w-fit">
                {!disabled && loading && <Icons.spinner />}
                {c?.["submit"]}
              </Button>
            </form>
          </Form>
        </>
      }
      content={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <CaseStudyForm.title
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <CaseStudyForm.refImages
                dic={dic}
                form={form as any}
                loading={loading}
              />
            </form>
          </Form>
        </>
      }
      title={c?.["create study case"]}
      description={
        c?.[
          "create a A well-structured study case for your real estate project that helps highlight the unique features, target audience, market strategy, and performance metrics of your project. once created, these study cases can be used to inform potential buyers, partners, and stakeholders, demonstrating the value and potential of your real estate developments."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}

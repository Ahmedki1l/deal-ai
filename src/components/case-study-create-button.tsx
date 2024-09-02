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
import {
  caseStudyCreateFormSchema,
  caseStudyCreateSchema,
} from "@/validations/case-studies";
import { createCaseStudy } from "@/actions/case-studies";
import { CaseStudyForm } from "@/components/case-study-form";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Platform, Project } from "@prisma/client";
import { convertBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

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
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyCreateFormSchema>>({
    resolver: zodResolver(caseStudyCreateFormSchema),
    defaultValues: {
      projectId: project?.["id"],
      content: "x",
      targetAudience: "x",
      pros: "x",
      cons: "x",
      hashtags: "x",
      Market_Strategy: "x",
      Performance_Metrics: "x",
      ROI_Calculation: "x",
      Strategic_Insights: "x",
      Recommendations: "x",
    },
  });

  async function onSubmit(data: z.infer<typeof caseStudyCreateFormSchema>) {
    const toastId = toast.loading("Initializing case...");

    try {
      setLoading(true);

      // Create a POST request with the data
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // TODO: gives too long
          refImages: [],
          // data?.refImages?.map((e) => e?.base64),
        } satisfies z.infer<typeof caseStudyCreateSchema>),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const { id } = await response.json().catch((err) => {
        setLoading(false);
        throw err;
      });

      // Start the EventSource after getting the id from the POST request
      const eventSource = new EventSource(`/api/cases?id=${id}`);

      eventSource.addEventListener("status", (event) => {
        toast.loading(event.data?.replaceAll('"', ""), {
          id: toastId,
        });
      });

      eventSource.addEventListener("completed", (event) => {
        toast.dismiss(toastId);
        eventSource.close();
        toast.success(event.data?.replaceAll('"', ""));

        router.refresh();
        setOpen(false);
        form.reset();
        setLoading(false);
      });

      eventSource.addEventListener("error", (event) => {
        console.error("Error occurred:", event);
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });

      eventSource.addEventListener("close", () => {
        toast.dismiss(toastId);
        eventSource.close();

        setLoading(false);
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);

      toast.error(err?.message);
    }
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

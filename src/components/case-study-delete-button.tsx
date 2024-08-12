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
import { caseStudyDeleteSchema } from "@/validations/case-studies";
import { deleteCaseStudy } from "@/actions/case-studies";
import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { CaseStudy } from "@prisma/client";
import { Dictionary } from "@/types/locale";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/locale";

type CaseStudyDeleteButtonProps = {
  caseStudy: Pick<CaseStudy, "id">;
} & Omit<DialogResponsiveProps, "open" | "setOpen"> &
  Dictionary["case-study-delete-button"] &
  Dictionary["dialog"];

export function CaseStudyDeleteButton({
  dic: { "case-study-delete-button": c, ...dic },
  caseStudy,
  ...props
}: CaseStudyDeleteButtonProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof caseStudyDeleteSchema>>({
    resolver: zodResolver(caseStudyDeleteSchema),
    defaultValues: {
      id: caseStudy?.["id"],
    },
  });

  function onSubmit(data: z.infer<typeof caseStudyDeleteSchema>) {
    setLoading(true);
    toast.promise(deleteCaseStudy(data), {
      finally: () => setLoading(false),
      error: async (err) => {
        const msg = await t(err?.["message"], lang);
        return msg;
      },
      success: () => {
        router.refresh();
        form.reset();
        setOpen(false);
        return c?.["deleted successfully."];
      },
    });
  }

  return (
    <DialogResponsive
      dic={dic}
      confirmButton={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Button
                variant="destructive"
                disabled={loading}
                className="w-full md:w-fit"
              >
                {loading && <Icons.spinner />}
                {c?.["delete"]}
              </Button>
            </form>
          </Form>
        </>
      }
      title={c?.["delete case study"]}
      description={
        c?.[
          "this step is essential for informing patients about the treatments available at your case study."
        ]
      }
      open={open}
      setOpen={setOpen}
      {...props}
    />
  );
}
"use client";

import { DialogResponsive, DialogResponsiveProps } from "@/components/dialog";
import { Icons } from "@/components/icons";
import { ProjectForm } from "@/components/project-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import axios from "@/lib/axios";
import { clientHttpRequest, getPdfImages } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import { projectCreateFormSchema } from "@/validations/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ApartmentForm, VillaForm } from "./property-create-button";
import { useSession } from "./session-provider";
import { Accordion } from "./ui/accordion";

export type ProjectCreateButtonProps = { user: User } & Omit<
  DialogResponsiveProps,
  "open" | "setOpen"
> &
  Dictionary["project-create-button"] &
  Dictionary["project-form"] &
  Dictionary["property-form"] &
  Dictionary["dialog"];

export function ProjectCreateButton({
  dic: { "project-create-button": c, ...dic },
  disabled,
  ...props
}: ProjectCreateButtonProps) {
  const locale = useLocale();
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(disabled ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof projectCreateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: { userId: user?.["id"], platforms: [{}], properties: [] },
  });

  async function onSubmit({
    pdfFile,
    pdf: pdfImagesArr,
    ...data
  }: z.infer<typeof projectCreateFormSchema>) {
    await clientHttpRequest(async () => {
      const pdfImages =
        pdfFile && !pdfImagesArr?.["length"]
          ? await getPdfImages({ locale, user, file: pdfFile })
          : pdfImagesArr;

      await axios({ locale, user }).post(`/api/projects`, {
        ...data,
        pdf: pdfImages,
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
      open={open}
      setOpen={setOpen}
      disabled={loading}
      confirmButton={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button disabled={loading} className="w-full md:w-fit">
              {!disabled && loading && <Icons.spinner />}
              {c?.["submit"]}
            </Button>
          </form>
        </Form>
      }
      content={
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-2">
                <div className="flex items-start justify-center gap-10">
                  <ProjectForm.logo
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                  <ProjectForm.pdf
                    dic={dic}
                    form={form as any}
                    loading={loading}
                  />
                </div>
                <ProjectForm.title
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.description
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <div className="flex items-end gap-2">
                <ProjectForm.distinct
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.map
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ProjectForm.city
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
                <ProjectForm.country
                  dic={dic}
                  form={form as any}
                  loading={loading}
                />
              </div>

              <ProjectForm.spaces
                dic={dic}
                form={form as any}
                loading={loading}
              />
              <ProjectForm.platforms
                dic={dic}
                form={form as any}
                loading={loading}
              />

              <div>
                <Card>
                  <CardContent className="py-4">
                    <Accordion type="single" collapsible>
                      <ApartmentForm
                        dic={dic}
                        form={form as any}
                        loading={loading}
                        project={{ id: "x" }}
                      />

                      <VillaForm
                        dic={dic}
                        form={form as any}
                        loading={loading}
                        project={{ id: "x" }}
                      />
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      }
      title={c?.["create project"]}
      description={
        c?.[
          "by providing detailed information about your project, you'll be able to streamline your operations, track progress, and ensure that all stakeholders are informed about the development's key aspects and milestones."
        ]
      }
      {...props}
    />
  );
}

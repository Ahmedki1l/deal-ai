"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  caseStudyCreateFormSchema,
  caseStudyUpdateFormSchema,
} from "@/validations/case-studies";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { convertBase64 } from "@/lib/utils";
import { Image } from "./image";
import { Dictionary } from "@/types/locale";

type CaseStudyFormProps = {
  loading: boolean;
  form: UseFormReturn<
    | z.infer<typeof caseStudyCreateFormSchema>
    | z.infer<typeof caseStudyUpdateFormSchema>,
    any,
    undefined
  >;
} & Dictionary["case-study-form"];

export const CaseStudyForm = {
  title: ({
    dic: { "case-study-form": c },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["title"]?.["label"]}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder={c?.["title"]?.["health center"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  refImages: function Component({
    dic: { "case-study-form": c },
    loading,
    form,
    limit,
  }: CaseStudyFormProps & {
    limit?: number;
  }) {
    const { fields, remove, append } = useFieldArray({
      name: "refImages",
      control: form?.["control"],
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <FormLabel>{c?.["reference image"]?.["label"]}</FormLabel>
          <Button
            size="icon"
            // @ts-ignore
            onClick={() => append({})}
            disabled={limit ? fields?.["length"] == limit : loading}
          >
            <Icons.add />
          </Button>
        </div>

        {fields.map((field, i) => (
          <FormField
            control={form?.["control"]}
            key={i}
            name={`refImages.${i}.file`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      type="file"
                      {...field}
                      value={undefined}
                      onChange={async (e) => {
                        const file = e?.["target"]?.["files"]?.[0];
                        if (file) {
                          const base64 = (
                            await convertBase64(file)
                          )?.toString();

                          field.onChange(file);
                          form.setValue(`refImages.${i}.base64`, base64 ?? "");
                        }
                      }}
                    />
                    {form.getValues(`refImages.${i}.base64`) ? (
                      <Image
                        src={form.getValues(`refImages.${i}.base64`)}
                        alt=""
                        className="h-8 w-8"
                      />
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(i)}
                    >
                      <Icons.x />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    );
  },
  content: ({
    dic: { "case-study-form": c },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel> {c?.["content"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={
                c?.["content"]?.["describe your case study's content"]
              }
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  targetAudience: ({
    dic: { "case-study-form": c },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="targetAudience"
      render={({ field }) => (
        <FormItem>
          <FormLabel> {c?.["targetAudience"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={
                c?.["targetAudience"]?.[
                  "describe your case study's target audience"
                ]
              }
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  pros: ({
    dic: { "case-study-form": c },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="pros"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["pros"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["pros"]?.["describe your case study's pros"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  cons: ({
    dic: { "case-study-form": c },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="cons"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["cons"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["cons"]?.["describe your case study's cons"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
};

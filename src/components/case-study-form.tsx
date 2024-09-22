"use client";

import { Icons } from "@/components/icons";
import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileToBase64 } from "@/lib/utils";
import { Dictionary } from "@/types/locale";
import {
  caseStudyCreateFormSchema,
  caseStudyUpdateFormSchema,
} from "@/validations/case-studies";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import * as z from "zod";

export type CaseStudyFormProps = {
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
    dic: {
      "case-study-form": { title: c },
    },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder={c?.["health center"]}
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
    dic: {
      "case-study-form": { refImages: c },
    },
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
          <FormLabel>{c?.["label"]}</FormLabel>
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
                          const base64 = (await fileToBase64(file))?.toString();

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
    dic: {
      "case-study-form": { content: c },
    },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel> {c?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["describe your study case's content"]}
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
    dic: {
      "case-study-form": { targetAudience: c },
    },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="targetAudience"
      render={({ field }) => (
        <FormItem>
          <FormLabel> {c?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["describe your study case's target audience"]}
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
    dic: {
      "case-study-form": { pros: c },
    },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="pros"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["describe your study case's pros"]}
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
    dic: {
      "case-study-form": { cons: c },
    },
    loading,
    form,
  }: CaseStudyFormProps) => (
    <FormField
      control={form.control}
      name="cons"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={c?.["describe your study case's cons"]}
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

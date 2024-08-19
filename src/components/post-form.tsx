"use client";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { postCreateSchema, postUpdateSchema } from "@/validations/posts";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { platforms, postCampaigns, postContentLengths } from "@/db/enums";
import { Dictionary } from "@/types/locale";
import { Checkbox } from "./ui/checkbox";
import { Link } from "./link";
import { buttonVariants } from "./ui/button";
import { useLocale } from "@/hooks/use-locale";

type PostFormProps = {
  loading: boolean;
  form: UseFormReturn<
    z.infer<typeof postCreateSchema> | z.infer<typeof postUpdateSchema>,
    any,
    undefined
  >;
} & Dictionary["post-form"];

export const PostForm = {
  title: ({
    dic: {
      "post-form": { title: c },
    },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="w-full"
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
  confirmedAt: ({
    dic: {
      "post-form": { confirmedAt: c },
    },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="confirm"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormDescription>
              {c?.["you can manage your posts in the"]}{" "}
              <Link href="/dashboard/calender" className="font-bold underline">
                {c?.["calender"]}
              </Link>{" "}
              {c?.["page"]}.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  ),

  content: ({
    dic: {
      "post-form": { content: c },
    },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-56 w-full"
              placeholder={c?.["describe your post's content"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  noOfWeeks: ({
    dic: {
      "post-form": { noOfWeeks: c },
    },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="noOfWeeks"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="w-full"
              placeholder="5"
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  campaignType: function Component({
    dic: {
      "post-form": { campaignType: c },
    },
    loading,
    form,
  }: PostFormProps) {
    const lang = useLocale();

    return (
      <FormField
        control={form.control}
        name="campaignType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={c?.["select your campaign"]} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {postCampaigns(lang)?.map((e, i) => (
                    <SelectItem key={i} value={e?.["value"]}>
                      {e?.["label"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  contentLength: function Component({
    dic: {
      "post-form": { contentLength: c },
    },
    loading,
    form,
  }: PostFormProps) {
    const lang = useLocale();
    return (
      <FormField
        control={form.control}
        name="contentLength"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={c?.["select your content length"]}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {postContentLengths(lang)?.map((e, i) => (
                    <SelectItem key={i} value={e?.["value"]}>
                      {e?.["label"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  platform: function Component({
    dic: {
      "post-form": { platform: c },
    },
    loading,
    form,
  }: PostFormProps) {
    const lang = useLocale();
    return (
      <FormField
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={c?.["select your platform"]} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms(lang)?.map((e, i) => (
                    <SelectItem key={i} value={e?.["value"]}>
                      {e?.["label"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  postAt: ({
    dic: {
      "post-form": { postAt: c },
    },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="postAt"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{c?.["label"]}</FormLabel>
          <FormControl className="w-full">
            <DateTimePicker
              // mode="single"
              value={field.value}
              onChange={field.onChange}
              granularity="minute"
              disabled={loading}
              // disabled={
              //   (date) =>
              //     loading ||
              //     (date.getDate() != new Date().getDate() &&
              //       date < new Date()) // past date
              // }
              // initialFocus
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
};

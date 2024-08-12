"use client";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
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

type PostFormProps = {
  loading: boolean;
  form: UseFormReturn<
    z.infer<typeof postCreateSchema> | z.infer<typeof postUpdateSchema>,
    any,
    undefined
  >;
} & Dictionary["post-form"];

export const PostForm = {
  title: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["title"]?.["label"]}</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="w-full"
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
  // image: ({
  //   loading,
  //   form,
  // }: PostFormProps<
  //   z.infer<typeof postCreateSchema> | z.infer<typeof postUpdateSchema>
  // >) => (
  //   <FormField
  //     control={form.control}
  //     name="image"
  //     render={({ field }) => (
  //       <FormItem>
  //         <FormLabel>Image</FormLabel>
  //         <FormControl>
  //           <Input
  //             type="text"
  //             className="w-full"
  //             placeholder="unsplash url"
  //             disabled={loading}
  //             {...field}
  //           />
  //         </FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     )}
  //   />
  // ),
  description: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["description"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-56 w-full"
              placeholder={c?.["description"]?.["describe your post"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  content: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["content"]?.["label"]}</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-56 w-full"
              placeholder={c?.["content"]?.["describe your post's content"]}
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  noOfWeeks: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="noOfWeeks"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["noOfWeeks"]?.["label"]}</FormLabel>
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
  campaignType: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="campaignType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["campaignType"]?.["label"]}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={c?.["campaignType"]?.["select your campaign"]}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {postCampaigns?.map((e, i) => (
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
  ),
  contentLength: ({
    dic: { "post-form": c },
    loading,
    form,
  }: PostFormProps) => (
    <FormField
      control={form.control}
      name="contentLength"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["contentLength"]?.["label"]}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      c?.["contentLength"]?.["select your content length"]
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {postContentLengths?.map((e, i) => (
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
  ),
  platform: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="platform"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["platform"]?.["label"]}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={c?.["platform"]?.["select your platform"]}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {platforms?.map((e, i) => (
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
  ),
  postAt: ({ dic: { "post-form": c }, loading, form }: PostFormProps) => (
    <FormField
      control={form.control}
      name="postAt"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{c?.["postAt"]?.["label"]}</FormLabel>
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

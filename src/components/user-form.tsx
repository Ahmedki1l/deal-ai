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
import {
  userAuthLoginSchema,
  userAuthRegisterSchema,
  userUpdateProfilePasswordFormSchema,
  userUpdateProfilePersonalSchema,
} from "@/validations/users";
import { Dictionary } from "@/types/locale";

type UserFormProps = {
  loading: boolean;
  form: UseFormReturn<
    | z.infer<typeof userAuthRegisterSchema>
    | z.infer<typeof userAuthLoginSchema>
    | z.infer<typeof userUpdateProfilePersonalSchema>
    | z.infer<typeof userUpdateProfilePasswordFormSchema>,
    any,
    undefined
  >;
} & Dictionary["user-form"];

export const UserForm = {
  name: function Component({
    dic: {
      "user-form": { name: c },
    },
    loading,
    form,
  }: UserFormProps) {
    return (
      <FormField
        control={form?.["control"]}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormControl>
              {/* @ts-ignore */}
              <Input
                type="text"
                placeholder={c?.["placeholder"]}
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  email: function Component({
    dic: {
      "user-form": { email: c },
    },
    loading,
    form,
  }: UserFormProps) {
    return (
      <FormField
        control={form?.["control"]}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{c?.["label"]}</FormLabel>
            <FormControl>
              <Input
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  password: function Component({
    dic: {
      "user-form": { password: c },
    },
    loading,
    form,
    field,
    label,
  }: UserFormProps & {
    field?: string;
    label?: string;
  }) {
    return (
      <FormField
        control={form?.["control"]}
        // @ts-ignore
        name={field ?? "password"}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label ?? c?.["label"]}</FormLabel>
            <FormControl>
              {/* @ts-ignore */}
              <Input
                type="password"
                dir="ltr"
                placeholder="******"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
};

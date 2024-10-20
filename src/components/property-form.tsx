"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dictionary } from "@/types/locale";
import { propertyCreateFormSchema } from "@/validations/properties";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export type PropertyFormProps = {
  loading: boolean;
  form: UseFormReturn<
    z.infer<typeof propertyCreateFormSchema>,
    // | z.infer<typeof propertyCreateSchema>
    // | z.infer<typeof propertyUpdateSchema>,
    any,
    undefined
  >;
} & Dictionary["property-form"];

export const PropertyForm = {
  title: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.title`}
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
  units: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.units`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {form.getValues("properties")?.[index]?.["type"] === "VILLA"
              ? c?.["units"]?.["no. of villas"]
              : c?.["units"]?.["units"]}
          </FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  space: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.space`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["space"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  finishing: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.finishing`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["finishing"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  floors: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.floors`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["floors"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  rooms: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.rooms`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["rooms"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  bathrooms: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.bathrooms`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["bathrooms"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  livingrooms: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.livingrooms`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["livingrooms"]?.["living rooms"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  price: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.price`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["price"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  garden: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.garden`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["garden"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  pool: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.pool`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["pool"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
  view: ({
    dic: { "property-form": c },
    loading,
    form,
    index,
  }: PropertyFormProps & { index: number }) => (
    <FormField
      control={form.control}
      name={`properties.${index}.view`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["view"]?.["label"]}</FormLabel>
          <FormControl>
            <Input type="text" disabled={loading} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
};

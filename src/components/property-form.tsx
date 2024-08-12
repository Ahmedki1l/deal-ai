"use client";

import { UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { propertyCreateFormSchema } from "@/validations/properties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyTypes } from "@/db/enums";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Dictionary } from "@/types/locale";

type PropertyFormProps = {
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
  type: function Component({
    dic: { "property-form": c },
    loading,
    form,
    typeIndex,
    remove,
  }: PropertyFormProps & {
    typeIndex: number;
    remove: UseFieldArrayRemove;
  }) {
    return (
      <FormField
        control={form.control}
        name={`types.${typeIndex}.value`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center justify-center gap-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={c?.["type"]?.["select your property type"]}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypes?.map((e, i) => {
                      // const Icon = Icons?.[e?.["icon"]] ?? null;
                      return (
                        <SelectItem
                          key={i}
                          value={e?.["value"]}
                          disabled={
                            !!form
                              ?.getValues("types")
                              ?.find((p) => p?.["value"] === e?.["value"])
                          }
                          className="flex items-center gap-2"
                        >
                          {/* {Icon && <Icon />}  */}

                          {e?.["label"]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(typeIndex)}
                >
                  <Icons.x />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
  title: ({
    dic: { "property-form": c },
    loading,
    form,
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.title`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.units`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["units"]?.["label"]}</FormLabel>
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.space`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.finishing`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.floors`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.rooms`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.bathrooms`}
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
  recipients: ({
    dic: { "property-form": c },
    loading,
    form,
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.recipients`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{c?.["recipients"]?.["label"]}</FormLabel>
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.garden`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.pool`}
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
    typeIndex,
    propertyIndex,
  }: PropertyFormProps & { typeIndex: number; propertyIndex: number }) => (
    <FormField
      control={form.control}
      name={`types.${typeIndex}.properties.${propertyIndex}.view`}
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

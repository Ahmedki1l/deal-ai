"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

type JsonEditorProps = {
  form: UseFormReturn<any, any, undefined>;
  data: any;
  path?: string;
};
export function JsonEditor({ form, data, path = "" }: JsonEditorProps) {
  // Function to delete a key from the JSON data
  function deleteKey(path: string) {
    const pathParts = path.split(".");
    const updatedData = { ...form.getValues() };
    let current = updatedData;

    // Traverse the object to the second last key
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (current[pathParts[i]] === undefined) {
        return; // If the path is invalid, exit the function
      }
      current = current[pathParts[i]];
    }

    // Remove the last key in the path
    const lastKey = pathParts[pathParts.length - 1];
    if (Array.isArray(current) && !isNaN(Number(lastKey))) {
      current.splice(Number(lastKey), 1); // Delete item from array
    } else {
      delete current[lastKey]; // Delete key from object
    }

    // Rebuild the updated values and reset the form
    form.reset({ ...updatedData });
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <div className="bord rtl:mr-2er-l-2 pl-2 ltr:ml-2">
        {Object.entries(data).map(([key, value]) => {
          // Create a new path for nested keys
          const newPath = (path ? [path, key] : [key])?.join(".");

          return (
            <div key={key} className="relative mb-2 flex items-start gap-2">
              <Label>{newPath}</Label>

              <JsonEditor form={form} data={value} path={newPath} />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-1 h-4 w-4 ltr:-left-1 rtl:-right-1"
                onClick={() => deleteKey(newPath)}
              >
                <Icons.x />
              </Button>
            </div>
          );
        })}
        <AddFieldWithType path={path} form={form} />
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <ul className="flex flex-col gap-2 ltr:ml-2 rtl:mr-2">
        {data.map((e, i) => {
          // Create a new path for each item in the array
          const newPath = [path, i]?.join(".");
          return (
            <div key={newPath} className="relative mb-2 flex items-start gap-2">
              <JsonEditor key={i} form={form} data={e} path={newPath} />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -left-1 -top-1 h-4 w-4"
                onClick={() => deleteKey(newPath)}
              >
                <Icons.x />
              </Button>
            </div>
          );
        })}

        <AddFieldWithType path={path} form={form} />
      </ul>
    );
  }

  // Render primitive values (string, number, boolean)
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="sr-only">{path}</FormLabel>
          <FormControl>
            <Input className="w-fit min-w-40" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const AddFieldWithType = ({
  form,
  path,
}: {
  form: UseFormReturn<any, any, undefined>;
  path: string;
}) => {
  // Function to add a new field to the JSON data
  function addField(selectedType: string) {
    const updatedData = { ...form.getValues() };
    const pathParts = path ? path.split(".") : [];
    let current = updatedData;

    // Traverse the object to the correct key
    for (let i = 0; i < pathParts.length; i++) {
      if (current[pathParts[i]] === undefined) {
        return; // If the path is invalid, exit the function
      }
      current = current[pathParts[i]];
    }

    const val = getNewFieldValueByType(selectedType);
    // Add a new field to the current object or array
    if (Array.isArray(current)) {
      current.push(val); // Add a new empty string to the array
    } else if (typeof current === "object" && current !== null) {
      current[`newKey${Object.keys(current).length + 1}`] = val; // Add a new key-value pair
    }

    // Update the form state
    form.reset({ ...updatedData });
  }

  // Function to return a new field value based on the selected type
  function getNewFieldValueByType(type: string) {
    switch (type) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "object":
        return {};
      case "array":
        return [];
      default:
        return "";
    }
  }

  return (
    <>
      <Select onValueChange={(v) => addField(v)}>
        <SelectTrigger>Add Item</SelectTrigger>
        <SelectContent>
          <SelectItem value="string">String</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="boolean">Boolean</SelectItem>
          <SelectItem value="object">Object</SelectItem>
          <SelectItem value="array">Array</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

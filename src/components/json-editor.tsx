"use client";

import { Icons } from "@/components/icons";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

  // Function to update a key in the JSON data
  function updateKey(oldPath: string, newKey: string) {
    const pathParts = oldPath.split(".");
    const updatedData = { ...form.getValues() };
    let current = updatedData;

    // Traverse the object to the second last key
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (current[pathParts[i]] === undefined) {
        return; // If the path is invalid, exit the function
      }
      current = current[pathParts[i]];
    }

    const lastKey = pathParts[pathParts.length - 1];
    const value = current[lastKey];

    // Update the key while preserving the order
    if (typeof current === "object" && !Array.isArray(current)) {
      const updatedObject = {};

      // Iterate over the original object's keys to rebuild with the updated key
      for (const key in current) {
        if (key === lastKey) {
          // Replace the old key with the new one
          // @ts-ignore
          updatedObject[newKey] = value;
        } else {
          // Keep other keys unchanged
          // @ts-ignore
          updatedObject[key] = current[key];
        }
      }

      // Assign the rebuilt object to the current object
      Object.keys(current).forEach((key) => delete current[key]);
      Object.assign(current, updatedObject);
    }

    // Rebuild the updated values and reset the form
    form.reset({ ...updatedData });
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return (
      <div className="flex flex-col gap-2 first:border-none ltr:border-l-2 ltr:pl-2 rtl:border-r-2 rtl:pr-2">
        {Object.entries(data).map(([key, value]) => {
          // Create a new path for nested keys
          const newPath = (path ? [path, key] : [key])?.join(".");

          return (
            <div key={key} className="relative my-2 flex items-start gap-2">
              <Input
                defaultValue={key}
                onBlur={(e) => {
                  const newKey = e?.["target"]?.["value"];
                  if (newKey && newKey !== key) updateKey(newPath, newKey);
                }}
                className="w-fit min-w-20 bg-muted"
              />

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
      <ul className="flex flex-col gap-2 border-red-400 ltr:ml-6 ltr:border-l-2 ltr:pl-2 rtl:mr-6 rtl:border-r-2 rtl:pr-2">
        {data.map((e, i) => {
          // Create a new path for each item in the array
          const newPath = [path, i]?.join(".");
          return (
            <li key={newPath} className="relative mb-2 flex items-center gap-2">
              <JsonEditor key={i} form={form} data={e} path={newPath} />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 ltr:-left-2 rtl:-right-2"
                onClick={() => deleteKey(newPath)}
              >
                <Icons.x />
              </Button>
            </li>
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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div>
            <Tooltip text="add item">
              <Icons.add />
            </Tooltip>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>New Field Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            { value: "string", label: "String" },
            { value: "number", label: "Number" },
            { value: "boolean", label: "Boolean" },
            { value: "object", label: "Object" },
            { value: "array", label: "Array" },
          ].map((e, i) => (
            <DropdownMenuItem key={i} onClick={() => addField(e?.["value"])}>
              {e?.["label"]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

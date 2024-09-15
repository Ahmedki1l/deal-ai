"use client";

import { DataTable, DataTableProps } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Link } from "@/components/link";
import {
  PropertyBinButton,
  PropertyBinButtonProps,
} from "@/components/property-bin-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/types/locale";
import { Property } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type PropertyColumnType = Property;
type PropertyTableProps = {
  data: PropertyColumnType[];
  disabled?: boolean;
} & Pick<DataTableProps<any, any>, "dic"> &
  Pick<PropertyBinButtonProps, "dic"> &
  Dictionary["dashboard"];

export function PropertyTable({
  dic: {
    dashboard: {
      user: {
        projects: {
          project: {
            properties: { table: c },
          },
        },
      },
    },
    ...dic
  },
  data,
  disabled,
}: PropertyTableProps) {
  return (
    <DataTable
      dic={dic}
      data={data}
      columns={
        [
          {
            accessorKey: "title",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["name"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["projectId"]}/properties/${r?.["id"]}`}
                className={buttonVariants({
                  variant: "link",
                  className: "flex-col items-start justify-start",
                })}
              >
                <CardTitle>{r?.["title"]}</CardTitle>
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "units",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["units"]}
              />
            ),
          },
          {
            accessorKey: "type",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["type"]}
              />
            ),
          },
          {
            accessorKey: "space",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["space"]}
              />
            ),
          },
          {
            accessorKey: "finishing",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["finishing"]}
              />
            ),
          },
          {
            accessorKey: "floors",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["floors"]}
              />
            ),
          },
          {
            accessorKey: "rooms",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["rooms"]}
              />
            ),
          },
          {
            accessorKey: "bathrooms",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["bathrooms"]}
              />
            ),
          },
          {
            accessorKey: "receptions",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["receptions"]}
              />
            ),
          },
          {
            accessorKey: "garden",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["garden"]}
              />
            ),
          },
          {
            accessorKey: "pool",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["pool"]}
              />
            ),
          },
          {
            accessorKey: "view",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["view"]}
              />
            ),
          },
          {
            id: "actions",
            cell: ({ row: { original: r } }) => {
              return (
                <>
                  <DataTableRowActions dic={dic}>
                    {/* <PropertyUpdateButton disabled={disabled} dic={dic} asChild caseStudy={r}>
                      <Button disabled={disabled}
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["edit"]}
                      </Button>
                    </PropertyUpdateButton> */}
                    <DropdownMenuSeparator />

                    <PropertyBinButton
                      disabled={disabled}
                      dic={dic}
                      asChild
                      property={r}
                    >
                      <Button
                        disabled={disabled}
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </PropertyBinButton>
                  </DataTableRowActions>
                </>
              );
            },
          },
        ] as ColumnDef<PropertyColumnType>[]
      }
    />
  );
}

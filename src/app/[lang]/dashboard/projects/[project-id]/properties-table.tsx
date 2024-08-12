"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Link } from "@/components/link";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { PropertyDeleteButton } from "@/components/property-delete-button";

import { Property, Post } from "@prisma/client";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Dictionary } from "@/types/locale";
import { DataTable } from "@/components/data-table";

type PropertyColumnType = Property;
type PropertyTableProps = {
  data: PropertyColumnType[];
} & Dictionary["data-table"] &
  Dictionary["data-table-column-header"] &
  Dictionary["data-table-pagination"] &
  Dictionary["data-table-view-options"] &
  Dictionary["property-delete-button"] &
  Dictionary["property-form"] &
  Dictionary["dialog"] &
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
            accessorKey: "recipients",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["recipients"]}
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
                  <DataTableRowActions>
                    {/* <PropertyUpdateForm property={r}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 text-start font-normal"
                    >
                      Edit
                    </Button>
                  </PropertyUpdateForm> */}

                    <PropertyDeleteButton dic={dic} asChild property={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </PropertyDeleteButton>
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

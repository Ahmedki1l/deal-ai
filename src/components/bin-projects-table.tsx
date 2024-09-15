"use client";

import { DataTable, DataTableProps } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Link } from "@/components/link";
import {
  ProjectDeleteButton,
  ProjectDeleteButtonProps,
} from "@/components/project-delete-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/types/locale";
import { Project } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ProjectRestoreButton,
  ProjectRestoreButtonProps,
} from "./project-restore-button";

type ColumnType = Project;

type BinProjectsTableProps = {
  data: ColumnType[];
} & Pick<DataTableProps<any, any>, "dic"> &
  Pick<ProjectDeleteButtonProps, "dic"> &
  Pick<ProjectRestoreButtonProps, "dic"> &
  Dictionary["dashboard"];

export function BinProjectsTable({
  dic: {
    dashboard: {
      user: {
        projects: { table: c },
      },
    },
    ...dic
  },
  data,
}: BinProjectsTableProps) {
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
                title={c?.["project"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["id"]}`}
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
            accessorKey: "deletedAt",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["deletedAt"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <div className="flex items-center gap-2">
                {new Date(r?.["deletedAt"]!)?.toLocaleDateString()}
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            id: "actions",
            cell: ({ row: { original: r } }) => {
              return (
                <>
                  <DataTableRowActions dic={dic}>
                    <ProjectRestoreButton dic={dic} project={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["restore"]}
                      </Button>
                    </ProjectRestoreButton>
                    <DropdownMenuSeparator />

                    <ProjectDeleteButton dic={dic} asChild project={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </ProjectDeleteButton>
                  </DataTableRowActions>
                </>
              );
            },
          },
        ] as ColumnDef<ColumnType>[]
      }
    />
  );
}

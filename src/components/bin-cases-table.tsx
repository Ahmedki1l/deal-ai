"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { CaseStudy } from "@prisma/client";
import { Link } from "@/components/link";
import { CaseStudyDeleteButton } from "@/components/case-study-delete-button";
import { CardTitle } from "@/components/ui/card";
import { Dictionary } from "@/types/locale";
import { DataTable } from "@/components/data-table";
import { CaseStudyRestoreButton } from "@/components/case-study-restore-button";

type ColumnType = Pick<CaseStudy, "id" | "projectId" | "title" | "deletedAt">;

type BinCasesTableProps = {
  data: ColumnType[];
} & Dictionary["data-table"] &
  Dictionary["data-table-column-header"] &
  Dictionary["data-table-pagination"] &
  Dictionary["data-table-view-options"] &
  Dictionary["dialog"] &
  Dictionary["case-study-restore-button"] &
  Dictionary["case-study-delete-button"] &
  Dictionary["case-study-form"] &
  Dictionary["dashboard"];

export function BinCasesTable({
  dic: {
    dashboard: {
      user: {
        projects: {
          project: {
            cases: { table: c },
          },
        },
      },
    },
    ...dic
  },
  data,
}: BinCasesTableProps) {
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
                href={`/dashboard/projects/${r?.["projectId"]}/cases/${r?.["id"]}`}
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
                  <DataTableRowActions>
                    <CaseStudyRestoreButton dic={dic} caseStudy={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["restore"]}
                      </Button>
                    </CaseStudyRestoreButton>
                    <DropdownMenuSeparator />

                    <CaseStudyDeleteButton dic={dic} asChild caseStudy={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </CaseStudyDeleteButton>
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

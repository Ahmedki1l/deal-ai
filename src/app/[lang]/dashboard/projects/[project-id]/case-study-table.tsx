"use client";

import {
  CaseStudyBinButton,
  CaseStudyBinButtonProps,
} from "@/components/case-study-bin-button";
import {
  CaseStudyUpdateForm,
  CaseStudyUpdateFormProps,
} from "@/components/case-study-update-form";
import { DataTable, DataTableProps } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Icons } from "@/components/icons";
import { Link } from "@/components/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/types/locale";
import { CaseStudy, Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type CaseStudyColumnType = CaseStudy & { posts: Post[] };
type CaseStudyTableProps = {
  data: CaseStudyColumnType[];
  disabled?: boolean;
} & Pick<DataTableProps<any, any>, "dic"> &
  Pick<CaseStudyUpdateFormProps, "dic"> &
  Pick<CaseStudyBinButtonProps, "dic"> &
  Dictionary["dashboard"];

export function CaseStudyTable({
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
  disabled,
}: CaseStudyTableProps) {
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
            accessorKey: "name",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["study case"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["id"]}`}
                className={buttonVariants({ variant: "link" })}
              >
                {r?.["content"] ? <Icons.check /> : <Icons.x />}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "name",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["target audience"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["id"]}`}
                className={buttonVariants({ variant: "link" })}
              >
                {r?.["targetAudience"] ? <Icons.check /> : <Icons.x />}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "name",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["posts"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["id"]}`}
                className={buttonVariants({ variant: "link" })}
              >
                {r?.["posts"]?.["length"]}
              </Link>
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
                    <CaseStudyUpdateForm
                      disabled={disabled}
                      dic={dic}
                      asChild
                      caseStudy={r}
                    >
                      <Button
                        disabled={disabled}
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["edit"]}
                      </Button>
                    </CaseStudyUpdateForm>
                    <DropdownMenuSeparator />

                    <CaseStudyBinButton
                      disabled={disabled}
                      dic={dic}
                      asChild
                      caseStudy={r}
                    >
                      <Button
                        disabled={disabled}
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </CaseStudyBinButton>
                  </DataTableRowActions>
                </>
              );
            },
          },
        ] as ColumnDef<CaseStudyColumnType>[]
      }
    />
  );
}

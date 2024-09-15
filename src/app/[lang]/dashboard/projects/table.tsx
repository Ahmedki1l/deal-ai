"use client";

import { DataTable, DataTableProps } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Icons } from "@/components/icons";
import { Link } from "@/components/link";
import {
  ProjectBinButton,
  ProjectBinButtonProps,
} from "@/components/project-bin-button";
import {
  ProjectUpdateForm,
  ProjectUpdateFormProps,
} from "@/components/project-update-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { platforms } from "@/db/enums";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { CaseStudy, Platform, Post, Project, Property } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type ColumnType = Project & {
  caseStudy: (CaseStudy & { posts: Post[] })[];
  properties: Property[];
  platforms: Platform[];
};

type TableProps = {
  data: ColumnType[];
} & Pick<DataTableProps<any, any>, "dic"> &
  Pick<ProjectBinButtonProps, "dic"> &
  Pick<ProjectUpdateFormProps, "dic"> &
  Dictionary["dashboard"];

export function Table({
  dic: {
    dashboard: {
      user: {
        projects: { table: c },
      },
    },
    ...dic
  },
  data,
}: TableProps) {
  const lang = useLocale();
  //   const router = useRouter();
  //   const [open, setOpen] = useState<boolean>(false);

  // async function onClickDeleteEvent(row: SelectEvent) {
  //   toast.promise(
  //     fetcher<null>(`/api/stores/${row?.["storeId"]}/projects/${row?.["id"]}`, {
  //       method: "DELETE",
  //     }),
  //     {
  //       error: (err) => t(err?.["message"], lang),
  //       loading: `Deleting ${row?.["title"]} ...`,
  //       success: (data) => {
  //         router.refresh();
  //         return "Event has been deleted successfully.";
  //       },
  //     }
  //   );
  // }

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
                {/* <CardDescription>
                {[r?.["distinct"], r?.["city"], r?.["country"]].join(", ")}
              </CardDescription> */}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "caseStudy",
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
                {r?.["caseStudy"]?.["length"] ? <Icons.check /> : <Icons.x />}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "caseStudy",
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
                {r?.["caseStudy"]?.["length"] ? <Icons.check /> : <Icons.x />}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "properties",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["properties"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <Link
                href={`/dashboard/projects/${r?.["id"]}`}
                className={buttonVariants({ variant: "link" })}
              >
                {r?.["properties"]?.["length"]}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "caseStudy",
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
                {r?.["caseStudy"]?.reduce(
                  (acc, e) => acc + e?.["posts"]?.["length"],
                  0,
                )}
              </Link>
            ),
            enableSorting: false,
            enableHiding: false,
          },
          {
            accessorKey: "platforms",
            header: ({ column }) => (
              <DataTableColumnHeader
                dic={dic}
                column={column}
                title={c?.["platforms"]}
              />
            ),
            cell: ({ row: { original: r } }) => (
              <div className="flex items-center gap-2">
                {r?.["platforms"]?.map((e, i) => {
                  const p = platforms(lang).find(
                    (p) => p?.["value"] === e?.["value"],
                  );
                  if (!p) return "---";

                  const Icon = Icons?.[p?.["icon"]] ?? null;

                  return <Icon key={i} />;
                })}
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
                    <ProjectUpdateForm dic={dic} asChild project={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["edit"]}
                      </Button>
                    </ProjectUpdateForm>
                    <DropdownMenuSeparator />

                    <ProjectBinButton dic={dic} asChild project={r}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-2 text-start font-normal"
                      >
                        {c?.["delete"]}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </Button>
                    </ProjectBinButton>
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

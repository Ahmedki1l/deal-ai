"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SelectItem } from "@/types";
import { Icons } from "@/components/icons";
import { useSelectedLayoutSegment } from "next/navigation";
import { Link } from "@/components/link";
import { Tooltip } from "./tooltip";

type SideNavProps = {
  isCollapsed: boolean;
  links: SelectItem[];
};

export function SideNav({ links, isCollapsed }: SideNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, i) => {
          const Icon = link?.["icon"] ? Icons?.[link?.["icon"]!] : null;

          return isCollapsed ? (
            <Tooltip
              key={i}
              side="right"
              className="flex items-center gap-4"
              text={
                <>
                  {link?.["label"]}
                  {link?.["indicator"] && (
                    <span className="ml-auto text-muted-foreground">
                      {link?.["indicator"]}
                    </span>
                  )}
                </>
              }
            >
              <Link
                href={link?.["value"]}
                className={cn(
                  buttonVariants({
                    variant:
                      segment === link?.["segment"] ? "default" : "ghost",
                    size: "icon",
                  }),
                  "h-9 w-9",

                  segment === link?.["segment"] &&
                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                )}
              >
                {Icon && <Icon />}
                <span className="sr-only">{link?.["label"]}</span>
              </Link>
            </Tooltip>
          ) : (
            <Link
              key={i}
              href={link?.["value"]}
              className={cn(
                buttonVariants({
                  variant: segment === link?.["segment"] ? "default" : "ghost",
                  size: "sm",
                }),

                segment === link?.["segment"] &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              {Icon && <Icon />}
              {link?.["label"]}
              {link?.["indicator"] && (
                <span
                  className={cn(
                    "ml-auto",

                    segment === link?.["segment"] &&
                      "text-background dark:text-white",
                  )}
                >
                  {link?.["indicator"]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import { Link } from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { usePathname } from "next/navigation";

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: NavItem[];
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item, i) => (
        <Link
          key={i}
          href={item?.["value"]}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.endsWith(item?.["value"])
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item?.["label"]}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SideNav } from "@/components/side-nav";
import { SelectItem } from "@/types";
import { useState } from "react";
import { User } from "@/types/db";
import { Avatar } from "@/components/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/users";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { t } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";
import { Dictionary } from "@/types/locale";
import { LocaleSwitcher } from "./locale-switcher";
import { Tooltip } from "./tooltip";

type DashboardLayoutProps = {
  user: User;
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  links: {
    top?: SelectItem[][];
    bottom?: SelectItem[][];
  };
} & Dictionary["dashboard-layout"] &
  Dictionary["locale-switcher"];

export function DashboardLayout({
  dic: { "dashboard-layout": c, ...dic },
  user,
  links,
  children,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = true,
  navCollapsedSize,
}: DashboardLayoutProps) {
  const lang = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes,
        )}`;
      }}
      className="items-stretch"
    >
      <div className="bg-card">
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            if (!isCollapsed) {
              setIsCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true,
              )}`;
            }
          }}
          onExpand={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false,
              )}`;
            }
          }}
          className={cn(
            "flex h-screen min-w-[200px] max-w-[250px] flex-col justify-between transition-all duration-300 ease-in-out",
            isCollapsed && "min-w-[50px]",
          )}
        >
          <div
            className={cn(
              "container flex items-center justify-center px-4 py-5 transition-all duration-300 ease-in-out",
              isCollapsed && "h-[55px] px-2",
            )}
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-5 text-center",
                isCollapsed &&
                  buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className: "h-9 w-9 shrink-0 rounded-full p-0",
                  }),
              )}
            >
              {isCollapsed ? (
                <Icons.logo />
              ) : (
                <Icons.fullLogo className="h-auto w-auto" />
              )}
            </div>
          </div>

          <div>
            {links?.["top"]?.map((links, i) => (
              <div key={i}>
                <Separator />
                <SideNav isCollapsed={isCollapsed} links={links} />
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col justify-end pb-4 pt-10">
            <div
              className={cn(
                "container flex items-center justify-center px-4 py-5 transition-all duration-300 ease-in-out",
                isCollapsed && "h-[55px] px-2",
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-5 text-center",
                  isCollapsed &&
                    buttonVariants({
                      variant: "outline",
                      size: "icon",
                      className: "h-9 w-9 shrink-0 rounded-full p-0",
                    }),
                )}
              >
                <Card className="w-full">
                  <CardHeader className="flex w-full flex-col items-center justify-center gap-4">
                    <div className="flex w-full items-center justify-center gap-3">
                      <Avatar
                        user={user}
                        className={cn(
                          "aspect-square h-12 w-12",
                          isCollapsed && "h-7 w-7",
                        )}
                        icon={{
                          name: "user",
                          className: isCollapsed ? "w-3 h-3" : "w-5 h-5",
                        }}
                      />
                    </div>
                    {!isCollapsed && (
                      <div className="text-sm">
                        {!isCollapsed && (
                          <CardTitle>{user?.["name"]}</CardTitle>
                        )}
                        <CardDescription className="tuncate line-clamp-1">
                          {user?.["email"]}
                        </CardDescription>
                        <LocaleSwitcher dic={dic} />
                      </div>
                    )}
                  </CardHeader>
                </Card>
              </div>
            </div>

            {links?.["bottom"]?.map((links, i) => (
              <div key={i}>
                <Separator className="first:hidden last:hidden" />
                <SideNav isCollapsed={isCollapsed} links={links} />
              </div>
            ))}

            <div className="px-2">
              {isCollapsed ? (
                <Tooltip
                  text={c?.["logout"]}
                  side="right"
                  className="flex items-center gap-4"
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "mx-auto w-full",
                      !isCollapsed && "justify-start",
                    )}
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      toast.promise(logout, {
                        finally: () => setLoading(false),
                        error: async (err) => {
                          const msg = await t(err?.["message"], lang);

                          return msg;
                        },
                      });
                    }}
                    size={isCollapsed ? "icon" : "sm"}
                  >
                    {loading ? (
                      <Icons.spinner />
                    ) : (
                      <Icons.logout className="rotate-180" />
                    )}
                    {!isCollapsed && <span>{c?.["logout"]}</span>}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "mx-auto w-full",
                    !isCollapsed && "justify-start",
                  )}
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    toast.promise(logout, {
                      error: (err) => {
                        setLoading(false);
                        return err?.["message"];
                      },
                    });
                  }}
                  size={isCollapsed ? "icon" : "sm"}
                >
                  {loading ? (
                    <Icons.spinner />
                  ) : (
                    <Icons.logout className="rotate-180" />
                  )}
                  {!isCollapsed && <span>{c?.["logout"]}</span>}
                </Button>
              )}
            </div>
          </div>
        </ResizablePanel>
      </div>
      <ResizableHandle withHandle />
      <div className="flex-1 overflow-y-auto">
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {children}
        </ResizablePanel>
      </div>
    </ResizablePanelGroup>
  );
}

"use client";

import { logout } from "@/actions/users";
import { Icons } from "@/components/icons";
import { SideNav } from "@/components/side-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { clientAction, cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dictionary } from "@/types/locale";
import { User } from "lucia";
import { useState } from "react";
import { Avatar } from "./avatar";
import { Link } from "./link";
import { LocaleSwitcher, LocaleSwitcherProps } from "./locale-switcher";
import { ModeToggler, ModeTogglerProps } from "./mode-toggler";
import { Tooltip } from "./tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type ResizableLayoutProps = {
  user: User;
  children: React.ReactNode;
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  links: {
    top?: NavItem[][];
    bottom?: NavItem[][];
  };
} & Dictionary["resizeable-layout"] &
  Pick<LocaleSwitcherProps, "dic"> &
  Pick<ModeTogglerProps, "dic">;

export function ResizableLayout({
  dic: { "resizeable-layout": c, ...dic },
  user,
  links,
  children,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = true,
  navCollapsedSize,
}: ResizableLayoutProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    defaultCollapsed ?? false,
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="relative flex h-screen w-full flex-col dark:bg-[#121212]"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes,
        )}`;
      }}
    >
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
          "flex h-screen min-w-[200px] max-w-[250px] flex-col justify-between bg-muted transition-all duration-300 ease-in-out dark:bg-card",
          isCollapsed && "min-w-[50px]",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Account Switcher */}
          <Link href="/dashboard" className="flex items-center">
            <div
              className={cn(
                "container my-1 flex flex-col items-center justify-center py-4",
                isCollapsed &&
                  buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className:
                      "h-9 w-9 shrink-0 rounded-none border-none p-0 shadow-none",
                  }),
              )}
            >
              {isCollapsed ? (
                <Icons.logo />
              ) : (
                <Icons.fullLogo className="h-auto w-auto" />
              )}
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex flex-1 flex-col justify-between gap-10">
            <div>
              {links?.["top"]?.map((links, i) => (
                <div key={i}>
                  <Separator />
                  <SideNav isCollapsed={isCollapsed} links={links} />
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col justify-end gap-4 pb-4 pt-10">
              {isCollapsed ? (
                <Tooltip text={user?.["name"]} side="right">
                  <Card className="mx-auto flex w-fit items-center justify-center rounded-full">
                    <Avatar
                      user={user}
                      className="aspect-square h-7 w-7"
                      icon={{
                        name: "user",
                        className: "w-5 h-5",
                      }}
                    />
                  </Card>
                </Tooltip>
              ) : (
                <div
                  className={cn(
                    "container px-4 py-5 transition-all duration-300 ease-in-out",
                  )}
                >
                  <Card className="w-full border-none bg-transparent shadow-none">
                    <CardHeader className="flex w-full flex-col items-center justify-center gap-4">
                      <div className="flex w-full items-center justify-center gap-3">
                        <Avatar
                          user={user}
                          className={cn("aspect-square h-12 w-12")}
                          icon={{
                            name: "user",
                            className: "w-5 h-5",
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center text-sm">
                      <CardTitle>{user?.["name"]}</CardTitle>
                      <CardDescription className="tuncate line-clamp-1">
                        {user?.["email"]}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="items-center justify-center gap-2">
                      <LocaleSwitcher dic={dic} />
                      <ModeToggler dic={dic} />
                    </CardFooter>
                  </Card>
                </div>
              )}

              {isCollapsed ? (
                <>
                  <Tooltip
                    text={dic?.["mode-toggle"]?.["toggle theme"]}
                    side="right"
                  >
                    <Card className="mx-auto flex w-fit items-center justify-center rounded-full">
                      <ModeToggler dic={dic} />
                    </Card>
                  </Tooltip>

                  <Tooltip
                    text={dic?.["locale-switcher"]?.["change language"]}
                    side="right"
                  >
                    <Card className="mx-auto flex w-fit items-center justify-center rounded-full">
                      <LocaleSwitcher dic={dic} />
                    </Card>
                  </Tooltip>
                </>
              ) : null}

              {links?.["bottom"]?.map((links, i) => (
                <div key={i}>
                  <Separator />
                  <SideNav isCollapsed={false} links={links} />
                </div>
              ))}

              <div className="p-2">
                {isCollapsed ? (
                  <Tooltip
                    text={c?.["logout"]}
                    side="right"
                    className="flex items-center gap-4"
                  >
                    <Button
                      variant="ghost"
                      className="mx-auto w-full"
                      disabled={loading}
                      onClick={async () => {
                        await clientAction(
                          async () => await logout(),
                          setLoading,
                        );
                      }}
                      size="icon"
                    >
                      {loading ? (
                        <Icons.spinner />
                      ) : (
                        <Icons.logout className="rotate-180" />
                      )}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    variant="ghost"
                    className="mx-auto w-full justify-start"
                    disabled={loading}
                    onClick={async () => {
                      await clientAction(
                        async () => await logout(),
                        setLoading,
                      );
                    }}
                    size="sm"
                  >
                    {loading ? (
                      <Icons.spinner />
                    ) : (
                      <Icons.logout className="rotate-180" />
                    )}
                    <span>{c?.["logout"]}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <div className="flex h-screen flex-col overflow-auto">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nav";

type SettingsLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <div className="flex-1">
      <div className="container flex max-w-screen-lg flex-1 flex-col gap-6 py-6">
        <div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>

          <Separator className="my-6" />
        </div>
        <div className="container flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav
              items={[
                {
                  title: "Profile",
                  href: "/dashboard/settings",
                },
                {
                  title: "Accounts",
                  href: "/dashboard/settings/accounts",
                },
                {
                  title: "Bin",
                  href: "/dashboard/settings/bin",
                },
              ]}
            />
          </aside>
          <Separator className="my-6 lg:hidden" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

import { SidebarNav } from "@/components/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";

type SettingsLayoutProps = Readonly<{
  children: React.ReactNode;
  params: LocaleProps;
}>;

export default async function SettingsLayout({
  children,
  params: { lang },
}: SettingsLayoutProps) {
  const {
    dashboard: {
      user: { settings: c },
    },
    ...dic
  } = await getDictionary(lang);
  return (
    <div className="flex-1">
      <div className="container flex max-w-screen-lg flex-1 flex-col gap-6 py-6">
        <div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {c?.["settings"]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {
                c?.[
                  "manage your account details, privacy settings, and how others perceive you on the platform."
                ]
              }
            </p>
          </div>

          <Separator className="my-6" />
        </div>
        <div className="container flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={c?.["main-nav"]} />
          </aside>
          <Separator className="my-2 lg:hidden" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

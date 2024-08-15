import { Metadata } from "next";
import { getAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { LocaleProps } from "@/types/locale";
import { getDictionary } from "@/lib/dictionaries";
import { UserProfilePersonalForm } from "@/components/user-profile-personal-form";
import { UserProfilePasswordForm } from "@/components/user-profile-password-form";

type SettingsProps = Readonly<{
  params: LocaleProps;
}>;

export const metadata: Metadata = { title: "Settings" };
export default async function Settings({ params: { lang } }: SettingsProps) {
  const {
    dashboard: {
      user: {
        settings: { profile: c },
      },
    },
    ...dic
  } = await getDictionary(lang);
  const user = (await getAuth())?.["user"]!;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["profile"]}</h3>
        <p className="text-sm text-muted-foreground">
          {c?.["this is how others will see you on the site."]}
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        <UserProfilePersonalForm dic={dic} user={user} />
        <UserProfilePasswordForm dic={dic} user={user} />
      </div>
    </div>
  );
}

import { getAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

// import {
//   DeleteAccountForm,
//   PersonalInforForm,
// } from "@/components/settings-profile-form";

export default async function Settings() {
  const user = (await getAuth())?.["user"]!;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        {/* <PersonalInforForm user={user} />
        <DeleteAccountForm user={user} /> */}
      </div>
    </div>
  );
}

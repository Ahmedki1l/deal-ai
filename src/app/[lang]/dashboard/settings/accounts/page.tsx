import { getAuth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

export default async function Settings() {
  const user = (await getAuth())?.["user"]!;
  // const specialties = await db.query.specialties.findMany({});
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />

      <div className="space-y-10">
        {/* <DoctorForm user={user} specialties={specialties} /> */}
      </div>
    </div>
  );
}

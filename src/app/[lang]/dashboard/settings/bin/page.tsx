import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import React from "react";

type BinProps = Readonly<{}>;

export const metadata: Metadata = { title: "Bin" };
export default async function Bin({}: BinProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Bin</h3>
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

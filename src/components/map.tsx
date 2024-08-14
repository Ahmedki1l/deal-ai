import * as React from "react";
import { Project } from "@prisma/client";

export type MapProps = {} & Pick<Project, "distinct" | "city" | "country">;
export function Map({
  // dic: { dialog: c },
  distinct,
  city,
  country,
  ...props
}: MapProps) {
  return (
    <div className="h-60 bg-muted">{[distinct, city, country].join(", ")}</div>
  );
}

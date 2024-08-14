"use client";
import * as React from "react";
import { Project } from "@prisma/client";
import { Loader } from "@googlemaps/js-api-loader";

export type MapProps = {} & Pick<Project, "distinct" | "city" | "country">;
export function Map({
  // dic: { dialog: c },
  distinct,
  city,
  country,
  ...props
}: MapProps) {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const position = {
        lat: 43.642693,
        lng: -79.3871189,
      };

      // map options
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: "MY_NEXT_MAP_ID",
      };
      const map = new Map(mapRef?.["current"]! as HTMLDivElement, mapOptions);
      const marker = new AdvancedMarkerElement({
        map,
        position,
      });
    };

    initMap();
  }, []);

  return <div ref={mapRef} className="h-60 bg-muted" />;
}

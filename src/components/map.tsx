"use client";

import { useGoogleMaps } from "@/hooks/use-google-map";
import { Project } from "@prisma/client";
import * as React from "react";
import { useFormContext } from "react-hook-form";

export type MapProps = {} & Pick<Project, "distinct" | "city" | "country">;
export function Map({ distinct, city, country, ...props }: MapProps) {
  const { loader } = useGoogleMaps();
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (loader) {
      loader?.load()?.then((google) => {
        const fullAddress = `${distinct}, ${city}, ${country}`;
        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 13,
        });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === "OK" && results![0]) {
            const position = results![0].geometry.location;

            map.setCenter(position);
            new google.maps.Marker({
              map,
              position,
              title: fullAddress, // Tooltip for the marker
            });
          } else {
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
          }
        });
      });
    }
  }, [loader, distinct, city, country]); // Reinitialize the map if location props change

  return <div ref={mapRef} className="h-60 w-full bg-muted"></div>;
}

export const MapPicker = () => {
  const { loader } = useGoogleMaps();
  const mapRef = React.useRef<HTMLDivElement>(null);
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const { setValue, clearErrors, getValues } = useFormContext();

  React.useEffect(() => {
    if (loader) {
      loader?.load()?.then((google) => {
        const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh, Saudi Arabia
        const initMap = (center: { lat: number; lng: number }) => {
          const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
            center,
            zoom: 12,
          });

          if (getValues("map")) {
            // Set a new marker
            const marker = new google.maps.Marker({
              position: JSON.parse(getValues("map")),
              map,
              title: "Selected Location",
            });
            markerRef.current = marker;
          }

          map.addListener("click", (mapsMouseEvent: { latLng: any }) => {
            // Remove the existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Reverse Geocoding
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: mapsMouseEvent.latLng },
              (results, status) => {
                if (status === "OK" && results![0]) {
                  const addressComponents = results?.find(
                    (result) =>
                      (result.types.includes("locality") &&
                        result.types.includes("political") &&
                        result.address_components.length === 3) ||
                      (result.types.includes("administrative_area_level_2") &&
                        result.types.includes("political") &&
                        result.address_components.length === 3)
                  )?.address_components;

                  if (addressComponents) {
                    const district = addressComponents[0]?.long_name;
                    const city = addressComponents[1]?.long_name;
                    const country = addressComponents[2]?.long_name;

                    clearErrors("distinct");
                    clearErrors("city");
                    clearErrors("country");

                    setValue("distinct", district ?? "");
                    setValue("city", city ?? "");
                    setValue("country", country ?? "");
                    setValue(
                      "map",
                      JSON.stringify(mapsMouseEvent.latLng ?? "")
                    );

                    // Set a new marker
                    const marker = new google.maps.Marker({
                      position: mapsMouseEvent.latLng,
                      map,
                      title: "Selected Location",
                    });
                    markerRef.current = marker;
                  }
                }
              }
            );
          });
        };

        // Attempt to fetch user's current location
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // User's location is obtained successfully
              initMap({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              // Fallback to default if geolocation fails or is denied
              initMap(defaultCenter);
            }
          );
        } else {
          // Geolocation isn't available or failed, use default
          initMap(defaultCenter);
        }
      });
    }
  }, [loader, setValue]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};

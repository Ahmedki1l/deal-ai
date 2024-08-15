"use client";
import * as React from "react";
import { Project } from "@prisma/client";
import { Loader } from "@googlemaps/js-api-loader";
import { useFormContext } from "react-hook-form";

export type MapProps = {} & Pick<Project, "distinct" | "city" | "country">;
export function Map({
  // dic: { dialog: c },
  distinct,
  city,
  country,
  ...props
}: MapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const initMap = async () => {
      // Build the full address from parts
      const fullAddress = `${distinct}, ${city}, ${country}`;
      console.log("Google Maps API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
        version: "weekly",
      });

      const google = await loader.load();
      const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
        zoom: 15, // Default zoom
      });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results![0]) {
          const position = results![0].geometry.location;

          map.setCenter(position);
          new google.maps.Marker({
            map,
            position,
            title: fullAddress, // Tooltip for the marker
          });
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    initMap();
  }, [distinct, city, country]); // Reinitialize the map if location props change

  return <div ref={mapRef} className="h-60 w-full bg-muted"></div>;
}

export const MapPicker = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const { setValue } = useFormContext();

  React.useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ["places"],
    });

    loader.load().then((google) => {
      const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Default to Los Angeles

      const initMap = (center: { lat: number; lng: number; }) => {
        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center,
          zoom: 12,
        });

        map.addListener("click", (mapsMouseEvent: { latLng: any; }) => {
          // Remove the existing marker
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Reverse Geocoding
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: mapsMouseEvent.latLng }, (results, status) => {
            if (status === "OK" && results![0]) {
              const addressComponents = results?.find(result => 
                (result.types.includes('locality') && result.types.includes('political') && result.address_components.length === 3)||
                (result.types.includes('administrative_area_level_2') && result.types.includes('political') && result.address_components.length === 3)
              )?.address_components;

              if (addressComponents) {
                const district = addressComponents[0]?.long_name;
                const city = addressComponents[1]?.long_name;
                const country = addressComponents[2]?.long_name;

                setValue("distinct", district || '');
                setValue("city", city || '');
                setValue("country", country || '');

                // Set a new marker
                const marker = new google.maps.Marker({
                  position: mapsMouseEvent.latLng,
                  map,
                  title: "Selected Location"
                });
                markerRef.current = marker;
              }
            }
          });
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
  }, [setValue]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
};


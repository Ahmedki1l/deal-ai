import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";

export const useGoogleMaps = () => {
  const [loader, setLoader] = useState<Loader | null>(null);

  useEffect(() => {
    if (!loader) {
      const newLoader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
        version: "weekly",
      });

      setLoader(newLoader);
    }
  }, [loader]);

  return { loader };
};

import { SelectItem } from "@/types";
import { getEnumArray } from "@/db/utils";
import {
  PROPERTY_TYPE,
  PLATFORM,
  POST_CAMPAIGN,
  POST_CONTENT_LENGTH,
} from "@prisma/client";
import { Icons } from "@/components/icons";

export const platformsArr = getEnumArray<PLATFORM>(PLATFORM);
export const propertyTypesArr = getEnumArray<PROPERTY_TYPE>(PROPERTY_TYPE);
export const postCampaignArr = getEnumArray<POST_CAMPAIGN>(POST_CAMPAIGN);
export const postContentLengthArr =
  getEnumArray<POST_CONTENT_LENGTH>(POST_CONTENT_LENGTH);

export const platforms = platformsArr.map(
  (e) =>
    ({
      value: e,
      label: e
        .split("_")
        .map((e) => `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`)
        .join(" "),
      icon: e?.toLowerCase() as keyof typeof Icons, // already satisfied
    }) satisfies SelectItem,
);
export const propertyTypes = propertyTypesArr.map(
  (e) =>
    ({
      value: e,
      label: e
        .split("_")
        .map((e) => `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`)
        .join(" "),
    }) satisfies SelectItem,
);
export const postCampaigns = postCampaignArr.map(
  (e) =>
    ({
      value: e,
      label: e
        .split("_")
        .map((e) => `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`)
        .join(" "),
    }) satisfies SelectItem,
);
export const postContentLengths = postContentLengthArr.map(
  (e) =>
    ({
      value: e,
      label: e
        .split("_")
        .map((e) => `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`)
        .join(" "),
    }) satisfies SelectItem,
);

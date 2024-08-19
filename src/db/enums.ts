import { SelectItem } from "@/types";
import { getEnumArray } from "@/db/utils";
import {
  PROPERTY_TYPE,
  PLATFORM,
  POST_CAMPAIGN,
  POST_CONTENT_LENGTH,
} from "@prisma/client";
import { Icons } from "@/components/icons";
import { Locale } from "@/types/locale";
import { t } from "@/lib/locale";

export const platformsArr = getEnumArray<PLATFORM>(PLATFORM);
export const propertyTypesArr = getEnumArray<PROPERTY_TYPE>(PROPERTY_TYPE);
export const postCampaignArr = getEnumArray<POST_CAMPAIGN>(POST_CAMPAIGN);
export const postContentLengthArr =
  getEnumArray<POST_CONTENT_LENGTH>(POST_CONTENT_LENGTH);

export const platforms = (locale: Locale) =>
  platformsArr.map(
    (e) =>
      ({
        value: e,
        label: e
          .split("_")
          .map(async (e) => {
            const label = await t(
              `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`,
              locale,
            );
            return label;
          })
          .join(" "),
        icon: e?.toLowerCase() as keyof typeof Icons, // already satisfied
      }) satisfies SelectItem,
  );

export const propertyTypes = (locale: Locale) =>
  propertyTypesArr.map(
    (e) =>
      ({
        value: e,
        label: e
          .split("_")
          .map(async (e) => {
            const label = await t(
              `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`,
              locale,
            );
            return label;
          })
          .join(" "),
      }) satisfies SelectItem,
  );
export const postCampaigns = (locale: Locale) =>
  postCampaignArr.map(
    (e) =>
      ({
        value: e,
        label: e
          .split("_")
          .map(async (e) => {
            const label = await t(
              `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`,
              locale,
            );
            return label;
          })
          .join(" "),
      }) satisfies SelectItem,
  );
export const postContentLengths = (locale: Locale) =>
  postContentLengthArr.map(
    (e) =>
      ({
        value: e,
        label: e
          .split("_")
          .map(async (e) => {
            const label = await t(
              `${e?.[0]?.toUpperCase()}${e?.slice(1)?.toLowerCase()}`,
              locale,
            );
            return label;
          })
          .join(" "),
      }) satisfies SelectItem,
  );

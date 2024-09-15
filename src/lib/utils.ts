import { Locale } from "@/types/locale";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { t } from "./locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertBase64(
  file: File,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader?.["result"]);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function isValidUrl(src: string) {
  try {
    new URL(src);
    return true;
  } catch (e) {
    return false;
  }
}

export const toastPromise = async (
  func: () => Promise<any>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  locale: Locale,
) => {
  try {
    setLoading(true);
    const res = await func();

    if (res?.["error"]) {
      const msg = await t(res?.["error"], locale);
      toast.error(msg);
      return null;
    }

    return res?.["data"] ?? null;
  } catch (err: any) {
    toast.error(err?.["message"]);
    return null;
  } finally {
    setLoading(false);
  }
};

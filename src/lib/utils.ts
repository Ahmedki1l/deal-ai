import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fileToBase64(
  file: File,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader?.["result"]);
    reader.onerror = (error) => reject(error);
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

export const clientAction = async <T>(
  func: () => Promise<T | void | { error: string }>,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<Exclude<T, { error: string }> | void> => {
  try {
    setLoading(true);
    const result = await func();

    if (result && typeof result === "object" && "error" in result) {
      toast.error(result?.["error"]);
      return;
    }

    return result as Exclude<T, { error: string }>;
  } catch (error: any) {
    toast.error(error?.["message"]);
  } finally {
    setLoading(false);
  }
};

export const clientHttpRequest = async <T>(
  func: () => Promise<T>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);
    return await func();
  } catch (err: any) {
    if (err?.["response"]) {
      console.error("error response: ", err?.["response"]?.["data"]);
      toast.error(err?.["response"]?.["data"]);
      return;
    }

    console.error("error: ", err?.["message"]);
    toast.error(err?.["message"]);
  } finally {
    setLoading(false);
  }
};

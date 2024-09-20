import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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

export async function fetcher<T>(
  url: RequestInfo | URL,
  options?: RequestInit | undefined,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(await response.text());

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json"))
    throw new Error("Expected JSON response: " + (await response.text()));

  const data = await response.json();
  return data as T;
}

export const clientAction = async <T>(
  func: () => Promise<T | void | { error: string }>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);
    const result = await func();

    if (result && typeof result === "object" && "error" in result) {
      toast.error(result?.["error"]);
      return;
    }

    return result;
  } catch (error: any) {
    toast.error(error?.["message"]);
  } finally {
    setLoading(false);
  }
};

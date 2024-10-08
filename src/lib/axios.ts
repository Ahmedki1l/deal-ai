import { Locale } from "@/types/locale";
import axiosInstance from "axios";
import { User } from "lucia";

const axios = ({ locale, user }: { locale: Locale; user: User | null }) =>
  axiosInstance.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    // timeout: 5000,
    headers: {
      locale,
      user: JSON.stringify(user),
      "Content-Type": "application/json",
    },
  });

export default axios;

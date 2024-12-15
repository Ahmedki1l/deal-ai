import { Locale } from "@/types/locale";
import Axios, { isAxiosError } from "axios";
import { User } from "lucia";

const axios = ({ locale, user }: { locale: Locale; user: User | null }) => {
  const axiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    headers: {
      locale,
      user: user ? btoa(encodeURIComponent(JSON.stringify(user))) : undefined,
      "Content-Type": "application/json",
    },
  });

  return axiosInstance;
};

export default axios;
;
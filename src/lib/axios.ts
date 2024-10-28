import { Locale } from "@/types/locale";
import Axios from "axios";
import { User } from "lucia";

const axios = ({ locale, user }: { locale: Locale; user: User | null }) => {
  const axiosInstance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    // timeout: 5000,
    headers: {
      locale,
      user: user ? btoa(encodeURIComponent(JSON.stringify(user))) : undefined,
      "Content-Type": "application/json",
    },
  });


   
  // axiosInstance.interceptors.request.use(
  //   (config: any) => {
  //     if (user) {
  //       config.headers.user =  JSON.stringify(user)
  //     }

  //     // Store the start time before making the request
  //     config.metadata = { startTime: new Date() };
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // axiosInstance.interceptors.response.use(
  //   (response: any) => {
  //     // Calculate the time taken for the request
  //     const endTime: any = new Date();
  //     const timeTaken = endTime - response.config.metadata.startTime;
  //     console.log(`Request to ${response.config.url} took ${timeTaken}ms`);
  //     return response;
  //   },
  //   (error) => {
  //     const endTime: any = new Date();
  //     const timeTaken = endTime - error.config.metadata.startTime;
  //     console.log(`Request to ${error.config.url} failed, took ${timeTaken}ms`);
  //     return Promise.reject(error);
  //   }
  // );

  return axiosInstance;
};

export default axios;
;
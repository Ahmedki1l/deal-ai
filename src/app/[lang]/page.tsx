import { getAuth } from "@/lib/auth";
import { LocaleProps } from "@/types/locale";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type HomeProps = Readonly<{
  params: LocaleProps;
}>;

export const metadata: Metadata = { title: "Home" };

export default async function Home({ params: { lang } }: HomeProps) {
  lang = "ar";
  const { user } = await getAuth();
  if (user) redirect(`/${lang}/dashboard`);
  else redirect(`/${lang}/login`);

  return <div className="container flex-1 py-6">Home </div>;
}

// "use client";
// import React, { useState, useEffect } from "react";
// import { MultiStepLoader } from "@/components/ui/multi-step-loader";
// import { Icons } from "@/components/icons";
// // import { IconSquareRoundedX } from "@tabler/icons-react";

// const loadingStates = [
//   {
//     text: "Buying a condo",
//   },
//   {
//     text: "Travelling in a flight",
//   },
//   {
//     text: "Meeting Tyler Durden",
//   },
//   {
//     text: "He makes soap",
//   },
//   {
//     text: "We goto a bar",
//   },
//   {
//     text: "Start a fight",
//   },
//   {
//     text: "We like it",
//   },
//   {
//     text: "Welcome to F**** C***",
//   },
// ];

// export default function MultiStepLoaderDemo() {
//   const [loading, setLoading] = useState(false);
//   const [currentState, setCurrentState] = useState(0);
//   const loop = false;
//   const duration = 2000;

//   useEffect(() => {
//     if (!loading) {
//       setCurrentState(0);
//       return;
//     }
//     const timeout = setTimeout(() => {
//       setCurrentState((prevState) =>
//         loop
//           ? prevState === loadingStates.length - 1
//             ? 0
//             : prevState + 1
//           : Math.min(prevState + 1, loadingStates.length - 1),
//       );
//     }, duration);

//     return () => clearTimeout(timeout);
//   }, [currentState, loading, loadingStates.length]);

//   return (
//     <div className="flex h-[60vh] w-full items-center justify-center">
//       {/* Core Loader Modal */}
//       <MultiStepLoader
//         currentState={currentState}
//         loadingStates={loadingStates}
//         loading={loading}
//       />

//       <button
//         onClick={() => setLoading(true)}
//         className="mx-auto flex h-10 items-center justify-center rounded-lg bg-[#39C3EF] px-8 text-sm font-medium text-black transition duration-200 hover:bg-[#39C3EF]/90 md:text-base"
//         style={{
//           boxShadow:
//             "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
//         }}
//       >
//         Click to load
//       </button>
//     </div>
//   );
// }

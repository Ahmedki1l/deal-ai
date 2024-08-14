"use client";

import { Icons } from "@/components/icons";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dictionary } from "@/types/locale";
import { useRouter } from "next/navigation";

type BackButtonProps = {} & ButtonProps & Dictionary["back-button"];
export function BackButton({
  dic: { "back-button": c },
  children,
  onClick,
  ...props
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} {...props}>
      {children ?? (
        <>
          <Icons.chevronLeft className="rtl:rotate-180" />
          {c?.["back"]}
        </>
      )}
    </Button>
  );
}

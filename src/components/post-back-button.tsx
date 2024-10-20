"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { Button, ButtonProps } from "@/components/ui/button";
import { Dictionary } from "@/types/locale";
import { useRouter, useSearchParams } from "next/navigation";

export type PostBackButtonProps = { href?: string } & ButtonProps & Dictionary["back-button"];

export function PostBackButton({
  dic: { "back-button": c },
  href,
  children,
  onClick,
  ...props
}: PostBackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    const storedTo = searchParams.get('to');
    if (storedTo) {
      sessionStorage.setItem('back-to', storedTo);
      setTo(storedTo);  // Set the "to" value in state
    } else {
      const sessionTo = sessionStorage.getItem('back-to') ?? href;
      setTo(sessionTo!);  // Fallback to session storage or href
    }
  }, [searchParams, href]);

  const handleBack = () => {
    if (to) router.push(to);
    else router.back();
  };

  return (
    <Button variant="ghost" onClick={handleBack} {...props}>
      {children ?? (
        <>
          <Icons.chevronLeft />
          {c?.["back"]}
        </>
      )}
    </Button>
  );
}

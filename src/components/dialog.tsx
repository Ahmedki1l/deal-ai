"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DialogTriggerProps } from "@radix-ui/react-dialog";
import { Dictionary } from "@/types/locale";

export type DialogResponsiveProps = {
  confirmButton?: React.ReactNode;
  content?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
} & Omit<DialogTriggerProps, "content" | "open" | "setOpen"> &
  Dictionary["dialog"];

export function DialogResponsive({
  dic: { dialog: c },
  confirmButton,
  content,
  title,
  description,
  setOpen,
  open,
  disabled,
  ...props
}: DialogResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const contentClassName = "overflow-auto max-h-[80vh]"; // 50% of viewport height and scrollable

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild {...props} />
        <DialogContent className={`w-fit ${contentClassName}`}>
          <DialogHeader>
            <DialogTitle>
              {title ?? c?.["are you sure you want to proceed?"]}
            </DialogTitle>
            <DialogDescription className="max-w-prose">
              {description ??
                c?.[
                  "Please confirm that all the provided information is accurate. This action cannot be undone."
                ]}
            </DialogDescription>
          </DialogHeader>
          {content}

          <DialogFooter className="gap-2">
            {confirmButton}
            <DialogClose disabled={disabled} asChild>
              <Button disabled={disabled} variant="outline">
                {c?.["cancel"]}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DrawerContent className={contentClassName}>
        <DrawerHeader>
          <DrawerTitle>
            {title ?? c?.["are you sure you want to proceed?"]}
          </DrawerTitle>
          <DrawerDescription className="max-w-prose">
            {description ??
              c?.[
                "Please confirm that all the provided information is accurate. This action cannot be undone."
              ]}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>

        <DrawerFooter className="gap-2">
          {confirmButton}
          <DrawerClose disabled={disabled} asChild>
            <Button disabled={disabled} variant="outline">
              {c?.["cancel"]}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

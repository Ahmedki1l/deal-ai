"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dictionary } from "@/types/locale";
import { AlertDialogTriggerProps } from "@radix-ui/react-alert-dialog";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export type DialogResponsiveProps = {
  confirmButton?: React.ReactNode;
  content?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  open?: boolean;
  type?: "dialog" | "alert";
} & Omit<AlertDialogTriggerProps, "content" | "open" | "setOpen" | "type"> &
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
  type = "dialog",
  ...props
}: DialogResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop && type == "dialog") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild {...props} />
        <DialogContent className="max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="justify-start">
              {title ?? c?.["are you sure you want to proceed?"]}
            </DialogTitle>
            <DialogDescription className="max-w-prose">
              {description ??
                c?.[
                  "please confirm that all the provided information is accurate. This action cannot be undone."
                ]}
            </DialogDescription>
          </DialogHeader>
          {content}
          {confirmButton && (
            <DialogFooter className="gap-2">{confirmButton}</DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (isDesktop && type === "alert") {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild {...props} />
        <AlertDialogContent className="max-h-[95vh] overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="justify-start">
              {title ?? c?.["are you sure you want to proceed?"]}
            </AlertDialogTitle>
            <AlertDialogDescription className="max-w-prose">
              {description ??
                c?.[
                  "please confirm that all the provided information is accurate. This action cannot be undone."
                ]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {content}

          <AlertDialogFooter className="gap-2">
            {confirmButton}
            <AlertDialogCancel disabled={disabled}>
              {c?.["cancel"]}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild {...props} />
      <DrawerContent className="max-h-[95vh]">
        <div className="overflow-auto">
          <DrawerHeader>
            <DrawerTitle>
              {title ?? c?.["are you sure you want to proceed?"]}
            </DrawerTitle>
            <DrawerDescription className="max-w-prose">
              {description ??
                c?.[
                  "please confirm that all the provided information is accurate. This action cannot be undone."
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}

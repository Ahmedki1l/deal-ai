import { Icons } from "@/components/icons";

export type NavItem = {
  segment?: string[] | null;
  value: string;
  label: string | React.ReactNode;
  icon?: keyof typeof Icons;
  indicator?: string | number | React.ReactNode;
  // children?: React.ReactNode;
};

export type SelectItem = {
  value: string;
  label: string | React.ReactNode;
  segment?: string | null;
  indicator?: string | number | React.ReactNode;
  icon?: keyof typeof Icons;
  children?: React.ReactNode;
};

export type ShortContents = {
  short: string;
  Medium: string;
  Long: string;
};

// Define message types for handling conversation
type SiriMessage =
  | {
      role: "system" | "user" | "assistant";
      content: string;
    }
  | {
      role: "function";
      name: string;
      content: string;
    };

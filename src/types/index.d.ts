import { Icons } from "@/components/icons";

export type SelectItem = {
  value: string;
  label: string | React.ReactNode;
  segment?: string | null;
  indicator?: string | number | React.ReactNode;
  icon?: keyof typeof Icons;
  children?: React.ReactNode;
};

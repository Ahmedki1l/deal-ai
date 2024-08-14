import { cn } from "@/lib/utils";
import {
  Tooltip as ToolTip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type TooltipProps = {
  children: React.ReactNode;
  text: React.ReactNode;
} & React.ComponentProps<typeof TooltipContent>;

export function Tooltip({ children, text, className, ...props }: TooltipProps) {
  return (
    <ToolTip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn(className)} {...props}>
        {text}
      </TooltipContent>
    </ToolTip>
  );
}

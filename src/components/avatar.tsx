import { AvatarProps as AvatarUIProps } from "@radix-ui/react-avatar";
import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { IconProps, Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { User } from "@/types/db";

export type AvatarProps = {
  user: Pick<User, "name" | "image"> | null;
  icon?: IconProps & {
    name: keyof typeof Icons;
  };
  children?: React.ReactNode;
} & AvatarUIProps;

export function Avatar({
  user,
  icon,
  className,
  children,
  ...props
}: AvatarProps) {
  const Icon = Icons[icon?.["name"] ?? "user"];

  return (
    <AvatarUI className={cn("shadow-xl", className)} {...props}>
      {(!!!icon || user?.["image"]) && (
        <AvatarImage
          src={user?.["image"]!} // !: it is null, but I have a default value for src
          alt={`${user?.["name"]} profile image`}
          className="object-cover object-center"
        />
      )}

      <AvatarFallback>
        {children ?? (
          <>
            <span className="sr-only">{user?.["name"]}</span>
            <Icon className={cn("h-3 w-3", icon?.["className"])} {...icon} />
          </>
        )}
      </AvatarFallback>
    </AvatarUI>
  );
}

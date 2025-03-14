import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { cva, VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  CalendarCheck2,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  Facebook,
  File,
  Globe,
  Home,
  Image,
  ImagePlay,
  Instagram,
  Laptop,
  LineChart,
  Linkedin,
  Loader2,
  LogOut,
  MapPin,
  Moon,
  PackageOpen,
  Plus,
  Settings,
  Sun,
  Timer,
  TimerOff,
  Trash2,
  Twitter,
  Type,
  User,
  Users,
  X,
  type LucideProps,
} from "lucide-react";
import icon from "../../public/images/Takamol_Logo.png";
import logo from "../../public/images/Takaml.png";
import { Image as CutomImage } from "./image";

export const IconsVariants = cva("h-4 w-4 shrink-0");
export type IconProps = {} & LucideProps & VariantProps<typeof IconsVariants>;
export type Icon = keyof typeof Icons;

export const Icons = {
  logo: ({ className, ...props }: IconProps) => (
    <CutomImage
      src={icon?.["src"]}
      alt=""
      className={cn(
        IconsVariants({}),
        "flex h-6 w-6 items-center rounded-full border-none bg-transparent",
        className
      )}
      // {...props}
    />
  ),

  fullLogo: ({ className, ...props }: IconProps) => (
    <CutomImage
      src={logo?.["src"]}
      alt=""
      className={cn(
        IconsVariants({}),
        "mr-2 h-6 w-6 rounded-none border-none bg-transparent",
        className
      )}
      // {...props}
    />
  ),
  spinner: ({ className, ...props }: IconProps) => (
    <Loader2
      className={cn(IconsVariants({}), "animate-spin", className)}
      {...props}
    />
  ),
  reload: ({ className, children, ...props }: IconProps) => (
    <ReloadIcon className={cn(IconsVariants({}), className)} {...props} />
  ),
  exclamationTriangle: ({ className, children, ...props }: IconProps) => (
    <ExclamationTriangleIcon
      className={cn(IconsVariants({}), className)}
      {...props}
    />
  ),
  home: ({ className, ...props }: IconProps) => (
    <Home className={cn(IconsVariants({}), className)} {...props} />
  ),
  write: ({ className, ...props }: IconProps) => (
    <Type className={cn(IconsVariants({}), className)} {...props} />
  ),
  schedule: ({ className, ...props }: IconProps) => (
    <CalendarCheck2 className={cn(IconsVariants({}), className)} {...props} />
  ),
  file: ({ className, ...props }: IconProps) => (
    <File className={cn(IconsVariants({}), className)} {...props} />
  ),
  scheduleCheck: ({ className, ...props }: IconProps) => (
    <CalendarCheck className={cn(IconsVariants({}), className)} {...props} />
  ),
  timer: ({ className, ...props }: IconProps) => (
    <Timer className={cn(IconsVariants({}), className)} {...props} />
  ),
  sun: ({ className, ...props }: IconProps) => (
    <Sun className={cn(IconsVariants({}), className)} {...props} />
  ),
  moon: ({ className, ...props }: IconProps) => (
    <Moon className={cn(IconsVariants({}), className)} {...props} />
  ),
  laptop: ({ className, ...props }: IconProps) => (
    <Laptop className={cn(IconsVariants({}), className)} {...props} />
  ),
  stopPlaying: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(IconsVariants({}), className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
      <line x1="12" y1="6" x2="12" y2="18" strokeWidth="2" />
      <line x1="6" y1="12" x2="18" y2="12" strokeWidth="2" />
    </svg>
  ),
  speaker: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(IconsVariants({}), className)}
      {...props}
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.37-2-4.47v8.93c1.23-1.1 2-2.7 2-4.46zm2-7.03v2.06c1.76 1.32 3 3.45 3 5.97s-1.24 4.65-3 5.97v2.06c2.91-1.54 5-4.54 5-8.03s-2.09-6.49-5-8.03z" />
    </svg>
  ),
  globe: ({ className, ...props }: IconProps) => (
    <Globe className={cn(IconsVariants({}), className)} {...props} />
  ),
  timerOff: ({ className, ...props }: IconProps) => (
    <TimerOff className={cn(IconsVariants({}), className)} {...props} />
  ),
  calender: ({ className, ...props }: IconProps) => (
    <Calendar className={cn(IconsVariants({}), className)} {...props} />
  ),
  trash: ({ className, ...props }: IconProps) => (
    <Trash2 className={cn(IconsVariants({}), className)} {...props} />
  ),
  mapPicker: ({ className, ...props }: IconProps) => (
    <MapPin className={cn(IconsVariants({}), className)} {...props} />
  ),
  image: ({ className, ...props }: IconProps) => (
    <Image className={cn(IconsVariants({}), className)} {...props} />
  ),
  imageReload: ({ className, ...props }: IconProps) => (
    <ImagePlay className={cn(IconsVariants({}), className)} {...props} />
  ),
  edit: ({ className, ...props }: IconProps) => (
    <Edit className={cn(IconsVariants({}), className)} {...props} />
  ),
  x: ({ className, ...props }: IconProps) => (
    <X className={cn(IconsVariants({}), className)} {...props} />
  ),
  check: ({ className, ...props }: IconProps) => (
    <Check className={cn(IconsVariants({}), className)} {...props} />
  ),
  logout: ({ className, ...props }: IconProps) => (
    <LogOut className={cn(IconsVariants({}), className)} {...props} />
  ),
  analytics: ({ className, ...props }: IconProps) => (
    <LineChart className={cn(IconsVariants({}), className)} {...props} />
  ),
  settings: ({ className, ...props }: IconProps) => (
    <Settings className={cn(IconsVariants({}), className)} {...props} />
  ),
  add: ({ className, ...props }: IconProps) => (
    <Plus className={cn(IconsVariants({}), className)} {...props} />
  ),
  externalLink: ({ className, ...props }: IconProps) => (
    <ExternalLink className={cn(IconsVariants({}), className)} {...props} />
  ),
  warning: ({ className, ...props }: IconProps) => (
    <AlertTriangle className={cn(IconsVariants({}), className)} {...props} />
  ),
  empty: ({ className, ...props }: IconProps) => (
    <PackageOpen className={cn(IconsVariants({}), className)} {...props} />
  ),
  user: ({ className, ...props }: IconProps) => (
    <User className={cn(IconsVariants({}), className)} {...props} />
  ),
  users: ({ className, ...props }: IconProps) => (
    <Users className={cn(IconsVariants({}), className)} {...props} />
  ),
  chevronLeft: ({ className, ...props }: IconProps) => (
    <ChevronLeft
      className={cn(IconsVariants({}), "rtl:rotate-180", className)}
      {...props}
    />
  ),
  chevronRight: ({ className, ...props }: IconProps) => (
    <ChevronRight
      className={cn(IconsVariants({}), "rtl:rotate-180", className)}
      {...props}
    />
  ),
  // SocialMedia Icons, keys must be lowercase -- used as lowercase another place in code
  facebook: ({ className, ...props }: IconProps) => (
    <Facebook
      className={cn(
        IconsVariants({}),
        "rounded-full bg-blue-600 p-0.5 text-primary-foreground",
        className
      )}
      {...props}
    />
  ),
  instagram: ({ className, ...props }: IconProps) => (
    <Instagram
      className={cn(IconsVariants({}), "stroke-pink-700", className)}
      {...props}
    />
  ),
  linkedin: ({ className, ...props }: IconProps) => (
    <Linkedin
      className={cn(IconsVariants({}), "stroke-blue-600", className)}
      {...props}
    />
  ),
  twitter: ({ className, ...props }: IconProps) => (
    <Twitter
      className={cn(IconsVariants({}), "stroke-blue-600", className)}
      {...props}
    />
  ),
  google: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="16px"
      height="16px"
      className={cn(IconsVariants({}), className)}
      {...props}
    >
      <path
        fill="#fbc02d"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#e53935"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4caf50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1565c0"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  ),
};

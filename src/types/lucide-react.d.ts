declare module "lucide-react" {
  import type { SVGProps } from "react";

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideProps = IconProps;

  export type Icon = React.FC<IconProps>;
  export type LucideIcon = Icon;

  export const ArrowDown: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  export const Award: Icon;
  export const BookOpen: Icon;
  export const Bot: Icon;
  export const BrainCircuit: Icon;
  export const Briefcase: Icon;
  export const Calendar: Icon;
  export const Check: Icon;
  export const CheckCircle2: Icon;
  export const ChevronRight: Icon;
  export const Circle: Icon;
  export const CircuitBoard: Icon;
  export const ClipboardCheck: Icon;
  export const Clock: Icon;
  export const ExternalLink: Icon;
  export const Eye: Icon;
  export const FileCheck: Icon;
  export const FileText: Icon;
  export const FileUp: Icon;
  export const FileWarning: Icon;
  export const Flame: Icon;
  export const FolderGit2: Icon;
  export const GitFork: Icon;
  export const GitPullRequestArrow: Icon;
  export const Landmark: Icon;
  export const LayoutDashboard: Icon;
  export const Library: Icon;
  export const Loader2: Icon;
  export const Map: Icon;
  export const Menu: Icon;
  export const MessageSquareText: Icon;
  export const MessagesSquare: Icon;
  export const Moon: Icon;
  export const PenTool: Icon;
  export const Play: Icon;
  export const RefreshCw: Icon;
  export const RotateCw: Icon;
  export const Send: Icon;
  export const ShieldCheck: Icon;
  export const SlidersHorizontal: Icon;
  export const Sparkles: Icon;
  export const Sun: Icon;
  export const Target: Icon;
  export const TrendingUp: Icon;
  export const Upload: Icon;
  export const User: Icon;
  export const User2: Icon;
  export const Wand2: Icon;
  export const Wrench: Icon;
  export const X: Icon;
}
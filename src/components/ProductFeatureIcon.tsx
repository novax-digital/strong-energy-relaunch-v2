import { Battery, Check, Clock, Headphones, Link as LinkIcon, Shield, Zap } from "lucide-react";

const iconMap = {
  Battery,
  Check,
  Clock,
  HeadphonesIcon: Headphones,
  Link: LinkIcon,
  Shield,
  Zap
};

export function ProductFeatureIcon({
  className = "h-6 w-6",
  icon,
  strokeWidth = 2
}: {
  className?: string;
  icon?: string;
  strokeWidth?: number;
}) {
  const Icon = iconMap[icon as keyof typeof iconMap] || Zap;
  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} />;
}

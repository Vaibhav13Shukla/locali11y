import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  severity: "critical" | "important" | "info";
  label?: string;
}

export function SeverityBadge({ severity, label }: SeverityBadgeProps) {
  const variants = {
    critical: "critical" as const,
    important: "important" as const,
    info: "info" as const,
  };

  return <Badge variant={variants[severity]}>{label ?? severity}</Badge>;
}

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const iconBgStyles = {
  default: "bg-muted",
  primary: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  destructive: "bg-destructive/10",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
          <p className={`text-2xl font-semibold font-mono ${variantStyles[variant]}`}>{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className={`p-2 rounded-md ${iconBgStyles[variant]}`}>
          <Icon className={`h-5 w-5 ${variantStyles[variant]}`} />
        </div>
      </div>
    </div>
  );
}

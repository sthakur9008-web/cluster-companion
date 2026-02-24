import { ClusterStatus } from "@/types/cluster";

interface StatusBadgeProps {
  status: ClusterStatus;
}

const statusConfig: Record<ClusterStatus, { className: string; dot: string }> = {
  Active: { className: "status-active", dot: "bg-success" },
  Offline: { className: "status-offline", dot: "bg-destructive" },
  Maintenance: { className: "status-maintenance", dot: "bg-warning" },
  Decommissioned: { className: "status-decommissioned", dot: "bg-muted-foreground" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${status === "Active" ? "animate-pulse-glow" : ""}`} />
      {status}
    </span>
  );
}

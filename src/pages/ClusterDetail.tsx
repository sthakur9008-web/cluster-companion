import { useParams, useNavigate } from "react-router-dom";
import { mockClusters, mockAuditLog } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Archive } from "lucide-react";

export default function ClusterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cluster = mockClusters.find((c) => c.id === id);

  if (!cluster) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Cluster not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    );
  }

  const auditEntries = mockAuditLog.filter((a) => a.clusterId === cluster.id);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-border text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold font-mono">{cluster.clusterName}</h1>
              <StatusBadge status={cluster.status} />
            </div>
            <p className="text-sm text-muted-foreground font-mono">{cluster.clusterIP}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3 w-3" /> Edit</Button>
          {cluster.status !== "Decommissioned" && (
            <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive"><Archive className="h-3 w-3" /> Decommission</Button>
          )}
        </div>
      </div>

      {/* Cluster Info */}
      <div className="stat-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Cluster Information</h3>
        <InfoRow label="Created" value={`${new Date(cluster.createdDate).toLocaleDateString()} by ${cluster.createdBy}`} />
        <InfoRow label="Last Updated" value={`${new Date(cluster.lastUpdatedDate).toLocaleDateString()} by ${cluster.lastUpdatedBy}`} />
        {cluster.decommissionDate && <InfoRow label="Decommissioned" value={`${cluster.decommissionDate} by ${cluster.decommissionApprovedBy}`} />}
      </div>

      {/* Nodes */}
      <div className="stat-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Production Nodes ({cluster.nodes.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="data-table-header">
              <th className="text-left p-2">Name</th><th className="text-left p-2">IP</th><th className="text-left p-2">OS</th>
              <th className="text-left p-2">C:</th><th className="text-left p-2">D:</th><th className="text-left p-2">E:</th><th className="text-left p-2">RAID</th>
            </tr></thead>
            <tbody>
              {cluster.nodes.map((n, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-2 font-mono text-primary">{n.name}</td>
                  <td className="p-2 font-mono">{n.ip}</td>
                  <td className="p-2">{n.os}</td>
                  <td className="p-2 font-mono">{n.cDriveSize}</td>
                  <td className="p-2 font-mono">{n.dDriveSize}</td>
                  <td className="p-2 font-mono">{n.eDriveSize}</td>
                  <td className="p-2">{n.raidType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services */}
      <div className="stat-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">MSCS Services ({cluster.services.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="data-table-header">
              <th className="text-left p-2">Service</th><th className="text-left p-2">Server Object</th><th className="text-left p-2">VIP</th>
              <th className="text-left p-2">Drives</th><th className="text-left p-2">Status</th><th className="text-left p-2">Remarks</th>
            </tr></thead>
            <tbody>
              {cluster.services.map((s, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-2 font-mono">{s.serviceName}</td>
                  <td className="p-2 font-mono">{s.serverObjectName}</td>
                  <td className="p-2 font-mono">{s.virtualIP}</td>
                  <td className="p-2 font-mono">{s.driveLetters}</td>
                  <td className="p-2"><StatusBadge status={s.status} /></td>
                  <td className="p-2 text-muted-foreground">{s.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DR Info */}
      {cluster.drInfo && (
        <div className="stat-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">DR Configuration</h3>
          <InfoRow label="DR Cluster" value={cluster.drInfo.drClusterName} />
          <InfoRow label="DR IP" value={cluster.drInfo.drClusterIP} />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="data-table-header">
                <th className="text-left p-2">Node</th><th className="text-left p-2">IP</th><th className="text-left p-2">OS</th>
              </tr></thead>
              <tbody>
                {cluster.drInfo.drNodes.map((n, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-2 font-mono text-primary">{n.name}</td>
                    <td className="p-2 font-mono">{n.ip}</td>
                    <td className="p-2">{n.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="stat-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Audit History</h3>
        {auditEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No audit entries</p>
        ) : (
          <div className="space-y-2">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-border text-sm">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                  entry.action === "CREATE" ? "bg-success/10 text-success" :
                  entry.action === "UPDATE" ? "bg-info/10 text-info" :
                  "bg-destructive/10 text-destructive"
                }`}>{entry.action}</span>
                <div className="flex-1">
                  <span className="text-muted-foreground">{entry.field}</span>
                  {entry.oldValue && <span className="font-mono text-destructive/70 line-through ml-2">{entry.oldValue}</span>}
                  {entry.newValue && <span className="font-mono text-success ml-2">{entry.newValue}</span>}
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <div>{entry.changedBy}</div>
                  <div>{new Date(entry.changedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

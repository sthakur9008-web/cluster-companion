import { mockClusters } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function Decommissioned() {
  const [search, setSearch] = useState("");
  const decommissioned = mockClusters.filter((c) => c.status === "Decommissioned");

  const filtered = decommissioned.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.clusterName.toLowerCase().includes(q) || c.clusterIP.includes(q);
  });

  const handleRestore = (name: string) => {
    toast({ title: "Cluster Restored", description: `${name} has been moved back to Active inventory` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Decommissioned Clusters</h1>
        <p className="text-sm text-muted-foreground mt-1">Archived clusters that have been taken out of service</p>
      </div>

      <div className="relative w-56">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 bg-muted border-border text-sm" />
      </div>

      {filtered.length === 0 ? (
        <div className="stat-card text-center py-12 text-muted-foreground">
          No decommissioned clusters found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-foreground font-medium">{c.clusterName}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 text-xs">
                    <div><span className="text-muted-foreground">IP:</span> <span className="font-mono">{c.clusterIP}</span></div>
                    <div><span className="text-muted-foreground">Decommissioned:</span> {c.decommissionDate}</div>
                    <div><span className="text-muted-foreground">Approved by:</span> {c.decommissionApprovedBy}</div>
                    <div><span className="text-muted-foreground">Reason:</span> {c.decommissionReason}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => handleRestore(c.clusterName)}>
                  <RotateCcw className="h-3 w-3" /> Restore
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

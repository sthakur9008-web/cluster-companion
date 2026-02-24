import { mockClusters } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [osFilter, setOsFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("clusterName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  const activeClusters = mockClusters.filter((c) => c.status !== "Decommissioned");

  const filtered = activeClusters
    .filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (osFilter !== "all" && !c.nodes.some((n) => n.os === osFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.clusterName.toLowerCase().includes(q) || c.clusterIP.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const aVal = (a as any)[sortField] || "";
      const bVal = (b as any)[sortField] || "";
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleExport = () => {
    const headers = ["Cluster Name", "Cluster IP", "Primary Nodes", "DR Nodes", "OS Version", "Services", "Virtual IPs", "Status", "Created", "Last Updated"];
    const rows = filtered.map((c) => [
      c.clusterName, c.clusterIP,
      c.nodes.map(n => n.name).join("; "),
      c.drInfo?.drNodes.map(n => n.name).join("; ") || "",
      [...new Set(c.nodes.map(n => n.os))].join("; "),
      c.services.map(s => s.serviceName).join("; "),
      c.services.map(s => s.virtualIP).join("; "),
      c.status,
      new Date(c.createdDate).toLocaleDateString(),
      new Date(c.lastUpdatedDate).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cluster_inventory.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="text-left p-3 cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Cluster Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} clusters</p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search name or IP..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 w-56 bg-muted border-border text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36 bg-muted border-border text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={osFilter} onValueChange={setOsFilter}>
          <SelectTrigger className="h-9 w-44 bg-muted border-border text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All OS Versions</SelectItem>
            <SelectItem value="Windows 2012 R2">Windows 2012 R2</SelectItem>
            <SelectItem value="Windows 2016">Windows 2016</SelectItem>
            <SelectItem value="Windows 2019">Windows 2019</SelectItem>
            <SelectItem value="Windows 2022">Windows 2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="stat-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="data-table-header">
                <SortHeader field="clusterName" label="Cluster Name" />
                <th className="text-left p-3">Primary Nodes</th>
                <th className="text-left p-3">DR Nodes</th>
                <th className="text-left p-3">OS Version</th>
                <th className="text-left p-3">Virtual IPs</th>
                <th className="text-left p-3">Services</th>
                <th className="text-left p-3">Drive Letters</th>
                <SortHeader field="status" label="Status" />
                <SortHeader field="createdDate" label="Created" />
                <SortHeader field="lastUpdatedDate" label="Updated" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/cluster/${c.id}`)}
                >
                  <td className="p-3 font-mono text-primary font-medium whitespace-nowrap">{c.clusterName}</td>
                  <td className="p-3 text-xs font-mono">{c.nodes.map(n => n.name).join(", ")}</td>
                  <td className="p-3 text-xs font-mono text-muted-foreground">{c.drInfo?.drNodes.map(n => n.name).join(", ") || "—"}</td>
                  <td className="p-3 text-xs">{[...new Set(c.nodes.map(n => n.os))].join(", ")}</td>
                  <td className="p-3 text-xs font-mono">{c.services.map(s => s.virtualIP).join(", ")}</td>
                  <td className="p-3 text-xs">{c.services.length}</td>
                  <td className="p-3 text-xs font-mono">{c.services.map(s => s.driveLetters).join(", ")}</td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(c.createdDate).toLocaleDateString()}</td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(c.lastUpdatedDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No clusters found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

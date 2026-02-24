import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockClusters } from "@/data/mockData";
import {
  Server,
  Activity,
  WifiOff,
  Archive,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";

const CHART_COLORS = [
  "hsl(174, 72%, 46%)",
  "hsl(207, 90%, 54%)",
  "hsl(142, 70%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 55%)",
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const activeClusters = mockClusters.filter((c) => c.status === "Active");
  const offlineClusters = mockClusters.filter((c) => c.status === "Offline");
  const decommissioned = mockClusters.filter((c) => c.status === "Decommissioned");
  const maintenanceClusters = mockClusters.filter((c) => c.status === "Maintenance");

  // OS distribution
  const osDistribution = mockClusters
    .filter((c) => c.status !== "Decommissioned")
    .reduce((acc, c) => {
      c.nodes.forEach((n) => {
        acc[n.os] = (acc[n.os] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  const osData = Object.entries(osDistribution).map(([name, value]) => ({ name, value }));

  // Prod vs DR
  const prodCount = mockClusters.filter((c) => c.status !== "Decommissioned").length;
  const drCount = mockClusters.filter((c) => c.drInfo && c.status !== "Decommissioned").length;
  const availabilityData = [
    { name: "Production", count: prodCount },
    { name: "DR Available", count: drCount },
    { name: "No DR", count: prodCount - drCount },
  ];

  // Filter clusters for recent table
  const filtered = mockClusters
    .filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search && !c.clusterName.toLowerCase().includes(search.toLowerCase()) && !c.clusterIP.includes(search)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Windows Cluster Inventory Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Clusters" value={mockClusters.length} icon={Server} variant="primary" />
        <StatCard title="Active" value={activeClusters.length} icon={Activity} variant="success" />
        <StatCard title="Offline" value={offlineClusters.length} icon={WifiOff} variant="destructive" />
        <StatCard title="Decommissioned" value={decommissioned.length} icon={Archive} variant="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">OS Version Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={osData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {osData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {osData.map((item, i) => (
              <span key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Production vs DR Availability</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={availabilityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)", fontSize: "12px" }}
              />
              <Bar dataKey="count" fill="hsl(174, 72%, 46%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent clusters */}
      <div className="stat-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Recently Updated Clusters</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search name or IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-56 bg-muted border-border text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36 bg-muted border-border text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="data-table-header">
                <th className="text-left p-3">Cluster Name</th>
                <th className="text-left p-3">IP Address</th>
                <th className="text-left p-3">Nodes</th>
                <th className="text-left p-3">Services</th>
                <th className="text-left p-3">DR</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cluster) => (
                <tr
                  key={cluster.id}
                  className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/cluster/${cluster.id}`)}
                >
                  <td className="p-3 font-mono text-primary font-medium">{cluster.clusterName}</td>
                  <td className="p-3 font-mono text-muted-foreground">{cluster.clusterIP}</td>
                  <td className="p-3">{cluster.nodes.length}</td>
                  <td className="p-3">{cluster.services.length}</td>
                  <td className="p-3">{cluster.drInfo ? "✓" : "—"}</td>
                  <td className="p-3"><StatusBadge status={cluster.status} /></td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(cluster.lastUpdatedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

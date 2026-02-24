import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Server, Shield } from "lucide-react";
import { OSVersion } from "@/types/cluster";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NodeForm {
  name: string;
  ip: string;
  os: OSVersion;
  cDrive: string;
  dDrive: string;
  eDrive: string;
  raidType: string;
}

interface ServiceForm {
  serviceName: string;
  serverObjectName: string;
  virtualIP: string;
  driveLetters: string;
  status: string;
  remarks: string;
}

const emptyNode: NodeForm = { name: "", ip: "", os: "Windows 2022", cDrive: "100GB", dDrive: "500GB", eDrive: "200GB", raidType: "RAID-5" };
const emptyService: ServiceForm = { serviceName: "", serverObjectName: "", virtualIP: "", driveLetters: "", status: "Active", remarks: "" };

export default function Onboard() {
  const navigate = useNavigate();
  const [clusterName, setClusterName] = useState("");
  const [clusterIP, setClusterIP] = useState("");
  const [nodes, setNodes] = useState<NodeForm[]>([{ ...emptyNode }]);
  const [services, setServices] = useState<ServiceForm[]>([{ ...emptyService }]);

  // DR Section
  const [hasDR, setHasDR] = useState(false);
  const [drClusterName, setDrClusterName] = useState("");
  const [drClusterIP, setDrClusterIP] = useState("");
  const [drNodes, setDrNodes] = useState<NodeForm[]>([{ ...emptyNode }]);

  const updateNode = (index: number, field: keyof NodeForm, value: string) => {
    const updated = [...nodes];
    updated[index] = { ...updated[index], [field]: value };
    setNodes(updated);
  };

  const updateService = (index: number, field: keyof ServiceForm, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const updateDrNode = (index: number, field: keyof NodeForm, value: string) => {
    const updated = [...drNodes];
    updated[index] = { ...updated[index], [field]: value };
    setDrNodes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clusterName.trim() || !clusterIP.trim()) {
      toast({ title: "Validation Error", description: "Cluster name and IP are required", variant: "destructive" });
      return;
    }
    toast({ title: "Cluster Onboarded", description: `${clusterName} has been successfully added` });
    navigate("/inventory");
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Onboard New Cluster</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new Windows cluster to the inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Section A */}
        <div className="stat-card">
          <SectionTitle icon={Server} title="Section A – Production (RCP)" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <Label className="text-xs">Cluster Name *</Label>
              <Input value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="PROD-SQL-CLU01" className="bg-muted border-border font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Cluster IP Address *</Label>
              <Input value={clusterIP} onChange={(e) => setClusterIP(e.target.value)} placeholder="10.20.30.100" className="bg-muted border-border font-mono" />
            </div>
          </div>

          {/* Nodes */}
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Cluster Nodes</h3>
          {nodes.map((node, i) => (
            <div key={i} className="border border-border rounded-md p-4 mb-3 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-primary">Node {i + 1}</span>
                {nodes.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setNodes(nodes.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Node Name</Label><Input value={node.name} onChange={(e) => updateNode(i, "name", e.target.value)} placeholder="PRODSQL01A" className="bg-muted border-border font-mono text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Node IP</Label><Input value={node.ip} onChange={(e) => updateNode(i, "ip", e.target.value)} placeholder="10.20.30.101" className="bg-muted border-border font-mono text-sm" /></div>
                <div className="space-y-1">
                  <Label className="text-xs">OS Version</Label>
                  <Select value={node.os} onValueChange={(v) => updateNode(i, "os", v)}>
                    <SelectTrigger className="bg-muted border-border text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Windows 2012 R2">Windows 2012 R2</SelectItem>
                      <SelectItem value="Windows 2016">Windows 2016</SelectItem>
                      <SelectItem value="Windows 2019">Windows 2019</SelectItem>
                      <SelectItem value="Windows 2022">Windows 2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">C Drive</Label><Input value={node.cDrive} onChange={(e) => updateNode(i, "cDrive", e.target.value)} className="bg-muted border-border text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">D Drive</Label><Input value={node.dDrive} onChange={(e) => updateNode(i, "dDrive", e.target.value)} className="bg-muted border-border text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">E Drive</Label><Input value={node.eDrive} onChange={(e) => updateNode(i, "eDrive", e.target.value)} className="bg-muted border-border text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">RAID Type</Label><Input value={node.raidType} onChange={(e) => updateNode(i, "raidType", e.target.value)} className="bg-muted border-border text-sm" /></div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setNodes([...nodes, { ...emptyNode }])} className="gap-1 mt-1">
            <Plus className="h-3 w-3" /> Add Node
          </Button>

          {/* Services */}
          <h3 className="text-sm font-medium text-muted-foreground mb-3 mt-6">MSCS Services</h3>
          {services.map((svc, i) => (
            <div key={i} className="border border-border rounded-md p-4 mb-3 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-primary">Service {i + 1}</span>
                {services.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setServices(services.filter((_, j) => j !== i))}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Service Name</Label><Input value={svc.serviceName} onChange={(e) => updateService(i, "serviceName", e.target.value)} className="bg-muted border-border font-mono text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Server Object</Label><Input value={svc.serverObjectName} onChange={(e) => updateService(i, "serverObjectName", e.target.value)} className="bg-muted border-border font-mono text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Virtual IP</Label><Input value={svc.virtualIP} onChange={(e) => updateService(i, "virtualIP", e.target.value)} className="bg-muted border-border font-mono text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Drive Letters</Label><Input value={svc.driveLetters} onChange={(e) => updateService(i, "driveLetters", e.target.value)} placeholder="D, E" className="bg-muted border-border text-sm" /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select value={svc.status} onValueChange={(v) => updateService(i, "status", v)}>
                    <SelectTrigger className="bg-muted border-border text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Remarks</Label><Input value={svc.remarks} onChange={(e) => updateService(i, "remarks", e.target.value)} className="bg-muted border-border text-sm" /></div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setServices([...services, { ...emptyService }])} className="gap-1 mt-1">
            <Plus className="h-3 w-3" /> Add Service
          </Button>
        </div>

        {/* Section B - DR */}
        <div className="stat-card">
          <SectionTitle icon={Shield} title="Section B – DR (HYD-DR)" />
          <div className="flex items-center gap-3 mb-4">
            <Label className="text-xs">Has DR Setup?</Label>
            <Button type="button" variant={hasDR ? "default" : "outline"} size="sm" onClick={() => setHasDR(!hasDR)}>
              {hasDR ? "Yes" : "No"}
            </Button>
          </div>

          {hasDR && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">DR Cluster Name</Label>
                  <Input value={drClusterName} onChange={(e) => setDrClusterName(e.target.value)} placeholder="DR-SQL-CLU01" className="bg-muted border-border font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">DR Cluster IP</Label>
                  <Input value={drClusterIP} onChange={(e) => setDrClusterIP(e.target.value)} placeholder="10.40.50.100" className="bg-muted border-border font-mono" />
                </div>
              </div>

              <h3 className="text-sm font-medium text-muted-foreground mb-3">DR Nodes</h3>
              {drNodes.map((node, i) => (
                <div key={i} className="border border-border rounded-md p-4 mb-3 bg-muted/30">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Node Name</Label><Input value={node.name} onChange={(e) => updateDrNode(i, "name", e.target.value)} className="bg-muted border-border font-mono text-sm" /></div>
                    <div className="space-y-1"><Label className="text-xs">Node IP</Label><Input value={node.ip} onChange={(e) => updateDrNode(i, "ip", e.target.value)} className="bg-muted border-border font-mono text-sm" /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">OS Version</Label>
                      <Select value={node.os} onValueChange={(v) => updateDrNode(i, "os", v)}>
                        <SelectTrigger className="bg-muted border-border text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Windows 2012 R2">Windows 2012 R2</SelectItem>
                          <SelectItem value="Windows 2016">Windows 2016</SelectItem>
                          <SelectItem value="Windows 2019">Windows 2019</SelectItem>
                          <SelectItem value="Windows 2022">Windows 2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setDrNodes([...drNodes, { ...emptyNode }])} className="gap-1">
                <Plus className="h-3 w-3" /> Add DR Node
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="gap-2">
            <Server className="h-4 w-4" /> Onboard Cluster
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

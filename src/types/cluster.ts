export type ClusterStatus = "Active" | "Offline" | "Maintenance" | "Decommissioned";

export type OSVersion = "Windows 2012 R2" | "Windows 2016" | "Windows 2019" | "Windows 2022";

export interface ClusterNode {
  name: string;
  ip: string;
  os: OSVersion;
  cDriveSize: string;
  dDriveSize: string;
  eDriveSize: string;
  raidType: string;
}

export interface MSCSService {
  serviceName: string;
  serverObjectName: string;
  virtualIP: string;
  driveLetters: string;
  status: ClusterStatus;
  remarks: string;
}

export interface DRInfo {
  drClusterName: string;
  drClusterIP: string;
  drNodes: ClusterNode[];
  drServices: {
    serviceName: string;
    serverObjectName: string;
    virtualIP: string;
    driveLetter: string;
    osVersion: OSVersion;
  }[];
}

export interface Cluster {
  id: string;
  clusterName: string;
  clusterIP: string;
  nodes: ClusterNode[];
  services: MSCSService[];
  drInfo: DRInfo | null;
  status: ClusterStatus;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  decommissionDate?: string;
  decommissionApprovedBy?: string;
  decommissionReason?: string;
}

export interface AuditEntry {
  id: string;
  clusterId: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

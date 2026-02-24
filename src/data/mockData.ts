import { Cluster, AuditEntry } from "@/types/cluster";

export const mockClusters: Cluster[] = [
  {
    id: "cl-001",
    clusterName: "PROD-SQL-CLU01",
    clusterIP: "10.20.30.100",
    nodes: [
      { name: "PRODSQL01A", ip: "10.20.30.101", os: "Windows 2022", cDriveSize: "100GB", dDriveSize: "500GB", eDriveSize: "200GB", raidType: "RAID-5" },
      { name: "PRODSQL01B", ip: "10.20.30.102", os: "Windows 2022", cDriveSize: "100GB", dDriveSize: "500GB", eDriveSize: "200GB", raidType: "RAID-5" },
    ],
    services: [
      { serviceName: "SQL-SVC-PROD01", serverObjectName: "SQLPROD01", virtualIP: "10.20.30.110", driveLetters: "D, E", status: "Active", remarks: "Primary production SQL" },
      { serviceName: "SQL-SVC-PROD02", serverObjectName: "SQLPROD02", virtualIP: "10.20.30.111", driveLetters: "D, E, F", status: "Active", remarks: "Secondary SQL instance" },
    ],
    drInfo: {
      drClusterName: "DR-SQL-CLU01",
      drClusterIP: "10.40.50.100",
      drNodes: [
        { name: "DRSQL01A", ip: "10.40.50.101", os: "Windows 2022", cDriveSize: "100GB", dDriveSize: "500GB", eDriveSize: "200GB", raidType: "RAID-5" },
      ],
      drServices: [
        { serviceName: "DR-SQL-SVC01", serverObjectName: "DRSQLPROD01", virtualIP: "10.40.50.110", driveLetter: "D, E", osVersion: "Windows 2022" },
      ],
    },
    status: "Active",
    createdDate: "2024-01-15T10:30:00Z",
    createdBy: "admin@company.com",
    lastUpdatedDate: "2025-02-20T14:22:00Z",
    lastUpdatedBy: "john.doe@company.com",
  },
  {
    id: "cl-002",
    clusterName: "PROD-APP-CLU01",
    clusterIP: "10.20.31.100",
    nodes: [
      { name: "PRODAPP01A", ip: "10.20.31.101", os: "Windows 2019", cDriveSize: "80GB", dDriveSize: "300GB", eDriveSize: "150GB", raidType: "RAID-1" },
      { name: "PRODAPP01B", ip: "10.20.31.102", os: "Windows 2019", cDriveSize: "80GB", dDriveSize: "300GB", eDriveSize: "150GB", raidType: "RAID-1" },
    ],
    services: [
      { serviceName: "APP-SVC-CORE", serverObjectName: "APPPROD01", virtualIP: "10.20.31.110", driveLetters: "D", status: "Active", remarks: "Core application service" },
    ],
    drInfo: {
      drClusterName: "DR-APP-CLU01",
      drClusterIP: "10.40.51.100",
      drNodes: [
        { name: "DRAPP01A", ip: "10.40.51.101", os: "Windows 2019", cDriveSize: "80GB", dDriveSize: "300GB", eDriveSize: "150GB", raidType: "RAID-1" },
      ],
      drServices: [
        { serviceName: "DR-APP-SVC01", serverObjectName: "DRAPP01", virtualIP: "10.40.51.110", driveLetter: "D", osVersion: "Windows 2019" },
      ],
    },
    status: "Active",
    createdDate: "2023-06-10T08:00:00Z",
    createdBy: "admin@company.com",
    lastUpdatedDate: "2025-01-15T09:45:00Z",
    lastUpdatedBy: "jane.smith@company.com",
  },
  {
    id: "cl-003",
    clusterName: "PROD-FILE-CLU01",
    clusterIP: "10.20.32.100",
    nodes: [
      { name: "PRODFILE01A", ip: "10.20.32.101", os: "Windows 2016", cDriveSize: "60GB", dDriveSize: "1TB", eDriveSize: "500GB", raidType: "RAID-10" },
      { name: "PRODFILE01B", ip: "10.20.32.102", os: "Windows 2016", cDriveSize: "60GB", dDriveSize: "1TB", eDriveSize: "500GB", raidType: "RAID-10" },
    ],
    services: [
      { serviceName: "FILE-SVC-01", serverObjectName: "FILEPROD01", virtualIP: "10.20.32.110", driveLetters: "D, E", status: "Maintenance", remarks: "Under scheduled maintenance" },
    ],
    drInfo: null,
    status: "Maintenance",
    createdDate: "2022-03-20T11:00:00Z",
    createdBy: "admin@company.com",
    lastUpdatedDate: "2025-02-18T16:30:00Z",
    lastUpdatedBy: "admin@company.com",
  },
  {
    id: "cl-004",
    clusterName: "PROD-WEB-CLU01",
    clusterIP: "10.20.33.100",
    nodes: [
      { name: "PRODWEB01A", ip: "10.20.33.101", os: "Windows 2022", cDriveSize: "100GB", dDriveSize: "200GB", eDriveSize: "100GB", raidType: "RAID-1" },
    ],
    services: [
      { serviceName: "WEB-SVC-01", serverObjectName: "WEBPROD01", virtualIP: "10.20.33.110", driveLetters: "D", status: "Active", remarks: "" },
    ],
    drInfo: {
      drClusterName: "DR-WEB-CLU01",
      drClusterIP: "10.40.53.100",
      drNodes: [
        { name: "DRWEB01A", ip: "10.40.53.101", os: "Windows 2022", cDriveSize: "100GB", dDriveSize: "200GB", eDriveSize: "100GB", raidType: "RAID-1" },
      ],
      drServices: [
        { serviceName: "DR-WEB-SVC01", serverObjectName: "DRWEB01", virtualIP: "10.40.53.110", driveLetter: "D", osVersion: "Windows 2022" },
      ],
    },
    status: "Active",
    createdDate: "2024-08-05T09:15:00Z",
    createdBy: "john.doe@company.com",
    lastUpdatedDate: "2025-02-22T11:00:00Z",
    lastUpdatedBy: "john.doe@company.com",
  },
  {
    id: "cl-005",
    clusterName: "PROD-LEGACY-CLU01",
    clusterIP: "10.20.34.100",
    nodes: [
      { name: "PRODLEG01A", ip: "10.20.34.101", os: "Windows 2012 R2", cDriveSize: "50GB", dDriveSize: "200GB", eDriveSize: "100GB", raidType: "RAID-5" },
    ],
    services: [
      { serviceName: "LEG-SVC-01", serverObjectName: "LEGPROD01", virtualIP: "10.20.34.110", driveLetters: "D", status: "Offline", remarks: "Pending decommission review" },
    ],
    drInfo: null,
    status: "Offline",
    createdDate: "2020-11-10T07:30:00Z",
    createdBy: "admin@company.com",
    lastUpdatedDate: "2024-12-01T10:00:00Z",
    lastUpdatedBy: "admin@company.com",
  },
  {
    id: "cl-006",
    clusterName: "PROD-DB-CLU02",
    clusterIP: "10.20.35.100",
    nodes: [
      { name: "PRODDB02A", ip: "10.20.35.101", os: "Windows 2019", cDriveSize: "100GB", dDriveSize: "800GB", eDriveSize: "400GB", raidType: "RAID-10" },
      { name: "PRODDB02B", ip: "10.20.35.102", os: "Windows 2019", cDriveSize: "100GB", dDriveSize: "800GB", eDriveSize: "400GB", raidType: "RAID-10" },
    ],
    services: [
      { serviceName: "DB-SVC-RPT", serverObjectName: "DBPROD02", virtualIP: "10.20.35.110", driveLetters: "D, E, F", status: "Active", remarks: "Reporting DB cluster" },
    ],
    drInfo: null,
    status: "Decommissioned",
    createdDate: "2021-04-22T13:00:00Z",
    createdBy: "admin@company.com",
    lastUpdatedDate: "2025-01-10T08:00:00Z",
    lastUpdatedBy: "admin@company.com",
    decommissionDate: "2025-01-10",
    decommissionApprovedBy: "cto@company.com",
    decommissionReason: "Migrated to cloud-based solution",
  },
];

export const mockAuditLog: AuditEntry[] = [
  { id: "a1", clusterId: "cl-001", action: "UPDATE", field: "Node OS", oldValue: "Windows 2019", newValue: "Windows 2022", changedBy: "john.doe@company.com", changedAt: "2025-02-20T14:22:00Z" },
  { id: "a2", clusterId: "cl-003", action: "UPDATE", field: "Status", oldValue: "Active", newValue: "Maintenance", changedBy: "admin@company.com", changedAt: "2025-02-18T16:30:00Z" },
  { id: "a3", clusterId: "cl-006", action: "DECOMMISSION", field: "Status", oldValue: "Active", newValue: "Decommissioned", changedBy: "admin@company.com", changedAt: "2025-01-10T08:00:00Z" },
  { id: "a4", clusterId: "cl-004", action: "CREATE", field: "Cluster", oldValue: "", newValue: "PROD-WEB-CLU01", changedBy: "john.doe@company.com", changedAt: "2024-08-05T09:15:00Z" },
  { id: "a5", clusterId: "cl-002", action: "UPDATE", field: "Virtual IP", oldValue: "10.20.31.109", newValue: "10.20.31.110", changedBy: "jane.smith@company.com", changedAt: "2025-01-15T09:45:00Z" },
];

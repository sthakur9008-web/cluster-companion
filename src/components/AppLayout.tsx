import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Server,
  PlusCircle,
  Archive,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Server },
  { title: "Onboard Cluster", url: "/onboard", icon: PlusCircle },
  { title: "Decommissioned", url: "/decommissioned", icon: Archive },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-200 flex flex-col`}
      >
        {/* Logo area */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-sidebar-accent-foreground truncate">
                WinCluster
              </span>
              <span className="text-[10px] text-sidebar-foreground truncate">
                Lifecycle Manager
              </span>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-mono text-primary">
                AD
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-sidebar-accent-foreground truncate">
                  admin@company.com
                </span>
                <span className="text-[10px] text-sidebar-foreground">Admin</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

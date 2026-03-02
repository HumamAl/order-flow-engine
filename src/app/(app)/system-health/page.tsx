"use client";

import { systemMetrics, serviceHealth, connectionPools } from "@/data/mock-data";
import { formatRelativeDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Cpu,
  HardDrive,
  Activity,
  Wifi,
  Server,
  HeartPulse,
  Database,
} from "lucide-react";

const metricIcons: Record<string, React.ReactNode> = {
  "CPU Usage": <Cpu className="h-4 w-4" />,
  Memory: <Server className="h-4 w-4" />,
  "Disk I/O": <HardDrive className="h-4 w-4" />,
  "Network In": <Wifi className="h-4 w-4" />,
  "Network Out": <Activity className="h-4 w-4" />,
  "Connection Pool": <Database className="h-4 w-4" />,
};

const metricStatusClass: Record<string, string> = {
  healthy: "text-green-600",
  warning: "text-amber-600",
  critical: "text-red-600",
};

const serviceStatusConfig: Record<string, { label: string; className: string; dotClass: string }> = {
  operational: {
    label: "Operational",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
    dotClass: "bg-green-500",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  outage: {
    label: "Outage",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
    dotClass: "bg-red-500",
  },
};

export default function SystemHealthPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Infrastructure metrics, service status, and connection pool overview
        </p>
      </div>

      {/* System metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {systemMetrics.map((metric) => {
          const pct = Math.round((metric.value / metric.max) * 100);
          const icon = metricIcons[metric.name];
          const statusClass = metricStatusClass[metric.status];
          return (
            <div
              key={metric.name}
              className="aesthetic-card"
              style={{ padding: "var(--card-padding)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("text-muted-foreground", statusClass)}>
                    {icon}
                  </span>
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <span className={cn("text-xs font-medium uppercase tracking-wide", statusClass)}>
                  {metric.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={cn("text-2xl font-bold font-mono", statusClass)}>
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {metric.max} {metric.unit}
                </span>
              </div>
              <Progress
                value={pct}
                className={cn(
                  "h-2",
                  metric.status === "warning" && "[&>div]:bg-amber-500",
                  metric.status === "critical" && "[&>div]:bg-red-500"
                )}
              />
              <span className="text-[11px] text-muted-foreground font-mono mt-1 block">
                {pct}% utilized
              </span>
            </div>
          );
        })}
      </div>

      {/* Service health table */}
      <div className="aesthetic-card overflow-hidden">
        <div
          className="flex items-center gap-2 border-b border-border/60"
          style={{ padding: "var(--card-padding)" }}
        >
          <HeartPulse className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Service Health</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {serviceHealth.filter((s) => s.status === "operational").length}/{serviceHealth.length} operational
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Uptime</TableHead>
              <TableHead className="text-right hidden md:table-cell">Response Time</TableHead>
              <TableHead className="hidden lg:table-cell">Last Incident</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceHealth.map((service) => {
              const config = serviceStatusConfig[service.status];
              return (
                <TableRow
                  key={service.name}
                  className="group hover:bg-surface-hover transition-colors duration-100"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-block h-2 w-2 rounded-full shrink-0",
                          config.dotClass
                        )}
                      />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-medium", config.className)}
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                    {service.uptime.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                    {service.responseTime}ms
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {service.lastIncident
                      ? formatRelativeDate(service.lastIncident)
                      : <span className="text-green-600 text-xs">None recorded</span>
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Connection pool overview */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Connection Pool Overview</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectionPools.map((pool) => {
            const utilization = Math.round(
              (pool.activeConnections / pool.maxConnections) * 100
            );
            const isHigh = utilization > 80;
            return (
              <div
                key={pool.name}
                className="border border-border/60 rounded-md p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{pool.name}</span>
                  <span
                    className={cn(
                      "text-xs font-mono font-medium",
                      isHigh ? "text-amber-600" : "text-muted-foreground"
                    )}
                  >
                    {utilization}%
                  </span>
                </div>
                <Progress
                  value={utilization}
                  className={cn("h-1.5", isHigh && "[&>div]:bg-amber-500")}
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    <span className="font-mono text-foreground">{pool.activeConnections}</span> active
                  </span>
                  <span>
                    <span className="font-mono text-foreground">{pool.idleConnections}</span> idle
                  </span>
                  <span>
                    <span className="font-mono text-foreground">{pool.maxConnections}</span> max
                  </span>
                </div>
                {pool.waitingRequests > 0 && (
                  <div className="text-[11px] text-amber-600 font-medium">
                    {pool.waitingRequests} requests waiting
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { apiEndpoints, apiLatencyTimeSeries } from "@/data/mock-data";
import { formatNumber } from "@/lib/formatters";
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
import {
  Activity,
  Clock,
  Gauge,
  AlertTriangle,
  Zap,
} from "lucide-react";

// SSR-safe chart wrapper
const LatencyChart = dynamic(() => import("./latency-chart"), { ssr: false });

const methodColors: Record<string, string> = {
  GET: "bg-green-500/10 text-green-600 border-green-500/20",
  POST: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  PATCH: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusDot: Record<string, string> = {
  healthy: "bg-green-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

export default function ApiMonitorPage() {
  const totalEndpoints = apiEndpoints.length;
  const avgLatency = Math.round(
    apiEndpoints.reduce((sum, ep) => sum + ep.avgLatencyMs, 0) / totalEndpoints
  );
  const totalReqPerMin = apiEndpoints.reduce((sum, ep) => sum + ep.requestsPerMin, 0);
  const degradedCount = apiEndpoints.filter(
    (ep) => ep.status === "degraded" || ep.status === "down"
  ).length;

  const summaryStats = [
    { label: "Total Endpoints", value: totalEndpoints.toString(), icon: Activity, accent: false },
    { label: "Avg Latency", value: `${avgLatency}ms`, icon: Clock, accent: false },
    { label: "Requests / min", value: formatNumber(totalReqPerMin), icon: Zap, accent: false },
    {
      label: "Degraded",
      value: degradedCount.toString(),
      icon: AlertTriangle,
      accent: degradedCount > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">API Monitor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Endpoint performance, latency trends, and error tracking
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="aesthetic-card"
            style={{ padding: "var(--card-padding)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <span
              className={cn(
                "text-2xl font-bold font-mono",
                stat.accent && "text-amber-600"
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Latency chart */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Latency Over 24 Hours</span>
        </div>
        <LatencyChart data={apiLatencyTimeSeries} />
      </div>

      {/* Endpoint table */}
      <div className="aesthetic-card overflow-hidden">
        <div
          className="flex items-center gap-2 border-b border-border/60"
          style={{ padding: "var(--card-padding)" }}
        >
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Endpoint Performance</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Method</TableHead>
              <TableHead>Path</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Avg</TableHead>
              <TableHead className="text-right hidden md:table-cell">P95</TableHead>
              <TableHead className="text-right hidden lg:table-cell">P99</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Req/min</TableHead>
              <TableHead className="text-right">Error %</TableHead>
              <TableHead className="w-[70px] text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiEndpoints.map((ep) => (
              <TableRow
                key={ep.id}
                className="group hover:bg-surface-hover transition-colors duration-100"
              >
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-mono font-medium",
                      methodColors[ep.method]
                    )}
                  >
                    {ep.method}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{ep.path}</TableCell>
                <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                  {ep.avgLatencyMs}ms
                </TableCell>
                <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                  {ep.p95LatencyMs}ms
                </TableCell>
                <TableCell className="text-right font-mono text-sm hidden lg:table-cell">
                  {ep.p99LatencyMs}ms
                </TableCell>
                <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                  {formatNumber(ep.requestsPerMin)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm",
                    ep.errorRate > 2 && "text-red-600 font-medium"
                  )}
                >
                  {ep.errorRate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <span
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        statusDot[ep.status]
                      )}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

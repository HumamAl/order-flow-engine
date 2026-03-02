"use client";

import { useState } from "react";
import { slowQueries, connectionPools } from "@/data/mock-data";
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
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Search,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Server,
} from "lucide-react";

const severityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  high: { label: "High", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  critical: { label: "Critical", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function QueryInspectorPage() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Query Inspector</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Database query performance analysis and optimization suggestions
        </p>
      </div>

      {/* Connection pool utilization */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Connection Pool Utilization</span>
        </div>
        <div className="space-y-4">
          {connectionPools.map((pool) => {
            const utilization = Math.round(
              (pool.activeConnections / pool.maxConnections) * 100
            );
            return (
              <div key={pool.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pool.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      <span className="font-mono text-foreground">{pool.activeConnections}</span> active
                    </span>
                    <span>
                      <span className="font-mono text-foreground">{pool.idleConnections}</span> idle
                    </span>
                    <span>
                      <span className="font-mono text-foreground">{pool.maxConnections}</span> max
                    </span>
                    {pool.waitingRequests > 0 && (
                      <span className="text-amber-600 font-medium">
                        {pool.waitingRequests} waiting
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress
                    value={utilization}
                    className={cn(
                      "h-2 flex-1",
                      utilization > 80 && "[&>div]:bg-amber-500",
                      utilization > 90 && "[&>div]:bg-red-500"
                    )}
                  />
                  <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                    {utilization}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slow queries table */}
      <div className="aesthetic-card overflow-hidden">
        <div
          className="flex items-center gap-2 border-b border-border/60"
          style={{ padding: "var(--card-padding)" }}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Slow Queries</span>
          <span className="text-xs text-muted-foreground ml-auto font-mono">
            {slowQueries.length} queries tracked
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32px]" />
              <TableHead>Query</TableHead>
              <TableHead className="hidden md:table-cell">Table</TableHead>
              <TableHead className="text-right">Avg</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Max</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Executions</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slowQueries.map((sq) => {
              const isExpanded = expandedRows.has(sq.id);
              const sev = severityConfig[sq.severity];
              return (
                <>
                  <TableRow
                    key={sq.id}
                    className="group hover:bg-surface-hover transition-colors duration-100 cursor-pointer"
                    onClick={() => toggleRow(sq.id)}
                  >
                    <TableCell className="pr-0">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted/50 px-1.5 py-0.5 rounded max-w-[300px] lg:max-w-[420px] inline-block truncate">
                        {sq.query}
                      </code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">
                      {sq.table}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {sq.avgTimeMs}ms
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                      {formatNumber(sq.maxTimeMs)}ms
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden lg:table-cell">
                      {formatNumber(sq.executionCount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-[11px] font-medium", sev?.className)}
                      >
                        {sev?.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${sq.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/30 p-0">
                        <div className="px-6 py-4 space-y-3">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                              Full Query
                            </span>
                            <code className="block text-xs font-mono bg-background border border-border/60 rounded-md p-3 whitespace-pre-wrap break-all leading-relaxed">
                              {sq.query}
                            </code>
                          </div>
                          {sq.indexSuggestion && (
                            <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-md p-3">
                              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-medium block mb-1">
                                  Index Suggestion
                                </span>
                                <code className="text-xs font-mono text-muted-foreground leading-relaxed">
                                  {sq.indexSuggestion}
                                </code>
                              </div>
                            </div>
                          )}
                          {!sq.indexSuggestion && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Database className="h-3.5 w-3.5" />
                              No index optimization needed — query is adequately indexed.
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

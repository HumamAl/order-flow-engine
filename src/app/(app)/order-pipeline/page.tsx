"use client";

import { useState } from "react";
import { orders, pipelineStages } from "@/data/mock-data";
import { formatCurrency, formatRelativeDate } from "@/lib/formatters";
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
  ArrowRight,
  Filter,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type FilterKey = "all" | "active" | "completed" | "issues";

const filterGroups: { key: FilterKey; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Orders", icon: <Package className="h-3.5 w-3.5" /> },
  { key: "active", label: "Active", icon: <Clock className="h-3.5 w-3.5" /> },
  { key: "completed", label: "Completed", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { key: "issues", label: "Issues", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_payment: { label: "Pending Payment", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  processing: { label: "Processing", className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  quality_check: { label: "Quality Check", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  shipped: { label: "Shipped", className: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  returned: { label: "Returned", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  standard: { label: "Standard", className: "bg-muted text-muted-foreground" },
  express: { label: "Express", className: "bg-primary/10 text-primary" },
  overnight: { label: "Overnight", className: "bg-destructive/10 text-destructive" },
};

function filterOrders(filter: FilterKey) {
  switch (filter) {
    case "active":
      return orders.filter((o) =>
        ["pending_payment", "confirmed", "processing", "quality_check", "shipped"].includes(o.status)
      );
    case "completed":
      return orders.filter((o) => o.status === "delivered");
    case "issues":
      return orders.filter((o) => ["cancelled", "returned"].includes(o.status));
    default:
      return orders;
  }
}

export default function OrderPipelinePage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const filteredOrders = filterOrders(filter);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Order Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track orders through every fulfillment stage
        </p>
      </div>

      {/* Pipeline visualization */}
      <div className="aesthetic-card" style={{ padding: "var(--card-padding)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Pipeline Overview</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {pipelineStages.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-1 min-w-0">
              <div className="flex flex-col items-center min-w-[100px] px-2 py-2 rounded-md bg-muted/50">
                <span className="text-lg font-bold font-mono">{stage.count}</span>
                <span className="text-[11px] text-muted-foreground text-center whitespace-nowrap">
                  {stage.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {stage.avgProcessingTime}
                </span>
              </div>
              {i < pipelineStages.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 pb-px">
        {filterGroups.map((group) => {
          const count =
            group.key === "all"
              ? orders.length
              : filterOrders(group.key).length;
          return (
            <button
              key={group.key}
              onClick={() => setFilter(group.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors duration-100 border-b-2 -mb-px",
                filter === group.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {group.icon}
              {group.label}
              <span className="ml-1 text-xs font-mono text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders table */}
      <div className="aesthetic-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden lg:table-cell">Items</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Channel</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const priority = priorityConfig[order.priority];
              return (
                <TableRow
                  key={order.id}
                  className="group hover:bg-surface-hover transition-colors duration-100"
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm font-medium">{order.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-medium", status?.className)}
                    >
                      {status?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground uppercase tracking-wide text-[11px]">
                      {order.channel}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={cn("text-[11px]", priority?.className)}
                    >
                      {priority?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                    {formatRelativeDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No orders match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

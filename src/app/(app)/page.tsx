"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  CircleDot,
  Clock,
  Gauge,
  Layers,
  Signal,
  Timer,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import {
  dashboardStats,
  pipelineStages,
  throughputData,
  activityFeed,
  serviceHealth,
} from "@/data/mock-data";
import { formatCurrency, formatNumber, formatCompactNumber } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Animated Counter Hook ────────────────────────────────────────
function useCountUp(target: number, duration = 1000, decimals = 0) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration, decimals]);

  return value;
}

// ── Staggered Reveal Wrapper ─────────────────────────────────────
function StaggerChild({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Throughput Chart (SSR-safe) ──────────────────────────────────
const ThroughputChart = dynamic(
  () =>
    import("recharts").then((mod) => {
      const {
        ResponsiveContainer,
        AreaChart,
        Area,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
      } = mod;

      function Chart() {
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={throughputData}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.45 0.18 265)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.45 0.18 265)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.01 265)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  fontFamily: "var(--font-geist-mono)",
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value) => [`${value} orders/min`, "Throughput"]}
              />
              <Area
                type="monotone"
                dataKey="ordersPerMin"
                stroke="oklch(0.45 0.18 265)"
                strokeWidth={2}
                fill="url(#throughputGradient)"
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      }

      Chart.displayName = "ThroughputChart";
      return Chart;
    }),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse bg-muted/30 rounded-md" /> }
);

// ── Severity Color Map ───────────────────────────────────────────
function severityDotClass(severity: string) {
  switch (severity) {
    case "success":
      return "bg-success";
    case "warning":
      return "bg-warning";
    case "error":
      return "bg-destructive";
    case "info":
    default:
      return "bg-primary";
  }
}

function severityIcon(severity: string) {
  switch (severity) {
    case "success":
      return <CheckCircle2 className="size-3.5 text-success shrink-0" />;
    case "warning":
      return <AlertTriangle className="size-3.5 text-warning shrink-0" />;
    case "error":
      return <XCircle className="size-3.5 text-destructive shrink-0" />;
    case "info":
    default:
      return <Info className="size-3.5 text-primary shrink-0" />;
  }
}

// ── Relative Time ────────────────────────────────────────────────
function relativeTime(timestamp: string) {
  const now = new Date("2026-03-01T18:00:00Z");
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

// ── Service Status Color ─────────────────────────────────────────
function serviceStatusColor(status: string) {
  switch (status) {
    case "operational":
      return "bg-success";
    case "degraded":
      return "bg-warning";
    case "outage":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
}

// ── Pipeline Stage Color ─────────────────────────────────────────
function pipelineStageColor(stage: string) {
  switch (stage) {
    case "pending_payment":
      return {
        bg: "bg-warning/10",
        border: "border-warning/30",
        text: "text-warning",
        accent: "oklch(0.769 0.188 70.08)",
      };
    case "confirmed":
      return {
        bg: "bg-primary/10",
        border: "border-primary/30",
        text: "text-primary",
        accent: "oklch(0.45 0.18 265)",
      };
    case "processing":
      return {
        bg: "bg-chart-2/10",
        border: "border-chart-2/30",
        text: "text-chart-2",
        accent: "oklch(0.60 0.15 200)",
      };
    case "quality_check":
      return {
        bg: "bg-chart-3/10",
        border: "border-chart-3/30",
        text: "text-chart-3",
        accent: "oklch(0.50 0.12 290)",
      };
    case "shipped":
      return {
        bg: "bg-chart-4/10",
        border: "border-chart-4/30",
        text: "text-chart-4",
        accent: "oklch(0.65 0.18 180)",
      };
    case "delivered":
      return {
        bg: "bg-success/10",
        border: "border-success/30",
        text: "text-success",
        accent: "oklch(0.627 0.194 149.214)",
      };
    default:
      return {
        bg: "bg-muted",
        border: "border-border",
        text: "text-muted-foreground",
        accent: "oklch(0.50 0 0)",
      };
  }
}

// ══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const ordersToday = useCountUp(dashboardStats.totalOrdersToday, 1200);
  const revenueToday = useCountUp(dashboardStats.revenueToday, 1400);
  const ordersPerMin = useCountUp(dashboardStats.ordersPerMinute, 1000, 1);
  const avgLatency = useCountUp(dashboardStats.avgLatencyMs, 900);
  const errorRate = useCountUp(dashboardStats.errorRate, 800, 2);
  const uptime = useCountUp(dashboardStats.uptimePercent, 1100, 2);
  const connections = useCountUp(dashboardStats.activeConnections, 1000);
  const avgOrderVal = useCountUp(dashboardStats.avgOrderValue, 1000, 2);

  // Pipeline active filter
  const [activePipelineStage, setActivePipelineStage] = useState<string | null>(null);

  // Simulated "live" pulse on the pipeline counts
  const [pulseIndex, setPulseIndex] = useState(-1);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % pipelineStages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container space-y-[var(--section-gap)]">
      {/* ── Section: Live Metrics Ticker ─────────────────────────── */}
      <StaggerChild index={0}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">Operations Command Center</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-success" />
            </span>
            <span className="text-[11px] font-mono text-success">LIVE</span>
          </div>
        </div>
      </StaggerChild>

      {/* ── Metrics Ticker Row ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-[var(--grid-gap)]">
        {[
          { label: "Orders Today", value: formatNumber(ordersToday), icon: Layers, sub: null },
          { label: "Revenue", value: formatCurrency(revenueToday), icon: Zap, sub: null },
          { label: "Avg Order", value: `$${avgOrderVal.toFixed(2)}`, icon: Gauge, sub: null },
          { label: "Orders/min", value: ordersPerMin.toFixed(1), icon: Activity, sub: null },
          { label: "Avg Latency", value: `${avgLatency}ms`, icon: Timer, sub: avgLatency < 100 ? "healthy" : "warning" },
          { label: "Error Rate", value: `${errorRate.toFixed(2)}%`, icon: AlertTriangle, sub: errorRate < 1 ? "healthy" : "warning" },
          { label: "Connections", value: formatNumber(connections), icon: Signal, sub: null },
          { label: "Uptime", value: `${uptime.toFixed(2)}%`, icon: CheckCircle2, sub: "healthy" },
        ].map((metric, i) => (
          <StaggerChild key={metric.label} index={i + 1}>
            <div className="aesthetic-card p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {metric.label}
                </span>
                <metric.icon className="size-3 text-muted-foreground/60" />
              </div>
              <span
                className={cn(
                  "text-base font-bold font-mono tabular-nums",
                  metric.sub === "warning" && "text-warning",
                  metric.sub === "healthy" && "text-foreground"
                )}
              >
                {metric.value}
              </span>
            </div>
          </StaggerChild>
        ))}
      </div>

      {/* ── Section: Order Flow Pipeline (HERO) ──────────────────── */}
      <StaggerChild index={9}>
        <div className="aesthetic-card overflow-hidden" style={{ padding: "var(--card-padding)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CircleDot className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Order Flow Pipeline</h2>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              {formatNumber(pipelineStages.reduce((s, p) => s + p.count, 0))} total in pipeline
            </Badge>
          </div>

          {/* Pipeline visualization */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 hidden lg:block" />

            {/* Flow animation overlay */}
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 overflow-hidden hidden lg:block">
              <div
                className="h-full w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                style={{
                  animation: "flowPulse 3s linear infinite",
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {pipelineStages.map((stage, i) => {
                const colors = pipelineStageColor(stage.stage);
                const isActive = activePipelineStage === stage.stage;
                const isPulsing = pulseIndex === i;

                return (
                  <button
                    key={stage.stage}
                    onClick={() =>
                      setActivePipelineStage(
                        activePipelineStage === stage.stage ? null : stage.stage
                      )
                    }
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-2 p-3 rounded-[var(--radius)] border transition-all",
                      "hover:scale-[1.02] cursor-pointer text-center",
                      isActive
                        ? `${colors.bg} ${colors.border} border-2`
                        : "bg-card border-border/60 hover:border-primary/30"
                    )}
                  >
                    {/* Stage count — hero number */}
                    <div className="relative">
                      <span
                        className={cn(
                          "text-2xl font-bold font-mono tabular-nums",
                          isActive ? colors.text : "text-foreground"
                        )}
                      >
                        {stage.count}
                      </span>
                      {isPulsing && (
                        <span className="absolute -top-1 -right-2">
                          <span className="relative flex size-2">
                            <span
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{ backgroundColor: colors.accent }}
                            />
                            <span
                              className="relative inline-flex rounded-full size-2"
                              style={{ backgroundColor: colors.accent }}
                            />
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Stage label */}
                    <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                      {stage.label}
                    </span>

                    {/* Throughput & processing time */}
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex items-center justify-between text-[9px] text-muted-foreground/70">
                        <span className="font-mono">{stage.throughputPerHour}/hr</span>
                        <span className="font-mono">{stage.avgProcessingTime}</span>
                      </div>
                      {/* Mini throughput bar */}
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.min((stage.throughputPerHour / 52) * 100, 100)}%`,
                            backgroundColor: colors.accent,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </div>

                    {/* Arrow connector (between stages, desktop only) */}
                    {i < pipelineStages.length - 1 && (
                      <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 z-20 hidden lg:block">
                        <ChevronRight className="size-4 text-border" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pipeline detail panel (when a stage is selected) */}
          {activePipelineStage && (
            <div className="mt-4 pt-4 border-t border-border/60">
              {(() => {
                const stage = pipelineStages.find((s) => s.stage === activePipelineStage);
                if (!stage) return null;
                const colors = pipelineStageColor(stage.stage);
                return (
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="outline" className={cn("text-xs font-mono", colors.text)}>
                      {stage.label}
                    </Badge>
                    <span className="text-muted-foreground">
                      <span className="font-mono font-bold text-foreground">{stage.count}</span>{" "}
                      orders in this stage
                    </span>
                    <span className="text-muted-foreground">
                      Avg processing:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {stage.avgProcessingTime}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Throughput:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {stage.throughputPerHour}/hr
                      </span>
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </StaggerChild>

      {/* ── Two-column: Throughput Chart + Activity Feed ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[var(--grid-gap)]">
        {/* Throughput Chart — 3 cols */}
        <StaggerChild index={10} className="lg:col-span-3">
          <div
            className="aesthetic-card h-full"
            style={{ padding: "var(--card-padding)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gauge className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">Order Throughput</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Last 6 hours</span>
            </div>
            <ThroughputChart />
          </div>
        </StaggerChild>

        {/* Activity Feed — 2 cols */}
        <StaggerChild index={11} className="lg:col-span-2">
          <div
            className="aesthetic-card h-full flex flex-col"
            style={{ padding: "var(--card-padding)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">Activity Feed</h2>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {activityFeed.length} events
              </Badge>
            </div>

            <div className="flex-1 space-y-0 overflow-y-auto max-h-[232px]">
              {activityFeed.slice(0, 8).map((event, i) => (
                <div
                  key={event.id}
                  className={cn(
                    "flex items-start gap-2.5 py-2 border-b border-border/40 last:border-0",
                    "hover:bg-surface-hover transition-colors rounded-sm px-1 -mx-1"
                  )}
                >
                  {/* Severity indicator */}
                  <div className="mt-1.5 shrink-0">
                    {severityIcon(event.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/90 leading-relaxed line-clamp-2">
                      {event.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground/60">
                        {relativeTime(event.timestamp)}
                      </span>
                      <span
                        className={cn(
                          "inline-block size-1.5 rounded-full",
                          severityDotClass(event.severity)
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerChild>
      </div>

      {/* ── Service Health Strip ──────────────────────────────────── */}
      <StaggerChild index={12}>
        <div
          className="aesthetic-card"
          style={{ padding: "var(--card-padding-sm, 1rem)" }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Signal className="size-3.5 text-primary" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Service Health
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {serviceHealth.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] bg-muted/30 hover:bg-surface-hover transition-colors"
              >
                <span
                  className={cn(
                    "shrink-0 size-2 rounded-full",
                    serviceStatusColor(service.status)
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium truncate">{service.name}</p>
                  <p className="text-[9px] font-mono text-muted-foreground/70">
                    {service.responseTime}ms &middot; {service.uptime}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StaggerChild>

      {/* ── Bottom Banner — Conversion CTA ────────────────────────── */}
      <StaggerChild index={13}>
        <div className="aesthetic-card p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            This is a live demo built for your project
          </p>
          <div className="flex gap-3">
            <Link
              href="/challenges"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              My Approach <ArrowRight className="size-3" />
            </Link>
            <Link
              href="/proposal"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Work With Me <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </StaggerChild>

      {/* ── Keyframe injection for pipeline flow animation ─────────── */}
      <style jsx global>{`
        @keyframes flowPulse {
          0% {
            transform: translateX(-64px);
          }
          100% {
            transform: translateX(calc(100% + 64px));
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Database,
  Zap,
  Webhook,
  CheckCircle2,
  XCircle,
  Server,
  RotateCcw,
  ShieldAlert,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { challenges, executiveSummary } from "@/data/challenges";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ── Animated Counter Hook ──────────────────────────────────────
function useCountUp(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || hasAnimated.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, enabled]);

  return { value, ref };
}

// ── Challenge 1: Before/After Visualization ────────────────────
function QueryBeforeAfter() {
  const [optimized, setOptimized] = useState(false);

  const metrics = [
    {
      label: "Avg Query Time",
      before: "890 ms",
      after: "~45 ms",
      beforeColor: "text-destructive",
      afterColor: "text-[color:var(--success)]",
    },
    {
      label: "Max Query Time (P99)",
      before: "3,400 ms",
      after: "~120 ms",
      beforeColor: "text-destructive",
      afterColor: "text-[color:var(--success)]",
    },
    {
      label: "Index Strategy",
      before: "Full table scan",
      after: "Composite (customer_id, created_at)",
      beforeColor: "text-[color:var(--warning)]",
      afterColor: "text-[color:var(--success)]",
    },
    {
      label: "Aggregation",
      before: "On-the-fly SUM/COUNT",
      after: "Incremental materialized view",
      beforeColor: "text-[color:var(--warning)]",
      afterColor: "text-[color:var(--success)]",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs font-medium font-mono px-2 py-0.5 rounded",
              !optimized
                ? "bg-destructive/10 text-destructive"
                : "bg-[color:var(--success)]/10 text-[color:var(--success)]"
            )}
          >
            {optimized ? "OPTIMIZED" : "CURRENT"}
          </span>
          <span className="text-xs text-muted-foreground">
            Toggle to compare
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Before</span>
          <Switch checked={optimized} onCheckedChange={setOptimized} />
          <span className="text-xs text-muted-foreground">After</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="border border-border/60 rounded-lg p-3 space-y-1"
          >
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              {m.label}
            </p>
            <p
              className={cn(
                "text-sm font-mono font-semibold transition-all duration-200",
                optimized ? m.afterColor : m.beforeColor
              )}
            >
              {optimized ? m.after : m.before}
            </p>
          </div>
        ))}
      </div>

      {optimized && (
        <div className="border border-border/60 rounded-lg p-3 bg-secondary/50">
          <p className="text-xs font-mono text-muted-foreground mb-1">
            -- Suggested index
          </p>
          <code className="text-xs font-mono text-foreground">
            CREATE INDEX idx_orders_customer_ltv ON orders (customer_id,
            created_at) INCLUDE (total_amount);
          </code>
        </div>
      )}
    </div>
  );
}

// ── Challenge 2: Animated Metrics Visualization ────────────────
function ScalabilityMetrics() {
  const throughputCurrent = useCountUp(210, 1000);
  const throughputTarget = useCountUp(2000, 1400);
  const errorCurrent = useCountUp(21, 900); // displayed as 2.1%
  const latencyCurrent = useCountUp(890, 1000);

  return (
    <div className="space-y-5">
      {/* Throughput */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Throughput (req/min)
          </span>
          <div className="flex items-center gap-2">
            <span
              ref={throughputCurrent.ref}
              className="text-xs font-mono text-destructive"
            >
              {throughputCurrent.value}
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span
              ref={throughputTarget.ref}
              className="text-xs font-mono text-[color:var(--success)] font-semibold"
            >
              {throughputTarget.value}+
            </span>
          </div>
        </div>
        <div className="flex gap-1 h-3">
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <Progress value={10.5} className="h-3 bg-destructive/15" />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
              Current: 210
            </span>
          </div>
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <Progress
              value={100}
              className="h-3 [&>[data-slot=progress-indicator]]:bg-[color:var(--success)]"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white">
              Target: 2,000+
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Redis-backed stock cache + read replicas eliminate DB bottleneck
        </p>
      </div>

      {/* Error Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Error Rate
          </span>
          <div className="flex items-center gap-2">
            <span
              ref={errorCurrent.ref}
              className="text-xs font-mono text-destructive"
            >
              {(errorCurrent.value / 10).toFixed(1)}%
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono text-[color:var(--success)] font-semibold">
              &lt; 0.1%
            </span>
          </div>
        </div>
        <div className="flex gap-1 h-3">
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-destructive transition-all duration-1000" style={{ width: "42%" }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
              Current: 2.1%
            </span>
          </div>
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-[color:var(--success)] transition-all duration-1000" style={{ width: "2%" }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
              Target: &lt; 0.1%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Connection pool tuning + circuit breakers prevent cascade failures
        </p>
      </div>

      {/* P99 Latency */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            P99 Latency
          </span>
          <div className="flex items-center gap-2">
            <span
              ref={latencyCurrent.ref}
              className="text-xs font-mono text-[color:var(--warning)]"
            >
              {latencyCurrent.value} ms
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono text-[color:var(--success)] font-semibold">
              &lt; 200 ms
            </span>
          </div>
        </div>
        <div className="flex gap-1 h-3">
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-[color:var(--warning)] transition-all duration-1000" style={{ width: "89%" }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
              Current: 890 ms
            </span>
          </div>
          <div className="relative flex-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-[color:var(--success)] transition-all duration-1000" style={{ width: "20%" }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-muted-foreground">
              Target: &lt; 200 ms
            </span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Horizontal auto-scaling + request-level timeouts cap tail latency
        </p>
      </div>
    </div>
  );
}

// ── Challenge 3: Architecture Diagram ──────────────────────────
function WebhookArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "event",
      label: "Order Event",
      sublabel: "status_changed",
      icon: Zap,
      color: "border-primary bg-primary/5",
    },
    {
      id: "queue",
      label: "Message Queue",
      sublabel: "SQS / RabbitMQ",
      icon: Server,
      color: "border-[color:var(--accent)] bg-[color:var(--accent)]/5",
    },
    {
      id: "retry",
      label: "Retry Handler",
      sublabel: "Exp. backoff, 3 attempts",
      icon: RotateCcw,
      color: "border-[color:var(--warning)] bg-[color:var(--warning)]/5",
    },
    {
      id: "circuit",
      label: "Circuit Breaker",
      sublabel: "Half-open probe every 30s",
      icon: ShieldAlert,
      color: "border-destructive bg-destructive/5",
    },
    {
      id: "endpoint",
      label: "Webhook Endpoint",
      sublabel: "Partner callback URL",
      icon: Webhook,
      color: "border-[color:var(--success)] bg-[color:var(--success)]/5",
    },
  ];

  const dlq = {
    id: "dlq",
    label: "Dead Letter Queue",
    sublabel: "Manual review + alerting",
    icon: Inbox,
  };

  return (
    <div className="space-y-4">
      {/* Main flow */}
      <div className="flex flex-col gap-2">
        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-center gap-1.5">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setActiveNode(activeNode === node.id ? null : node.id)
                }
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-all cursor-pointer",
                  "hover:shadow-sm",
                  activeNode === node.id
                    ? node.color
                    : "border-border/60 bg-card"
                )}
              >
                <node.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    activeNode === node.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                />
                <div className="text-left">
                  <p className="text-xs font-medium leading-tight">
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {node.sublabel}
                  </p>
                </div>
              </button>
              {i < nodes.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex flex-col gap-1.5 md:hidden">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center gap-1.5">
              <button
                onClick={() =>
                  setActiveNode(activeNode === node.id ? null : node.id)
                }
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 w-full transition-all cursor-pointer",
                  "hover:shadow-sm",
                  activeNode === node.id
                    ? node.color
                    : "border-border/60 bg-card"
                )}
              >
                <node.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    activeNode === node.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                />
                <div className="text-left">
                  <p className="text-xs font-medium leading-tight">
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {node.sublabel}
                  </p>
                </div>
              </button>
              {i < nodes.length - 1 && (
                <div className="w-px h-3 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dead Letter Queue branch */}
      <div className="flex items-center gap-2 ml-0 md:ml-[calc(50%-4rem)]">
        <div className="hidden md:block w-px h-6 bg-border ml-8" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-destructive/40 hidden md:block" />
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
            <dlq.icon className="w-4 h-4 text-destructive shrink-0" />
            <div>
              <p className="text-xs font-medium text-destructive">
                {dlq.label}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {dlq.sublabel}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            After 3 failures
          </Badge>
        </div>
      </div>

      {/* Active node detail */}
      {activeNode && (
        <div className="border border-border/60 rounded-lg p-3 bg-secondary/30 text-xs space-y-1">
          <p className="font-medium">
            {nodes.find((n) => n.id === activeNode)?.label ||
              dlq.label}
          </p>
          <p className="text-muted-foreground">
            {activeNode === "event" &&
              "Emitted on every order status transition. Payload includes order ID, old/new status, timestamp, and metadata."}
            {activeNode === "queue" &&
              "Decouples event production from webhook delivery. Guarantees at-least-once delivery with message deduplication."}
            {activeNode === "retry" &&
              "Exponential backoff: 1s, 4s, 16s. Jitter added to prevent thundering herd on partner endpoint recovery."}
            {activeNode === "circuit" &&
              "Opens after 5 consecutive failures. Half-open probe every 30s. Prevents wasting resources on a known-down endpoint."}
            {activeNode === "endpoint" &&
              "Partner-registered HTTPS callback. Payload signed with HMAC-SHA256. 5s timeout, 200-299 = success."}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Challenge Icon Map ─────────────────────────────────────────
const challengeIcons: Record<string, typeof Database> = {
  "query-performance": Database,
  "api-scalability": Zap,
  "api-integration": Webhook,
};

// ── Challenge Visualization Map ────────────────────────────────
const challengeViz: Record<string, () => React.ReactNode> = {
  "query-performance": () => <QueryBeforeAfter />,
  "api-scalability": () => <ScalabilityMetrics />,
  "api-integration": () => <WebhookArchitecture />,
};

// ── Page Component ─────────────────────────────────────────────
export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ── Page Heading ─────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Three backend bottlenecks, three concrete optimization paths
          </p>
        </div>

        {/* ── Executive Summary ────────────────────────────────── */}
        <div
          className="rounded-lg p-5 space-y-3"
          style={{ background: "var(--section-dark)" }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to the live demo
          </Link>
          <p className="text-sm leading-relaxed text-white/80">
            {executiveSummary}
          </p>
        </div>

        {/* ── Challenge Cards ─────────────────────────────────── */}
        <div className="space-y-6">
          {challenges.map((challenge, index) => {
            const Icon = challengeIcons[challenge.id] || Database;
            const renderViz = challengeViz[challenge.id];

            return (
              <div
                key={challenge.id}
                className="aesthetic-card p-5 sm:p-6 space-y-5"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </Badge>
                      <h2 className="text-base font-semibold leading-tight">
                        {challenge.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Visualization */}
                <div className="border border-border/40 rounded-lg p-4 bg-secondary/20">
                  {renderViz ? renderViz() : null}
                </div>

                {/* Outcome */}
                {challenge.outcome && (
                  <div className="flex items-start gap-2 pt-1 border-t border-border/40">
                    <CheckCircle2 className="w-4 h-4 text-[color:var(--success)] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[color:var(--success)]">
                      {challenge.outcome}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA Closer ──────────────────────────────────────── */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">
              Ready to see the plan in action?
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              The proposal page outlines timeline, process, and how we&apos;d
              work together.
            </p>
          </div>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            View Proposal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

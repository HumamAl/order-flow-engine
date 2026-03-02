import type { LucideIcon } from "lucide-react";

// Sidebar navigation
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ── Order Management Domain Types ─────────────────────────────

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "quality_check"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  channel: "web" | "api" | "mobile" | "pos";
  priority: "standard" | "express" | "overnight";
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  warehouse: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: "standard" | "premium" | "enterprise";
  totalOrders: number;
  lifetimeValue: number;
}

// ── Pipeline Stage ────────────────────────────────────────────

export interface PipelineStage {
  stage: OrderStatus;
  label: string;
  count: number;
  avgProcessingTime: string;
  throughputPerHour: number;
}

// ── API Monitoring ────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerMin: number;
  errorRate: number;
  lastCalled: string;
  status: "healthy" | "degraded" | "down";
}

export interface ApiLatencyPoint {
  time: string;
  avgMs: number;
  p95Ms: number;
  p99Ms: number;
}

// ── Database / Query Performance ──────────────────────────────

export interface SlowQuery {
  id: string;
  query: string;
  table: string;
  avgTimeMs: number;
  maxTimeMs: number;
  executionCount: number;
  lastExecuted: string;
  indexSuggestion: string | null;
  severity: "low" | "medium" | "high" | "critical";
}

export interface DbConnectionPool {
  name: string;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
  waitingRequests: number;
}

// ── System Health ─────────────────────────────────────────────

export interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
}

export interface ServiceHealth {
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  responseTime: number;
  lastIncident: string | null;
}

// ── Activity Feed ─────────────────────────────────────────────

export type ActivityType =
  | "order_created"
  | "order_shipped"
  | "order_delivered"
  | "payment_received"
  | "api_error"
  | "slow_query"
  | "deployment"
  | "scale_event";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "success";
}

// ── Chart Data ────────────────────────────────────────────────

export interface ThroughputPoint {
  time: string;
  ordersPerMin: number;
  successRate: number;
}

export interface MonthlyVolume {
  month: string;
  orders: number;
  revenue: number;
  returns: number;
}

// ── Challenge / Proposal Types ────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

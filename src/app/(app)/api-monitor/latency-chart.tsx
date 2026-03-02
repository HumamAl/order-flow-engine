"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ApiLatencyPoint } from "@/lib/types";

export default function LatencyChart({ data }: { data: ApiLatencyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}ms`}
          width={55}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          formatter={(value, name) => {
            const labels: Record<string, string> = {
              avgMs: "Avg",
              p95Ms: "P95",
              p99Ms: "P99",
            };
            return [`${value}ms`, labels[String(name)] ?? name];
          }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          formatter={(value: string) => {
            const labels: Record<string, string> = {
              avgMs: "Avg Latency",
              p95Ms: "P95",
              p99Ms: "P99",
            };
            return labels[value] ?? value;
          }}
          iconType="plainline"
          wrapperStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="avgMs"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="p95Ms"
          stroke="var(--chart-2)"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 2"
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="p99Ms"
          stroke="var(--chart-3)"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="2 2"
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

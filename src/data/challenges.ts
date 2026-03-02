import type { Challenge } from "@/lib/types";

export const executiveSummary =
  "Based on the operational patterns visible in the demo, the backend has three high-impact bottlenecks: unindexed aggregation queries pushing LTV lookups past 3 seconds, an inventory endpoint buckling under peak load, and a webhook dispatcher dropping 4% of delivery notifications. Each challenge below maps to a concrete optimization path — with the query work alone likely paying for itself in the first sprint.";

export const challenges: Challenge[] = [
  {
    id: "query-performance",
    title: "Query Performance & Indexing Strategy",
    description:
      "The customer lifetime-value aggregation currently scans the full orders table on every call — 890 ms average, spiking to 3.4 s under concurrent load. Adding a composite index on (customer_id, created_at) and rewriting the aggregation as an incremental materialized view would collapse that to single-digit milliseconds for most reads.",
    visualizationType: "before-after",
    outcome:
      "Could reduce average query time from 890 ms to ~45 ms and eliminate the 3.4 s tail-latency spikes that block downstream API responses.",
  },
  {
    id: "api-scalability",
    title: "API Scalability Under Load",
    description:
      "The inventory-check endpoint is the hottest path in the order pipeline — every checkout hits it. At current traffic it averages 156 ms with a 2.1% error rate, and connection-pool exhaustion is the likely culprit. A read-replica layer, Redis-backed stock cache, and tuned connection pooling could push throughput past 2,000 req/min with sub-200 ms P99.",
    visualizationType: "metrics",
    outcome:
      "Could increase sustained throughput from ~210 req/min to 2,000+ req/min and bring the error rate below 0.1%, removing the primary scaling ceiling before peak-season traffic.",
  },
  {
    id: "api-integration",
    title: "RESTful API Design & Integration",
    description:
      "The webhook dispatcher fires delivery notifications synchronously with a 4.2% failure rate and 340 ms average latency. Missed webhooks mean partners don't get status updates, leading to manual reconciliation. Introducing an async message queue with exponential-backoff retries, a circuit breaker, and a dead-letter queue would make the pipeline self-healing.",
    visualizationType: "architecture",
    outcome:
      "Could cut webhook failure rate from 4.2% to < 0.05% and decouple notification latency from the order-processing hot path, improving end-to-end reliability.",
  },
];

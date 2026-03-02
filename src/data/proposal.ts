import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer who builds backend systems that actually scale — from database optimization to API design to cloud deployment.",
  bio: "I build backend systems and operational tools that handle real transaction volumes. From query optimization to API design, I focus on the boring stuff that makes systems reliable.",
  approach: [
    {
      title: "Audit the Bottlenecks",
      description:
        "Profile the current system — slow queries, connection pool saturation, API latency spikes. Fix the highest-impact issues first.",
    },
    {
      title: "Build the Foundation",
      description:
        "Proper indexing, connection pooling, caching layer. Production-ready code with monitoring from day one.",
    },
    {
      title: "Ship & Measure",
      description:
        "Deploy with real metrics. If the P95 latency drops and throughput climbs, we're on track.",
    },
    {
      title: "Scale Incrementally",
      description:
        "Add read replicas, message queues, and horizontal scaling as load grows. No premature optimization.",
    },
  ],
  skillCategories: [
    {
      name: "Backend & APIs",
      skills: [
        "Node.js",
        "REST API Design",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Connection Pooling",
        "Query Optimization",
      ],
    },
    {
      name: "Cloud & DevOps",
      skills: [
        "AWS (EC2, RDS, ElastiCache)",
        "Docker",
        "CI/CD",
        "Monitoring",
        "Auto-Scaling",
      ],
    },
    {
      name: "Frontend",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    {
      name: "Integration",
      skills: [
        "Webhook Handlers",
        "Message Queues",
        "Stripe API",
        "Third-Party APIs",
      ],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "1",
    title: "Fleet Maintenance SaaS",
    description:
      "6-module SaaS platform covering the full maintenance lifecycle — asset registry, work orders, preventive scheduling, inspections, parts inventory, and analytics.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "REST API"],
    relevance:
      "Complex multi-module backend with relational data and real-time scheduling",
    outcome:
      "6-module SaaS covering the full maintenance lifecycle — from asset registry to work orders to parts inventory",
  },
  {
    id: "2",
    title: "PayGuard — Transaction Monitor",
    description:
      "Real-time transaction monitoring with flagging engine, multi-account linking, alert system, and merchant monitoring.",
    tech: ["Next.js", "TypeScript", "Real-time Processing"],
    relevance:
      "High-throughput transaction processing with real-time monitoring — similar scalability challenges",
    outcome:
      "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery",
    liveUrl: "https://payment-monitor.vercel.app",
  },
  {
    id: "3",
    title: "eBay Pokemon Monitor",
    description:
      "Real-time eBay Browse API monitoring with Discord webhook alerts, price tracking, and configurable filters.",
    tech: ["Next.js", "TypeScript", "REST API", "Webhooks"],
    relevance:
      "REST API integration, webhook handling, and real-time monitoring — directly relevant to API work",
    outcome:
      "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
    liveUrl: "https://ebay-pokemon-monitor.vercel.app",
  },
  {
    id: "4",
    title: "Data Intelligence Platform",
    description:
      "Multi-source data aggregation with interactive dashboards, filterable insights, and analytics.",
    tech: ["Next.js", "TypeScript", "Recharts", "Data Aggregation"],
    relevance:
      "Data pipeline architecture with aggregation and analytics — similar to order analytics needs",
    outcome:
      "Unified analytics dashboard pulling from multiple sources with interactive charts and filterable insights",
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
  },
];

// App configuration — single source of truth for all identity/attribution text.

export type AestheticProfile =
  | "linear"
  | "bold-editorial"
  | "warm-organic"
  | "corporate-enterprise"
  | "dark-premium"
  | "swiss-typographic"
  | "glassmorphism"
  | "neobrutalism"
  | "nature-wellness"
  | "data-dense"
  | "saas-modern"
  | "e-commerce"
  | "brand-forward"
  | "retrofuturism";

export type DemoFormat =
  | "dashboard-app"
  | "mobile-app-preview"
  | "landing-page"
  | "multi-screen-walkthrough"
  | "split-panel-demo"
  | "admin-console";

export type DeviceModel =
  | "iphone-15-pro"
  | "pixel-8"
  | "ipad-pro"
  | "generic-phone"
  | "chrome-browser"
  | "safari-browser";

export const APP_CONFIG = {
  appName: "OrderFlow Engine",
  projectName: "Order Management System",
  clientName: null as string | null,
  domain: "order-management",
  aesthetic: "linear" as AestheticProfile,
  demoFormat: "dashboard-app" as DemoFormat,
  deviceModel: undefined as DeviceModel | undefined,
  screenCount: undefined as number | undefined,
} as const;

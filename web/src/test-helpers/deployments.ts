import type { Deployment, DeploymentListItem } from "@/domains/deployments/types";

export function buildDeploymentListItem(
  overrides: Partial<DeploymentListItem> = {},
): DeploymentListItem {
  return {
    attributes: {
      description: "Handles checkout flows",
      framework: "fastapi",
      language: "python",
      name: "checkout-api",
      oncall: "payments-oncall",
      priority: "high",
      region: "eu-west-1",
      team: "payments",
    },
    created_at: "2026-04-01T12:00:00Z",
    created_by: "adilson",
    deployment_id: "dep-001",
    description: "Handles checkout flows",
    environment: "production",
    name: "checkout-api",
    status: "active",
    team: "payments",
    type: "web_service",
    updated_at: "2026-04-10T09:30:00Z",
    version: "1.0.0",
    ...overrides,
  };
}

export function buildDeployment(
  overrides: Partial<Deployment> = {},
): Deployment {
  return {
    attributes: {
      description: "Handles checkout flows",
      framework: "fastapi",
      language: "python",
      name: "checkout-api",
      oncall: "payments-oncall",
      priority: "high",
      region: "eu-west-1",
      team: "payments",
    },
    created_at: "2026-04-01T12:00:00Z",
    created_by: "adilson",
    deleted_at: null,
    deployment_id: "dep-001",
    environment: "production",
    status: "active",
    type: "web_service",
    updated_at: "2026-04-10T09:30:00Z",
    version: "1.0.0",
    ...overrides,
  };
}

export type DeploymentStatus = "active" | "failed" | "stopped";

export type DeploymentType = "web_service" | "worker" | "cron_job";

export type DeploymentEnvironment =
  | "production"
  | "staging"
  | "development";

export type DeploymentListItem = {
  deployment_id: string;
  name: string;
  description: string | null;
  team: string;
  version: string;
  status: DeploymentStatus;
  type: DeploymentType;
  environment: DeploymentEnvironment;
  created_at: string;
  created_by: string;
  updated_at: string;
};

export type DeploymentListResponse = {
  items: DeploymentListItem[];
  total: number;
  next_cursor: string | null;
};

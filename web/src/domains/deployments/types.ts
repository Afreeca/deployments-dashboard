export type DeploymentStatus = "active" | "failed" | "stopped";

export type DeploymentType = "web_service" | "worker" | "cron_job";

export type DeploymentEnvironment =
  | "production"
  | "staging"
  | "development";

export type DeploymentAttributes = {
  name: string;
  description: string | null;
  team: string;
  region: string | null;
  language: string | null;
  framework: string | null;
  priority: string | null;
  oncall: string | null;
};

export type Deployment = {
  deployment_id: string;
  version: string;
  status: DeploymentStatus;
  type: DeploymentType;
  environment: DeploymentEnvironment;
  attributes: DeploymentAttributes;
  created_at: string;
  created_by: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DeploymentListItem = {
  attributes: DeploymentAttributes;
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

export type DeploymentList = {
  items: DeploymentListItem[];
  total: number;
  next_cursor: string | null;
};

export type UpdateDeploymentRequest = {
  description?: string | null;
  name?: string;
};

export type UpdateDeploymentAttributesRequest = {
  remove: string[];
  set: Record<string, string>;
};

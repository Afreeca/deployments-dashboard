import type { DeploymentListItem } from "@/domains/deployments/types";

import styles from "./deployments-table.module.scss";

type DeploymentsTableProps = {
  deployments: DeploymentListItem[];
  isLoading: boolean;
  error: string | null;
};

const statusToneMap: Record<DeploymentListItem["status"], string> = {
  active: styles.statusActive,
  failed: styles.statusFailed,
  stopped: styles.statusStopped,
};

const environmentToneMap: Record<DeploymentListItem["environment"], string> = {
  production: styles.environmentProduction,
  staging: styles.environmentStaging,
  development: styles.environmentDevelopment,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatType(value: DeploymentListItem["type"]) {
  return value.replaceAll("_", " ");
}

export function DeploymentsTable({
  deployments,
  isLoading,
  error,
}: DeploymentsTableProps) {
  if (isLoading) {
    return <div className={styles.feedback}>Loading deployments...</div>;
  }

  if (error) {
    return <div className={styles.feedbackError}>{error}</div>;
  }

  if (deployments.length === 0) {
    return <div className={styles.feedback}>No deployments found.</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHead}>
        <span>Deployment</span>
        <span>Status</span>
        <span>Type</span>
        <span>Env</span>
        <span>Created By</span>
        <span>Updated</span>
      </div>

      <div className={styles.tableRows}>
        {deployments.map((deployment) => (
          <article
            key={deployment.deployment_id}
            className={styles.tableRow}
          >
            <div className={styles.deploymentCell}>
              <p className={styles.deploymentName}>{deployment.name}</p>
              <p className={styles.deploymentDescription}>
                {deployment.description ?? "No description"}
              </p>
              <p className={styles.deploymentId}>{deployment.deployment_id}</p>
            </div>

            <div>
              <span
                className={`${styles.badge} ${statusToneMap[deployment.status]}`}
              >
                {deployment.status}
              </span>
            </div>

            <div className={styles.tableText}>{formatType(deployment.type)}</div>

            <div>
              <span
                className={`${styles.badge} ${environmentToneMap[deployment.environment]}`}
              >
                {deployment.environment}
              </span>
            </div>

            <div className={styles.creatorInfo}>
              <p>{deployment.created_by}</p>
              <p className={styles.teamName}>{deployment.team}</p>
            </div>

            <div className={styles.tableText}>
              <p>{formatDate(deployment.updated_at)}</p>
              <p className={styles.deploymentVersion}>v{deployment.version}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

import type { DeploymentListItem } from "@/domains/deployments/types";
import { Badge } from "@/components/badge/badge";

import styles from "./deployments-table.module.scss";

type DeploymentsTableRowProps = {
  deployment: DeploymentListItem;
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

export function DeploymentsTableRow({
  deployment,
}: DeploymentsTableRowProps) {
  return (
    <div className={styles.tableRow}>
      <div className={styles.deploymentCell}>
        <p className={styles.deploymentName}>{deployment.name}</p>
        <p className={styles.deploymentDescription}>
          {deployment.description ?? "No description"}
        </p>
        <p className={styles.deploymentId}>{deployment.deployment_id}</p>
      </div>

      <Badge variant={deployment.status}>{deployment.status}</Badge>

      <div className={styles.tableText}>{formatType(deployment.type)}</div>

      <Badge variant={deployment.environment}>{deployment.environment}</Badge>

      <div className={styles.creatorInfo}>
        <p>{deployment.created_by}</p>
        <p className={styles.teamName}>{deployment.team}</p>
      </div>

      <div className={styles.tableText}>
        <p>{formatDate(deployment.updated_at)}</p>
        <p className={styles.deploymentVersion}>v{deployment.version}</p>
      </div>
    </div>
  );
}

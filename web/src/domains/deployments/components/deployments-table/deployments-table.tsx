import type { DeploymentListItem } from "@/domains/deployments/types";
import { DeploymentsTableRow } from "@/domains/deployments/components/deployments-table/deployments-table-row";

import styles from "./deployments-table.module.scss";

type DeploymentsTableProps = {
  deployments: DeploymentListItem[];
  isLoading: boolean;
  error: string | null;
};

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
          <DeploymentsTableRow
            key={deployment.deployment_id}
            deployment={deployment}
          />
        ))}
      </div>
    </div>
  );
}

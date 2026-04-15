"use client";

import { useRouter } from "next/navigation";

import type { DeploymentListItem, UpdateDeploymentRequest } from "@/domains/deployments/types";
import { formatDeploymentDate, formatDeploymentType } from "@/domains/deployments/utils";
import { Badge } from "@/components/badge/badge";
import { EditableFieldCell } from "./editable-field-cell";

import styles from "./deployments-table.module.scss";

type DeploymentsTableRowProps = {
  deployment: DeploymentListItem;
  isSaving: boolean;
  onSave: (updateRequest: UpdateDeploymentRequest) => void;
};

export function DeploymentsTableRow({
  deployment,
  isSaving,
  onSave,
}: DeploymentsTableRowProps) {
  const router = useRouter();

  return (
    <div
      className={styles.tableRow}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("[data-editable-control]")) {
          return;
        }

        router.push(`/deployments/${deployment.deployment_id}`);
      }}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-editable-control]")) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/deployments/${deployment.deployment_id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <EditableFieldCell
        buildSaveRequest={(draftValue) => ({ name: draftValue.trim() })}
        canSave={(draftValue) => !!draftValue.trim()}
        className={styles.nameCell}
        isSaving={isSaving}
        key={`name-${deployment.name}`}
        onSave={onSave}
        value={deployment.name}
      />

      <EditableFieldCell
        buildSaveRequest={(draftValue) => ({ description: draftValue.trim() || null })}
        className={styles.descriptionCell}
        inputType="textarea"
        isSaving={isSaving}
        key={`description-${deployment.description ?? ""}`}
        onSave={onSave}
        title={deployment.description ?? undefined}
        value={deployment.description ?? "—"}
      />

      <div
        className={styles.idCell}
        title={deployment.deployment_id}
      >
        {deployment.deployment_id}
      </div>

      <Badge variant={deployment.status}>{deployment.status}</Badge>

      <div className={styles.tableText}>{formatDeploymentType(deployment.type)}</div>

      <Badge variant={deployment.environment}>{deployment.environment}</Badge>

      <div
        className={styles.creatorInfo}
        title={`${deployment.created_by} · ${deployment.team}`}
      >
        <p>{deployment.created_by}</p>
        <p className={styles.teamName}>{deployment.team}</p>
      </div>

      <div className={styles.tableText}>
        <p>{formatDeploymentDate(deployment.updated_at)}</p>
        <p className={styles.deploymentVersion}>v{deployment.version}</p>
      </div>
    </div>
  );
}

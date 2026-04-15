"use client";

import { useRouter } from "next/navigation";
import type { DeploymentListItem } from "@/domains/deployments/types";
import { Badge } from "@/components/badge/badge";
import styles from "./deployments-table.module.scss";

type DeploymentsTableRowProps = {
  deployment: DeploymentListItem;
  onEdit: () => void;
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
  onEdit,
}: DeploymentsTableRowProps) {
  const router = useRouter();

  return (
    <div
      className={styles.tableRow}
      onClick={() => router.push(`/deployments/${deployment.deployment_id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/deployments/${deployment.deployment_id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.deploymentCell}>
        <p className={styles.deploymentName}>{deployment.name}</p>
        <p
          className={styles.deploymentDescription}
          title={deployment.description ?? undefined}
        >
          {deployment.description ?? "No description"}
        </p>
        <p className={styles.deploymentId}>{deployment.deployment_id}</p>
        <button
          className={styles.editButton}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onEdit();
          }}
          aria-label={`Edit ${deployment.name}`}
        >
          <svg
            aria-hidden="true"
            className={styles.editIcon}
            viewBox="0 0 24 24"
          >
            <path
              d="M4 20L8.5 19L18.6 8.9C19.4 8.1 19.4 6.9 18.6 6.1L17.9 5.4C17.1 4.6 15.9 4.6 15.1 5.4L5 15.5L4 20Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>

      <Badge variant={deployment.status}>{deployment.status}</Badge>

      <div className={styles.tableText}>{formatType(deployment.type)}</div>

      <Badge variant={deployment.environment}>{deployment.environment}</Badge>

      <div className={styles.creatorInfo} title={`${deployment.created_by} · ${deployment.team}`}>
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

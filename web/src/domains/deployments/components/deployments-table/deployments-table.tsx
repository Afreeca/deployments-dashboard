"use client";

import { useState } from "react";

import { Modal } from "@/components/modal/modal";
import { useUpdateDeployment } from "@/domains/deployments/hooks/use-update-deployment";
import { EditDeploymentForm } from "@/domains/deployments/forms/edit-deployment-form/edit-deployment-form";
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
  const updateDeploymentMutation = useUpdateDeployment();
  const [editingDeployment, setEditingDeployment] =
    useState<DeploymentListItem | null>(null);

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
            onEdit={() => setEditingDeployment(deployment)}
          />
        ))}
      </div>

      {editingDeployment ? (
        <Modal
          ariaLabelledBy="deployment-edit-title"
          key={editingDeployment.deployment_id}
          onClose={() => {
            if (!updateDeploymentMutation.isPending) {
              setEditingDeployment(null);
            }
          }}
          subtitle={editingDeployment.deployment_id}
          title="Edit deployment labels"
        >
          <EditDeploymentForm
            deployment={editingDeployment}
            error={
              updateDeploymentMutation.error instanceof Error
                ? updateDeploymentMutation.error.message
                : null
            }
            isSaving={updateDeploymentMutation.isPending}
            onCancel={() => {
              if (!updateDeploymentMutation.isPending) {
                setEditingDeployment(null);
              }
            }}
            onSubmit={(updateRequest) =>
              updateDeploymentMutation.mutate(
                {
                  deploymentId: editingDeployment.deployment_id,
                  updateRequest,
                },
                {
                  onSuccess: () => {
                    setEditingDeployment(null);
                  },
                },
              )
            }
          />
        </Modal>
      ) : null}
    </div>
  );
}

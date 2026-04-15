"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/badge/badge";
import { EditDeploymentAttributesForm } from "@/domains/deployments/forms/edit-deployment-attributes-form/edit-deployment-attributes-form";
import { useDeleteDeployment } from "@/domains/deployments/hooks/use-delete-deployment";
import { useDeployment } from "@/domains/deployments/hooks/use-deployment";
import { useUpdateDeploymentAttributes } from "@/domains/deployments/hooks/use-update-deployment-attributes";
import { formatDeploymentDate, formatDeploymentType } from "@/domains/deployments/utils";

import styles from "./deployment-detail-page.module.scss";

type DeploymentDetailPageProps = {
  deploymentId: string;
};

export function DeploymentDetailPage({ deploymentId }: DeploymentDetailPageProps) {
  const router = useRouter();
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const deleteDeploymentMutation = useDeleteDeployment();
  const { data: deployment, error, isLoading } = useDeployment(deploymentId);
  const updateDeploymentAttributesMutation = useUpdateDeploymentAttributes();

  if (isLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.pageContent}>
          <div className={styles.feedback}>Loading deployment details...</div>
        </section>
      </main>
    );
  }

  if (error || !deployment) {
    return (
      <main className={styles.page}>
        <section className={styles.pageContent}>
          <div className={styles.feedbackError}>
            {error ?? "Deployment not found."}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.pageContent}>
        <header className={styles.header}>
          <Link className={styles.backLink} href="/">
            Back to dashboard
          </Link>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.pageTitle}>{deployment.attributes.name}</h1>
              <p className={styles.deploymentId}>{deploymentId}</p>
            </div>
            <div className={styles.badges}>
              <Badge variant={deployment.status}>{deployment.status}</Badge>
              <Badge variant={deployment.environment}>{deployment.environment}</Badge>
            </div>
          </div>
        </header>

        <div className={styles.summaryGrid}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <dl className={styles.summaryList}>
              <div>
                <dt>Type</dt>
                <dd>{formatDeploymentType(deployment.type)}</dd>
              </div>
              <div>
                <dt>Created by</dt>
                <dd>{deployment.created_by}</dd>
              </div>
              <div>
                <dt>Created at</dt>
                <dd>{formatDeploymentDate(deployment.created_at)}</dd>
              </div>
              <div>
                <dt>Updated at</dt>
                <dd>{formatDeploymentDate(deployment.updated_at)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Attributes</h2>
            <EditDeploymentAttributesForm
              deployment={deployment}
              error={
                updateDeploymentAttributesMutation.error instanceof Error
                  ? updateDeploymentAttributesMutation.error.message
                  : null
              }
              isSaving={updateDeploymentAttributesMutation.isPending}
              key={`${deployment.deployment_id}-${deployment.updated_at}`}
              onSubmit={(updateRequest) =>
                updateDeploymentAttributesMutation.mutate({
                  deploymentId: deployment.deployment_id,
                  updateRequest,
                })
              }
            />
          </section>

          <section className={`${styles.card} ${styles.dangerCard}`}>
            <h2 className={styles.sectionTitle}>Danger zone</h2>
            <p className={styles.sectionDescription}>
              Deleting this deployment removes it from the dashboard. You can restore
              it for up to 30 days.
            </p>

            {isDeleteConfirming ? (
              <div className={styles.confirmationBlock}>
                <p className={styles.confirmationText}>
                  Delete <strong>{deployment.attributes.name}</strong>? It will disappear
                  from the dashboard, but can still be restored within 30 days.
                </p>

                {deleteDeploymentMutation.error instanceof Error ? (
                  <p className={styles.deleteError}>
                    {deleteDeploymentMutation.error.message}
                  </p>
                ) : null}

                <div className={styles.confirmationActions}>
                  <button
                    className={styles.cancelDeleteButton}
                    disabled={deleteDeploymentMutation.isPending}
                    onClick={() => setIsDeleteConfirming(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.deleteButton}
                    disabled={deleteDeploymentMutation.isPending}
                    onClick={() =>
                      deleteDeploymentMutation.mutate(deployment.deployment_id, {
                        onSuccess: () => {
                          router.push("/");
                        },
                      })
                    }
                    type="button"
                  >
                    {deleteDeploymentMutation.isPending
                      ? "Deleting..."
                      : "Delete deployment"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.deleteButton}
                onClick={() => setIsDeleteConfirming(true)}
                type="button"
              >
                Delete deployment
              </button>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

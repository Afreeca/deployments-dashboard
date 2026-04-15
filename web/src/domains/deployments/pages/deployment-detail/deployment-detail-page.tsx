"use client";

import styles from "./deployment-detail-page.module.scss";

type DeploymentDetailPageProps = {
  deploymentId: string;
};

export function DeploymentDetailPage({ deploymentId }: DeploymentDetailPageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.pageContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Deployment Detail</h1>
          <p className={styles.deploymentId}>{deploymentId}</p>
        </header>
      </section>
    </main>
  );
}

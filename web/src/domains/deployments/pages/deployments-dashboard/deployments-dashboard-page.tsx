"use client";

import { DeploymentsTable } from "@/domains/deployments/components/deployments-table/deployments-table";
import { useDeployments } from "@/domains/deployments/hooks/use-deployments";

import styles from "./deployments-dashboard-page.module.scss";

export function DeploymentsDashboardPage() {
  const { data, isLoading, error } = useDeployments();

  return (
    <main className={styles.page}>
      <section className={styles.pageContent}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Deployments Dashboard</h1>
        </header>

        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <h2 className={styles.tableTitle}>Deployment list view</h2>
          </div>

          <DeploymentsTable
            deployments={data?.items ?? []}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>
    </main>
  );
}

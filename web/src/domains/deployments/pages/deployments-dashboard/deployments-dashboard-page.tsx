"use client";

import { DeploymentsFilters } from "@/domains/deployments/components/deployments-filters/deployments-filters";
import { DeploymentsTable } from "@/domains/deployments/components/deployments-table/deployments-table";
import { useDeploymentFilters } from "@/domains/deployments/hooks/use-deployment-filters";
import { useDeployments } from "@/domains/deployments/hooks/use-deployments";

import styles from "./deployments-dashboard-page.module.scss";

export function DeploymentsDashboardPage() {
  const { data, isLoading, error } = useDeployments();
  const { filters, filteredDeployments } = useDeploymentFilters(data?.items ?? []);

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

          <div className={styles.filtersSection}>
            <DeploymentsFilters filters={filters} />
          </div>

          <DeploymentsTable
            deployments={filteredDeployments}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>
    </main>
  );
}

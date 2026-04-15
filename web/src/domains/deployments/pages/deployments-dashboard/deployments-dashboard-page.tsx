"use client";

import { useState } from "react";

import { DeploymentsFilters } from "@/domains/deployments/components/deployments-filters/deployments-filters";
import { DeploymentsTable } from "@/domains/deployments/components/deployments-table/deployments-table";
import { useDeployments } from "@/domains/deployments/hooks/use-deployments";
import type {
  DeploymentEnvironment,
  DeploymentStatus,
  DeploymentType,
} from "@/domains/deployments/types";

import styles from "./deployments-dashboard-page.module.scss";

export function DeploymentsDashboardPage() {
  const { data, isLoading, error } = useDeployments();
  const [environment, setEnvironment] = useState<DeploymentEnvironment | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<DeploymentStatus | "">("");
  const [type, setType] = useState<DeploymentType | "">("");

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
            <DeploymentsFilters
              environment={environment}
              onEnvironmentChange={setEnvironment}
              onSearchTermChange={setSearchTerm}
              onStatusChange={setStatus}
              onTypeChange={setType}
              searchTerm={searchTerm}
              status={status}
              type={type}
            />
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

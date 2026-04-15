"use client";

import type { DeploymentFilters, SortKey } from "@/domains/deployments/hooks/use-deployment-filters";
import type {
  DeploymentEnvironment,
  DeploymentStatus,
  DeploymentType,
} from "@/domains/deployments/types";

import styles from "./deployments-filters.module.scss";

const environmentOptions: Array<{ label: string; value: DeploymentEnvironment }> = [
  { label: "Production", value: "production" },
  { label: "Staging", value: "staging" },
  { label: "Development", value: "development" },
];

const statusOptions: Array<{ label: string; value: DeploymentStatus }> = [
  { label: "Active", value: "active" },
  { label: "Failed", value: "failed" },
  { label: "Stopped", value: "stopped" },
];

const typeOptions: Array<{ label: string; value: DeploymentType }> = [
  { label: "Web service", value: "web_service" },
  { label: "Worker", value: "worker" },
  { label: "Cron job", value: "cron_job" },
];

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: "Newest first", value: "updated_at_desc" },
  { label: "Oldest first", value: "updated_at_asc" },
  { label: "Name A–Z", value: "name_asc" },
  { label: "Name Z–A", value: "name_desc" },
];

type DeploymentsFiltersProps = {
  filters: DeploymentFilters;
};

export function DeploymentsFilters({ filters }: DeploymentsFiltersProps) {
  const {
    environment,
    searchTerm,
    sortKey,
    status,
    type,
    setEnvironment,
    setSearchTerm,
    setSortKey,
    setStatus,
    setType,
  } = filters;

  return (
    <div className={styles.filters}>
      <label className={styles.searchField}>
        <span className={styles.fieldLabel}>Search</span>
        <input
          className={styles.searchInput}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by ID, name, creator, or attribute value"
          type="search"
          value={searchTerm}
        />
      </label>

      <div className={styles.selectGrid}>
        <label className={styles.selectField}>
          <span className={styles.fieldLabel}>Status</span>
          <select
            className={styles.selectInput}
            onChange={(event) => setStatus(event.target.value as DeploymentStatus | "")}
            value={status}
          >
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField}>
          <span className={styles.fieldLabel}>Type</span>
          <select
            className={styles.selectInput}
            onChange={(event) => setType(event.target.value as DeploymentType | "")}
            value={type}
          >
            <option value="">All types</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField}>
          <span className={styles.fieldLabel}>Environment</span>
          <select
            className={styles.selectInput}
            onChange={(event) => setEnvironment(event.target.value as DeploymentEnvironment | "")}
            value={environment}
          >
            <option value="">All environments</option>
            {environmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField}>
          <span className={styles.fieldLabel}>Sort</span>
          <select
            className={styles.selectInput}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            value={sortKey}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

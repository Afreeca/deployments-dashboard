"use client";

import { useMemo, useState } from "react";

import type {
  DeploymentEnvironment,
  DeploymentListItem,
  DeploymentStatus,
  DeploymentType,
} from "@/domains/deployments/types";

export type SortKey = "updated_at_desc" | "updated_at_asc" | "name_asc" | "name_desc";

export type DeploymentFilters = {
  environment: DeploymentEnvironment | "";
  searchTerm: string;
  sortKey: SortKey;
  status: DeploymentStatus | "";
  type: DeploymentType | "";
  setEnvironment: (value: DeploymentEnvironment | "") => void;
  setSearchTerm: (value: string) => void;
  setSortKey: (value: SortKey) => void;
  setStatus: (value: DeploymentStatus | "") => void;
  setType: (value: DeploymentType | "") => void;
};

function sortDeployments(deployments: DeploymentListItem[], sortKey: SortKey) {
  return [...deployments].sort((a, b) => {
    switch (sortKey) {
      case "name_asc":  return a.name.localeCompare(b.name);
      case "name_desc": return b.name.localeCompare(a.name);
      case "updated_at_asc":  return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      case "updated_at_desc": return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });
}

export function useDeploymentFilters(deployments: DeploymentListItem[]) {
  const [environment, setEnvironment] = useState<DeploymentEnvironment | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at_desc");
  const [status, setStatus] = useState<DeploymentStatus | "">("");
  const [type, setType] = useState<DeploymentType | "">("");

  const filteredDeployments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = deployments.filter((d) => {
      if (status && d.status !== status) return false;
      if (type && d.type !== type) return false;
      if (environment && d.environment !== environment) return false;
      if (term && ![d.deployment_id, d.name, d.created_by, d.description ?? "", d.team]
        .some((field) => field.toLowerCase().includes(term))) return false;
      return true;
    });

    return sortDeployments(filtered, sortKey);
  }, [deployments, environment, searchTerm, sortKey, status, type]);

  const filters: DeploymentFilters = {
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
  };

  return { filters, filteredDeployments };
}

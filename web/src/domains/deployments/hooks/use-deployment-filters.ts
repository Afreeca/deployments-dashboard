"use client";

import { useMemo, useState } from "react";

import type {
  DeploymentEnvironment,
  DeploymentListItem,
  DeploymentStatus,
  DeploymentType,
} from "@/domains/deployments/types";

export type DeploymentFilters = {
  environment: DeploymentEnvironment | "";
  searchTerm: string;
  status: DeploymentStatus | "";
  type: DeploymentType | "";
  setEnvironment: (value: DeploymentEnvironment | "") => void;
  setSearchTerm: (value: string) => void;
  setStatus: (value: DeploymentStatus | "") => void;
  setType: (value: DeploymentType | "") => void;
};

export function useDeploymentFilters(deployments: DeploymentListItem[]) {
  const [environment, setEnvironment] = useState<DeploymentEnvironment | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<DeploymentStatus | "">("");
  const [type, setType] = useState<DeploymentType | "">("");

  const filteredDeployments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return deployments.filter((d) => {
      if (status && d.status !== status) return false;
      if (type && d.type !== type) return false;
      if (environment && d.environment !== environment) return false;
      if (term && ![d.deployment_id, d.name, d.created_by, d.description ?? "", d.team]
        .some((field) => field.toLowerCase().includes(term))) return false;
      return true;
    });
  }, [deployments, environment, searchTerm, status, type]);

  const filters: DeploymentFilters = {
    environment,
    searchTerm,
    status,
    type,
    setEnvironment,
    setSearchTerm,
    setStatus,
    setType,
  };

  return { filters, filteredDeployments };
}
